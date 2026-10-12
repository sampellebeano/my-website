import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../public/bassh/navigation.js', import.meta.url), 'utf8');

// Supply browser history, scrolling, and event delivery without a Node viewport.
function createPage({ hash = '', state = null } = {}) {
  const listeners = new Map();
  const entries = [{ hash, state }];
  let index = 0;
  let nextId = 0;
  let clickHandler = () => {};
  let scrollHandler = () => {};
  const location = { hash };
  const page = {
    scrollTop: 0,
    addEventListener: (type, callback) => { if (type === 'scroll') scrollHandler = callback; },
    scrollTo: options => { page.lastScroll = options; scroll(options.top); },
  };
  const targets = Object.fromEntries([['setup', 1200], ['main-content', 80]].map(([id, top]) => [id, {
    tabIndex: -1,
    scrollIntoView: options => { page.lastAnchorScroll = options; scroll(top); },
    focus: options => { page.focused = { id, options }; },
  }]));
  const history = {
    get state() { return entries[index].state; },
    replaceState: state => { entries[index].state = state; },
    pushState: (state, title, hash) => { entries.splice(index + 1); entries.push({ hash, state }); index++; location.hash = hash; },
  };
  const document = {
    getElementById: id => id === 'page-content' ? page : targets[id],
    addEventListener: (type, callback) => { if (type === 'click') clickHandler = callback; },
  };
  const window = { addEventListener: (type, callback) => listeners.set(type, callback) };
  function scroll(top) { page.scrollTop = top; scrollHandler(); }
  runInNewContext(source, { document, window, history, location, crypto: { randomUUID: () => `entry-${++nextId}` } });
  return {
    page, history, location, scroll,
    emit: type => listeners.get(type)?.(),
    go: delta => { index += delta; location.hash = entries[index].hash; listeners.get('popstate')?.(); },
    click: (hash, options = {}) => {
      let prevented = false;
      const link = { hash, target: options.target || '', hasAttribute: name => name === 'download' && options.download };
      clickHandler({ button: 0, ...options, target: { closest: () => hash.startsWith('#') ? link : null }, preventDefault: () => { prevented = true; } });
      return prevented;
    },
  };
}

test('opening a setup deep link positions the reading pane at its target', () => {
  const view = createPage({ hash: '#setup' });
  view.emit('pageshow');
  assert.equal(view.page.scrollTop, 1200);
  assert.equal(view.page.lastAnchorScroll.behavior, 'instant');
});

test('Back and Forward restore each entry including manual scrolling after an anchor', () => {
  const view = createPage();
  view.emit('pageshow');
  view.scroll(250);
  assert.equal(view.click('#setup'), true);
  assert.equal(view.page.scrollTop, 1200);
  assert.equal(view.location.hash, '#setup');
  assert.equal(view.page.lastAnchorScroll, undefined, 'Clicked anchors use the CSS smooth scrolling preference');
  view.scroll(1450);
  view.go(-1);
  assert.equal(view.page.scrollTop, 250);
  view.go(1);
  assert.equal(view.page.scrollTop, 1450);
});

test('reload restores the saved reading position rather than resetting to the hash', () => {
  const view = createPage({ hash: '#setup' });
  view.emit('pageshow');
  view.scroll(1600);
  view.emit('pagehide');
  const reloaded = createPage({ hash: '#setup', state: view.history.state });
  reloaded.emit('pageshow');
  assert.equal(reloaded.page.scrollTop, 1600);
  assert.equal(reloaded.page.lastScroll.behavior, 'instant');
});

test('skip navigation focuses the content without replacing the smooth scroll', () => {
  const view = createPage();
  view.emit('pageshow');
  assert.equal(view.click('#main-content'), true);
  assert.equal(view.page.focused.id, 'main-content');
  assert.equal(view.page.focused.options.preventScroll, true);
});

test('modified clicks, downloads, new tabs, and unknown targets keep native behavior', () => {
  const cases = [
    ['#setup', { metaKey: true }], ['#setup', { ctrlKey: true }],
    ['#setup', { shiftKey: true }], ['#setup', { altKey: true }],
    ['#setup', { button: 1 }], ['#setup', { download: true }],
    ['#setup', { target: '_blank' }], ['#missing', {}], ['/downloads/bassh.zip', {}],
  ];
  for (const [hash, options] of cases) {
    const view = createPage();
    view.emit('pageshow');
    assert.equal(view.click(hash, options), false);
    assert.equal(view.page.scrollTop, 0);
  }
});
