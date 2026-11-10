import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

test('Kapture has a standalone page at its clean project URLs', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const { rewrites } = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const cacheDir = await mkdtemp(join(tmpdir(), 'kapture-page-test-'));
  const server = await createServer({
    root, cacheDir, mode: 'production', logLevel: 'silent', appType: 'mpa',
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { host: '127.0.0.1', port: 0, watch: null },
    plugins: [{
      name: 'test-hosting-rewrites',
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const path = request.url?.split('?')[0];
          const rewrite = rewrites.find(rule => rule.source === path);
          if (rewrite) request.url = rewrite.destination;
          next();
        });
      },
    }],
  });
  try {
    await server.listen();
    const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    for (const path of ['/kapture', '/kapture/', '/kapture/index.html']) {
      const response = await fetch(`${origin}${path}`);
      assert.equal(response.status, 200, `${path} must serve the project page`);
      assert.match(response.headers.get('content-type'), /text\/html/);
      const html = await response.text();
      assert.match(html, /<h1\b[^>]*>Kapture<\/h1>/, 'The route must show Kapture rather than the overview');
      assert.match(html, /href="https:\/\/samjgreen\.com\/kapture"/, 'The page must identify its canonical public URL');
      assert.match(html, /href="\/#\/projects\/kapture"/, 'The page must link back to its project overview');
      assert.match(html, /href="\/"/, 'The page must link back to the homepage');
      const stylesheets = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(([, href]) => href);
      assert.deepEqual(stylesheets, ['/styles/site-theme.css', '/kapture/style.css']);
      for (const stylesheet of stylesheets) {
        const css = await fetch(new URL(stylesheet, `${origin}${path}`));
        assert.equal(css.status, 200, `${stylesheet} must resolve from ${path}`);
        assert.match(css.headers.get('content-type'), /text\/css/);
      }
    }
  } finally {
    await server.close();
    await rm(cacheDir, { recursive: true, force: true });
  }
});

test('Kapture does not offer public installation or setup access', async () => {
  const html = await readFile(new URL('../public/kapture/index.html', import.meta.url), 'utf8');
  assert.match(html, /I don’t have public installation or setup instructions to share here yet/);
  assert.doesNotMatch(html, /href="\/downloads\/|testflight\.apple\.com|href="[^"]+\.(?:ipa|zip|dmg|pkg)(?:[?#"])/i);
  const downloads = [...html.matchAll(/<a\b[^>]*\bdownload(?=\s|=|>)[^>]*>/gi)];
  assert.equal(downloads.length, 1, 'The shared CV must be the only downloadable file');
  assert.match(downloads[0][0], /href="\/cv\/Sam-Green-Solution-Architecture-CV\.pdf"/);
});
