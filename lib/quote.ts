import { STORE } from './store.ts';

// Quote requests: what they can be for, how they are checked (the same rules on the page and on the server), and the
// email the store receives. Prices are never shown on the site; a quote is how a visitor asks for one.

export const QUOTE_ACTION = 'Request a quote';

/** What a quote can be for, in the order the form lists them. */
export const QUOTE_TOPICS = [
  { id: 'inverter', label: 'Hybrid inverter' },
  { id: 'solar-panels', label: 'Solar panels' },
  { id: 'solar-ac', label: 'Solar air conditioner' },
  { id: 'power-station', label: 'Portable power station' },
  { id: 'generator', label: 'Generator' },
  { id: 'led', label: 'LED lighting' },
  { id: 'cameras', label: 'Solar security camera' },
  { id: 'furniture', label: 'Furniture and delivery' },
] as const;

export type QuoteTopic = (typeof QUOTE_TOPICS)[number]['id'];

/** Large items, where the form also asks where they should go. */
export const DELIVERY_TOPICS: readonly QuoteTopic[] = ['furniture', 'generator'];

export const QUOTE_LIMITS = { name: 100, email: 200, phone: 40, area: 120, details: 2000 } as const;

export interface QuoteRequest {
  topics: QuoteTopic[];
  details: string;
  area: string;
  name: string;
  email: string;
  phone: string;
}

export type QuoteField = keyof QuoteRequest;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

const isTopic = (v: unknown): v is QuoteTopic => QUOTE_TOPICS.some((t) => t.id === v);
const labelOf = (id: QuoteTopic) => QUOTE_TOPICS.find((t) => t.id === id)!.label;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Topic ids from a ?for= value: one id or several, comma separated; anything unknown is dropped. */
export function topicsFrom(value: string | string[] | undefined): QuoteTopic[] {
  const parts = (Array.isArray(value) ? value : [value ?? '']).flatMap((v) => v.split(','));
  return [...new Set(parts.map((p) => p.trim()).filter(isTopic))];
}

/** A link to the quote page with a topic already chosen. */
export function quoteHref(topic?: QuoteTopic) {
  return topic ? `/quote?for=${topic}` : '/quote';
}

/** Checks a submitted request. Strings are trimmed; single-line fields lose their line breaks. */
export function checkQuote(input: unknown): { ok: true; value: QuoteRequest } | { ok: false; errors: QuoteErrors } {
  if (!input || typeof input !== 'object') return { ok: false, errors: { name: 'Add your name so we know who to reply to.' } };
  const raw = input as Record<string, unknown>;
  const line = (k: QuoteField) => (typeof raw[k] === 'string' ? (raw[k] as string).replace(/\s+/g, ' ').trim() : '');
  const value: QuoteRequest = {
    topics: Array.isArray(raw.topics) ? [...new Set(raw.topics.filter(isTopic))] : [],
    details: typeof raw.details === 'string' ? raw.details.trim() : '',
    area: line('area'),
    name: line('name'),
    email: line('email'),
    phone: line('phone'),
  };

  const errors: QuoteErrors = {};
  if (Array.isArray(raw.topics) && raw.topics.some((t) => !isTopic(t))) errors.topics = 'Choose from the list.';
  else if (!value.topics.length && !value.details) errors.topics = 'Choose what the quote is for, or describe it below.';
  if (!value.name) errors.name = 'Add your name so we know who to reply to.';
  if (!value.email) errors.email = 'Add an email address for the reply.';
  else if (!EMAIL.test(value.email)) errors.email = 'Check the email address. It should look like name@example.com.';
  for (const k of Object.keys(QUOTE_LIMITS) as (keyof typeof QUOTE_LIMITS)[]) {
    if (value[k].length > QUOTE_LIMITS[k]) errors[k] = `Keep this under ${QUOTE_LIMITS[k].toLocaleString('en-US')} characters.`;
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

function subjectOf(q: QuoteRequest) {
  return q.topics.length ? `Quote request: ${q.topics.map(labelOf).join(', ')} (${q.name})` : `Quote request (${q.name})`;
}

function linesOf(q: QuoteRequest) {
  return [
    q.topics.length ? `For: ${q.topics.map(labelOf).join(', ')}` : '',
    q.area ? `Delivery area: ${q.area}` : '',
    q.details ? `\n${q.details}\n` : '',
    `Name: ${q.name}`,
    `Email: ${q.email}`,
    q.phone ? `Phone: ${q.phone}` : '',
  ].filter(Boolean);
}

/** The email the store receives from the website. Replying goes straight to the visitor. */
export function quoteEmail(q: QuoteRequest) {
  const text = ['A quote request from the Jontai Energy website.', '', ...linesOf(q), '', `Reply to this email to answer ${q.name} directly.`].join('\n');
  return { subject: subjectOf(q), text };
}

/** The same request as a message the visitor sends from their own email app, for when the website cannot send it. */
export function quoteMailto(q: QuoteRequest, to: string = STORE.email) {
  const body = ['Hello Jontai Energy, I would like a quote.', '', ...linesOf(q)].join('\n');
  return `mailto:${to}?subject=${encodeURIComponent(subjectOf(q))}&body=${encodeURIComponent(body)}`;
}
