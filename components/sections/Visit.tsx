'use client';

import { useEffect, useState } from 'react';
import { DIRECTIONS_URL } from '@/lib/contact';
import { QUOTE_ACTION } from '@/lib/quote';
import { SERVICE_LINE, STORE, arubaNow, hoursOn, openState } from '@/lib/store';

const FAQ = [
  {
    q: 'Who installs what I buy?',
    a: 'A licensed electrician for inverters and panels, and an HVAC technician for solar air conditioners, as the manufacturers require. Jontai Energy sells and delivers; it does not install.',
  },
  { q: 'What do you deliver?', a: 'Large items, such as furniture from the second floor and large generators. Ask about delivery when you buy.' },
  { q: 'Can I see products before I buy?', a: 'Yes. Everything is on the floor at Cumana 73, with furniture one flight up.' },
  { q: 'Are prices online?', a: 'No. Request a quote and the store replies by email with current prices and what is in stock, or ask in store.' },
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** The open span of the day on a small sun arc (06:00 left, 20:00 right). Decorative; the line beside it says it. */
function TodayArc({ from, to }: { from: number; to: number }) {
  const START = 6;
  const END = 20;
  const point = (h: number) => {
    const a = Math.PI * (1 - (h - START) / (END - START));
    return `${(30 + 26 * Math.cos(a)).toFixed(1)} ${(30 - 26 * Math.sin(a)).toFixed(1)}`;
  };
  return (
    <svg className="today__arc" viewBox="0 0 60 32" aria-hidden="true">
      <path className="today__day" d={`M ${point(START)} A 26 26 0 0 1 ${point(END)}`} />
      <path className="today__open" d={`M ${point(from)} A 26 26 0 0 1 ${point(to)}`} />
    </svg>
  );
}

export function Visit() {
  // Marked after load, in Aruba time, so the server and the visitor's clock never disagree.
  const [now, setNow] = useState<{ day: number; hour: number } | null>(null);
  useEffect(() => setNow(arubaNow()), []);

  return (
    <section id="visit" className="visit" aria-labelledby="visit-title">
      <div className="container visit__grid">
        <div className="visit__place">
          <h2 id="visit-title" className="h-section" data-reveal>
            Visit the store.
          </h2>
          <address className="visit__address" data-reveal style={{ ['--i' as string]: 1 }}>
            {STORE.street}, {STORE.city}, {STORE.country}
          </address>
          <div className="actions">
            <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
              Get directions
            </a>
            <a href="/quote" className="btn btn--ghost">
              {QUOTE_ACTION}
            </a>
          </div>
          {now && (
            <p className="today">
              <TodayArc from={hoursOn(now.day).from} to={hoursOn(now.day).to} />
              <span>
                <strong>{openState(now.day, now.hour).line}</strong>
                <span>
                  {DAYS[now.day]}, {hoursOn(now.day).time}
                </span>
              </span>
            </p>
          )}
        </div>

        <dl className="info">
          <div className="info__row">
            <dt>Opening hours</dt>
            <dd>
              {STORE.hours.map((h) => (
                <span key={h.days} className="info__hours">
                  <span>{h.days}</span>
                  <span>{h.time}</span>
                </span>
              ))}
            </dd>
          </div>
          <div className="info__row">
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${STORE.phone.replace(/\s/g, '')}`}>{STORE.phone}</a>
            </dd>
          </div>
          <div className="info__row">
            <dt>WhatsApp</dt>
            <dd>
              <a href={STORE.whatsapp} target="_blank" rel="noopener noreferrer">
                Message us
              </a>
            </dd>
          </div>
          <div className="info__row">
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${STORE.email}`}>{STORE.email}</a>
            </dd>
          </div>
          <div className="info__row">
            <dt>Social</dt>
            <dd>
              <a href={STORE.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a href={STORE.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <div className="container visit__more">
        <p className="service">{SERVICE_LINE}</p>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
