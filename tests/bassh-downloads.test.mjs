import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

test('the Bassh project links to the download page without hosting an installer', async () => {
  const html = await readFile(new URL('../public/bassh/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /href="\/downloads\/|Download for Mac|href="[^"]+\.(?:ipa|zip|dmg|pkg)(?:[?#"])/i);
  const downloads = [...html.matchAll(/<a\b[^>]*\bdownload(?=\s|=|>)[^>]*>/gi)];
  assert.equal(downloads.length, 1, 'The shared CV must be the only downloadable file');
  assert.match(downloads[0][0], /href="\/cv\/Sam-Green-Solution-Architecture-CV\.pdf"/);
  assert.doesNotMatch(html, /download-dock|floating-download|src="\/bassh\/download\.js"/);
  assert.doesNotMatch(html, /Download the ZIP using the button above|Download a newer version from this page/i);
  assert.match(html, /href="\/bassh\/download"/);
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

test('the download page submits the Mac password to the server and offers email access for iPhone', async () => {
  const html = await readFile(new URL('../public/bassh/download/index.html', import.meta.url), 'utf8');
  assert.match(html, /<form\b[^>]*action="\/api\/bassh-mac-download"[^>]*method="post"/);
  assert.match(html, /<input\b[^>]*type="password"[^>]*name="password"[^>]*required/);
  assert.doesNotMatch(html, /github\.com\/sampellebeano\/bassh\/releases|\.blob\.vercel-storage\.com/);
  assert.doesNotMatch(html, /href="\/downloads\/|testflight\.apple\.com|href="[^"]+\.(?:ipa|zip|dmg|pkg)(?:[?#"])/i);

  const emailHref = html.match(/href="(mailto:[^"]+\?[^"]+)"/)?.[1];
  assert.ok(emailHref, 'Visitors must be able to email for iPhone beta access');
  const email = new URL(emailHref.replaceAll('&amp;', '&'));
  assert.equal(email.pathname, 'sam.jgreen@icloud.com');
  assert.equal(email.searchParams.get('subject'), 'bassh iOS TestFlight access');
  assert.match(email.searchParams.get('body'), /like to try the bassh iPhone beta/);
});

test('Vercel serves both download page URLs and redirects legacy installer requests', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  for (const source of ['/bassh/download', '/bassh/download/']) {
    assert.ok(config.rewrites.some(route => route.source === source && route.destination === '/bassh/download/index.html'));
  }
  assert.deepEqual(config.redirects.find(route => route.source === '/downloads/bassh/:path*'), {
    source: '/downloads/bassh/:path*',
    destination: '/bassh',
    permanent: false,
  });
});

test('the Mac download rejects missing, malformed, and incorrect passwords before delivery', async () => {
  const { POST } = await import('../api/bassh-mac-download.js');
  const key = 'BASSH_MAC_DOWNLOAD_PASSWORD';
  const previous = process.env[key];
  const url = 'https://samjgreen.com/api/bassh-mac-download';

  try {
    delete process.env[key];
    const request = (body, endpoint = url) => new Request(endpoint, { method: 'POST', body });
    const unavailable = await POST(request(new URLSearchParams({ password: 'fixture' })));
    assert.equal(unavailable.status, 303);
    assert.equal(unavailable.headers.get('location'), '/bassh/download#mac-download-unavailable');
    assert.equal(unavailable.headers.get('cache-control'), 'private, no-store');

    process.env[key] = 'fixture-password';
    for (const body of [
      new URLSearchParams(),
      new URLSearchParams({ password: 'incorrect' }),
      new URLSearchParams([['password', 'fixture-password'], ['password', 'incorrect']]),
      new URLSearchParams({ password: 'x'.repeat(2_049) }),
      'password=fixture-password',
    ]) {
      const denied = await POST(request(body));
      assert.equal(denied.status, 303);
      assert.equal(denied.headers.get('location'), '/bassh/download#mac-download-password-error');
      assert.equal(denied.headers.get('content-disposition'), null);
    }

    const alternate = await POST(request(new URLSearchParams({ password: 'fixture-password' }), `${url}/`));
    assert.equal(alternate.status, 404);
  } finally {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  }
});
