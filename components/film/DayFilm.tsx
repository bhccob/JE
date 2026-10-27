'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { filmProgress, frameAt, framePath, type ChapterId, type FrameSize } from '@/lib/film';
import { DAYBREAK_LIFT } from './Daybreak';
import { FrameStore, drawCover, fitCanvas } from './frames';
import { filmStore } from './store';

gsap.registerPlugin(ScrollTrigger);

/** The hero rests at first light: the frames before it play once on load, then scroll takes over. */
const DAWN_REST = 0.42;
const INTRO_FRAMES = 32;

/**
 * One fixed canvas behind the eight chapters of the day. Each chapter's scroll progress (GSAP ScrollTrigger, no
 * pinning) picks a frame from that chapter's Blender sequence and mixes toward the next frame, so 60 frames scrub as
 * smoothly as 120. A product chapter then holds on its last frame for a stretch (its `hold`), and when scrolling
 * stops in or just before that stretch the page settles onto it, so each product reads as a place you arrive at.
 * The canvas redraws only when the frame or the mix changes. Reduced motion, Save-Data and no-JS visitors never reach
 * this: the chapters show their stills instead (see `.still` in CSS).
 */
export function DayFilm({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  // Scroll positions of the middle of each product hold, read by the settle below.
  const holds = useRef<{ start: number; centre: number; end: number }[]>([]);
  const lenis = useLenis();

  useEffect(() => {
    const el = root.current;
    const cvs = canvas.current;
    if (!el || !cvs || document.documentElement.classList.contains('still')) return;
    const ctx = cvs.getContext('2d', { alpha: false });
    if (!ctx) return;

    const size: FrameSize = window.matchMedia('(orientation: portrait)').matches ? 'm' : 'd';
    const chapters = Array.from(el.querySelectorAll<HTMLElement>('[data-chapter]'));
    const ids = chapters.map((c) => c.dataset.chapter as ChapterId);
    const lengths = chapters.map((c) => Number(c.dataset.length) || 1);
    const holdOf = chapters.map((c) => Number(c.dataset.hold) || 0);
    const intro = { v: window.scrollY < 8 ? 0 : 1 };
    let active: ChapterId = 'dawn';
    let k = 0;
    let progress = 0;
    let raf = 0;
    let drawn = '';

    const effective = () =>
      active === 'dawn' ? DAWN_REST * intro.v + progress * (1 - DAWN_REST) : filmProgress(progress, lengths[k], holdOf[k]);
    // Arrived: the film rests on this chapter's product (inside its hold), or the hero has settled at first light.
    const arrivedNow = () =>
      holdOf[k] > 0 ? effective() >= 0.999 : active === 'dawn' && progress < 0.02 && intro.v > 0.98;

    const frames = new FrameStore(size, (id) => {
      if (id === active) schedule();
    });

    // While the film moves, neighbouring frames are mixed (it reads as motion); once scrolling stops, the picture
    // settles on the nearest single frame so a fast camera move never rests as a double image.
    let settled = true;
    let settleTimer = 0;
    const moving = () => {
      settled = false;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        settled = true;
        schedule();
      }, 160);
    };

    function draw() {
      raf = 0;
      const at = frameAt(effective(), frames.count(active));
      const i = settled && at.t >= 0.5 ? at.i + 1 : at.i;
      const t = settled ? 0 : at.t;
      frames.seek(active, i);
      const a = frames.get(active, i) ?? frames.nearest(active, i);
      if (!a || !ctx) return;
      const b = t > 0.03 ? frames.get(active, i + 1) : null;
      const key = `${a.key}|${b ? `${b.key}|${t.toFixed(2)}` : ''}|${cvs!.width}`;
      if (key === drawn) return;
      drawn = key;
      drawCover(ctx, a.image);
      if (b) drawCover(ctx, b.image, t);
      cvs!.dataset.ready = 'true';
    }
    function schedule() {
      if (!raf) raf = requestAnimationFrame(draw);
    }

    const resize = () => {
      fitCanvas(cvs, size);
      drawn = '';
      schedule();
    };
    resize();
    window.addEventListener('resize', resize);

    let dawnReleased = false;
    const setActive = (id: ChapterId, p: number) => {
      active = id;
      k = ids.indexOf(id);
      progress = p;
      filmStore.set({ chapter: id, progress: effective(), arrived: arrivedNow() });
      if (id !== 'dawn' || dawnReleased) void frames.load(id);
      const next = ids[ids.indexOf(id) + 1];
      if (next && p > 0.25) void frames.load(next);
      moving();
      schedule();
    };

    // A chapter's film runs from the moment it starts to slide in until its copy lets go ('bottom bottom'), so each
    // product is framed while its copy is still held on screen, and the camera leaves for the next one as that
    // copy slides out. The ranges meet end to end. Dawn starts at the top of the page.
    const triggers = chapters.map((section, k) =>
      ScrollTrigger.create({
        trigger: section,
        start: k === 0 ? 'top top' : 'top bottom',
        end: 'bottom bottom',
        onUpdate: (self) => setActive(ids[k], self.progress),
        onToggle: (self) => self.isActive && setActive(ids[k], self.progress),
      }),
    );
    // Measured on each ScrollTrigger refresh (load, resize), never during a scroll, so scrolling forces no layout.
    let stageEnd = 0;
    const measure = () => {
      holds.current = triggers.flatMap((t, i) => {
        if (!(holdOf[i] > 0)) return [];
        const total = lengths[i] + holdOf[i];
        const at = (p: number) => t.start + p * (t.end - t.start);
        return [{ start: at(lengths[i] / total), centre: at((lengths[i] + holdOf[i] / 2) / total), end: at(1) }];
      });
      stageEnd = el.offsetTop + el.offsetHeight - window.innerHeight + 2;
    };
    measure();
    ScrollTrigger.addEventListener('refresh', measure);
    // The film is on stage until its last screen has passed. A plain check on every scroll, so a jump straight past
    // the film (an anchor link) still hides the sun dial.
    let onStage = true;
    const checkStage = () => {
      const now = window.scrollY < stageEnd;
      if (now !== onStage) {
        onStage = now;
        filmStore.set({ visible: now });
      }
    };
    checkStage();
    window.addEventListener('scroll', checkStage, { passive: true });

    // First light: only the intro frames load up front. The rest of dawn waits for the first scroll (or a quiet
    // moment), so a visitor who only reads the hero downloads about a megabyte of film.
    const rest = () => {
      dawnReleased = true;
      void frames.load('dawn');
      window.removeEventListener('scroll', rest);
    };
    window.addEventListener('scroll', rest, { passive: true });
    const idle = window.setTimeout(rest, 6000);
    // The opening is the fonts and the sunrise frames. Its progress goes to the loading screen (Daybreak); while that
    // covers the page, the sunrise waits for it to open and starts as it lifts, so the sun comes up in view.
    let tween: gsap.core.Tween | undefined;
    let gone = false;
    let fetched = 0;
    let waitForDaybreak = () => {};
    const report = () => {
      if (!gone) filmStore.set({ opening: (++fetched / INTRO_FRAMES) * 0.95 });
    };
    const sunrise = (delay: number) => {
      tween = gsap.to(intro, {
        v: 1,
        delay,
        duration: 2.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (active === 'dawn') filmStore.set({ progress: effective(), arrived: arrivedNow() });
          schedule();
        },
      });
    };
    Promise.all([frames.loadRange('dawn', 0, INTRO_FRAMES, report), document.fonts?.ready]).then(() => {
      if (gone) return;
      filmStore.set({ opening: 1 });
      if (intro.v >= 1) return;
      if (!document.documentElement.classList.contains('before-dawn')) return sunrise(0);
      waitForDaybreak = filmStore.subscribe((s) => {
        if (s.daybreak && !tween) sunrise(DAYBREAK_LIFT);
      });
    });
    schedule();

    return () => {
      gone = true;
      waitForDaybreak();
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      window.clearTimeout(settleTimer);
      window.removeEventListener('scroll', rest);
      tween?.kill();
      triggers.forEach((t) => t.kill());
      window.removeEventListener('scroll', checkStage);
      ScrollTrigger.removeEventListener('refresh', measure);
      window.removeEventListener('resize', resize);
      frames.dispose();
    };
  }, []);

  // The settle: when scrolling comes to rest inside a product's hold, or just short of it, glide to its middle. It
  // never pulls a visitor back once they have scrolled on past a product, and it stays out of the way while a
  // product panel is open.
  useEffect(() => {
    if (!lenis || document.documentElement.classList.contains('still')) return;
    let timer = 0;
    let gliding = false;
    const onScroll = () => {
      window.clearTimeout(timer);
      if (gliding) return;
      timer = window.setTimeout(() => {
        if (lenis.isStopped) return;
        const y = lenis.scroll;
        const lead = window.innerHeight * 0.55;
        const hold = holds.current.find((h) => y >= h.start - lead && y <= h.end - window.innerHeight * 0.05);
        if (!hold || Math.abs(hold.centre - y) < 4) return;
        gliding = true;
        lenis.scrollTo(hold.centre, {
          duration: 0.7,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          onComplete: () => {
            gliding = false;
          },
        });
      }, 180);
    };
    lenis.on('scroll', onScroll);
    return () => {
      window.clearTimeout(timer);
      lenis.off('scroll', onScroll);
    };
  }, [lenis]);

  return (
    <div ref={root} id="top" className="film">
      <div className="film__stage" aria-hidden="true">
        <picture>
          <source media="(orientation: portrait)" srcSet={framePath('dawn', 'm', 0)} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="film__first" src={framePath('dawn', 'd', 0)} alt="" fetchPriority="high" />
        </picture>
        <canvas ref={canvas} className="film__canvas" />
      </div>
      <div className="film__chapters">{children}</div>
    </div>
  );
}
