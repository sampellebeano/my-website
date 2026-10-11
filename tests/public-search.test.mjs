import test from 'node:test';
import assert from 'node:assert/strict';
import { searchPublicContent } from '../src/lib/public-search.ts';
import { matchesQuery } from '../src/lib/text-search.ts';
import { daily, book, collection } from './fixtures.mjs';

const cv = [
  { id: 'project', section: 'work', title: 'Enterprise architecture', context: 'Proposal', paragraphs: ['A demonstrated solution.'], keywords: 'Presight' },
  { id: 'role', section: 'experience', title: 'Consultant', context: 'Ireland', paragraphs: ['Architecture and adoption.'] },
];
const content = collection([daily()], [book()]);

test('nonempty unfiltered queries search all three public sources', () => {
  assert.deepEqual(searchPublicContent('architecture', '', cv, content).map(result => result.source), ['cv', 'cv', 'activity', 'book']);
});
test('matching ignores case and accents and requires every word', () => {
  assert.ok(matchesQuery('École architecture in Dublin', 'éCOLE DUBLIN'));
  assert.ok(!matchesQuery('Architecture in Dublin', 'architecture UAE'));
});
test('CV keywords remain searchable', () => assert.equal(searchPublicContent('presight', '', cv, content)[0].id, 'project'));
test('results link to their actual published record', () => {
  const results = searchPublicContent('architecture', '', cv, content);
  assert.equal(results[0].href, '/experience?entry=project');
  assert.equal(results[2].href, '/updates?entry=daily-2026-10-08');
  assert.equal(results[3].href, '/books?entry=book-example');
  assert.equal(results[3].context, 'Example Author · Reading');
  assert.deepEqual(results[3].paragraphs, ['A test-only reading note.']);
});
test('empty and whitespace queries retain the full CV view', () => {
  for (const query of ['', '   ']) assert.deepEqual(searchPublicContent(query, '', cv, content).map(result => result.id), ['project', 'role']);
});
test('a recognised section searches only its CV records', () => {
  assert.deepEqual(searchPublicContent('architecture', 'work', cv, content).map(result => result.id), ['project']);
  assert.deepEqual(searchPublicContent('', 'experience', cv, content).map(result => result.id), ['role']);
});
test('unknown sections retain the legacy empty result', () => assert.deepEqual(searchPublicContent('architecture', 'missing', cv, content), []));
test('unmatched queries return no invented answer', () => assert.deepEqual(searchPublicContent('unfindableword', '', cv, content), []));
test('query text is encoded in CV section result links', () => assert.equal(searchPublicContent('architecture & adoption', '', [{ ...cv[1], section: 'about', paragraphs: ['Architecture & adoption.'] }], collection())[0].href, '/search?section=about&query=architecture%20%26%20adoption'));
