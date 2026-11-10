import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

test('the Bassh page has no app download controls or links', async () => {
  const html = await readFile(new URL('../public/bassh/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /href="\/downloads\/|Download for Mac|href="[^"]+\.(?:ipa|zip|dmg|pkg)(?:[?#"])/i);
  const downloads = [...html.matchAll(/<a\b[^>]*\bdownload(?=\s|=|>)[^>]*>/gi)];
  assert.equal(downloads.length, 1, 'The shared CV must be the only downloadable file');
  assert.match(downloads[0][0], /href="\/cv\/Sam-Green-Solution-Architecture-CV\.pdf"/);
  assert.doesNotMatch(html, /download-dock|floating-download|src="\/bassh\/download\.js"/);
  assert.doesNotMatch(html, /Download the ZIP using the button above|Download a newer version from this page/i);
  assert.match(html, /App downloads aren’t currently available from this site/);
});

test('the archived notarized release retains its verified bytes', async () => {
  // Independently verified GitHub release asset hashes, not page-derived values.
  const expected = {
    'bassh-mac-0.2.0-3-notarized.zip': 'c40cdd409950a02345dd981e56950f2fad55fa4cc51cd0fe4e27f55c06938b76',
    'Install.txt': '8b9d2193bd6d1edfcc592e527775aa69c0cd11cf0289f669145ee8057ea069e7',
    'release.json': '95a4425f048112719cc7d8e366ad049304956417cb9c56912207261612f4ac06',
    'SHA256SUMS': '4c7e6f453a0b1042aa6e5199af1c80029fb4be5fdee1323bf6b75c708d959b04',
  };
  const releasePath = '/downloads/bassh/0.2.0-3-notarized/';
  for (const [name, checksum] of Object.entries(expected)) {
    const archivedFile = await readFile(new URL(`../public${releasePath}${name}`, import.meta.url));
    const actual = createHash('sha256').update(archivedFile).digest('hex');
    assert.equal(actual, checksum, `${name} must match the verified release`);
  }
  const release = JSON.parse(await readFile(new URL(`../public${releasePath}release.json`, import.meta.url), 'utf8'));
  assert.equal(release.signing, 'developer-id');
  assert.equal(release.notarized, true);
  assert.deepEqual(release.architectures, ['arm64', 'x86_64']);
});

test('the iPhone beta stays private and the email button only expresses release interest', async () => {
  const html = await readFile(new URL('../public/bassh/index.html', import.meta.url), 'utf8');
  assert.match(html, /I’m still testing the iPhone app privately/);
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
