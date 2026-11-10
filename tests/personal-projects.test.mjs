import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { projects } from '../src/data/projects.ts';
import { searchPublicContent } from '../src/lib/public-search.ts';

const content = { activity: [], books: [], versions: [] };
const career = [{ id: 'aviation', section: 'work', title: 'Autonomous workforce solutions for aviation', context: 'Career work', paragraphs: ['A ServiceNow career initiative.'] }];

test('personal projects include the user-named builds and exclude employer initiatives', () => {
  assert.deepEqual(projects.map(project => project.id), ['bassh', 'ryw', 'kapture']);
  assert.ok(!projects.some(project => ['presight', 'aviation', 'executive-briefings', 'quip'].includes(project.id)));
});
test('Kapture search remains readable without a standalone destination', () => {
  const results = searchPublicContent('Kapture', '', career, content, projects);
  assert.equal(results.length, 1);
  assert.equal(results[0].source, 'project');
  assert.equal(results[0].href, undefined);
});
test('bassh search links directly to its standalone page', () => {
  const results = searchPublicContent('bassh', '', career, content, projects);
  assert.equal(results.length, 1);
  assert.equal(results[0].source, 'project');
  assert.equal(results[0].href, '/bassh');
});
test('highlighter keeps its established ID and is discoverable by its new name, old names and purpose', () => {
  const project = projects.find(project => project.id === 'ryw');
  assert.ok(project, 'Keep the established ryw project identity');
  assert.equal(project.title, 'highlighter');
  assert.equal(project.icon, undefined, 'Do not invent approved artwork for the rename');
  assert.equal(project.screenshot, undefined, 'Do not invent a recording for the rename');
  for (const query of ['highlighter', 'RYW', 'RTW', 'Run the World', 'Run Your World', 'running map']) {
    const results = searchPublicContent(query, '', career, content, projects);
    assert.ok(results.some(result => result.id === 'ryw' && result.title === 'highlighter' && result.source === 'project'), query);
  }
  assert.deepEqual(searchPublicContent('highlighter', 'work', career, content, projects), []);
  assert.deepEqual(searchPublicContent('RYW', 'work', career, content, projects), []);
});
test('published app GIFs and still posters reserve their actual image dimensions', async () => {
  assert.equal(projects.find(project => project.id === 'ryw').screenshot, undefined, 'highlighter’s previous image is withdrawn');
  for (const project of projects.filter(project => project.id !== 'ryw')) {
    assert.ok(project.screenshot, `${project.title} needs a screenshot`);
    const { src, poster, width, height } = project.screenshot;
    assert.match(src, /^\/images\/apps\/[a-z-]+\.gif$/);
    const gif = await readFile(new URL(`../public${src}`, import.meta.url));
    assert.match(gif.subarray(0, 6).toString(), /^GIF8[79]a$/);
    assert.equal(gif.readUInt16LE(6), width, `${project.title} GIF width`);
    assert.equal(gif.readUInt16LE(8), height, `${project.title} GIF height`);
    assert.match(poster, /^\/images\/apps\/[a-z-]+\.png$/);
    const png = await readFile(new URL(`../public${poster}`, import.meta.url));
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.equal(png.readUInt32BE(16), width, `${project.title} width`);
    assert.equal(png.readUInt32BE(20), height, `${project.title} height`);
  }
});
test('the withdrawn RYW screenshot is no longer a public asset', async () => {
  await assert.rejects(readFile(new URL('../public/images/apps/ryw-routes.png', import.meta.url)), { code: 'ENOENT' });
});
test('personal projects do not enter full CV or filtered CV browsing', () => {
  assert.deepEqual(searchPublicContent('', '', career, content, projects).map(result => result.id), ['aviation']);
  assert.deepEqual(searchPublicContent('Kapture', 'work', career, content, projects), []);
});
test('career highlight search opens Experience rather than Projects', () => {
  const results = searchPublicContent('aviation', '', career, content, projects);
  assert.equal(results[0].source, 'cv');
  assert.equal(results[0].href, '/experience');
});
