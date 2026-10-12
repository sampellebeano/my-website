import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../public/bassh/download.js', import.meta.url), 'utf8');

// Node has no viewport. Supply only browser geometry and event delivery.
function createViewport(initialBottom = 1100) {
  let bottom = initialBottom;
  const listeners = new Map();
  const floating = { hidden: true };
  const primary = {
    getBoundingClientRect: () => ({ bottom }),
    focus: () => { document.activeElement = primary; },
  };
  const document = {
    activeElement: null,
    getElementById: id => ({ 'mac-download': primary, 'floating-download': floating })[id],
  };
  const window = { addEventListener: (type, callback) => listeners.set(type, callback) };
  runInNewContext(source, { document, window });
  return {
    primary, floating, document,
    update: (nextBottom, type = 'scroll') => { bottom = nextBottom; listeners.get(type)?.(); },
  };
}

test('the floating download appears only after the original has scrolled above the viewport', () => {
  const viewport = createViewport();
  assert.equal(viewport.floating.hidden, true, 'A download still below the viewport must not float');
  viewport.update(24);
  assert.equal(viewport.floating.hidden, true, 'Keep only the original while any of it remains visible');
  viewport.update(-1);
  assert.equal(viewport.floating.hidden, false, 'Keep the download accessible after scrolling past it');
  viewport.update(20);
  assert.equal(viewport.floating.hidden, true, 'Hide the floating copy when the original returns');
});

test('a jump directly from below the viewport to above it still exposes the download', () => {
  const viewport = createViewport(1100);
  viewport.update(-700);
  assert.equal(viewport.floating.hidden, false, 'Section jumps must work without an intermediate intersection');
});

test('a restored position below the download exposes the floating button before any scroll event', () => {
  const viewport = createViewport(-700);
  assert.equal(viewport.floating.hidden, false);
});

test('a resize that brings the original back into view hides the floating button', () => {
  const viewport = createViewport(-100);
  viewport.update(30, 'resize');
  assert.equal(viewport.floating.hidden, true);
});

test('keyboard focus returns to the original when its focused floating copy hides', () => {
  const viewport = createViewport(-100);
  viewport.document.activeElement = viewport.floating;
  viewport.update(30);
  assert.equal(viewport.floating.hidden, true);
  assert.equal(viewport.document.activeElement, viewport.primary);
});

test('scrolling leaves focus alone when the floating button is not focused', () => {
  const viewport = createViewport();
  const otherControl = {};
  viewport.document.activeElement = otherControl;
  viewport.update(-100);
  viewport.update(30);
  assert.equal(viewport.document.activeElement, otherControl);
});
