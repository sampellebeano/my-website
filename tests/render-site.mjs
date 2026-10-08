import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

const route = process.argv[2];
const pathname = new URL(route, 'https://website.test').pathname;
const pages = { '/': 'Index', '/projects': 'Projects', '/experience': 'Experience', '/search': 'SearchResults' };
if (!pages[pathname]) throw new Error('Unsupported render fixture');
const cacheDir = await mkdtemp(join(tmpdir(), 'website-render-test-'));
const root = fileURLToPath(new URL('../', import.meta.url));
try {
  const server = await createServer({ root, cacheDir, mode: 'production', logLevel: 'silent', server: { middlewareMode: true, watch: null }, appType: 'custom' });
  try {
    const { default: Page } = await server.ssrLoadModule(`/src/pages/${pages[pathname]}.tsx`);
    process.stdout.write(renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [route] }, createElement(Page))));
  } finally { await server.close(); }
} finally { await rm(cacheDir, { recursive: true, force: true }); }
