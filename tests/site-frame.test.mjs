import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';

const contentFrames = [
  ['../src/components/single-screen.css', '.site-frame'],
  ['../public/kapture/style.css', '.project-frame'],
];
const frames = [...contentFrames, ['../public/bassh/style.css', '.page-content']];

function luminance(rgb) {
  const [r, g, b] = rgb.map(channel => {
    const srgb = channel / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

test('current pages share a paper finish and a frame edge that blends into the surrounding canvas', async () => {
  const themeUrl = new URL('../public/styles/site-theme.css', import.meta.url);
  const theme = postcss.parse(await readFile(themeUrl, 'utf8'));
  const palette = theme.nodes.find(node => node.selector === ':root');
  const color = name => palette.nodes.find(node => node.prop === name)?.value;
  const rgb = hex => hex.match(/[a-f\d]{2}/gi).map(channel => Number.parseInt(channel, 16));
  const canvas = rgb(color('--site-canvas'));
  const paper = rgb(color('--site-paper'));
  const finish = theme.nodes.find(node => node.nodes?.some(decl => decl.prop === 'background-image' && decl.value === 'var(--site-paper-finish)'));
  const texturePath = color('--site-paper-finish').match(/url\("([^"]+)"\)/)?.[1];
  assert.ok(texturePath, 'The shared finish references a paper texture');
  assert.match(await readFile(new URL(texturePath, themeUrl), 'utf8'), /<svg\b/);

  for (const [path, selector] of frames) {
    const stylesheet = postcss.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
    const rule = stylesheet.nodes.find(node => node.selector === selector);
    const border = rule?.nodes.find(node => node.prop === 'border')?.value;
    const token = border?.match(/var\((--[\w-]+)\)/)?.[1];
    assert.equal(token, '--site-frame-edge', selector);
    assert.ok(finish?.selectors.includes(selector), selector);
  }

  const edge = rgb(color('--site-frame-edge'));
  assert.ok(edge.every((channel, index) => channel >= canvas[index] && channel <= paper[index]), 'The edge falls between the canvas and the page surface');
  const muted = rgb(color('--site-muted'));
  assert.ok((luminance(paper) + 0.05) / (luminance(muted) + 0.05) >= 7, 'Small muted text has strong contrast on the paper');
});

test('short pages can end at their content height', async () => {
  for (const [path, selector] of contentFrames) {
    const stylesheet = postcss.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
    stylesheet.walkRules(selector, frame => {
      frame.walkDecls(/^(?:min-)?(?:height|block-size)$/, declaration => {
        assert.doesNotMatch(declaration.value, /\d[dls]?v[bh]\b/i, `${selector} must not reserve extra height on tall screens`);
      });
    });
  }
});
