'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { finishIntro } from './intro';

gsap.registerPlugin(ScrollTrigger);

const SEEN = 'jontai-loader';

/**
 * The first visit of a session opens on the store charging up: sand fills the forest screen from the bottom like a
 * battery, with a mint edge, and the count and the brand change colour as the edge passes them (the layout is drawn
 * twice and the sand copy is uncovered). It waits for the fonts and the page (never more than four seconds), and at
 * 100% the screen is the page's own sand, so it hands over to the hero without a cut. The head script decides whether
 * it shows (html.is-loading): never on a later visit, with reduced motion or with Save-Data.
 */
export function Loader({ line }: { line: string }) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  // Hold the page still under the loader.
  useEffect(() => {
    if (lenis && document.documentElement.classList.contains('is-loading')) lenis.stop();
  }, [lenis]);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    const charged = el?.querySelector<HTMLElement>('.loader__charged');
    const edge = el?.querySelector<HTMLElement>('.loader__edge');
    if (!el || !charged || !edge || !html.classList.contains('is-loading')) {
      finishIntro();
      return;
    }
    const levels = el.querySelectorAll<HTMLElement>('[data-level]');
    const level = { p: 0 };
    const draw = () => {
      charged.style.clipPath = `inset(${(100 - level.p).toFixed(2)}% 0 0 0)`;
      edge.style.transform = `translateY(${((1 - level.p / 100) * window.innerHeight).toFixed(1)}px)`;
      const v = String(Math.round(level.p));
      levels.forEach((n) => (n.textContent = v));
    };
    const loaded = new Promise<void>((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', () => r(), { once: true })));
    const ready = Promise.race([Promise.all([document.fonts?.ready, loaded]), new Promise((r) => setTimeout(r, 4000))]);

    let cancelled = false;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.loader__layer:first-child .loader__top > *, .loader__layer:first-child .loader__line'), {
        opacity: 0,
        y: 14,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.07,
      });
      const charge = gsap.to(level, { p: 86, duration: 1.35, delay: 0.15, ease: 'power2.inOut', onUpdate: draw });
      Promise.all([ready, charge.then()]).then(() => {
        if (cancelled) return;
        ctx.add(() => {
          gsap
            .timeline()
            .to(level, { p: 100, duration: 0.45, ease: 'power2.out', onUpdate: draw })
            .to(edge, { opacity: 0, duration: 0.2, ease: 'power2.out' }, '-=0.1')
            .to(
              el.querySelectorAll('.loader__charged .loader__top > *, .loader__charged .loader__count, .loader__charged .loader__line'),
              { yPercent: -60, opacity: 0, duration: 0.6, ease: 'expo.out', stagger: 0.05 },
              '+=0.15',
            )
            .add(() => {
              try {
                sessionStorage.setItem(SEEN, '1');
              } catch {}
              html.classList.remove('is-loading');
              lenisRef.current?.start();
              ScrollTrigger.refresh();
              finishIntro();
            }, '-=0.3');
        });
      });
    }, el);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} className="loader" aria-hidden="true">
      {[false, true].map((sand) => (
        <div key={String(sand)} className={sand ? 'loader__layer loader__charged' : 'loader__layer'}>
          <div className="loader__top">
            <span className="loader__brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon-192.png" alt="" width={36} height={36} />
              Jontai Energy
            </span>
            <span className="label">Cumana 73 · Oranjestad</span>
          </div>
          <div className="loader__bottom">
            <span className="loader__count">
              <span data-level>0</span>
              <small>%</small>
            </span>
            <span className="loader__line">{line}</span>
          </div>
        </div>
      ))}
      <span className="loader__edge" />
    </div>
  );
}
