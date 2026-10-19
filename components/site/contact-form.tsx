'use client';
import { useState, useSyncExternalStore } from 'react';
import { enquiryTypes, type EnquiryType } from '@/lib/contact';
import { ResearchSelect } from '@/components/ui/research-controls';
import Link from './research-link';
const readEnquiryType = () => new URLSearchParams(window.location.search).get('type');
const subscribeHistory = (changed: () => void) => { window.addEventListener('popstate', changed); return () => window.removeEventListener('popstate', changed); };
const labels = { research: 'Research collaboration', pilot: 'Pilot enquiry', investment: 'Investment enquiry', general: 'General enquiry' };
export default function ContactForm() {
  const [selectedType, setType] = useState<EnquiryType | null>(null);
  const queryType = useSyncExternalStore(subscribeHistory, readEnquiryType, () => null);
  const type = selectedType ?? (enquiryTypes.includes(queryType as EnquiryType) ? queryType as EnquiryType : 'general');
  const [pending, setPending] = useState(false); const [error, setError] = useState(''); const [reference, setReference] = useState('');
  return <form className="contact-form" method="post" action="/api/contact" onSubmit={async event => {
    event.preventDefault(); if (pending) return; setError(''); setPending(true);
    const form = new FormData(event.currentTarget);
    try { const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)), signal: AbortSignal.timeout(20000) }); const result = await response.json() as { reference?: string; error?: string }; if (!response.ok || !result.reference) throw new Error(result.error || 'Your enquiry could not be saved.'); setReference(result.reference); }
    catch (error) { setError(error instanceof Error && error.name !== 'TimeoutError' ? error.message : 'No confirmation was received. Please try again later.'); }
    finally { setPending(false); }
  }}>
    <h2>Start a conversation.</h2>
    <p>Share a research question, a pilot idea or a partnership proposal. Please do not include medical records or other sensitive health information.</p>
    {reference ? <div className="contact-confirmation" role="status"><h3>Enquiry saved for review.</h3><p>Thank you. Your message has been received for review. Keep the reference below for your records.</p><p>Reference: <code>{reference}</code></p><button type="button" onClick={() => setReference('')}>Send another enquiry</button></div> : <>
      <fieldset disabled={pending}>
        <legend className="sr-only">Your enquiry</legend>
        <div className="contact-type-control"><label htmlFor="contact-type">Enquiry type</label><ResearchSelect id="contact-type" name="type" label="Enquiry type" value={type} onValueChange={value=>setType(value as EnquiryType)} disabled={pending} options={enquiryTypes.map(value=>({value,label:labels[value]}))}/></div>
        <div className="contact-form-row"><label htmlFor="contact-name">Name<input id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={120} /></label><label htmlFor="contact-organization">Organisation <span>(optional)</span><input id="contact-organization" name="organization" autoComplete="organization" maxLength={160} /></label></div>
        <label htmlFor="contact-email">Reply email<input id="contact-email" type="email" name="email" autoComplete="email" required maxLength={254} /></label>
        <label htmlFor="contact-message">Your message<textarea id="contact-message" name="message" required minLength={20} maxLength={5000} rows={6} /></label>
        <div hidden aria-hidden="true"><label htmlFor="contact-website">Website<input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <p className="contact-form-privacy">We store these details to review and respond to your enquiry. Read our <Link href="/privacy">privacy notice</Link>.</p>
        <button className="btn btn-dark" type="submit">{pending ? 'Saving enquiry…' : 'Submit enquiry'}</button>
      </fieldset>
      <div aria-live="polite" role={error ? 'alert' : 'status'}>{error || (pending ? 'Saving your enquiry…' : '')}</div>
    </>}
  </form>;
}
