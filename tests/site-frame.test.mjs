import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';

const frameSelectors = ['.site-frame', '.page-content', '.project-frame'];

function luminance(rgb) {
  const [r, g, b] = rgb.map(channel => {
    const srgb = channel / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

test('current pages share a responsive paper frame', async () => {
  const themeUrl = new URL('../public/styles/site-theme.css', import.meta.url);
  const theme = postcss.parse(await readFile(themeUrl, 'utf8'));
  const palette = theme.nodes.find(node => node.selector === ':root');
  const color = name => palette.nodes.find(node => node.prop === name)?.value;
  const rgb = hex => hex.match(/[a-f\d]{2}/gi).map(channel => Number.parseInt(channel, 16));
  const canvas = rgb(color('--site-canvas'));
  const paper = rgb(color('--site-paper'));
  const frame = theme.nodes.find(node => node.selectors?.includes('.site-frame') && node.nodes?.some(decl => decl.prop === 'width'));
  assert.ok(frame, 'The shared theme sets the frame width');
  assert.deepEqual(frame.selectors, frameSelectors);
  const frameValue = name => frame.nodes.find(node => node.prop === name)?.value;
  assert.match(frameValue('width'), /var\(--site-frame-width\)/);
  assert.equal(frameValue('border'), '1px solid var(--site-frame-edge)');
  assert.equal(frameValue('background-image'), 'var(--site-paper-finish)');
  const texturePath = color('--site-paper-finish').match(/url\("([^"]+)"\)/)?.[1];
  assert.ok(texturePath, 'The shared finish references a paper texture');
  assert.match(await readFile(new URL(texturePath, themeUrl), 'utf8'), /<svg\b/);

  const edge = rgb(color('--site-frame-edge'));
  assert.ok(edge.every((channel, index) => channel >= canvas[index] && channel <= paper[index]), 'The edge falls between the canvas and the page surface');
  const muted = rgb(color('--site-muted'));
  assert.ok((luminance(paper) + 0.05) / (luminance(muted) + 0.05) >= 7, 'Small muted text has strong contrast on the paper');
});

test('desktop frames share a viewport height and scroll when their content is longer', async () => {
  const theme = postcss.parse(await readFile(new URL('../public/styles/site-theme.css', import.meta.url), 'utf8'));
  const desktop = theme.nodes.find(node => node.name === 'media' && node.params === '(min-width: 761px)');
  const frame = desktop?.nodes.find(node => frameSelectors.every(selector => node.selectors?.includes(selector)));

  assert.ok(frame, 'All current pages share the desktop frame height rule');
  const value = property => frame.nodes.find(node => node.prop === property)?.value;
  assert.match(value('height'), /100svh.*--site-frame-gap/);
  assert.equal(value('overflow-y'), 'auto');
});
