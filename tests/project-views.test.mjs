import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

function render(route, fixture) {
  const result = spawnSync(process.execPath, ['tests/render-site.mjs', route, ...(fixture ? [fixture] : [])], { encoding: 'utf8', env: { ...process.env, NODE_ENV: 'development' } });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

for (const route of ['/', '/projects']) {
  test(`${route} exposes every personal build without employer initiatives or app downloads`, () => {
    const html = render(route);
    for (const slug of ['bassh', 'highlighter', 'kapture']) assert.match(html, new RegExp(`href="/projects/${slug}"`));
    assert.match(html, /id="highlighter"/);
    assert.doesNotMatch(html, /href="\/projects\/ryw\b/);
    assert.doesNotMatch(html, /Presight|AI and automation in aviation|Quip Black Belt programme/);
    assert.doesNotMatch(html, /Download for Mac|project-download|href="\/downloads\//);
    assert.equal((html.match(/aria-label="Sam’s project iPhone"/g) ?? []).length, 1);
    assert.doesNotMatch(html, /<img\b[^>]*src="[^"]+(?:\.gif|-demo-poster\.png)"/);
    assert.doesNotMatch(html, /images\/apps\/(?:ryw|highlighter)-/);
    assert.match(html, /class="project-link-title">highlighter<\/span>/);
    assert.match(html, /aria-label="Open highlighter overview"/);
    assert.doesNotMatch(html, />RYW</);
  });
}

for (const route of ['/projects/highlighter', '/projects/ryw', '/projects?entry=ryw']) {
  test(`${route} opens highlighter and links to its current URL`, () => {
    const html = render(route);
    assert.match(html, /<h1[^>]*>highlighter<\/h1>/);
    assert.match(html, /aria-label="highlighter preview"/);
    assert.match(html, /Oh, I remember that run/);
    assert.match(html, /No recording available yet/);
    assert.match(html, /original GPS routes/);
    assert.doesNotMatch(html, /description pages|href="[^"]*\?page=/);
    assert.match(html, /<a(?=[^>]*href="\/projects\/highlighter")(?=[^>]*aria-current="page")[^>]*>highlighter<\/a>/);
    assert.doesNotMatch(html, /href="\/projects\/ryw\b/);
    assert.doesNotMatch(html, />RYW<|Run Your World|Run the World/);
    assert.doesNotMatch(html, /class="demo-recording"|images\/apps\/(?:ryw|highlighter)-|src="[^"]+\.gif/);
  });
}

test('bassh retains access to its tester setup page from its overview', () => {
  assert.match(render('/projects/bassh'), /href="\/bassh#setup"/);
});

test('legacy career highlights open their own selected text with the parent role index', () => {
  const html = render('/experience?entry=aviation');
  assert.match(html, /<article id="aviation"/);
  for (const id of ['servicenow-uae', 'servicenow-ireland', 'servicenow-itom', 'salesforce']) assert.match(html, new RegExp(`href="/experience\\?entry=${id}"`));
  assert.match(html, /AI and automation in aviation/);
});

for (const [section, entry, ids] of [
  ['books', 'book-example', ['book-example', 'book-second']],
  ['updates', 'daily-2026-10-08', ['daily-2026-10-08', 'daily-second', 'weekly-2026-10-05']],
]) {
  test(`legacy ${section} entry URLs retain their complete document collections`, () => {
    const html = render(`/${section}?entry=${entry}`, 'populated');
    for (const id of ids) assert.ok(html.includes(`id="${id}"`), id);
    assert.ok(!/href="[^"]*entry=/.test(html));
    assert.ok(!/<h[23]\b[^>]*><a/.test(html));
  });
}

test('published notes and books remain reachable from compact navigation', () => {
  const html = render('/', 'populated');
  assert.match(html, /href="\/updates"/);
  assert.match(html, /href="\/books"/);
  assert.doesNotMatch(html, /The week in review|Architecture in Practice/);
});

test('the current full CV no longer publishes the client name', () => {
  assert.doesNotMatch(render('/cv'), /Presight/i);
});
