import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

for (const app of ['bassh', 'kapture']) {
  test(`${app} directs recording viewers to its selected project iPhone`, async () => {
    const html = await readFile(new URL(`../public/${app}/index.html`, import.meta.url), 'utf8');
    const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    const previewLink = links.find(([, href, label]) => href === `/#/projects/${app}` && /iPhone/i.test(label));
    assert.ok(previewLink, 'The preview link must open the matching app in the shared iPhone');
    assert.doesNotMatch(html, /href="\/#\/\?entry=projects"/);
  });

  test(`${app} leaves recording playback to the shared project viewer`, async () => {
    const html = await readFile(new URL(`../public/${app}/index.html`, import.meta.url), 'utf8');
    assert.doesNotMatch(html, /iphone-frame|app-previews\.js|data-recording=|demo-toggle/);
    assert.doesNotMatch(html, /<img\b[^>]*src="[^"]+(?:\.gif|-demo-poster\.png)"/);
  });

  test(`${app} has the same home mark as the main site`, async () => {
    const html = await readFile(new URL(`../public/${app}/index.html`, import.meta.url), 'utf8');
    assert.match(html, /<a\b[^>]*href="\/"[^>]*aria-label="Sam Green home"[^>]*>\s*<img\b[^>]*src="\/images\/sam-green-portrait\.jpg"[^>]*alt=""/);
  });

  test(`${app} keeps global navigation separate from project navigation`, async () => {
    const html = await readFile(new URL(`../public/${app}/index.html`, import.meta.url), 'utf8');
    const header = html.match(/<header class="site-header">([\s\S]*?)<\/header>/)?.[1];
    assert.ok(header, 'The project page must use the shared site header');
    const navigation = header.match(/<nav\b[^>]*aria-label="Main navigation"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(navigation, 'The primary navigation must be labelled');
    assert.deepEqual([...navigation.matchAll(/href="([^"]+)"/g)].map(([, href]) => href), [
      '/', '/#/projects', '/#/experience',
    ]);
    assert.doesNotMatch(header, /Back to|href="#setup"/);
    const context = html.match(/<main\b[^>]*>\s*<nav\b[^>]*class="context-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(context, 'Project links must remain available at the start of the content');
    assert.ok(context.includes(`href="/#/projects/${app}"`));
    if (app === 'bassh') assert.match(context, /href="#setup"/);
  });

  test(`${app} provides the same contact and document destinations as the main site`, async () => {
    const html = await readFile(new URL(`../public/${app}/index.html`, import.meta.url), 'utf8');
    const footer = html.match(/<footer class="site-footer">([\s\S]*?)<\/footer>/)?.[1];
    assert.ok(footer, 'The project page must include the site footer');
    assert.deepEqual([...footer.matchAll(/href="([^"]+)"/g)].map(([, href]) => href), [
      'https://www.linkedin.com/in/samjohngreen',
      'https://github.com/sampellebeano',
      'mailto:sam.jgreen@icloud.com',
      '/#/cv',
      '/cv/Sam-Green-Solution-Architecture-CV.pdf',
      '/#/history',
    ]);
  });
}
