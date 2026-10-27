'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/** Over these the light gathers, tighter and brighter, as if it lands on the control. */
const HOT = 'a[href], button:not(:disabled), [role="button"], label[for], summary, select, input:is([type="range"], [type="checkbox"], [type="radio"])';

/**
 * A soft warm light that follows the mouse, as if the visitor carries a little of the film's sun. The native cursor
 * stays. Mouse and trackpad only; touch screens, reduced motion and Save-Data (html.still) and forced colours go
 * without. It is one small layer moved by transform on GSAP's ticker, the clock Lenis already runs on, so it adds no
 * loop of its own, never touches layout and uses no blend mode.
 */
export function CursorGlow() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (forced-colors: none)').matches;
    if (!el || !fine || document.documentElement.classList.contains('still')) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      // It appears where the pointer is, rather than sliding in from wherever it was last.
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.dataset.on = 'true';
        shown = true;
      }
      x(e.clientX);
      y(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const hot = String(e.target instanceof Element && e.target.closest(HOT) !== null);
      if (el.dataset.hot !== hot) el.dataset.hot = hot;
    };
    const hide = () => {
      el.dataset.on = 'false';
      shown = false;
    };
    const out = (e: PointerEvent) => {
      if (!e.relatedTarget) hide();
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerout', out, { passive: true });
    window.addEventListener('blur', hide);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerout', out);
      window.removeEventListener('blur', hide);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div ref={root} className="glow" aria-hidden="true">
      <span className="glow__light" />
    </div>
  );
}
