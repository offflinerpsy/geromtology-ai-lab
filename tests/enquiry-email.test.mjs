import test from 'node:test';
import assert from 'node:assert/strict';
import { enquiryEmail, notifyEnquiry } from '../lib/enquiry-email.ts';

const sample = { name: 'Ada <Researcher>', organization: 'Lab & partners', email: 'ada@example.org', message: '<script>alert("hello")</script>\nResearch enquiry.', type: 'research' };
test('enquiry notification has a fixed sender and owner recipient, safe HTML and reply address', () => {
  const email = enquiryEmail(sample, 'test-reference', 'owner@example.org');
  assert.equal(email.to, 'owner@example.org');
  assert.equal(email.from.email, 'notifications@gerontology.app');
  assert.equal(email.replyTo, sample.email);
  assert.ok(email.text.includes(sample.message));
  assert.ok(email.html.includes('&lt;script&gt;'));
  assert.ok(email.html.includes('Lab &amp; partners'));
  assert.ok(!email.html.includes('<script>'));
  assert.ok(email.text.includes('https://gerontology.app/manage/enquiries'));
});
test('notification failures and missing configuration do not reject an accepted enquiry', async () => {
  assert.equal(await notifyEnquiry(undefined, 'owner@example.org', sample, 'test-reference'), 'unconfigured');
  const sender = { send: async () => { throw new Error('delivery failure'); } };
  assert.equal(await notifyEnquiry(sender, 'owner@example.org', sample, 'test-reference'), 'failed');
  let delivered;
  assert.equal(await notifyEnquiry({ send: async payload => { delivered = payload; return { messageId: 'test-message' }; } }, 'owner@example.org', sample, 'test-reference'), 'sent');
  assert.equal(delivered.to, 'owner@example.org');
});
