import type { CSSProperties } from 'react';
import { Contours } from '@/components/ui/Contours';
import { NUMBERS_HILLS } from '@/lib/contours';
import { HOME_COPY } from '@/lib/products';

/**
 * Jontai at a glance: big narrow numbers on contour lines, no boxes. Each number is a strip of digits that rolls up to
 * it like an odometer; the strip rests on the number itself, so without motion it simply shows it.
 */
export function Numbers() {
  const { numbers } = HOME_COPY;
  return (
    <section className="numbers" aria-labelledby="numbers-title">
      <Contours hills={NUMBERS_HILLS} />
      <p id="numbers-title" className="label" data-reveal>
        {numbers.label}
      </p>
      <ul className="stats">
        {numbers.stats.map((s) => (
          <li key={s.label}>
            <span className="stat__n" data-odometer={s.value} aria-hidden="true">
              <span className="stat__strip" style={{ '--to': `${(-100 * s.value) / (s.value + 1)}%` } as CSSProperties}>
                {Array.from({ length: s.value + 1 }, (_, d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
            <span className="stat__l label" data-reveal>
              <span className="visually-hidden">{s.value} </span>
              {s.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
