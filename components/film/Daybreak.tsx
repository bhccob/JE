'use client';

import { useEffect, useRef } from 'react';
import { filmStore } from './store';

/** Seconds after the sun starts to swell when the screen starts to lift, as the sun is about to cover it. DayFilm
 *  starts the sunrise then. */
export const DAYBREAK_LIFT = 0.68;
/** Set for the rest of the visit once the screen has shown. The head script in app/layout.tsx reads the same key. */
const SEEN = 'jontai-daybreak';
/** The sunrise never runs faster than this, so the screen reads as an opening, not a flash; it runs slower when
 *  loading does. */
const RISE = 3300;
/** A beat at 05:30 before the sun swells. */
const HOLD = 500;
const SWELL = 1100;
const FADE = 850;
/** A scroll, tap or key skips the sunrise with a quick fade. */
const SKIP_FADE = 400;
/** If the opening is still loading by then, the sun rises anyway and the film catches up behind it. */
const PATIENCE = { film: 8000, still: 3000 };
/** The clock runs from 04:00 to 05:30, where the film's own clock starts. */
const FROM = 4 * 60;
const TO = 5.5 * 60;

// Once per page life as well, so coming back to the home page without a reload skips it.
let played = false;

const clockAt = (p: number) => {
  const m = Math.round(FROM + (TO - FROM) * p);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

/**
 * The loading screen on a first visit: the night the film starts from, a horizon, and a sun that comes up over it
 * while a clock runs to 05:30. The sun rises with the opening as it really loads, but never faster than RISE. At
 * 05:30 it swells to fill the screen and the screen lifts onto the dawn frame as the film's sunrise starts. Any
 * scroll, tap or key skips it. With reduced motion or Save-Data it is the night and the horizon alone, fading out
 * once the fonts are in. It shows only while html.before-dawn is set by the head script, so never without scripts,
 * and CSS lifts it on its own if the scripts never arrive. The sun, the glow and the swell run on WAAPI (translate,
 * scale, opacity), so they stay smooth while the page loads; only the clock's digits are written from script.
 */
export function Daybreak() {
  const root = useRef<HTMLDivElement>(null);
  const sun = useRef<HTMLSpanElement>(null);
  const sky = useRef<HTMLSpanElement>(null);
  const clock = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    const disc = sun.current;
    const glow = sky.current;
    const digits = clock.current;
    if (!el || !disc || !glow || !digits) return;
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
    let hold = 0;
    let raf = 0;
    let opened = false;
    let gone = false;

    const stop = () => {
      unsubscribe();
      window.clearTimeout(patience);
      window.clearTimeout(hold);
      cancelAnimationFrame(raf);
      early.forEach((type) => window.removeEventListener(type, skip));
    };
    const lift = () => {
      played = true;
      html.classList.remove('before-dawn');
      animations.forEach((a) => a.cancel());
    };
    const fadeOut = (delay: number, duration: number) => {
      const fade = el.animate([{ opacity: 1 }, { opacity: 0 }], {
        delay,
        duration,
        // A dissolve of the sun's light into the picture, so it holds for a beat before it clears.
        easing: token('--ease-in-out'),
        fill: 'forwards',
      });
      animations.push(fade);
      fade.finished.then(lift, () => {});
    };
    const begin = () => {
      if (opened || gone) return false;
      opened = true;
      stop();
      filmStore.set({ daybreak: true });
      return true;
    };
    // At 05:30: the sun swells from where it stands until it covers the farthest corner, and the screen lifts.
    const swell = () => {
      if (!begin()) return;
      el.dataset.open = 'true';
      const r = disc.getBoundingClientRect();
      const [cx, cy] = [r.left + r.width / 2, r.top + r.height / 2];
      const [w, h] = [window.innerWidth, window.innerHeight];
      const reach = Math.max(Math.hypot(cx, cy), Math.hypot(w - cx, cy), Math.hypot(cx, h - cy), Math.hypot(w - cx, h - cy));
      const cover = ((2 * reach) / r.width) * 1.05;
      animations.push(disc.animate([{ scale: '1' }, { scale: cover.toFixed(2) }], { duration: SWELL, easing: token('--ease-in-out'), fill: 'forwards' }));
      fadeOut(DAYBREAK_LIFT * 1000, FADE);
    };
    function skip() {
      if (begin()) fadeOut(0, SKIP_FADE);
    }

    early.forEach((type) => window.addEventListener(type, skip, { passive: true }));

    if (still) {
      patience = window.setTimeout(skip, PATIENCE.still);
      void document.fonts?.ready.then(skip);
      return () => {
        gone = true;
        stop();
        if (opened) lift();
      };
    }

    // The sunrise: the sun and its glow rise over RISE, paused whenever they get ahead of what has really loaded.
    const timing = { duration: RISE, easing: token('--ease-in-out'), fill: 'forwards' as const };
    const rise = disc.animate([{ translate: '0 85%' }, { translate: '0 0' }], timing);
    const light = glow.animate([{ opacity: 0 }, { opacity: 1 }], timing);
    animations.push(rise, light);
    let loaded = 0;
    let shown = '';
    const tick = () => {
      raf = 0;
      const ahead = Number(rise.currentTime ?? 0) / RISE >= loaded && loaded < 1;
      for (const a of [rise, light]) {
        if (ahead && a.playState === 'running') a.pause();
        else if (!ahead && a.playState === 'paused') a.play();
      }
      const time = clockAt(rise.effect?.getComputedTiming().progress ?? 0);
      if (time !== shown) digits.textContent = shown = time;
      if (rise.playState === 'finished') {
        digits.textContent = clockAt(1);
        hold = window.setTimeout(swell, HOLD);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    unsubscribe = filmStore.subscribe((s) => {
      loaded = s.opening;
    });
    patience = window.setTimeout(() => {
      loaded = 1;
    }, PATIENCE.film);
    raf = requestAnimationFrame(tick);

    return () => {
      gone = true;
      stop();
      if (opened) lift();
      else animations.forEach((a) => a.cancel());
    };
  }, []);

  return (
    <div ref={root} className="daybreak" aria-hidden="true">
      <span ref={sky} className="daybreak__sky" />
      <span ref={sun} className="daybreak__sun" />
      <span className="daybreak__ground" />
      <span className="daybreak__mark">
        Jontai <span>Energy</span>
      </span>
      <span className="daybreak__time">
        <span ref={clock} className="daybreak__clock">
          {clockAt(0)}
        </span>
        <span className="daybreak__caption">Sunrise in Oranjestad</span>
      </span>
    </div>
  );
}
