'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { CheckCircle, WarningCircle } from '@phosphor-icons/react/dist/ssr';
import { DELIVERY_TOPICS, QUOTE_LIMITS, checkQuote, quoteMailto, type QuoteErrors, type QuoteField, type QuoteRequest, type QuoteTopic } from '@/lib/quote';
import { STORE } from '@/lib/store';
import { ProductPicker } from './ProductPicker';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent'; name: string; email: string } | { kind: 'failed'; request: QuoteRequest };

const ORDER: QuoteField[] = ['topics', 'details', 'area', 'name', 'email', 'phone'];

/**
 * The quote request, in two parts: what it is for, then how to reply. Checked here and again on the server with the
 * same rules. If the website cannot send it, the visitor gets the same message ready to send from their own email app.
 */
export function QuoteForm({ initial }: { initial: QuoteTopic[] }) {
  const id = useId();
  const [topics, setTopics] = useState<QuoteTopic[]>(initial);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const form = useRef<HTMLFormElement>(null);
  const sent = useRef<HTMLDivElement>(null);
  const delivery = topics.some((t) => DELIVERY_TOPICS.includes(t));

  useEffect(() => {
    if (status.kind === 'sent') sent.current?.focus();
  }, [status.kind]);

  const choose = (next: QuoteTopic[]) => {
    setTopics(next);
    if (errors.topics) setErrors((cur) => ({ ...cur, topics: undefined }));
  };

  const showErrors = (next: QuoteErrors) => {
    setErrors(next);
    const first = ORDER.find((k) => next[k]);
    if (first) requestAnimationFrame(() => form.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus());
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = (k: string) => String(data.get(k) ?? '');
    const checked = checkQuote({ topics, details: text('details'), area: delivery ? text('area') : '', name: text('name'), email: text('email'), phone: text('phone') });
    if (!checked.ok) return showErrors(checked.errors);

    setErrors({});
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...checked.value, website: text('website') }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: QuoteErrors };
      if (res.ok && json.ok) return setStatus({ kind: 'sent', name: checked.value.name, email: checked.value.email });
      if (res.status === 422 && json.errors) {
        setStatus({ kind: 'idle' });
        return showErrors(json.errors);
      }
      setStatus({ kind: 'failed', request: checked.value });
    } catch {
      setStatus({ kind: 'failed', request: checked.value });
    }
  }

  if (status.kind === 'sent') {
    return (
      <div ref={sent} className="quote__sent" role="status" tabIndex={-1}>
        <CheckCircle size={40} weight="light" aria-hidden="true" />
        <h2 className="h-title">Request sent.</h2>
        <p className="body">
          Thank you, {status.name}. Jontai Energy will reply to <strong>{status.email}</strong>.
        </p>
        <div className="actions">
          <a href="/" className="btn btn--primary">
            Back to the home page
          </a>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setTopics([]);
              setStatus({ kind: 'idle' });
            }}
          >
            Send another request
          </button>
        </div>
      </div>
    );
  }

  const sending = status.kind === 'sending';
  const describe = (k: QuoteField, hint?: boolean) => [hint ? `${id}-${k}-hint` : '', errors[k] ? `${id}-${k}-error` : ''].filter(Boolean).join(' ') || undefined;
  const error = (k: QuoteField) =>
    errors[k] ? (
      <p id={`${id}-${k}-error`} className="field__error">
        <WarningCircle size={16} weight="bold" aria-hidden="true" />
        {errors[k]}
      </p>
    ) : null;
  const input = (k: QuoteField) => ({
    id: `${id}-${k}`,
    name: k,
    className: 'field__input',
    'data-field': k,
    'aria-invalid': Boolean(errors[k]) || undefined,
  });

  return (
    <form ref={form} className="quote__form" onSubmit={submit} noValidate aria-busy={sending}>
      <section className="quote__part" aria-labelledby={`${id}-need`}>
        <h2 id={`${id}-need`} className="quote__part-title">
          Your request
        </h2>

        <div className="field">
          <span id={`${id}-topics-label`} className="field__label">
            Product
          </span>
          <ProductPicker labelId={`${id}-topics-label`} value={topics} onChange={choose} error={errors.topics} describedBy={describe('topics', true)} />
          <p id={`${id}-topics-hint`} className="field__hint">
            Choose one or more.
          </p>
          {error('topics')}
        </div>

        <div className="field">
          <label htmlFor={`${id}-details`} className="field__label">
            Details
          </label>
          <textarea
            {...input('details')}
            className="field__input field__input--area"
            rows={5}
            maxLength={QUOTE_LIMITS.details}
            placeholder="For example: two 12,000 BTU solar air conditioners, one for a bedroom and one for an office."
            aria-describedby={describe('details', true)}
          />
          <p id={`${id}-details-hint`} className="field__hint">
            Models, sizes, quantities, and where it will be used.
          </p>
          {error('details')}
        </div>

        {delivery && (
          <div className="field">
            <label htmlFor={`${id}-area`} className="field__label">
              Delivery area <span className="field__optional">optional</span>
            </label>
            <input {...input('area')} autoComplete="address-level2" maxLength={QUOTE_LIMITS.area} aria-describedby={describe('area', true)} />
            <p id={`${id}-area-hint`} className="field__hint">
              Large items such as furniture can be delivered. Where should it go?
            </p>
            {error('area')}
          </div>
        )}
      </section>

      <section className="quote__part" aria-labelledby={`${id}-you`}>
        <h2 id={`${id}-you`} className="quote__part-title">
          Your details
        </h2>
        <div className="field-row">
          <div className="field">
            <label htmlFor={`${id}-name`} className="field__label">
              Name
            </label>
            <input {...input('name')} autoComplete="name" required maxLength={QUOTE_LIMITS.name} aria-describedby={describe('name')} />
            {error('name')}
          </div>
          <div className="field">
            <label htmlFor={`${id}-email`} className="field__label">
              Email
            </label>
            <input {...input('email')} type="email" inputMode="email" autoComplete="email" required maxLength={QUOTE_LIMITS.email} aria-describedby={describe('email')} />
            {error('email')}
          </div>
        </div>
        <div className="field">
          <label htmlFor={`${id}-phone`} className="field__label">
            Phone <span className="field__optional">optional, if you would rather we call</span>
          </label>
          <input {...input('phone')} type="tel" autoComplete="tel" maxLength={QUOTE_LIMITS.phone} aria-describedby={describe('phone')} />
          {error('phone')}
        </div>
      </section>

      {/* Left empty by people; bots fill it in. */}
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status.kind === 'failed' && (
        <div className="quote__failed" role="alert">
          <p>
            <strong>The website could not send this right now.</strong> Your message is ready to send from your own email app instead, or call{' '}
            <a href={`tel:${STORE.phone.replace(/\s/g, '')}`}>{STORE.phone}</a>.
          </p>
          <a href={quoteMailto(status.request)} className="btn btn--ghost btn--sm">
            Open in your email app
          </a>
        </div>
      )}

      <div className="quote__send">
        <button type="submit" className="btn btn--primary" disabled={sending}>
          {sending ? 'Sending' : 'Send request'}
        </button>
        <p className="note">Sent by email to Jontai Energy. Your details are only used to reply.</p>
      </div>
    </form>
  );
}
