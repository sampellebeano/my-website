import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';

const contentFrames = [
  ['../src/components/single-screen.css', '.site-frame'],
  ['../public/kapture/style.css', '.project-frame'],
];
const frames = [...contentFrames, ['../public/bassh/style.css', '.page-content']];

test('current pages share a paper finish and a frame edge that blends into the surrounding canvas', async () => {
  const theme = postcss.parse(await readFile(new URL('../public/styles/site-theme.css', import.meta.url), 'utf8'));
  const palette = theme.nodes.find(node => node.selector === ':root');
  const color = name => palette.nodes.find(node => node.prop === name)?.value;
  const rgb = hex => hex.match(/[a-f\d]{2}/gi).map(channel => Number.parseInt(channel, 16));
  const canvas = rgb(color('--site-canvas'));
  const paper = rgb(color('--site-paper'));

  for (const [path, selector] of frames) {
    const stylesheet = postcss.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
    const rule = stylesheet.nodes.find(node => node.selector === selector);
    const border = rule?.nodes.find(node => node.prop === 'border')?.value;
    const token = border?.match(/var\((--[\w-]+)\)/)?.[1];
    assert.equal(token, '--site-frame-edge', selector);
    assert.equal(rule?.nodes.find(node => node.prop === 'background-image')?.value, 'var(--site-paper-finish)', selector);
  }

  const edge = rgb(color('--site-frame-edge'));
  assert.ok(edge.every((channel, index) => channel >= canvas[index] && channel <= paper[index]), 'The edge falls between the canvas and the page surface');
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
