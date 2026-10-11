export const enquiryTypes = ['research', 'pilot', 'investment', 'general'] as const;
export type EnquiryType = typeof enquiryTypes[number];
export type Enquiry = { name: string; organization: string; email: string; message: string; type: EnquiryType };
export function validateEnquiry(value: unknown): Enquiry {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Please complete the enquiry form.');
  const data = value as Record<string, unknown>;
  if (data.website !== undefined && data.website !== '') throw new Error('The enquiry could not be accepted.');
  const field = (key: string, min: number, max: number) => {
    if (typeof data[key] !== 'string') throw new Error(`Please check your ${key}.`);
    const text = data[key].trim();
    if (text.length < min || text.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) throw new Error(`Please check your ${key}.`);
    return text;
  };
  const name = field('name', 2, 120), organization = field('organization', 0, 160), email = field('email', 3, 254), message = field('message', 20, 5000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid reply email address.');
  if (!enquiryTypes.includes(data.type as EnquiryType)) throw new Error('Choose an enquiry type.');
  return { name, organization, email, message, type: data.type as EnquiryType };
}
export function validContactOrigin(request: Request): boolean {
  return request.headers.get('origin') === new URL(request.url).origin && request.headers.get('sec-fetch-site') !== 'cross-site';
}
export async function readContactBody(request: Request): Promise<unknown> {
  const limit = 24000;
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') throw new Error('Use the enquiry form to submit your message.');
  if (Number(request.headers.get('content-length')) > limit || !request.body) throw new Error('The enquiry is too large or empty.');
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  try { for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > limit) { await reader.cancel(); throw new Error('The enquiry is too large.'); } chunks.push(value); } }
  finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); } catch { throw new Error('The enquiry could not be read.'); }
}
