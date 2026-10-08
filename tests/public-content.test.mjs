import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePublicContent, sortActivity, formatPublicDate, activityWeek, groupActivity } from '../src/lib/public-content.ts';
import { daily, weekly, book, collection } from './fixtures.mjs';

test('empty collections are valid', () => assert.deepEqual(parsePublicContent(collection(), []), collection()));
test('unknown private fields are rejected without printing their value', () => {
  assert.throws(() => parsePublicContent(collection([daily({ privateNotes: 'DO-NOT-PUBLISH-TEST-VALUE' })]), []), error => !error.message.includes('DO-NOT-PUBLISH-TEST-VALUE'));
});
test('duplicate IDs across public records are rejected', () => assert.throws(() => parsePublicContent(collection([daily()], [book({ id: 'daily-2026-10-08' })]), [])));
test('invalid calendar dates are rejected', () => {
  for (const date of ['2026-02-30', '2026-13-01', '2026-00-08']) assert.throws(() => parsePublicContent(collection([daily({ activityDate: date })]), []));
});
test('timestamps require an explicit offset and a real calendar date', () => {
  for (const timestamp of ['2026-10-08T20:00:00', '2026-02-30T20:00:00Z']) assert.throws(() => parsePublicContent(collection([daily({ publishedAt: timestamp })]), []));
});
test('weekly intervals must run Monday through Sunday', () => {
  for (const interval of [{ startDate: '2026-10-06' }, { endDate: '2026-10-12' }]) assert.throws(() => parsePublicContent(collection([daily(), weekly(interval)]), []));
});
test('weekly references must name published daily notes in that week', () => {
  for (const refs of [[], ['missing'], ['weekly-2026-10-05'], ['daily-2026-10-08', 'daily-2026-10-08']]) assert.throws(() => parsePublicContent(collection([daily(), weekly({ dailyEntryIds: refs })]), []));
  assert.throws(() => parsePublicContent(collection([daily({ activityDate: '2026-10-12' }), weekly()]), []));
});
test('empty or overlong paragraph collections are rejected', () => {
  for (const body of [[], [' '], ['a', 'b', 'c', 'd', 'e']]) assert.throws(() => parsePublicContent(collection([daily({ body })]), []));
});
test('unsafe links and unknown routes are rejected', () => {
  for (const href of ['javascript:alert(1)', 'http://example.com', '#/missing', '#/updates?entry=missing', 'https://user:password@example.com']) {
    assert.throws(() => parsePublicContent(collection([daily({ links: [{ label: 'Read', href }] })]), []));
  }
});
test('public project and activity links resolve against their records', () => {
  const entry = daily({ links: [{ label: 'Project', href: '#/projects?entry=presight' }, { label: 'Note', href: '#/updates?entry=daily-2026-10-08' }] });
  assert.equal(parsePublicContent(collection([entry]), ['presight']).activity[0].links.length, 2);
});
test('career highlight links resolve in Experience', () => {
  const entry = daily({ links: [{ label: 'Career work', href: '#/experience?entry=aviation' }] });
  assert.equal(parsePublicContent(collection([entry]), ['kapture', 'bassh'], ['aviation']).activity.length, 1);
});
test('career IDs cannot be linked as personal projects', () => {
  const entry = daily({ links: [{ label: 'Career work', href: '#/projects?entry=aviation' }] });
  assert.throws(() => parsePublicContent(collection([entry]), ['kapture', 'bassh'], ['aviation']));
});
test('hash links must name the actual route rather than a normalised URL path', () => {
  const links = [{ label: 'Note', href: '#/books/../updates?entry=daily-2026-10-08' }];
  assert.throws(() => parsePublicContent(collection([daily({ links })]), []));
});
test('book dates and reading statuses are validated', () => {
  assert.throws(() => parsePublicContent(collection([], [book({ completedOn: '2026-02-30' })]), []));
  assert.throws(() => parsePublicContent(collection([], [book({ status: 'private' })]), []));
  assert.equal(parsePublicContent(collection([], [book()]), []).books[0].status, 'reading');
});
test('historical paths stay in their dated snapshot', () => {
  const version = { id: 'v1', label: 'Previous website', capturedOn: '2026-10-08', sourceRevision: '6390bafd', path: 'history/2026-10-08/index.html' };
  assert.equal(parsePublicContent(collection([], [], [version]), []).versions.length, 1);
  assert.throws(() => parsePublicContent(collection([], [], [{ ...version, path: '../private/index.html' }]), []));
});
test('publication ordering compares actual instants and has stable ties', () => {
  const entries = [daily({ id: 'b', publishedAt: '2026-10-08T21:00:00+04:00' }), daily({ id: 'a', publishedAt: '2026-10-08T17:00:00Z' }), daily({ id: 'c', publishedAt: '2026-10-08T18:00:00Z' })];
  assert.deepEqual(sortActivity(entries).map(entry => entry.id), ['c', 'a', 'b']);
  assert.deepEqual(entries.map(entry => entry.id), ['b', 'a', 'c']);
});
test('Dubai display dates cross UTC midnight correctly', () => {
  assert.equal(formatPublicDate('2026-10-08T21:30:00Z'), '9 Oct 2026');
  assert.equal(formatPublicDate('2026-10-08'), '8 Oct 2026');
});
test('Dubai weeks cross Sunday midnight and calendar years correctly', () => {
  assert.deepEqual(activityWeek('2026-10-11T21:30:00Z'), { startDate: '2026-10-12', endDate: '2026-10-18' });
  assert.deepEqual(activityWeek('2026-01-01'), { startDate: '2025-12-29', endDate: '2026-01-04' });
});
test('late-published daily notes stay in their activity week', () => {
  const groups = groupActivity([daily({ publishedAt: '2026-10-13T20:00:00+04:00' })]);
  assert.equal(groups[0].startDate, '2026-10-05');
});
test('revised recaps use the newest publication without hiding daily notes', () => {
  const groups = groupActivity([daily(), weekly(), weekly({ id: 'revised-week', publishedAt: '2026-10-12T20:00:00+04:00' }), daily({ id: 'next-week', activityDate: '2026-10-12', publishedAt: '2026-10-12T21:00:00+04:00' })]);
  assert.deepEqual(groups.map(group => group.startDate), ['2026-10-12', '2026-10-05']);
  assert.equal(groups[1].recap.id, 'revised-week');
  assert.deepEqual(groups.flatMap(group => group.daily.map(entry => entry.id)), ['next-week', 'daily-2026-10-08']);
});
