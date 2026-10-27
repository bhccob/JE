'use client';

import { useEffect, useState } from 'react';
import { Clock, EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react/dist/ssr';
import { DIRECTIONS_URL } from '@/lib/contact';
import { STORE, arubaNow, hoursOn, openState } from '@/lib/store';

/**
 * The store's details beside the quote form, one block each: hours (today marked, open or closed now in Aruba
 * time), the address and how to reach the store. Today is worked out after load, so the server never guesses.
 */
export function StoreCard() {
  const [now, setNow] = useState<{ day: number; hour: number } | null>(null);
  useEffect(() => setNow(arubaNow()), []);
  const today = now ? hoursOn(now.day) : null;
  const state = now ? openState(now.day, now.hour) : null;

  return (
    <aside className="store" aria-label="The store">
      <section className="store__block">
        <h2 className="store__title">
          <Clock size={18} aria-hidden="true" />
          Opening hours
        </h2>
        {state && (
          <p className="store__state" data-open={state.open}>
            {state.line}
          </p>
        )}
        <table className="store__hours">
          <tbody>
            {STORE.hours.map((h) => (
              <tr key={h.days} data-today={h === today || undefined}>
                <th scope="row">{h.days}</th>
                <td>{h.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="store__block">
        <h2 className="store__title">
          <MapPin size={18} aria-hidden="true" />
          Visit
        </h2>
        <p className="store__value">
          {STORE.street}, {STORE.city}, {STORE.country}
        </p>
        <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="store__link">
          Get directions
        </a>
      </section>

      <div className="store__pair">
        <section className="store__block">
          <h2 className="store__title">
            <Phone size={18} aria-hidden="true" />
            Call
          </h2>
          <a href={`tel:${STORE.phone.replace(/\s/g, '')}`} className="store__value store__link">
            {STORE.phone}
          </a>
        </section>
        <section className="store__block">
          <h2 className="store__title">
            <EnvelopeSimple size={18} aria-hidden="true" />
            Email
          </h2>
          <a href={`mailto:${STORE.email}`} className="store__value store__link">
            {STORE.email}
          </a>
        </section>
      </div>
    </aside>
  );
}
