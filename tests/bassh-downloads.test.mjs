import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

test('the public Mac download serves the verified notarized ZIP and release files', async () => {
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
    assert.equal(links.length, 2, 'Both the original and floating buttons must expose the download');
    assert.equal(new Set(links.map(link => link.href)).size, 1, 'Both buttons must serve the same verified installer');
    // Independently verified GitHub release asset hashes, not page-derived values.
    const expected = {
      'bassh-mac-0.2.0-3-notarized.zip': 'c40cdd409950a02345dd981e56950f2fad55fa4cc51cd0fe4e27f55c06938b76',
      'Install.txt': '8b9d2193bd6d1edfcc592e527775aa69c0cd11cf0289f669145ee8057ea069e7',
      'release.json': '95a4425f048112719cc7d8e366ad049304956417cb9c56912207261612f4ac06',
      'SHA256SUMS': '4c7e6f453a0b1042aa6e5199af1c80029fb4be5fdee1323bf6b75c708d959b04',
    };
    const releasePath = '/downloads/bassh/0.2.0-3-notarized/';
    assert.equal(links[0].origin, origin, 'The download must work without private repository access');
    assert.equal(links[0].pathname, `${releasePath}bassh-mac-0.2.0-3-notarized.zip`);
    assert.ok(html.includes(`href="${releasePath}SHA256SUMS"`), 'Checksums must identify the current release');
    for (const [name, checksum] of Object.entries(expected)) {
      const download = await fetch(`${origin}${releasePath}${name}`);
      assert.equal(download.status, 200, `The ${name} link must serve a download`);
      const actual = createHash('sha256').update(Buffer.from(await download.arrayBuffer())).digest('hex');
      assert.equal(actual, checksum, `${name} must match the verified release`);
    }
    const release = await (await fetch(`${origin}${releasePath}release.json`)).json();
    assert.equal(release.signing, 'developer-id');
    assert.equal(release.notarized, true);
    assert.deepEqual(release.architectures, ['arm64', 'x86_64']);
    assert.doesNotMatch(html, /Open Anyway|xattr|not notarized|ad hoc/i, 'The page must not instruct users to bypass Gatekeeper for this notarized release');
  } finally {
    await server.close();
    await rm(cacheDir, { recursive: true, force: true });
  }
});

test('the iPhone beta stays private and the email button only expresses release interest', async () => {
  const html = await readFile(new URL('../public/bassh/index.html', import.meta.url), 'utf8');
  assert.match(html, /iPhone app is in private testing/);
  assert.doesNotMatch(html, /testflight\.apple\.com|href="[^"]+\.ipa|request beta access|<form\b/i);
  const emailHref = html.match(/class="release-interest-button" href="([^"]+)"/)?.[1];
  assert.ok(emailHref, 'Visitors must be able to email about the App Store release');
  const email = new URL(emailHref.replaceAll('&amp;', '&'));
  assert.equal(email.protocol, 'mailto:');
  assert.equal(email.pathname, 'sam.jgreen@icloud.com');
  assert.equal(email.searchParams.get('subject'), 'bassh App Store release');
  assert.match(email.searchParams.get('body'), /let me know when bassh is available on the App Store/);
  assert.doesNotMatch(email.searchParams.get('body'), /beta|TestFlight/i);
});
