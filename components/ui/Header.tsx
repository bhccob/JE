'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DIRECTIONS_URL, whatsappLink } from '@/lib/contact';
import { QUOTE_ACTION } from '@/lib/quote';

gsap.registerPlugin(ScrollTrigger);

/** The home page's sections. `spans` lists the sections during which a link counts as the current one. */
const LINKS = [
  { id: 'solar', label: 'Solar', spans: ['solar', 'cooling'] },
  { id: 'backup', label: 'Power' },
  { id: 'light', label: 'Lighting' },
  { id: 'upstairs', label: 'Furniture' },
  { id: 'rewards', label: 'Rewards' },
  { id: 'visit', label: 'Visit' },
] as const;

/**
 * The header: the store's mark, the sections, a quote and WhatsApp. It turns solid once you leave the top, steps out
 * of the way while you read down and comes back as soon as you scroll up or tab into it. On the home page a line
 * glides under the section you are in. Phones get a full-screen menu. `base` is '/' on other pages, so the section
 * links lead back home.
 */
export function Header({ base = '' }: { base?: string }) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const lastY = useRef(0);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const links = useRef(new Map<string, HTMLAnchorElement>());

  const lenis = useLenis((l) => {
    const y = l.scroll;
    setSolid(y > 12);
    if (y > lastY.current + 4 && y > window.innerHeight * 0.7) setHidden(true);
    else if (y < lastY.current - 4) setHidden(false);
    lastY.current = y;
  });

  // A reload part-way down the page starts solid.
  useEffect(() => setSolid(window.scrollY > 12), []);

  // The phone menu exists only up to 960px. Widening past it (a tablet turned to landscape) closes it, or the page
  // would stay inert and still under a menu that is no longer shown.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 961px)');
    const onChange = () => {
      if (wide.matches) setOpen(false);
    };
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, []);

  // Home only: which section is in the middle of the screen.
  useEffect(() => {
    if (base) return;
    const triggers = LINKS.map((l) => {
      const spans: readonly string[] = 'spans' in l ? l.spans : [l.id];
      const first = document.getElementById(spans[0]);
      const last = document.getElementById(spans[spans.length - 1]);
      if (!first || !last) return null;
      return ScrollTrigger.create({
        trigger: first,
        endTrigger: last,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => setCurrent((c) => (self.isActive ? l.id : c === l.id ? null : c)),
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, [base]);

  // The line under the current link: one bar, moved and stretched by transform.
  useEffect(() => {
    const line = bar.current;
    if (!line) return;
    const link = current ? links.current.get(current) : null;
    if (link) {
      line.dataset.x = String(link.offsetLeft);
      line.style.transform = `translateX(${link.offsetLeft}px) scaleX(${link.offsetWidth})`;
    } else {
      line.style.transform = `translateX(${line.dataset.x ?? 0}px) scaleX(0)`;
    }
  }, [current]);

  // The phone menu: the page behind is inert, Escape closes it, focus goes in and comes back to Menu.
  useEffect(() => {
    const sheet = menu.current;
    if (!sheet) return;
    sheet.inert = !open;
    if (!open) return;
    const behind = [...document.querySelectorAll<HTMLElement>('main, footer')];
    behind.forEach((el) => (el.inert = true));
    lenis?.stop();
    const first = sheet.querySelector<HTMLElement>('a');
    const focusIn = window.setTimeout(() => first?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggle.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusIn);
      window.removeEventListener('keydown', onKey);
      behind.forEach((el) => (el.inert = false));
      lenis?.start();
    };
  }, [open, lenis]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="nav" data-solid={solid || open} data-hidden={hidden && !open}>
        <a href={base || '#top'} className="brand" aria-label={base ? 'Jontai Energy, home' : 'Jontai Energy, back to the top'}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" alt="" width={36} height={36} />
          Jontai Energy
        </a>
        <nav aria-label="Main" className="nav__main">
          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  ref={(el) => {
                    if (el) links.current.set(l.id, el);
                  }}
                  href={`${base}#${l.id}`}
                  className="nav__link"
                  data-current={current === l.id}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <span ref={bar} className="nav__bar" aria-hidden="true" />
        </nav>
        <div className="nav__end">
          <a href="/quote" className="nav__quote" aria-current={pathname === '/quote' ? 'page' : undefined}>
            Get a quote
          </a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm">
            WhatsApp us
          </a>
          <button
            ref={toggle}
            type="button"
            className="btn btn--ghost btn--sm nav__menu"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>
      <nav id="menu" ref={menu} className="menu" aria-label="Menu" data-open={open}>
        <ul className="menu__links">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={`${base}#${l.id}`} onClick={close}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="actions">
          <a href="/quote" className="btn btn--primary">
            {QUOTE_ACTION}
          </a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
            WhatsApp us
          </a>
          <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
            Get directions
          </a>
        </div>
      </nav>
    </>
  );
}
