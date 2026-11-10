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
test('results identify whole sections without opening single-record views', () => {
  const results = searchPublicContent('architecture', '', cv, content);
  assert.equal(results[0].href, '/experience');
  assert.equal(results[2].href, '/updates');
  assert.equal(results[3].href, '/books');
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
test('site history searches edition labels, summaries and making notes with direct entry links', () => {
  const edition = { id: 'saved-2026-11-02', label: 'Personal website before the overhaul', capturedOn: '2026-11-02', summary: 'A growing app gallery.', notes: ['Preserved explicit playback in the phone.'], path: 'history/2026-11-02/index.html' };
  for (const query of ['overhaul', 'growing gallery', 'explicit playback']) {
    const results = searchPublicContent(query, '', [], collection([], [], [edition]));
    assert.deepEqual(results.map(result => result.source), ['version']);
    assert.equal(results[0].href, '/history?entry=saved-2026-11-02');
    assert.equal(results[0].context, 'Captured 2 Nov 2026');
    assert.deepEqual(results[0].paragraphs, [edition.summary, ...edition.notes]);
  }
});
test('site history search orders captures by date then ID and handles original metadata', () => {
  const editions = [{ id: 'old', label: 'Saved website', capturedOn: '2026-10-08' }, { id: 'new-z', label: 'Saved website', capturedOn: '2026-11-02' }, { id: 'new-a', label: 'Saved website', capturedOn: '2026-11-02' }];
  const results = searchPublicContent('saved website', '', [], collection([], [], editions));
  assert.deepEqual(results.map(result => result.id), ['new-a', 'new-z', 'old']);
  assert.deepEqual(results[2].paragraphs, []);
});
test('editions never enter empty-query or filtered CV browsing', () => {
  const editions = [{ id: 'saved', label: 'Architecture website', capturedOn: '2026-10-08', notes: ['Architecture decisions.'] }];
  for (const query of ['', '   ']) assert.deepEqual(searchPublicContent(query, '', cv, collection([], [], editions)).map(result => result.id), ['project', 'role']);
  assert.deepEqual(searchPublicContent('architecture', 'work', cv, collection([], [], editions)).map(result => result.id), ['project']);
});
