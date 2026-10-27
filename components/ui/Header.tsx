'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';
import { useLenis } from 'lenis/react';
import { DIRECTIONS_URL } from '@/lib/contact';

const LINKS = [
  { href: '#shop', label: 'Products' },
  { href: '#upstairs', label: 'Furniture' },
  { href: '#rewards', label: 'Loyalty' },
  { href: '#visit', label: 'Visit us' },
];
const QUOTE = { href: '/quote', label: 'Quotes' };

/** `base` is '/' on pages other than home, so the section links lead back to the film. */
export function Header({ base = '' }: { base?: string }) {
  const links = [...LINKS.map((l) => ({ ...l, href: base + l.href })), QUOTE];
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lenis?.start();
    };
  }, [open, lenis]);

  return (
    <header className="nav" data-scrolled={scrolled} data-open={open}>
      <div className="container nav__frame">
        <div className="nav__inner glass">
          <a href={base || '#top'} className="wordmark" aria-label={base ? 'Jontai Energy, home' : 'Jontai Energy, back to the top'}>
            Jontai <span>Energy</span>
          </a>
          <nav aria-label="Main">
            <ul className="nav__links">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="nav__link" aria-current={base && l === QUOTE ? 'page' : undefined}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm nav__cta">
            Get directions
          </a>
          <button
            ref={toggle}
            type="button"
            className="btn btn--ghost btn--sm nav__menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
      <nav id="mobile-menu" aria-label="Mobile" className="nav__panel glass" data-open={open} hidden={!open}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
          Get directions
        </a>
      </nav>
    </header>
  );
}
