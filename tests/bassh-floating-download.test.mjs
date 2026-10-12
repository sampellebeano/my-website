import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../public/bassh/download.js', import.meta.url), 'utf8');

// Node has no viewport. Supply only browser geometry and event delivery.
function createViewport(initialBottom = 1100) {
  let bottom = initialBottom;
  const listeners = new Map();
  const floating = { hidden: true };
  const page = {
    scrollTop: 1000, clientHeight: 800, scrollHeight: 3000,
    scrollTo: ({ top }) => { page.scrollTop = Math.max(0, Math.min(top, 2200)); },
  };
  const dock = { hidden: true };
  const primary = {
    getBoundingClientRect: () => ({ bottom }),
    focus: () => { document.activeElement = primary; },
  };
  const document = {
    body: {},
    activeElement: null,
    getElementById: id => ({ 'mac-download': primary, 'floating-download': floating, 'download-dock': dock, 'page-content': page })[id],
  };
  const window = { addEventListener: (type, callback) => listeners.set(type, callback) };
  runInNewContext(source, { document, window });
  return {
    primary, floating, dock, document, page,
    press: (key, modifiers = {}, focus = floating) => {
      document.activeElement = focus;
      let prevented = false;
      const event = { key, ...modifiers, preventDefault: () => { prevented = true; } };
      listeners.get("keydown")?.(event);
      return { prevented, top: page.scrollTop };
    },
    update: (nextBottom, type = 'scroll') => { bottom = nextBottom; listeners.get(type)?.(); },
  };
}

test('the floating download appears only after the original has scrolled above the viewport', () => {
  const viewport = createViewport();
  assert.equal(viewport.floating.hidden, true, 'A download still below the viewport must not float');
  viewport.update(24);
  assert.equal(viewport.floating.hidden, true, 'Keep only the original while any of it remains visible');
  viewport.update(-1);
  assert.equal(viewport.floating.hidden, false, 'Keep the download accessible after scrolling past it');
  viewport.update(20);
  assert.equal(viewport.floating.hidden, true, 'Hide the floating copy when the original returns');
});

test('a jump directly from below the viewport to above it still exposes the download', () => {
  const viewport = createViewport(1100);
  viewport.update(-700);
  assert.equal(viewport.floating.hidden, false, 'Section jumps must work without an intermediate intersection');
});

test('a restored position below the download exposes the floating button before any scroll event', () => {
  const viewport = createViewport(-700);
  assert.equal(viewport.floating.hidden, false);
});

test('a resize that brings the original back into view hides the floating button', () => {
  const viewport = createViewport(-100);
  viewport.update(30, 'resize');
  assert.equal(viewport.floating.hidden, true);
});

test('keyboard focus returns to the original when its focused floating copy hides', () => {
  const viewport = createViewport(-100);
  viewport.document.activeElement = viewport.floating;
  viewport.update(30);
  assert.equal(viewport.floating.hidden, true);
  assert.equal(viewport.document.activeElement, viewport.primary);
});

test('scrolling leaves focus alone when the floating button is not focused', () => {
  const viewport = createViewport();
  const otherControl = {};
  viewport.document.activeElement = otherControl;
  viewport.update(-100);
  viewport.update(30);
  assert.equal(viewport.document.activeElement, otherControl);
});

test('the download gets its own reserved reading space only while it is floating', () => {
  const viewport = createViewport();
  assert.equal(viewport.dock.hidden, true);
  viewport.update(-1);
  assert.equal(viewport.floating.hidden, false);
  assert.equal(viewport.dock.hidden, false, 'Show the reserved strip with the floating button');
  viewport.update(20);
  assert.equal(viewport.dock.hidden, true, 'Return the space when the original becomes visible');
});

test('paging keys on the floating download still scroll the instructions', () => {
  const cases = [
    ['PageDown', {}, 1700], ['PageUp', {}, 300],
    ['ArrowDown', {}, 1040], ['ArrowUp', {}, 960],
    ['Home', {}, 0], ['End', {}, 2200],
    [' ', {}, 1700], [' ', { shiftKey: true }, 300],
    ['ArrowUp', { metaKey: true }, 0], ['ArrowDown', { metaKey: true }, 2200],
  ];
  for (const [key, modifiers, top] of cases) {
    const viewport = createViewport(-100);
    assert.deepEqual(viewport.press(key, modifiers), { prevented: true, top }, key);
  }
});

test('Enter and Tab keep their native download activation and focus behavior', () => {
  const viewport = createViewport(-100);
  assert.deepEqual(viewport.press('Enter'), { prevented: false, top: 1000 });
  assert.deepEqual(viewport.press('Tab'), { prevented: false, top: 1000 });
});


test('paging from the initial page focus scrolls the reading area', () => {
  const viewport = createViewport();
  assert.deepEqual(viewport.press('PageDown', {}, viewport.document.body), { prevented: true, top: 1700 });
});

test('paging and Space within native controls are left to the browser', () => {
  const viewport = createViewport();
  const disclosureControl = {};
  assert.deepEqual(viewport.press(' ', {}, disclosureControl), { prevented: false, top: 1000 });
  assert.deepEqual(viewport.press('PageDown', {}, disclosureControl), { prevented: false, top: 1000 });
});
