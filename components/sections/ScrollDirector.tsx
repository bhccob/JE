'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SECTION_IDS } from '@/lib/cameraKeyframes';
import { useScrollStore, type SectionRange } from '@/lib/scrollStore';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The single page-level ScrollTrigger. It scrubs a proxy from 0 to 1 (scrub: 1 gives the
 * one-second catch-up smoothing), writes that into the scroll store, and re-measures every
 * [data-section] on refresh. Camera, lighting, particle and DOM sync all read from the store.
 */
export function ScrollDirector() {
  const velocity = useRef(0);

  useGSAP(() => {
    const store = useScrollStore.getState();
    const main = document.getElementById('main');
    if (!main) return;

    const measure = () => {
      const max = Math.max(1, ScrollTrigger.maxScroll(window));
      const vh = window.innerHeight;
      const ranges: SectionRange[] = [];
      let prevHoldEnd = 0;
      for (const id of SECTION_IDS) {
        const el = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const holdStart = Math.min(top, max);
        const holdEnd = Math.min(Math.max(top, top + el.offsetHeight - vh), max);
        ranges.push({ id, spanStart: prevHoldEnd / max, holdStart: holdStart / max, holdEnd: holdEnd / max });
        prevHoldEnd = holdEnd;
      }
      store.setRanges(ranges);
    };

    const proxy = { p: 0 };
    gsap.to(proxy, {
      p: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: main,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
        onRefresh: measure,
        onUpdate: (self) => {
          velocity.current = self.getVelocity();
        },
      },
      onUpdate: () => useScrollStore.getState().setProgress(proxy.p, velocity.current),
    });

    for (const id of SECTION_IDS) {
      const el = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
      if (!el) continue;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && useScrollStore.getState().setActiveSection(id),
      });
    }

    measure();
    // Fonts and lazy content shift layout after first paint.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    if (process.env.NODE_ENV === 'development') {
      // Lets tooling step frames when the tab is backgrounded and rAF is paused.
      (window as unknown as { __gsap?: typeof gsap; __ST?: typeof ScrollTrigger }).__gsap = gsap;
      (window as unknown as { __ST?: typeof ScrollTrigger }).__ST = ScrollTrigger;
      (window as unknown as { __scroll?: typeof useScrollStore }).__scroll = useScrollStore;
    }
  });

  return null;
}
