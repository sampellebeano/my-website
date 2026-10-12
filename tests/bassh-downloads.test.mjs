import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

test('the public Mac download links serve the verified preview binaries', async () => {
  const cacheDir = await mkdtemp(join(tmpdir(), 'bassh-download-test-'));
  const root = fileURLToPath(new URL('../', import.meta.url));
  const server = await createServer({
    root, cacheDir, mode: 'production', logLevel: 'silent', appType: 'mpa',
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { host: '127.0.0.1', port: 0, watch: null },
  });
  try {
    await server.listen();
    const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    const response = await fetch(`${origin}/bassh/index.html`);
    assert.equal(response.status, 200, 'The download page must be available');
    const html = await response.text();
    const links = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*\bdownload(?:\s|=|>)/g)]
      .map(match => new URL(match[1], `${origin}/bassh`))
      .filter(url => /\.(dmg|zip)$/.test(url.pathname));
    assert.equal(links.length, 2, 'Both Mac installer formats must be linked');
    // Independently verified GitHub release asset hashes, not page-derived values.
    const expected = {
      'bassh-mac-0.2.0-3-preview.dmg': 'de10455638ecbf0a03818f4adb2f1667075983a736ab2d8238f22bf19f146771',
      'bassh-mac-0.2.0-3-preview.zip': '8d8a28e4ddaa5e541289f3eac0236928ee6645b5e6811ec498fbc44787f22ec1',
    };
    const servedNames = new Set();
    for (const url of links) {
      assert.equal(url.origin, origin, 'Download links must work without private repository access');
      const name = url.pathname.split('/').at(-1);
      assert.ok(expected[name], 'Each download must identify a known release asset');
      const download = await fetch(url);
      assert.equal(download.status, 200, `The ${name} link must serve a download`);
      const actual = createHash('sha256').update(Buffer.from(await download.arrayBuffer())).digest('hex');
      assert.equal(actual, expected[name], `${name} must match the verified release`);
      servedNames.add(name);
    }
    assert.equal(servedNames.size, 2, 'The DMG and ZIP must be distinct downloads');
  } finally {
    await server.close();
    await rm(cacheDir, { recursive: true, force: true });
  }
});
