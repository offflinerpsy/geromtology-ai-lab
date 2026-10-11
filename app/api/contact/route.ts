import { env } from 'cloudflare:workers';
import { readContactBody, validateEnquiry, validContactOrigin } from '@/lib/contact';
import { notifyEnquiry } from '@/lib/enquiry-email';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store' };
export async function POST(request: Request) {
  if (!validContactOrigin(request)) return Response.json({ error: 'Submit your enquiry from this website.' }, { status: 403, headers });
  const db = env.DB;
  if (!db) return Response.json({ error: 'The enquiry inbox is temporarily unavailable. Please try again later.' }, { status: 503, headers });
  let data;
  try { data = validateEnquiry(await readContactBody(request)); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : 'Check the enquiry form.' }, { status: 400, headers }); }
  try {
    const now = Date.now(); const hour = Math.floor(now / 3600000);
    // Cloudflare supplies this header. Never accept a client-supplied forwarded IP or store raw IP addresses.
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${new URL(request.url).host}:${hour}:${ip}`));
    const key = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    await db.prepare('DELETE FROM contact_rate_limits WHERE expires_at < ?').bind(now).run();
    const quota = await db.prepare('INSERT INTO contact_rate_limits (key, count, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 WHERE count < 5 RETURNING count').bind(key, (hour + 2) * 3600000).first<{ count: number }>();
    if (!quota) return Response.json({ error: 'Too many enquiries. Please try again in an hour.' }, { status: 429, headers: { ...headers, 'Retry-After': '3600' } });
    const id = crypto.randomUUID();
    await db.prepare('INSERT INTO contact_enquiries (id, name, organization, email, message, type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, data.name, data.organization, data.email, data.message, data.type, now).run();
    await notifyEnquiry(env.EMAIL, env.CONTACT_INBOX_OWNER_EMAIL, data, id);
    return Response.json({ reference: id, message: 'Your enquiry has been saved for review. Keep this reference for your records.' }, { status: 201, headers });
  } catch { return Response.json({ error: 'Your enquiry could not be saved. Please try again later.' }, { status: 503, headers }); }
}
