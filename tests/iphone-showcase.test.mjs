import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ssrViteOptions } from '../scripts/ssr-vite-options.mjs';

let server;
let cacheDir;
let IPhoneShowcase;

before(async () => {
  cacheDir = await mkdtemp(join(tmpdir(), 'iphone-showcase-test-'));
  server = await createServer({
    ...ssrViteOptions(),
    root: fileURLToPath(new URL('../', import.meta.url)),
    cacheDir,
    mode: 'production',
    logLevel: 'silent',
    server: { middlewareMode: true, watch: null },
    appType: 'custom',
  });
  ({ IPhoneShowcase } = await server.ssrLoadModule('/src/components/IPhoneShowcase.tsx'));
});

after(async () => {
  await server?.close();
  if (cacheDir) await rm(cacheDir, { recursive: true, force: true });
});

function render(props = {}) {
  return renderToStaticMarkup(createElement(IPhoneShowcase, props));
}

test('the compact launcher loads app identities without mounting any recording', () => {
  const html = render();
  const launcher = html.match(/<div class="demo-app-grid">([\s\S]*?)<\/div>/)?.[1] ?? '';
  assert.match(launcher, /aria-label="Open bassh demo"/);
  assert.match(launcher, /aria-label="Open highlighter overview"/);
  assert.match(launcher, /aria-label="Open Kapture demo"/);
  assert.doesNotMatch(html, /images\/apps\/ryw-/);
  assert.match(html, /^<div class="phone-showcase-device"/);
  assert.doesNotMatch(html, /app-directory|phone-showcase-intro|demo-selected-description/);
  assert.doesNotMatch(html, /<img\b[^>]*src="[^"]+(?:\.gif|-demo-poster\.png)"/, 'No recording or poster loads before a selection');
});

test('a selected project renders its poster immediately for a direct route', () => {
  const html = render({ selectedId: 'bassh', onSelectProject() {}, onHome() {} });
  const recording = html.match(/<img\b[^>]*class="demo-recording"[^>]*>/g) ?? [];
  assert.equal(recording.length, 1);
  assert.match(recording[0], /src="\/images\/apps\/bassh-demo-poster\.png"/);
  assert.doesNotMatch(html, /kapture-journey-demo(?:-poster)?\.(?:gif|png)/);
  assert.doesNotMatch(recording[0], /\.gif/);
  assert.match(html, /aria-label="Play bassh demo"/);
  assert.match(html, /aria-label="Return to iPhone home screen"/);
  assert.match(html, /role="status">bassh demo paused\./);
});

test('the selected app exposes Home and playback before the phone screen in focus order', () => {
  const html = render({ selectedId: 'bassh' });
  assert.match(html, /class="demo-phone-controls"[\s\S]*aria-label="Return to iPhone home screen"[\s\S]*aria-label="Play bassh demo"[\s\S]*class="demo-iphone" role="group"/);
});

test('a selected highlighter overview stays truthful without invented media', () => {
  const html = render({ selectedId: 'ryw' });
  assert.match(html, /<h3>highlighter<\/h3>/);
  assert.match(html, /In development/);
  assert.match(html, /A map of the places I’ve run/);
  assert.match(html, /No recording available yet/);
  assert.doesNotMatch(html, /class="demo-recording"|images\/apps\/(?:ryw|highlighter)-|aria-label="Play (?:RYW|highlighter)/);
});

test('no device view adds a synthetic island or notch over supplied captures', () => {
  for (const selectedId of [undefined, 'bassh', 'kapture', 'ryw']) {
    assert.doesNotMatch(render({ selectedId }), /demo-island|demo-notch/);
  }
});

test('an unknown selected project falls back to the launcher', () => {
  const html = render({ selectedId: 'missing' });
  assert.doesNotMatch(html, /class="demo-open-app"|class="demo-recording"/);
  assert.match(html, /iPhone home screen\. Choose an app/);
});

test('a growing collection shows only eight of 29 apps with labelled pagination', () => {
  const extraApps = Array.from({ length: 29 }, (_, index) => ({
    id: `future-${index + 1}`,
    title: `Future app ${index + 1}`,
    context: 'Personal project · iPhone',
    summary: `An honest summary for app ${index + 1}.`,
    paragraphs: [],
    status: 'In development',
  }));
  const html = render({ projects: extraApps });
  assert.equal((html.match(/class="demo-app-icon"/g) ?? []).length, 8);
  assert.match(html, /aria-label="Open Future app 8 overview"/);
  assert.doesNotMatch(html, /aria-label="Open Future app 9 overview"|aria-label="Open Future app 29 overview"/);
  assert.match(html, /aria-label="Next apps page"/);
  assert.match(html, /class="demo-app-grid"[\s\S]*class="demo-phone-controls"[\s\S]*aria-label="Next apps page"/);
  assert.match(html, /Page 1 of 4/);
  assert.match(html, /Apps 1–8 of 29/);
  assert.doesNotMatch(html, /<img\b/, 'Missing artwork remains typographic');
});

test('a direct selection on a later page keeps its launcher icon available for returning home', () => {
  const projects = Array.from({ length: 9 }, (_, index) => ({
    id: `future-${index + 1}`,
    title: `Future app ${index + 1}`,
    context: 'Personal project · iPhone',
    summary: `An honest summary for app ${index + 1}.`,
    paragraphs: [],
  }));
  const html = render({ projects, selectedId: 'future-9' });
  assert.match(html, /<h3>Future app 9<\/h3>/);
  assert.match(html, /aria-label="Open Future app 9 overview"/);
  assert.doesNotMatch(html, /aria-label="Open Future app 1 overview"/);
});
