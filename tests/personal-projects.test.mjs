import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { projects } from '../src/data/projects.ts';

test('personal projects include the user-named builds and exclude employer initiatives', () => {
  assert.deepEqual(projects.map(project => project.id), ['bassh', 'ryw', 'kapture']);
  assert.ok(!projects.some(project => ['presight', 'aviation', 'executive-briefings', 'quip'].includes(project.id)));
});
test('highlighter keeps its established ID and uses its current name', () => {
  const project = projects.find(project => project.id === 'ryw');
  assert.ok(project, 'Keep the established ryw project identity');
  assert.equal(project.title, 'highlighter');
  assert.equal(project.icon, undefined, 'Do not invent approved artwork for the rename');
  assert.equal(project.screenshot, undefined, 'Do not invent a recording for the rename');
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
