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
  assert.match(html, /Technology, AI/);
  for (const id of ['bassh', 'ryw', 'kapture']) assert.match(html, new RegExp(`href="/projects/${id}"`));
  assert.equal((html.match(/aria-label="Sam’s project iPhone"/g) ?? []).length, 1);
  assert.match(html, /href="mailto:sam.jgreen@icloud.com"/);
  assert.match(html, /href="\/cv\/Sam-Green-Solution-Architecture-CV.pdf"/);
  assert.match(html, /href="\/history"/);
  assert.doesNotMatch(html, /home-career|home-history|demo-selected-description/);
});

test('project collection pairs all summaries with a single launcher', () => {
  const html = render('/projects');
  assert.equal((html.match(/aria-label="Sam’s project iPhone"/g) ?? []).length, 1);
  for (const id of ['bassh', 'ryw', 'kapture']) assert.match(html, new RegExp(`href="/projects/${id}"`));
  assert.match(html, /A marketplace to help clients find creators/);
  assert.doesNotMatch(html, /Saved connections and multiple sessions/);
});

test('app descriptions use a matching next screen with only the selected demo', () => {
  const html = render('/projects/bassh');
  assert.match(html, /<h1[^>]*>bassh<\/h1>/);
  assert.match(html, /Saved connections and multiple sessions/);
  assert.match(html, /bassh-demo-poster.png/);
  assert.doesNotMatch(html, /kapture-journey-demo-poster|src="[^"]+\.gif/);
  assert.match(html, /href="\/projects\/bassh\?page=2"/);
  assert.match(html, /href="\/bassh"/);
  assert.match(html, /href="\/projects"/);
});

test('all app description paragraphs remain reachable through bounded pages', () => {
  const first = render('/projects/bassh');
  const second = render('/projects/bassh?page=2');
  assert.doesNotMatch(first, /The Mac companion supports macOS 15/);
  assert.match(second, /The Mac companion supports macOS 15/);
  assert.match(second, /href="\/projects\/bassh"/);
  const invalid = render('/projects/bassh?page=999');
  assert.match(invalid, /The Mac companion supports macOS 15/);
});

test('legacy app queries open the chosen overview and unknown app IDs have a return path', () => {
  assert.match(render('/projects?entry=bassh'), /<h1[^>]*>bassh<\/h1>/);
  const html = render('/projects/not-a-project');
  assert.match(html, /Project not found/);
  assert.match(html, /href="\/projects"/);
});

test('RYW detail retains its honest text-only state', () => {
  const html = render('/projects/ryw');
  assert.match(html, /No recording available yet/);
  assert.match(html, /original GPS routes|recorded routes/);
  assert.doesNotMatch(html, /images\/apps\/ryw-|src="[^"]+\.gif/);
});
