import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { daily } from './fixtures.mjs';

async function validate(activity) {
  const directory = await mkdtemp(join(tmpdir(), 'website-content-test-'));
  try {
    for (const [name, entries] of Object.entries({ activity, books: [], 'site-versions': [] })) {
      await writeFile(join(directory, `${name}.json`), JSON.stringify(entries));
    }
    return spawnSync(process.execPath, ['--experimental-strip-types', 'scripts/validate-content.mjs', '--content-dir', directory], { encoding: 'utf8' });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test('the content CLI accepts a valid public record', async () => {
  const result = await validate([daily()]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 activity/);
});
test('the content CLI rejects private fields with a redacted actionable error', async () => {
  const result = await validate([daily({ privateNotes: 'SECRET-TEST-VALUE' })]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /activity\.0.*unrecognised/);
  assert.ok(!`${result.stdout}${result.stderr}`.includes('SECRET-TEST-VALUE'));
});
test('the content CLI resolves project links from the existing CV', async () => {
  const result = await validate([daily({ links: [{ label: 'Project', href: '#/projects?entry=presight' }] })]);
  assert.equal(result.status, 0, result.stderr);
});
