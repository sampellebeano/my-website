import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../src/data/projects.ts';
import { searchPublicContent } from '../src/lib/public-search.ts';

const content = { activity: [], books: [], versions: [] };
const career = [{ id: 'aviation', section: 'work', title: 'Autonomous workforce solutions for aviation', context: 'Career work', paragraphs: ['A ServiceNow career initiative.'] }];

test('personal projects include the user-named builds and exclude employer initiatives', () => {
  assert.deepEqual(projects.map(project => project.id), ['kapture', 'bassh']);
  assert.ok(!projects.some(project => ['presight', 'aviation', 'executive-briefings', 'quip'].includes(project.id)));
});
test('personal project search links to personal project detail', () => {
  const results = searchPublicContent('Kapture', '', career, content, projects);
  assert.equal(results.length, 1);
  assert.equal(results[0].source, 'project');
  assert.equal(results[0].href, '/projects?entry=kapture');
});
test('personal projects do not enter full CV or filtered CV browsing', () => {
  assert.deepEqual(searchPublicContent('', '', career, content, projects).map(result => result.id), ['aviation']);
  assert.deepEqual(searchPublicContent('Kapture', 'work', career, content, projects), []);
});
test('career highlight search opens Experience rather than Projects', () => {
  const results = searchPublicContent('aviation', '', career, content, projects);
  assert.equal(results[0].source, 'cv');
  assert.equal(results[0].href, '/experience?entry=aviation');
});
