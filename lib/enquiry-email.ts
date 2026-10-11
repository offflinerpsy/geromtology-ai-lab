import type { Enquiry } from './contact';
import { SITE_ORIGIN } from './seo.ts';

const labels = { research: 'Research collaboration', pilot: 'Pilot enquiry', investment: 'Investment enquiry', general: 'General enquiry' };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);

export function enquiryEmail(data: Enquiry, reference: string, owner: string) {
  const details = [
    ['Reference', reference], ['Type', labels[data.type]], ['Name', data.name],
    ['Organisation', data.organization || 'Not supplied'], ['Reply email', data.email],
  ];
  const inbox = `${SITE_ORIGIN}/manage/enquiries`;
  return {
    from: { email: 'notifications@gerontology.app', name: 'ProAge Atlas' },
    to: owner,
    replyTo: data.email,
    subject: `ProAge Atlas — ${labels[data.type]}`,
    text: `${details.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${data.message}\n\nPrivate inbox: ${inbox}`,
    html: `<h1>New ProAge Atlas enquiry</h1><dl>${details.map(([label, value]) => `<dt>${label}</dt><dd>${escapeHtml(value)}</dd>`).join('')}</dl><p style="white-space:pre-wrap">${escapeHtml(data.message)}</p><p><a href="${inbox}">Open the private inbox</a></p>`,
  } satisfies Parameters<SendEmail['send']>[0];
}

// The durable enquiry is saved first. Delivery failures must never ask the
// visitor to resubmit a message that has already been accepted.
export async function notifyEnquiry(email: SendEmail | undefined, owner: string | undefined, data: Enquiry, reference: string) {
  if (!email || !owner?.trim()) return 'unconfigured' as const;
  try {
    const result = await email.send(enquiryEmail(data, reference, owner.trim()));
    console.info('Enquiry notification accepted', { reference, messageId: result.messageId });
    return 'sent' as const;
  } catch {
    console.error('Enquiry notification failed; retained in private inbox', { reference });
    return 'failed' as const;
  }
}
