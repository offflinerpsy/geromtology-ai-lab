import { env } from 'cloudflare:workers';
import { unstable_noStore as noStore } from 'next/cache';
import { notFound } from 'next/navigation';
import { getResearchUser, researchSignInPath } from '@/app/research-auth';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Private enquiry inbox', robots: { index: false, follow: false } };
type Row = { id: string; name: string; organization: string; email: string; message: string; type: string; created_at: number };
export default async function EnquiriesPage() {
  noStore();
  const owner = (env as unknown as Record<string, string | undefined>).CONTACT_INBOX_OWNER_EMAIL?.trim().toLowerCase();
  if (!owner) notFound();
  const user = await getResearchUser();
  if (!user) return <main id="main" className="private-inbox container"><h1>Private enquiry inbox</h1><p>Sign in with the site owner’s verified email account.</p><a href={researchSignInPath('/manage/enquiries')} target="_top">Sign in</a></main>;
  if (user.email.trim().toLowerCase() !== owner) notFound();
  if (!env.DB) return <main id="main" className="private-inbox container"><h1>Enquiry inbox unavailable</h1><p>The database connection is not ready.</p></main>;
  const { results } = await env.DB.prepare('SELECT id, name, organization, email, message, type, created_at FROM contact_enquiries ORDER BY created_at DESC LIMIT 100').all<Row>();
  return <main id="main" className="private-inbox container"><p className="eyebrow">Owner access</p><h1>Enquiry inbox</h1><p>The 100 most recent submissions. New submissions are saved here; email notifications are sent separately when available.</p>{!results.length && <p>No enquiries yet.</p>}{results.map(row => <article key={row.id} style={{ borderTop: '1px solid currentColor', paddingBlock: '1.5rem' }}><p>{row.type} · <time dateTime={new Date(row.created_at).toISOString()}>{new Date(row.created_at).toISOString()}</time></p><h2>{row.name}</h2><p>{row.organization}</p><p>Reply address: {row.email}</p><p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{row.message}</p><small>Reference: {row.id}</small></article>)}</main>;
}
