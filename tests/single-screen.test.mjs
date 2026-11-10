import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

function render(route) {
  const result = spawnSync(process.execPath, ['tests/render-site.mjs', route], { encoding: 'utf8', env: { ...process.env, NODE_ENV: 'development' } });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test('home exposes the complete app collection, contact, CV and history in a compact introduction', () => {
  const html = render('/');
  assert.match(html, /I work in tech\.<br\/>I also make apps/);
  for (const slug of ['bassh', 'highlighter', 'kapture']) assert.match(html, new RegExp(`href="/projects/${slug}"`));
  assert.equal((html.match(/aria-label="Sam’s project iPhone"/g) ?? []).length, 1);
  assert.match(html, /href="mailto:sam.jgreen@icloud.com"/);
  assert.match(html, /href="\/cv\/Sam-Green-Solution-Architecture-CV.pdf"/);
  assert.match(html, /href="\/cv"/);
  assert.doesNotMatch(html, /role="search"|href="\/search(?:[?\/"])/);
  assert.match(html, /href="\/history"/);
  assert.doesNotMatch(html, /home-career|home-history|demo-selected-description/);
});

test('project collection pairs all summaries with a single launcher', () => {
  const html = render('/projects');
  assert.equal((html.match(/aria-label="Sam’s project iPhone"/g) ?? []).length, 1);
  for (const slug of ['bassh', 'highlighter', 'kapture']) assert.match(html, new RegExp(`href="/projects/${slug}"`));
  assert.match(html, /Find a creator, plan a project and keep the work in one place/);
  assert.doesNotMatch(html, /It saves my connections and lets me keep a few sessions open/);
});

test('app overviews pair the description with only the selected demo', () => {
  const html = render('/projects/bassh');
  assert.match(html, /<h1[^>]*>bassh<\/h1>/);
  assert.match(html, /bassh-demo-poster.png/);
  assert.doesNotMatch(html, /kapture-journey-demo-poster|src="[^"]+\.gif/);
  assert.match(html, /href="\/bassh#setup"[^>]*>Setup guide/);
  assert.match(html, /href="\/projects"/);
});

test('the complete bassh description is visible even on old pagination links', () => {
  for (const route of ['/projects/bassh', '/projects/bassh?page=2', '/projects/bassh?page=999']) {
    const html = render(route);
    assert.match(html, /The phone connects over SSH/, route);
    assert.match(html, /It saves my connections and lets me keep a few sessions open/, route);
    assert.match(html, /check the Mac’s host fingerprint/, route);
    assert.match(html, /The Mac app needs macOS 15/, route);
    assert.doesNotMatch(html, /description pages|href="[^"]*\?page=/, route);
  }
});

test('legacy app queries open the chosen overview and unknown app IDs have a return path', () => {
  assert.match(render('/projects?entry=bassh'), /<h1[^>]*>bassh<\/h1>/);
  const html = render('/projects/not-a-project');
  assert.match(html, /Project not found/);
  assert.match(html, /href="\/projects"/);
});

test('highlighter detail retains its text-only state at the current URL', () => {
  const html = render('/projects/highlighter');
  assert.match(html, /No recording available yet/);
  assert.match(html, /original GPS routes|recorded routes/);
  assert.doesNotMatch(html, /images\/apps\/(?:ryw|highlighter)-|src="[^"]+\.gif/);
});

test('home, project index and every app use the same dedicated phone layout', () => {
  for (const route of ['/', '/projects', '/projects/bassh', '/projects/bassh?page=2', '/projects/highlighter', '/projects/kapture']) {
    const html = render(route);
    assert.match(html, /<section class="device-stage(?: [^"]*)?"/, route);
    assert.match(html, /<div class="device-stage-copy">/, route);
    assert.equal((html.match(/<aside class="screen-phone"/g) ?? []).length, 1, route);
    assert.equal((html.match(/class="phone-showcase-device"/g) ?? []).length, 1, route);
  }
});

test('missing pages retain the common home mark, navigation and a recovery link', () => {
  const html = render('/404');
  assert.match(html, /class="site-frame/);
  assert.match(html, /aria-label="Sam Green home"/);
  assert.match(html, /src="\/favicon.png"/);
  assert.match(html, /<h1[^>]*>Page not found<\/h1>/);
  assert.match(html, /href="\/projects"/);
  assert.match(html, /href="\/history"/);
  assert.match(html, /href="\/"[^>]*>[^<]*Return home/);
  assert.equal((html.match(/<main\b/g) ?? []).length, 1);
});

test('document routes retain their layout when opened with a trailing slash', () => {
  for (const route of ['/cv/', '/books/', '/updates/']) {
    assert.match(render(route), /class="site-frame[^\"]*site-frame--document/, route);
  }
});
