import { createHash } from 'node:crypto';
import { access, cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const excludedNames = new Set(['node_modules', '.git', '.vercel', '.agents', '.codex', '.aws', '.DS_Store', 'dist']);

async function filesIn(root, filter = () => true, prefix = '') {
  const files = [];
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
    const name = join(prefix, entry.name);
    if (!filter(name, entry.name) || entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) files.push(...await filesIn(root, filter, name));
    else if (entry.isFile()) files.push(name);
  }
  return files.sort();
}

async function manifest(root, filter) {
  const result = {};
  for (const file of await filesIn(root, filter)) result[file.split(sep).join('/')] = sha256(await readFile(join(root, file)));
  return `${JSON.stringify(result, null, 2)}\n`;
}

function localDestination(url) {
  const [path, suffix = ''] = url.split(/(?=[?#])/s, 2);
  if (path === '/') return `index.html${suffix}`;
  if (path === '/bassh' || path === '/kapture') return `${path.slice(1)}/index.html${suffix}`;
  return `${path.slice(1)}${suffix}`;
}

function relativeResource(file, destination) {
  const path = relative(dirname(file), destination).split(sep).join('/');
  return path.startsWith('.') ? path : `./${path}`;
}

export async function captureSiteVersion({ buildDir, sourceDir, outputDir, capturedOn, baseRevision, id, label }) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(capturedOn) || !/^[a-f0-9]{40}$/.test(baseRevision) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || !label?.trim()) throw new Error('Provide a capture date, full base revision, stable ID and label.');
  if (!new RegExp(`^${capturedOn}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$`).test(basename(outputDir))) throw new Error('Output folder must match the capture date with an optional suffix.');
  const insideBuild = relative(resolve(buildDir), resolve(outputDir));
  if (!insideBuild || (!insideBuild.startsWith(`..${sep}`) && insideBuild !== '..')) throw new Error('Keep the snapshot outside its build directory.');
  try { await access(outputDir); throw new Error('Snapshot output already exists; choose a new edition.'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await access(join(buildDir, 'index.html'));
  const sourceManifest = await manifest(sourceDir, (path, name) => !excludedNames.has(name) && !name.startsWith('.env') && !/^public\/(?:history|downloads)(?:\/|$)/.test(path));
  await mkdir(dirname(outputDir), { recursive: true });
  await cp(buildDir, outputDir, { recursive: true, filter: path => {
    const part = relative(buildDir, path).split(sep).join('/');
    return !/^(?:history|downloads)(?:\/|$)/.test(part) && !/\.docx$/i.test(part);
  } });
  for (const file of await filesIn(outputDir)) {
    const extension = extname(file);
    if (!['.html', '.css', '.js'].includes(extension)) continue;
    let content = await readFile(join(outputDir, file), 'utf8');
    if (extension === '.html') {
      content = content.replace(/(\b[\w-]+\s*=\s*)(["'])(\/(?!\/)[^"']*)\2/g, (_, attribute, quote, url) => `${attribute}${quote}${relativeResource(file, localDestination(url))}${quote}`);
    } else if (extension === '.css') {
      content = content.replace(/url\(\s*(["']?)(\/(?!\/)[^)'"\s]+)\1\s*\)/g, (_, quote, url) => `url(${quote}${relativeResource(file, localDestination(url))}${quote})`);
    } else if (file.startsWith(`assets${sep}`)) {
      content = content.replace(/(["'])(\/(?:images\/|styles\/|scripts\/|cv\/|bassh(?:\/[^"']*)?|kapture(?:\/[^"']*)?)[^"']*)\1/g, (_, _quote, url) => `new URL(${JSON.stringify(relativeResource(file, localDestination(url)))},import.meta.url).href`);
      // Keep validated edition metadata intact; only rebase its rendered URLs.
      content = content.replace(/`\.\/\$\{([A-Za-z_$][\w$]*(?:\[\d+\])?)\.(path|preview)\}`/g, (_, record, field) => `new URL("../"+${record}.${field}.replace(/^history\\//,""),document.baseURI).href`);
    }
    await writeFile(join(outputDir, file), content);
  }
  await writeFile(join(outputDir, 'source-manifest.json'), sourceManifest);
  const buildManifest = await manifest(outputDir);
  await writeFile(join(outputDir, 'build-manifest.json'), buildManifest);
  return { id, label, capturedOn, path: `history/${basename(outputDir)}/index.html`, sourceKind: 'working-tree', baseRevision, sourceManifestSha256: sha256(sourceManifest), buildManifestSha256: sha256(buildManifest) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const options = {};
  for (let index = 2; index < process.argv.length; index += 2) {
    const key = process.argv[index].replace(/^--/, '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    options[key] = process.argv[index + 1];
  }
  const result = await captureSiteVersion(options);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
