'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { TEAM } from '@/lib/team';

/** Where each placeholder crops the plaster wall, so the five empty frames are not the same picture. */
const WALL = ['18% 28%', '64% 20%', '36% 66%', '82% 52%', '50% 38%'];

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Meet the team, after the furniture floor. No cards: portraits, numbers and hairlines. On wide screens the words hold
 * on the left while the portraits scroll past on the right, and the index brings forward whoever is in view; on phones
 * the portraits are a row you swipe. Without scripts every name in the index stays at full ink.
 */
export function Team() {
  const people = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const el = people.current;
    if (!el) return;
    setActive(TEAM[0].id);
    // The portrait crossing the middle of the screen is the one in view.
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.id ?? null);
        }),
      { rootMargin: '-50% 0px -50% 0px' },
    );
    el.querySelectorAll<HTMLElement>('[data-id]').forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  return (
    <section id="team" className="team" aria-labelledby="team-title">
      <div className="container team__grid">
        <div className="team__text">
          <p className="team__label" data-reveal>
            Meet the team
          </p>
          <h2 id="team-title" className="h-section" data-reveal style={{ ['--i' as string]: 1 }}>
            The people behind Jontai Energy.
          </h2>
          <p className="lead" data-reveal style={{ ['--i' as string]: 2 }}>
            Come and say hello at Cumana 73, Oranjestad.
          </p>
          <nav aria-label="Team members">
            <ol className="team__index">
              {TEAM.map((m, i) => (
                <li key={m.id} data-on={active ? String(active === m.id) : undefined}>
                  <a href={`#team-${m.id}`}>
                    <span className="team__num">{pad(i + 1)}</span>
                    <span className="team__who">
                      <span className="team__name">{m.name}</span>
                      <span className="team__role">{m.role}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <ol ref={people} className="team__people">
          {TEAM.map((m, i) => (
            <li key={m.id} id={`team-${m.id}`} data-id={m.id} className="team__person">
              <figure>
                <div className="team__photo" data-slot style={{ ['--wall' as string]: WALL[i % WALL.length] } as CSSProperties}>
                  {m.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo} alt="" loading="lazy" decoding="async" width={800} height={1000} />
                  ) : (
                    <span className="team__pending">Photo of {m.name.split(' ')[0]} to come</span>
                  )}
                </div>
                <figcaption className="team__caption">
                  <span className="team__num">{pad(i + 1)}</span>
                  <span className="team__who">
                    <span className="team__name">{m.name}</span>
                    <span className="team__role">{m.role}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
