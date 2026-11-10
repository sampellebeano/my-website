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
    for (const id of ['bassh', 'ryw', 'kapture']) assert.match(html, new RegExp(`href="/projects/${id}"`));
    assert.doesNotMatch(html, /Presight|Autonomous workforce solutions for aviation|Quip Black Belt programme/);
    assert.doesNotMatch(html, /Download for Mac|project-download|href="\/downloads\//);
    assert.equal((html.match(/aria-label="Sam’s project iPhone"/g) ?? []).length, 1);
    assert.doesNotMatch(html, /<img\b[^>]*src="[^"]+(?:\.gif|-demo-poster\.png)"/);
    assert.doesNotMatch(html, /images\/apps\/ryw-/);
  });
}

test('bassh retains access to its tester setup page from its new overview and search', () => {
  assert.match(render('/projects/bassh'), /href="\/bassh"/);
  assert.match(render('/search?query=bassh'), /<h2\b[^>]*><a href="\/bassh">bassh<\/a>/);
});

test('legacy career highlights open their own selected text with the parent role index', () => {
  const html = render('/experience?entry=aviation');
  assert.match(html, /<article id="aviation"/);
  for (const id of ['servicenow-uae', 'servicenow-ireland', 'servicenow-itom', 'salesforce']) assert.match(html, new RegExp(`href="/experience\\?entry=${id}"`));
  assert.match(html, /Autonomous workforce solutions for aviation/);
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

test('CV search remains readable and preserves the search form', () => {
  const html = render('/search?query=aviation');
  assert.match(html, /Autonomous workforce solutions for aviation/);
  assert.match(html, /<form\b/);
  assert.ok(!/<h2\b[^>]*><a/.test(html));
});

test('published notes and books remain reachable from compact navigation', () => {
  const html = render('/', 'populated');
  assert.match(html, /href="\/updates"/);
  assert.match(html, /href="\/books"/);
  assert.doesNotMatch(html, /The week in review|Architecture in Practice/);
});

test('the current full CV no longer publishes the client name', () => {
  assert.doesNotMatch(render('/search'), /Presight/i);
});
