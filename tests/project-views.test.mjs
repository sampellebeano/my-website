import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

function render(route) {
  // Vite's SSR transform emits jsxDEV; use React's development runtime.
  const result = spawnSync(process.execPath, ['tests/render-site.mjs', route], { encoding: 'utf8', env: { ...process.env, NODE_ENV: 'development' } });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test('Projects renders personal builds instead of employer initiatives', () => {
  const html = render('/projects');
  assert.ok(/>Kapture</.test(html), 'Projects must show Kapture');
  assert.ok(/>bassh</.test(html), 'Projects must show bassh');
  assert.ok(!/Presight|Autonomous workforce solutions for aviation|Quip Black Belt programme/.test(html), 'Employer initiatives must not appear as personal projects');
});
test('the overview features personal projects', () => {
  const html = render('/');
  assert.ok(/projects\?entry=kapture/.test(html), 'Overview must link to Kapture');
  assert.ok(/projects\?entry=bassh/.test(html), 'Overview must link to bassh');
  assert.ok(!/projects\?entry=(presight|aviation)/.test(html), 'Overview must not feature employer initiatives as personal projects');
});
test('the bassh project detail opens the public companion download page', () => {
  const html = render('/projects?entry=bassh');
  assert.ok(/href="\/bassh"/.test(html), 'The project must expose its public download page');
});
test('career highlights have readable Experience details', () => {
  const html = render('/experience?entry=aviation');
  assert.ok(/id="aviation"/.test(html), 'Career detail must identify the aviation record');
  assert.ok(/Autonomous workforce solutions for aviation/.test(html), 'Career detail must render its title');
  assert.ok(/All experience/.test(html), 'Career detail must link back to Experience');
});
test('the current full CV no longer publishes the client name', () => {
  assert.ok(!/Presight/i.test(render('/search')), 'Current full CV must remove the client name');
});

test('the overview gives career the first position before personal projects', () => {
  const html = render('/');
  const sections = [...html.matchAll(/<section[^>]*aria-labelledby="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(sections.slice(0, 2), ['career-title', 'work-title']);
});
