import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const previewHref = '/#/?entry=projects';

for (const app of ['bassh', 'kapture']) {
  test(`${app} directs recording viewers to the homepage iPhone`, async () => {
    const html = await readFile(new URL(`../public/${app}/index.html`, import.meta.url), 'utf8');
    const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    assert.ok(links.some(([, href, label]) => href === previewHref && /iPhone/i.test(label)));
    assert.ok(links.some(([, href]) => href === '/'));
    assert.ok(links.some(([, href]) => href === '/#/projects'));
    const stylesheet = `/${app}/style.css`;
    const stylesheets = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)];
    assert.ok(stylesheets.some(([, href]) => href === stylesheet));
    assert.ok((await readFile(new URL(`../public${stylesheet}`, import.meta.url), 'utf8')).trim());
  });

  test(`${app} leaves recording playback to the homepage viewer`, async () => {
    const html = await readFile(new URL(`../public/${app}/index.html`, import.meta.url), 'utf8');
    assert.doesNotMatch(html, /iphone-frame|app-previews\.js|data-recording=|demo-toggle/);
    assert.doesNotMatch(html, /<img\b[^>]*src="[^"]+(?:\.gif|-demo-poster\.png)"/);
  });
}

test('the homepage link opens a launcher with both recorded projects', () => {
  const route = previewHref.split('#')[1];
  const result = spawnSync(process.execPath, ['tests/render-site.mjs', route], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /aria-label="Sam’s project iPhone"/);
  assert.match(result.stdout, /aria-label="Open bassh demo"/);
  assert.match(result.stdout, /aria-label="Open Kapture demo"/);
});
