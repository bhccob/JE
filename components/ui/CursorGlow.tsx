'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/** Over these the light lands: the sun gathers to a point inside a ring of light. */
const HOT = 'a[href], button:not(:disabled), [role="button"], label[for], summary, select, input:is([type="range"], [type="checkbox"], [type="radio"])';

/** A spring by feel, in Apple's terms: about how long it takes to settle, and how much it overshoots (0 none, 1 forever). */
function spring(duration: number, bounce: number) {
  return { k: ((2 * Math.PI) / duration) ** 2, c: (4 * Math.PI * (1 - bounce)) / duration };
}

/** The sun glides after the hand, close behind it, settling in about a third of a second with the faintest overshoot. */
const GLIDE = spring(0.35, 0.12);
/** How long the trail's light lingers (ms), and the longest it gets (px) however fast the hand moves. */
const LIFE = 300;
const REACH = 160;
/** The trail is laid as dabs of light this far apart (px), this wide at the head (px), each this strong. */
const STEP = 2.5;
const SIZE = 30;
const STRENGTH = 0.11;

type Point = { x: number; y: number; t: number };

/** A colour token as "r, g, b", so the canvas can fade it without greying; null where the canvas can't read it. */
function rgb(el: HTMLElement, token: string) {
  el.style.color = `var(${token})`;
  const css = getComputedStyle(el).color;
  el.style.removeProperty('color');
  const g = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!g) return null;
  g.fillStyle = '#010203';
  g.fillStyle = css;
  if (g.fillStyle === '#010203') return null;
  g.fillRect(0, 0, 1, 1);
  const [r, gr, b] = g.getImageData(0, 0, 1, 1).data;
  return `${r}, ${gr}, ${b}`;
}

/** One dab of sunlight: a white-hot heart, then sun, then a wide amber bloom that falls away to nothing. */
function dab(white: string, sun: string, amber: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const fill = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  fill.addColorStop(0, `rgba(${white}, 1)`);
  fill.addColorStop(0.1, `rgba(${sun}, 0.85)`);
  fill.addColorStop(0.25, `rgba(${sun}, 0.35)`);
  fill.addColorStop(0.5, `rgba(${amber}, 0.1)`);
  fill.addColorStop(1, `rgba(${amber}, 0)`);
  g.fillStyle = fill;
  g.fillRect(0, 0, 64, 64);
  return c;
}

/**
 * A small sun that glides after the mouse with a trail of light behind it, as if the visitor carries a little of the
 * film's sun. The native cursor stays. The sun follows on a spring; the trail is dabs of light laid back along the
 * path it took, added together on a canvas so where they gather they burn whiter, like light does, each smaller and
 * fainter until it is gone. Over a control the sun opens into a ring; a press sends a ring of light out from the
 * click. Mouse and trackpad only; touch screens, reduced motion and Save-Data (html.still) and forced colours go
 * without. It draws on GSAP's ticker, the clock Lenis already runs on, so it adds no loop of its own, rests once the
 * sun settles and the trail has faded, never touches layout and uses no blend mode on the page.
 */
export function CursorGlow() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (forced-colors: none)').matches;
    if (!el || !fine || document.documentElement.classList.contains('still')) return;
    const head = el.querySelector<HTMLElement>('.glow__head')!;
    const ripple = el.querySelector<HTMLElement>('.glow__ripple')!;
    const cvs = el.querySelector('canvas')!;
    const ctx = cvs.getContext('2d');
    const white = rgb(cvs, '--glow-white');
    const sun = rgb(cvs, '--color-sun');
    const amber = rgb(cvs, '--glow-amber');
    // Without a canvas that reads the palette there is no trail; the sun and its ring still follow.
    const brush = ctx && white && sun && amber ? dab(white, sun, amber) : null;
    const ease = getComputedStyle(document.documentElement).getPropertyValue('--ease-out').trim();
    const at = { x: 0, y: 0, vx: 0, vy: 0 };
    const trail: Point[] = [];
    let drawn: [number, number, number, number] | null = null;
    let tx = 0;
    let ty = 0;
    let shown = false;
    let resting = true;

    const wipe = () => {
      if (ctx && drawn) ctx.clearRect(drawn[0], drawn[1], drawn[2] - drawn[0], drawn[3] - drawn[1]);
      drawn = null;
    };
    /** Lays the trail from the sun back along its path, each dab smaller and fainter, until its light runs out. */
    const draw = (now: number) => {
      wipe();
      if (!ctx || !brush) return;
      let along = 0;
      let next = 0;
      for (let i = trail.length - 1; i > 0; i--) {
        const a = trail[i];
        const b = trail[i - 1];
        const seg = Math.hypot(b.x - a.x, b.y - a.y);
        for (; next <= along + seg; next += STEP) {
          const f = (next - along) / seg;
          const fade = Math.max((now - (a.t + (b.t - a.t) * f)) / LIFE, next / REACH);
          if (fade >= 1) return;
          const r = (SIZE * (1 - 0.6 * fade)) / 2;
          const x = a.x + (b.x - a.x) * f;
          const y = a.y + (b.y - a.y) * f;
          ctx.globalAlpha = STRENGTH * (1 - fade) ** 1.5;
          ctx.drawImage(brush, x - r, y - r, r * 2, r * 2);
          drawn = drawn
            ? [Math.min(drawn[0], x - r - 1), Math.min(drawn[1], y - r - 1), Math.max(drawn[2], x + r + 1), Math.max(drawn[3], y + r + 1)]
            : [x - r - 1, y - r - 1, x + r + 1, y + r + 1];
        }
        along += seg;
      }
    };
    const tick = (_time: number, ms: number) => {
      if (resting) return;
      const now = performance.now();
      // A long frame (a background tab, a busy main thread) is taken as a short one, so the spring never flies apart.
      const dt = Math.min(ms / 1000, 1 / 30);
      at.vx += (GLIDE.k * (tx - at.x) - GLIDE.c * at.vx) * dt;
      at.vy += (GLIDE.k * (ty - at.y) - GLIDE.c * at.vy) * dt;
      at.x += at.vx * dt;
      at.y += at.vy * dt;
      head.style.transform = `translate3d(${at.x}px, ${at.y}px, 0)`;
      const last = trail[trail.length - 1];
      if (!last || Math.abs(at.x - last.x) + Math.abs(at.y - last.y) >= 0.5) trail.push({ x: at.x, y: at.y, t: now });
      while (trail.length && now - trail[0].t > LIFE) trail.shift();
      draw(now);
      const settled = Math.hypot(at.vx, at.vy) < 2 && Math.abs(tx - at.x) < 0.5 && Math.abs(ty - at.y) < 0.5;
      resting = settled && trail.length === 0;
    };
    const fit = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
      // Resizing resets the context, so the dabs are set to add up again here: where they gather, the light burns whiter.
      if (ctx) ctx.globalCompositeOperation = 'lighter';
      drawn = null;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX;
      ty = e.clientY;
      // It appears where the pointer is, with no trail from wherever it left the window.
      if (!shown) {
        Object.assign(at, { x: tx, y: ty, vx: 0, vy: 0 });
        trail.length = 0;
        head.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        el.dataset.on = 'true';
        shown = true;
      }
      resting = false;
    };
    const over = (e: PointerEvent) => {
      const hot = String(e.target instanceof Element && e.target.closest(HOT) !== null);
      if (el.dataset.hot !== hot) el.dataset.hot = hot;
    };
    const press = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      el.dataset.down = 'true';
      // The ring of light goes out from where the click landed and stays there while the sun moves on.
      ripple.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      ripple.animate([{ scale: '0.5', opacity: 0.9 }, { scale: '2.4', opacity: 0 }], { duration: 600, easing: ease });
    };
    const release = () => {
      el.dataset.down = 'false';
    };
    const hide = () => {
      el.dataset.on = 'false';
      release();
      trail.length = 0;
      wipe();
      shown = false;
    };
    const out = (e: PointerEvent) => {
      if (!e.relatedTarget) hide();
    };

    fit();
    gsap.ticker.add(tick);
    window.addEventListener('resize', fit, { passive: true });
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerout', out, { passive: true });
    window.addEventListener('pointerdown', press, { passive: true });
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('pointercancel', release, { passive: true });
    window.addEventListener('blur', hide);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', fit);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerout', out);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', hide);
    };
  }, []);

  return (
    <div ref={root} className="glow" aria-hidden="true">
      <canvas className="glow__trail" />
      <span className="glow__head">
        <span className="glow__aura" />
      </span>
      <span className="glow__ripple" />
    </div>
  );
}
