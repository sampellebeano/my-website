import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const editions = JSON.parse(readFileSync(new URL('../content/site-versions.json', import.meta.url), 'utf8'));
const newest = [...editions].sort((a, b) => b.capturedOn.localeCompare(a.capturedOn))[0];
const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');

function render(route) {
  const result = spawnSync(process.execPath, ['tests/render-site.mjs', route], { encoding: 'utf8', env: { ...process.env, NODE_ENV: 'development' } });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test('edition search results identify Site history and link to the matching saved entry', () => {
  const html = render('/search?query=October');
  assert.match(html, /Site history · Captured 8 Oct 2026/);
  assert.match(html, /<h2[^>]*><a[^>]*href="\/history\?entry=cv-search-2026-10-08"[^>]*>CV and search/);
});

test('the shared footer exposes a visible link to Site history', () => {
  const html = render('/search');
  assert.match(html, /<a[^>]*class="[^"]*previous-versions[^>]*href="\/history"[^>]*>Site history/);
  assert.doesNotMatch(html, /<details[^>]*class="previous-versions"/);
});

test('Site history lists every saved edition and opens with only the newest article', () => {
  const html = render('/history');
  assert.match(html, /<h1[^>]*>Site history<\/h1>/);
  assert.match(html, /Current edition/);
  assert.match(html, /href="\/"[^>]*>Visit the current homepage/);
  assert.equal((html.match(/<article\b/g) ?? []).length, 1, 'Show one selected edition at a time');
  for (const edition of editions) {
    assert.ok(html.includes(`href="/history?entry=${edition.id}"`), edition.id);
    assert.ok(html.includes(escapeHtml(edition.label)), edition.label);
    assert.ok(html.includes(`dateTime="${edition.capturedOn}"`), edition.capturedOn);
  }
  assert.ok(html.includes(`<article id="${newest.id}"`));
  assert.ok(html.includes(`href="/${newest.path}"`));
  assert.match(html, />Open saved site /);
  assert.doesNotMatch(html, /<iframe\b/, 'Opening a saved site must remain an explicit link');
  if (editions.every(edition => !edition.preview)) {
    const article = html.match(/<article\b[\s\S]*?<\/article>/)?.[0];
    assert.ok(article, 'The selected edition must render an article');
    assert.doesNotMatch(article, /<img\b/, 'Do not invent archive previews');
  }
});

for (const selected of editions) {
  test(`the ${selected.id} entry URL shows its own notes and retains the whole edition index`, () => {
    const html = render(`/history?entry=${selected.id}`);
    assert.equal((html.match(/<article\b/g) ?? []).length, 1);
    assert.ok(html.includes(`<article id="${selected.id}"`));
    assert.ok(html.includes(`href="/${selected.path}"`));
    assert.ok(new RegExp(`<a(?=[^>]*href="/history\\?entry=${selected.id}")(?=[^>]*aria-current="page")[^>]*>`).test(html), `Mark ${selected.id} as the selected edition`);
    for (const edition of editions) {
      assert.ok(html.includes(`href="/history?entry=${edition.id}"`), edition.id);
      if (edition.summary) assert.equal(html.includes(escapeHtml(edition.summary)), edition.id === selected.id, edition.summary);
      for (const note of edition.notes ?? []) assert.equal(html.includes(escapeHtml(note)), edition.id === selected.id, note);
    }
  });
}

test('an unknown history id falls back to the newest saved edition', () => {
  const html = render('/history?entry=missing-edition');
  assert.equal((html.match(/<article\b/g) ?? []).length, 1);
  assert.ok(html.includes(`<article id="${newest.id}"`));
  assert.ok(html.includes(`href="/${newest.path}"`));
  assert.ok(new RegExp(`<a(?=[^>]*href="/history\\?entry=${newest.id}")(?=[^>]*aria-current="page")[^>]*>`).test(html), 'Mark the fallback edition as selected');
});
