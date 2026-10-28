import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { OpenStatus } from '@/components/home/OpenStatus';
import { Contours } from '@/components/ui/Contours';
import { FitText } from '@/components/ui/FitText';
import { DIRECTIONS_URL, whatsappLink } from '@/lib/contact';
import { VISIT_HILLS } from '@/lib/contours';
import { QUOTE_ACTION } from '@/lib/quote';
import { SERVICE_LINE, STORE } from '@/lib/store';

const FAQ = [
  {
    q: 'Who installs what I buy?',
    a: 'A licensed electrician for inverters and panels, and an HVAC technician for solar air conditioners, as the manufacturers require. Jontai Energy sells and delivers; it does not install.',
  },
  { q: 'What do you deliver?', a: 'Large items, such as furniture from the second floor and large generators. Ask about delivery when you buy.' },
  { q: 'Can I see products before I buy?', a: 'Yes. Everything is on the floor at Cumana 73, with furniture one flight up.' },
  { q: 'Are prices online?', a: 'No. Request a quote and the store replies by email with current prices and what is in stock, or ask in store.' },
];

/**
 * The store, said big: CUMANA 73 across the width on forest with contour lines, then hours with the live open line,
 * how to reach us and the service line on glass panels, the questions people ask, and the ways to come by or get in
 * touch.
 */
export function Visit() {
  return (
    <section id="visit" className="visit" data-tone="dark" data-expand aria-labelledby="visit-title">
      <Contours hills={VISIT_HILLS} />
      <h2 id="visit-title" className="label" data-reveal>
        Visit the store
      </h2>
      <FitText text={STORE.street} chars label={`${STORE.street}, ${STORE.city}, ${STORE.country}`} className="visit__street" />
      <p className="visit__city" data-reveal>
        {STORE.city}, {STORE.country}
      </p>

      <div className="visit__grid">
        <div className="visit__panel glass glass--dark">
          <span className="label" data-reveal>
            Opening hours
          </span>
          <dl className="hours" data-reveal>
            {STORE.hours.map((h) => (
              <div key={h.days}>
                <dt>{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
          <OpenStatus data-reveal />
        </div>
        <div className="contact visit__panel glass glass--dark">
          <span className="label" data-reveal>
            Talk to us
          </span>
          <div data-reveal>
            <a href={`tel:${STORE.phone.replace(/\s/g, '')}`}>{STORE.phone}</a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href={`mailto:${STORE.email}`}>{STORE.email}</a>
          </div>
        </div>
        <div className="visit__panel glass glass--dark">
          <span className="label" data-reveal>
            Good to know
          </span>
          <p className="fine" data-reveal>
            {SERVICE_LINE}
          </p>
        </div>
      </div>

      <section id="faq" className="faq" aria-labelledby="faq-title">
        <h3 id="faq-title" className="label" data-reveal>
          Questions
        </h3>
        {FAQ.map((f) => (
          <details key={f.q} data-reveal>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      <div className="actions" data-reveal>
        <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
          Get directions <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </a>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
          WhatsApp us
        </a>
        <a href="/quote" className="btn btn--ghost">
          {QUOTE_ACTION}
        </a>
      </div>
    </section>
  );
}
