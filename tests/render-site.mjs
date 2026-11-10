import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { daily, weekly, book } from './fixtures.mjs';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ssrViteOptions } from '../scripts/ssr-vite-options.mjs';

const route = process.argv[2];
const pathname = new URL(route, 'https://website.test').pathname.replace(/\/+$/, '') || '/';
const pages = { '/': 'Showcase', '/projects': 'Showcase', '/experience': 'Experience', '/cv': 'CV', '/updates': 'Updates', '/books': 'Books', '/history': 'SiteHistory', '/404': 'NotFound' };
const path = /^\/projects\/[^/]+$/.test(pathname) ? '/projects/:projectId' : pathname;
const page = pages[path] ?? (path === '/projects/:projectId' ? 'Showcase' : undefined);
if (!page) throw new Error('Unsupported render fixture');
const cacheDir = await mkdtemp(join(tmpdir(), 'website-render-test-'));
const root = fileURLToPath(new URL('../', import.meta.url));
try {
  const server = await createServer({ ...ssrViteOptions(), root, cacheDir, mode: 'production', logLevel: 'silent', server: { middlewareMode: true, watch: null }, appType: 'custom' });
  try {
    if (process.argv[3] === 'populated') {
      const { publicContent } = await server.ssrLoadModule('/src/data/public-content.ts');
      publicContent.activity = [daily(), daily({ id: 'daily-second', title: 'A second note' }), weekly()];
      publicContent.books = [book(), book({ id: 'book-second', title: 'Another book', status: 'read' })];
    }
    const { default: Page } = await server.ssrLoadModule(`/src/pages/${page}.tsx`);
    if (process.argv[3] === 'reduced-motion') {
      globalThis.window = { matchMedia: query => ({ matches: query === '(prefers-reduced-motion: reduce)' }) };
    }
    process.stdout.write(renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [route] },
      createElement(Routes, null, createElement(Route, { path, element: createElement(Page) })))));
  } finally { await server.close(); }
} finally { await rm(cacheDir, { recursive: true, force: true }); }
