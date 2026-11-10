import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

function render(route) {
  const result = spawnSync(process.execPath, ['tests/render-site.mjs', route], { encoding: 'utf8', env: { ...process.env, NODE_ENV: 'development' } });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test('the direct courses and credentials view groups the individual qualifications into lists', () => {
  const html = render('/cv?section=qualifications');
  assert.ok(/<h1[^>]*>Courses &amp; credentials<\/h1>/.test(html));
  for (const [id, names] of [
    ['platform-certifications', ['ServiceNow Certified System Administrator', 'ITIL Foundation Certificate in IT Service Management', 'Sales Cloud Consultant', 'Service Cloud Consultant', 'Pardot Specialist', 'Advanced Administrator', 'Platform App Builder', 'Administrator']],
    ['ai-courses', ['AI-Driven Leadership: Strategies for the Future', 'Mastering Generative AI for Product Innovation', 'AI Essentials for Business']],
    ['business-courses', ['Certificate in Negotiation Mastery', 'Professional Service Firm Leader Program', 'Entrepreneurship: Venture Creation Programme', 'CxO Training']],
    ['sales-training', ['SPIN Selling', 'ValueSelling Certification', 'Storytelling Certified', 'Demo Certified']],
    ['education', ['Computer Science &amp; Business']],
  ]) {
    const group = html.match(new RegExp(`<ul[^>]*aria-labelledby="${id}">([\\s\\S]*?)</ul>`));
    assert.ok(group, `${id} remains a labeled list`);
    const rows = group[1].match(/<li>[\s\S]*?<\/li>/g) ?? [];
    assert.equal(rows.length, names.length);
    names.forEach((name, index) => assert.ok(rows[index].includes(`>${name}<`), name));
  }
  assert.ok(html.includes('University of Oxford'));
  assert.ok(html.includes('Distinction'));
  assert.ok(html.includes('II.1 Honours'));
  assert.doesNotMatch(html, /site-search|type="search"|Senior Solution Consultant, UAE/);
});

test('the full CV keeps the qualifications, work history, contact and PDF available', () => {
  const html = render('/cv');
  assert.ok(/<h1[^>]*>Full CV<\/h1>/.test(html));
  assert.ok(html.includes('ServiceNow | Senior Solution Consultant, UAE'));
  assert.ok(html.includes('AI Essentials for Business'));
  assert.ok(html.includes('href="mailto:sam.jgreen@icloud.com"'));
  assert.match(html, /href="\/cv\/Sam-Green-Solution-Architecture-CV\.pdf"[^>]*download/);
  assert.doesNotMatch(html, /site-search|type="search"/);
});
