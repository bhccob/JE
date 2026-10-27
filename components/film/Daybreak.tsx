'use client';

import { useEffect, useRef } from 'react';
import { filmStore } from './store';

/** Seconds after the sun starts to zoom when the screen starts to lift, as the sun is about to cover it. DayFilm
 *  starts the sunrise then. */
export const DAYBREAK_LIFT = 0.68;
/** Set for the rest of the visit once the screen has shown. The head script in app/layout.tsx reads the same key. */
const SEEN = 'jontai-daybreak';
/** The outline never draws faster than this, so the screen reads as an opening, not a flash; it draws slower when
 *  loading does. */
const DRAW = 3300;
/** The outline fills with light, then a beat before the zoom. */
const BRIGHTEN = 550;
const BEAT = 150;
const ZOOM = 1100;
const FADE = 850;
/** A scroll, tap or key skips it with a quick fade. */
const SKIP_FADE = 400;
/** If the opening is still loading by then, the outline completes anyway and the film catches up behind it. */
const PATIENCE = { film: 8000, still: 3000 };

// Once per page life as well, so coming back to the home page without a reload skips it.
let played = false;

/**
 * The loading screen on a first visit: the night the film starts from and the outline of a sun, drawn round as the
 * opening loads (never faster than DRAW). Once it closes, the sun lights up and zooms into the screen, thinning to a
 * warm wash over the morning as the screen lifts onto the dawn frame and the film's sunrise starts. Any scroll, tap
 * or key skips it. With reduced motion or Save-Data it is the still outline, fading out once the fonts are in. It
 * shows only while html.before-dawn is set by the head script, so never without scripts, and CSS lifts it on its own
 * if the scripts never arrive. Everything runs on WAAPI (the outline's dash, then scale and opacity), so it stays
 * smooth while the page loads.
 */
export function Daybreak() {
  const root = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLSpanElement>(null);
  const sun = useRef<HTMLSpanElement>(null);
  const core = useRef<HTMLSpanElement>(null);
  const ring = useRef<SVGSVGElement>(null);
  const arc = useRef<SVGPathElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    const night = scene.current;
    const disc = sun.current;
    const light = core.current;
    const outline = ring.current;
    const stroke = arc.current;
    if (!el || !night || !disc || !light || !outline || !stroke) return;
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
    const inOut = token('--ease-in-out');
    const out = token('--ease-out');
    const animations: Animation[] = [];
    const early = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    let unsubscribe = () => {};
    let patience = 0;
    let next = 0;
    let raf = 0;
    let opened = false;
    let gone = false;

    const stop = () => {
      unsubscribe();
      window.clearTimeout(patience);
      window.clearTimeout(next);
      cancelAnimationFrame(raf);
      early.forEach((type) => window.removeEventListener(type, skip));
    };
    const lift = () => {
      played = true;
      html.classList.remove('before-dawn');
      animations.forEach((a) => a.cancel());
    };
    const play = (target: Element, keyframes: Keyframe[], timing: KeyframeAnimationOptions) => {
      const a = target.animate(keyframes, { fill: 'forwards', ...timing });
      animations.push(a);
      return a;
    };
    const fadeOut = (delay: number, duration: number) => {
      play(el, [{ opacity: 1 }, { opacity: 0 }], { delay, duration, easing: inOut }).finished.then(lift, () => {});
    };
    const begin = () => {
      if (opened || gone) return false;
      opened = true;
      stop();
      filmStore.set({ daybreak: true });
      return true;
    };
    // The zoom: the lit sun grows from the middle until it covers the corners. It stays solid while the night
    // dissolves behind it, then thins over the morning, so the screen fills with a warm wash, not a block of colour.
    const zoom = () => {
      if (!begin()) return;
      const r = disc.getBoundingClientRect();
      const reach = Math.hypot(Math.max(r.left + r.width / 2, window.innerWidth - r.left - r.width / 2), Math.max(r.top + r.height / 2, window.innerHeight - r.top - r.height / 2));
      const cover = ((2 * reach) / r.width) * 1.05;
      play(disc, [{ scale: '1' }, { scale: cover.toFixed(2) }], { duration: ZOOM, easing: inOut });
      play(light, [{ opacity: 1 }, { opacity: 1, offset: 0.55 }, { opacity: 0.45 }], { duration: ZOOM, easing: inOut });
      play(night, [{ opacity: 1 }, { opacity: 0 }], { delay: ZOOM * 0.25, duration: ZOOM * 0.4, easing: inOut });
      fadeOut(DAYBREAK_LIFT * 1000, FADE);
    };
    // The outline has closed: the sun fills with light and the outline gives way to it.
    const brighten = () => {
      play(light, [{ opacity: 0 }, { opacity: 1 }], { duration: BRIGHTEN, easing: out });
      play(outline, [{ opacity: 1 }, { opacity: 0 }], { duration: BRIGHTEN, easing: out });
      next = window.setTimeout(zoom, BRIGHTEN + BEAT);
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

    // The outline fades in and draws round over DRAW, paused whenever it gets ahead of what has really loaded.
    play(disc, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: out });
    const draw = play(stroke, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: DRAW, easing: inOut });
    let loaded = 0;
    const tick = () => {
      raf = 0;
      const ahead = Number(draw.currentTime ?? 0) / DRAW >= loaded && loaded < 1;
      if (ahead && draw.playState === 'running') draw.pause();
      else if (!ahead && draw.playState === 'paused') draw.play();
      if (draw.playState === 'finished') return brighten();
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
      <span ref={scene} className="daybreak__scene">
        <span className="daybreak__mark">
          Jontai <span>Energy</span>
        </span>
      </span>
      <span ref={sun} className="daybreak__sun">
        <span ref={core} className="daybreak__core" />
        <svg ref={ring} className="daybreak__ring" viewBox="0 0 100 100">
          <circle className="daybreak__track" cx="50" cy="50" r="49" />
          {/* From the top, clockwise. A path, not a circle, so pathLength works in Safari too. */}
          <path ref={arc} className="daybreak__arc" d="M50 1 a49 49 0 1 1 0 98 a49 49 0 1 1 0 -98" pathLength={1} />
        </svg>
      </span>
    </div>
  );
}
