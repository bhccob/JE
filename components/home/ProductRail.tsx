'use client';

import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { scrollTargets } from '@/components/providers/scrollTargets';
import { useSettle } from './useSettle';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Wide enough for a product's words and picture side by side; whether they fit one screen is measured (fits). */
const ROOMY = '(min-width: 961px) and (min-height: 560px)';
const MOTION = '(prefers-reduced-motion: no-preference)';
/** Screens of scroll each product holds still for, to be read. */
const HOLD = 0.8;
/** Screens of scroll the slide from one product to the next takes. */
const MOVE = 1;
/** The way out after the last product, in screens of scroll. */
const OUT = 1;
/** Between two products, how far into the slide (either way) a resting scroll must be to carry on to the next. */
const PUSH = 0.12;
/** Outside the rail, how near a resting place (a share of the screen height) a scroll must stop to settle onto it. */
const NEAR = 0.22;
/** Steps in the staircase that carries the rail away, up to the next section. */
const STEPS = 6;
/** How far behind the first step the last one starts, as a share of the way out. */
const STAGGER = 0.45;

interface RailItem {
  id: string;
  number: string;
  name: string;
}

/** Where the rail rests, in scroll positions: each product's still stretch, and the end of the way out. */
interface Rests {
  holds: [number, number][];
  end: number;
}

const closest = (ys: number[], y: number) => ys.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a));

/**
 * The products as a rail. On wide screens with motion, the section locks in place and the scroll walks through the
 * five products sideways. Each product holds still for a stretch of scroll, to be read, then the next slides in: its
 * picture drifts in slower than its panel and the words catch up one after another, so the store seems to have depth.
 * A scroll that comes to rest mid-slide snaps on in the direction it was going (a little way in is enough), and one
 * resting just short of the rail locks onto the first product. The numbers along the top (with a line along the
 * bottom) show where you are and jump there. After the last product the rail climbs away in a staircase, one flight
 * up, and the next section is already underneath it. Links to a product land on it (scrollTargets).
 *
 * Phones, short screens and reduced motion keep the products stacked, one screen each, and a scroll resting near the
 * start of one settles onto it; with motion, the picture and the big number drift against the scroll there. Without
 * scripts the stack is all there is.
 */
export function ProductRail({ items }: { items: RailItem[] }) {
  const hud = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLElement>(null);
  const rests = useRef<(() => Rests) | null>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const lenisNow = useRef(lenis);

  useEffect(() => {
    lenisNow.current = lenis;
  }, [lenis]);

  useGSAP(() => {
    const host = hud.current?.closest<HTMLElement>('.rail');
    const section = host?.closest<HTMLElement>('.showroom');
    const track = host?.querySelector<HTMLElement>('.chapters');
    if (!host || !section || !track) return;
    const panels = gsap.utils.toArray<HTMLElement>(track.children);
    const pics = panels.map((p) => p.querySelector<HTMLElement>('.chapter__media > :is(img, .bulb3d)'));
    const ghosts = panels.map((p) => p.querySelector<HTMLElement>('.ghost'));
    const words = panels.map((p) => gsap.utils.toArray<HTMLElement>(p.querySelectorAll('.chapter__text > :not(.ghost)')));
    const n = panels.length;
    const roomy = window.matchMedia(ROOMY);
    const width = () => host.clientWidth;
    // The rail's timeline, in screens of scroll: product i holds from held(i) to held(i) + HOLD, then slides on.
    const held = (i: number) => i * (HOLD + MOVE);
    const total = held(n - 1) + HOLD + OUT;

    // Whether every product's words fit one screen in the rail's layout, measured in it before anything is painted.
    const fits = () => {
      const was = section.dataset.rail;
      section.dataset.rail = 'true';
      const ok = panels.every((p, i) => {
        const text = p.querySelector<HTMLElement>('.chapter__text');
        const first = words[i][0];
        const last = words[i][words[i].length - 1];
        if (!text || !first || !last) return true;
        const style = getComputedStyle(text);
        const room = text.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
        return last.offsetTop + last.offsetHeight - first.offsetTop <= room;
      });
      if (was === undefined) delete section.dataset.rail;
      return ok;
    };

    // Stacked, the picture and the big number drift against the scroll.
    const stack = () => {
      panels.forEach((_, i) => {
        const pic = pics[i];
        const ghost = ghosts[i];
        if (pic) {
          gsap.fromTo(pic, { yPercent: 10 }, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: pic.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
        }
        if (ghost) {
          gsap.fromTo(ghost, { yPercent: 28 }, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: ghost.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
        }
      });
    };

    // The rail; returns what undoes the parts GSAP does not track.
    const rail = () => {
      section.dataset.rail = 'true';
      // Where the numbers sit across the screen (0 to 1), to tell what passes under them.
      let centre = 0.9;

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: host,
          pin: true,
          start: 'top top',
          end: () => `+=${total * window.innerHeight}`,
          scrub: true,
          invalidateOnRefresh: true,
          // Pinned before anything further down measures itself, so their triggers count the pinned stretch.
          refreshPriority: 1,
          onRefresh: () => {
            const box = hud.current?.getBoundingClientRect();
            if (box?.width) centre = (box.left + box.width / 2) / width();
          },
          onUpdate: (self) => {
            const at = self.progress * total;
            const i = Math.min(n - 1, Math.floor(at / (HOLD + MOVE)));
            setActive(Math.min(n - 1, Math.max(0, Math.round((at - HOLD / 2) / (HOLD + MOVE)))));
            // A fraction f of the way through a slide, the next product's words cover the numbers from 1 - centre
            // to 1.5 - centre; the oak upstairs is light like the stage.
            const f = (at - held(i) - HOLD) / MOVE;
            const next = panels[i + 1];
            const over = f > 1 - centre && f < 1.5 - centre && next?.dataset.tone === 'dark';
            if (hud.current) hud.current.dataset.over = over ? 'dark' : 'light';
          },
        },
      });

      for (let i = 1; i < n; i++) {
        const from = i - 1;
        const at = held(from) + HOLD;
        tl.fromTo(track, { x: () => -from * width() }, { x: () => -i * width(), duration: MOVE, immediateRender: i === 1 }, at);
        // Depth: the product arriving drifts in slower than its panel and the one leaving lingers; the big number
        // runs ahead, and the words catch up one after another.
        if (pics[i]) tl.fromTo(pics[i], { xPercent: -28 }, { xPercent: 0, duration: MOVE }, at);
        if (pics[from]) tl.fromTo(pics[from], { xPercent: 0 }, { xPercent: 28, duration: MOVE, immediateRender: false }, at);
        if (ghosts[i]) tl.fromTo(ghosts[i], { xPercent: 40 }, { xPercent: 0, duration: MOVE }, at);
        words[i].forEach((el, k) => {
          tl.fromTo(el, { x: () => (k + 1) * 0.05 * width() }, { x: 0, duration: MOVE, ease: 'power2.out' }, at);
        });
      }
      if (fill.current) tl.fromTo(fill.current, { scaleX: 0 }, { scaleX: 1, duration: held(n - 1) }, 0);

      // The way out: the rail climbs away in steps from the right, a flight up, uncovering the next section, which is
      // already rising underneath it (rail CSS tucks it under the rail's last screen).
      const out = held(n - 1) + HOLD;
      const step = gsap.parseEase('power2.inOut');
      const stair = { p: 0 };
      const climb = () => {
        if (stair.p <= 0) {
          host.style.clipPath = '';
          return;
        }
        const points = ['0% 0%', '100% 0%'];
        for (let k = STEPS - 1; k >= 0; k--) {
          const lag = (STAGGER * (STEPS - 1 - k)) / (STEPS - 1);
          const y = 100 * (1 - step(gsap.utils.clamp(0, 1, (stair.p - lag) / (1 - STAGGER))));
          points.push(`${((100 * (k + 1)) / STEPS).toFixed(3)}% ${y.toFixed(2)}%`, `${((100 * k) / STEPS).toFixed(3)}% ${y.toFixed(2)}%`);
        }
        host.style.clipPath = `polygon(${points.join(', ')})`;
      };
      tl.to(stair, { p: 1, duration: OUT, onUpdate: climb }, out);
      tl.fromTo(panels[n - 1], { yPercent: 0 }, { yPercent: -8, duration: OUT, ease: 'power2.in', immediateRender: false }, out);
      tl.to([hud.current, fill.current?.parentElement], { autoAlpha: 0, duration: 0.2 }, out);

      const st = tl.scrollTrigger as ScrollTrigger;
      const y = (at: number) => st.start + ((st.end - st.start) * at) / total;
      rests.current = () => ({ holds: items.map((_, i) => [y(held(i)), y(held(i) + HOLD)]), end: st.end });
      // A link to a product lands in the middle of its still stretch.
      items.forEach((it, i) => scrollTargets.set(it.id, () => y(held(i) + HOLD / 2)));

      return () => {
        items.forEach((it) => scrollTargets.delete(it.id));
        rests.current = null;
        host.style.clipPath = '';
        delete section.dataset.rail;
      };
    };

    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      let mode: 'rail' | 'stack' | null = null;
      let ctx: gsap.Context | null = null;
      let undo: (() => void) | undefined;
      let frame = 0;
      let first = true;

      // Rail or stack, for this screen. Everything further down measures again afterwards, so their triggers count
      // the pinned stretch (or no longer count it).
      const apply = () => {
        const next = roomy.matches && fits() ? 'rail' : 'stack';
        if (next !== mode) {
          ctx?.revert();
          undo?.();
          undo = undefined;
          mode = next;
          ctx = gsap.context(() => {
            if (next === 'rail') undo = rail();
            else stack();
          });
          ScrollTrigger.refresh();
        }
        // A link from another page to one of the products (/#backup) lands on it.
        const arrived = first ? scrollTargets.get(decodeURIComponent(location.hash.slice(1))) : undefined;
        first = false;
        if (arrived) {
          const to = arrived();
          if (lenisNow.current) lenisNow.current.scrollTo(to, { immediate: true, force: true });
          else window.scrollTo(0, to);
        }
      };
      apply();
      // Every refresh (a resize, the fonts arriving) checks again: past the size limits, or once the words no longer
      // fit (or fit again), it switches.
      const onRefresh = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(apply);
      };
      ScrollTrigger.addEventListener('refresh', onRefresh);
      return () => {
        cancelAnimationFrame(frame);
        ScrollTrigger.removeEventListener('refresh', onRefresh);
        ctx?.revert();
        undo?.();
      };
    });
  });

  // Settle. On the rail: a scroll resting within a product's still stretch stays; mid-slide it goes on to the next
  // product (or back) in the direction it was moving, once a little way in; just short of the rail it locks onto the
  // first product. Stacked: onto a product whose start the scroll rests near.
  useSettle((y, dir) => {
    const near = window.innerHeight * NEAR;
    const rail = rests.current?.();
    if (rail) {
      const { holds, end } = rail;
      if (y < holds[0][0]) return y >= holds[0][0] - near ? holds[0][0] : null;
      if (y > end) return null;
      for (let i = 0; i < holds.length; i++) {
        const [a, b] = holds[i];
        if (y <= b) return y >= a ? null : between(holds[i - 1][1], a, y, dir);
      }
      return between(holds[holds.length - 1][1], end, y, dir);
    }
    const starts = items.flatMap((it) => {
      const el = document.getElementById(it.id);
      return el ? [el.getBoundingClientRect().top + y] : [];
    });
    if (!starts.length) return null;
    const target = closest(starts, y);
    return Math.abs(target - y) <= near ? target : null;
  });

  const go = (i: number) => {
    const at = scrollTargets.get(items[i].id);
    if (at && lenis) lenis.scrollTo(at(), { duration: 1.2 });
  };

  return (
    <>
      <div ref={hud} className="rail__hud label" role="group" aria-label="Products">
        {items.map((it, i) => (
          <button key={it.id} type="button" aria-label={`${it.number} ${it.name}`} aria-current={i === active ? 'true' : undefined} onClick={() => go(i)}>
            {it.number}
          </button>
        ))}
      </div>
      <span className="rail__bar" aria-hidden="true">
        <i ref={fill} />
      </span>
    </>
  );
}

/** Mid-slide from `from` to `to`: on in the direction the scroll was going once PUSH of the way in, else back. */
function between(from: number, to: number, y: number, dir: number) {
  const q = (y - from) / (to - from);
  if (dir > 0) return q > PUSH ? to : from;
  if (dir < 0) return q < 1 - PUSH ? from : to;
  return q < 0.5 ? from : to;
}
