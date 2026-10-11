import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readContactBody, validateEnquiry, validContactOrigin } from '../lib/contact.ts';
const sample = { name: 'Ada Researcher', organization: 'Research lab', email: 'ada@example.org', message: 'I would like to discuss a research collaboration.', type: 'research', website: '' };
test('contact preserves a valid enquiry and trims fields', () => {
  assert.equal(validateEnquiry({ ...sample, name: ' Ada Researcher ' }).name, 'Ada Researcher');
  assert.equal(validateEnquiry({ ...sample, organization: '' }).organization, '');
});
test('contact rejects missing fields, bots, invalid types, control characters and invalid email', () => {
  for (const data of [null, [], { ...sample, website: 'bot' }, { ...sample, email: 'bad@address' }, { ...sample, email: 'a\r\n@example.org' }, { ...sample, message: 'short' }, { ...sample, name: 'A\u0000B' }, { ...sample, type: 'medical' }, { ...sample, message: 'x'.repeat(5001) }, { ...sample, name: undefined }]) assert.throws(() => validateEnquiry(data));
});
test('contact requires exact same origin, rejecting absent and cross-site origins', () => {
  const req = headers => new Request('https://example.org/api/contact', { headers });
  assert.equal(validContactOrigin(req({ origin: 'https://example.org' })), true);
  for (const headers of [{}, { origin: 'https://evil.example' }, { origin: 'https://example.org', 'sec-fetch-site': 'cross-site' }, { origin: 'http://example.org' }]) assert.equal(validContactOrigin(req(headers)), false);
});
test('contact body validates JSON and rejects unsupported format and oversized streamed content', async () => {
  const req = (body, contentType = 'application/json') => new Request('https://example.org/api/contact', { method: 'POST', headers: { 'Content-Type': contentType }, body });
  assert.deepEqual(await readContactBody(req(JSON.stringify(sample))), sample);
  await assert.rejects(readContactBody(req('bad json')));
  await assert.rejects(readContactBody(req(JSON.stringify(sample), 'text/plain')));
  await assert.rejects(readContactBody(req(JSON.stringify({ message: 'я'.repeat(15000) }))));
});
