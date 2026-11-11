import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

function render(route) {
  const result = spawnSync(process.execPath, ['tests/render-site.mjs', route], { encoding: 'utf8', env: { ...process.env, NODE_ENV: 'development' } });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

const roles = [
  ['servicenow-uae', 'I work with aviation and wealth management customers'],
  ['servicenow-ireland', 'I worked with healthcare, retail and education customers in Ireland.'],
  ['servicenow-itom', 'I was the first EMEA Digital Specialist Solution Consultant'],
  ['salesforce', 'I led solution engineering for small and medium businesses in professional services across the UK and Ireland.'],
];
const highlights = [
  ['enterprise-front-door', 'servicenow-uae', 'I proposed one place for people in five separate business units to access services.'],
  ['aviation', 'servicenow-uae', 'I’m working on AI and automation ideas for an airport and an international airline.'],
  ['executive-briefings', 'servicenow-uae', 'I run Executive Briefing Centre sessions with customers'],
  ['quip', 'salesforce', 'I ran the Quip Black Belt programme and built a platform'],
];

function assertRoleIndex(html, selectedRole) {
  for (const [id] of roles) assert.ok(html.includes(`href="/experience?entry=${id}"`), `Keep ${id} reachable`);
  assert.ok(new RegExp(`<a(?=[^>]*href="/experience\\?entry=${selectedRole}")(?=[^>]*aria-current="true")[^>]*>`).test(html), `Mark ${selectedRole} as the selected role`);
}

test('Experience keeps the home portrait at the start of the site header', () => {
  const html = render('/experience');
  assert.match(html, /<header class="site-header"><a[^>]*aria-label="Sam Green home"[^>]*><img[^>]*src="\/images\/sam-green-portrait\.jpg"[^>]*\/><\/a><nav[^>]*aria-label="Main navigation"/);
});

test('Experience defaults to the current role and keeps the CV and credentials directly reachable', () => {
  const html = render('/experience');
  assert.equal((html.match(/<article\b/g) ?? []).length, 1);
  assert.ok(html.includes('<article id="servicenow-uae"'));
  assertRoleIndex(html, 'servicenow-uae');
  assert.match(html, /href="\/cv\/Sam-Green-Solution-Architecture-CV\.pdf"[^>]*download/);
  assert.match(html, /href="\/cv\?section=qualifications"/);
  assert.match(html, /href="\/cv"/);
  assert.doesNotMatch(html, /href="\/search(?:[?\/"])/);
  for (const [id, parent] of highlights) {
    if (parent === 'servicenow-uae') assert.ok(html.includes(`href="/experience?entry=${id}"`));
  }
  for (const [, sentence] of roles.slice(1)) assert.ok(!html.includes(sentence), 'Other role descriptions stay behind their links');
  for (const [, , sentence] of highlights) assert.ok(!html.includes(sentence), 'Highlight paragraphs are selected individually');
});

for (const [id, sentence] of roles) {
  test(`the ${id} URL shows that role without stacking every role description`, () => {
    const html = render(`/experience?entry=${id}`);
    assert.equal((html.match(/<article\b/g) ?? []).length, 1);
    assert.ok(html.includes(`<article id="${id}"`));
    assertRoleIndex(html, id);
    for (const [roleId, roleSentence] of roles) assert.equal(html.includes(roleSentence), roleId === id, roleSentence);
    for (const [highlightId, parent] of highlights) {
      if (parent === id) assert.ok(html.includes(`href="/experience?entry=${highlightId}"`));
    }
    assert.ok(html.includes(sentence));
  });
}

for (const [id, parent, sentence] of highlights) {
  test(`the ${id} highlight URL selects its parent role and only its own description`, () => {
    const html = render(`/experience?entry=${id}`);
    assert.equal((html.match(/<article\b/g) ?? []).length, 1);
    assert.ok(html.includes(`<article id="${id}"`));
    assertRoleIndex(html, parent);
    assert.ok(new RegExp(`<a(?=[^>]*href="/experience\\?entry=${id}")(?=[^>]*aria-current="page")[^>]*>`).test(html), `Mark ${id} as the selected highlight`);
    for (const [highlightId, , highlightSentence] of highlights) assert.equal(html.includes(highlightSentence), highlightId === id, highlightSentence);
    for (const [, roleSentence] of roles) assert.ok(!html.includes(roleSentence), 'A highlight replaces the role description');
    assert.ok(html.includes(sentence));
  });
}

test('an unknown Experience entry falls back to the current role', () => {
  const html = render('/experience?entry=missing-entry');
  assert.ok(html.includes('<article id="servicenow-uae"'));
  assertRoleIndex(html, 'servicenow-uae');
});
