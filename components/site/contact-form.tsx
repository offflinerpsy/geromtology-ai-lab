'use client';
import { useEffect, useState } from 'react';
import { enquiryTypes, type EnquiryType } from '@/lib/contact';
const labels = { research: 'Research collaboration', pilot: 'Pilot enquiry', investment: 'Investment enquiry', general: 'General enquiry' };
export default function ContactForm() {
  const [type, setType] = useState<EnquiryType>('general');
  const [pending, setPending] = useState(false); const [error, setError] = useState(''); const [reference, setReference] = useState('');
  useEffect(() => { const value = new URLSearchParams(window.location.search).get('type'); if (enquiryTypes.includes(value as EnquiryType)) setType(value as EnquiryType); }, []);
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
        <label htmlFor="contact-type">Enquiry type<select id="contact-type" name="type" value={type} onChange={event => setType(event.target.value as EnquiryType)}>{enquiryTypes.map(value => <option value={value} key={value}>{labels[value]}</option>)}</select></label>
        <div className="contact-form-row"><label htmlFor="contact-name">Name<input id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={120} /></label><label htmlFor="contact-organization">Organisation <span>(optional)</span><input id="contact-organization" name="organization" autoComplete="organization" maxLength={160} /></label></div>
        <label htmlFor="contact-email">Reply email<input id="contact-email" type="email" name="email" autoComplete="email" required maxLength={254} /></label>
        <label htmlFor="contact-message">Your message<textarea id="contact-message" name="message" required minLength={20} maxLength={5000} rows={6} /></label>
        <div hidden aria-hidden="true"><label htmlFor="contact-website">Website<input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <p className="contact-form-privacy">We store these details to review and respond to your enquiry. Read our <a href="/privacy">privacy notice</a>.</p>
        <button className="btn btn-dark" type="submit">{pending ? 'Saving enquiry…' : 'Submit enquiry'}<span aria-hidden="true">↗</span></button>
      </fieldset>
      <div aria-live="polite" role={error ? 'alert' : 'status'}>{error || (pending ? 'Saving your enquiry…' : '')}</div>
    </>}
  </form>;
}
