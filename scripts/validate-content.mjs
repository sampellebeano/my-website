import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import { createServer } from 'vite';
import { parsePublicContent } from '../src/lib/public-content.ts';

const root = fileURLToPath(new URL('../', import.meta.url));

async function readCollection(directory, name) {
  let raw;
  try { raw = await readFile(join(directory, `${name}.json`), 'utf8'); }
  catch { throw new Error(`Cannot read ${name}.json in the content directory.`); }
  try { return JSON.parse(raw); }
  catch { throw new Error(`${name}.json is not valid JSON. Check its syntax without including private drafts.`); }
}

try {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--content-dir')) {
    throw new Error('Usage: validate-content.mjs [--content-dir <directory>]');
  }
  const directory = args.length ? resolve(args[1]) : join(root, 'content');
  const [activity, books, versions] = await Promise.all([
    readCollection(directory, 'activity'), readCollection(directory, 'books'), readCollection(directory, 'site-versions'),
  ]);
  const server = await createServer({ root, mode: 'production', logLevel: 'silent', server: { middlewareMode: true, watch: null }, appType: 'custom' });
  let cvIds;
  try {
    const { entries } = await server.ssrLoadModule('/src/data/cv.ts');
    cvIds = entries.filter(entry => entry.section === 'work').map(entry => entry.id);
  } finally { await server.close(); }
  const content = parsePublicContent({ activity, books, versions }, cvIds);
  console.log(`Public content valid: ${content.activity.length} activity, ${content.books.length} books, ${content.versions.length} previous versions.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
