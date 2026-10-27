'use client';

import { useEffect, useRef } from 'react';
import { filmStore } from './store';

/** Seconds after the opening has loaded when the screen starts to lift, as the sun is about to cover it. DayFilm
 *  starts the sunrise then. */
export const DAYBREAK_LIFT = 0.45;
/** Set for the rest of the visit once the screen has shown. The head script in app/layout.tsx reads the same key. */
const SEEN = 'jontai-daybreak';
/** If the opening is still loading by then, the sun opens anyway and the film catches up behind it. */
const PATIENCE = { film: 8000, still: 3000 };
const SWELL = 800;
const FADE = 600;

// Once per page life as well, so coming back to the home page without a reload skips it.
let played = false;

/**
 * The loading screen on a first visit: the night the film starts from, and a sun that grows as the opening loads.
 * Once it has loaded, the sun swells to fill the screen and the screen lifts onto the dawn frame as the sunrise
 * starts. Any scroll, tap or key opens it at once. With reduced motion or Save-Data it is the night alone, fading out
 * once the fonts are in. It shows only while html.before-dawn is set by the head script, so never without scripts,
 * and CSS lifts it on its own if the scripts never arrive. Both animations are transform and opacity on WAAPI, so
 * they stay smooth while the page is busy loading and decoding.
 */
export function Daybreak() {
  const root = useRef<HTMLDivElement>(null);
  const sun = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    const disc = sun.current;
    if (!el || !disc) return;
    if (played || !html.classList.contains('before-dawn')) {
      html.classList.remove('before-dawn');
      return;
    }
    try {
      sessionStorage.setItem(SEEN, '1');
    } catch {
      // Storage refused (some private windows): the screen shows again on the next visit to the home page.
    }
    const still = html.classList.contains('still');
    const token = (name: string) => getComputedStyle(html).getPropertyValue(name).trim();
    const animations: Animation[] = [];
    const early = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    let unsubscribe = () => {};
    let patience = 0;
    let opened = false;
    let gone = false;

    const stop = () => {
      unsubscribe();
      window.clearTimeout(patience);
      early.forEach((type) => window.removeEventListener(type, open));
    };
    const lift = () => {
      played = true;
      html.classList.remove('before-dawn');
      animations.forEach((a) => a.cancel());
    };
    function open() {
      if (opened || gone) return;
      opened = true;
      stop();
      if (!still) {
        const cover = (Math.hypot(window.innerWidth, window.innerHeight) / disc!.offsetWidth) * 1.1;
        const from = getComputedStyle(disc!).transform;
        animations.push(
          disc!.animate([{ transform: from }, { transform: `scale(${cover.toFixed(2)})` }], {
            duration: SWELL,
            easing: token('--ease-in-out'),
            fill: 'forwards',
          }),
        );
      }
      const fade = el!.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: FADE,
        delay: still ? 0 : DAYBREAK_LIFT * 1000,
        // A dissolve of the sun's light into the picture, so it holds for a beat before it clears.
        easing: token('--ease-in-out'),
        fill: 'forwards',
      });
      animations.push(fade);
      fade.finished.then(lift, () => {});
    }

    early.forEach((type) => window.addEventListener(type, open, { passive: true }));
    patience = window.setTimeout(open, still ? PATIENCE.still : PATIENCE.film);
    if (still) {
      void document.fonts?.ready.then(open);
    } else {
      unsubscribe = filmStore.subscribe((s) => {
        if (opened) return;
        disc.style.transform = `scale(${(0.2 + 0.8 * s.opening).toFixed(3)})`;
        if (s.opening >= 1) open();
      });
    }

    return () => {
      gone = true;
      stop();
      if (opened) lift();
    };
  }, []);

  return (
    <div ref={root} className="daybreak" aria-hidden="true">
      <span className="daybreak__mark">
        Jontai <span>Energy</span>
      </span>
      <span ref={sun} className="daybreak__sun" />
    </div>
  );
}
