'use client';

import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

/** No scroll for this long counts as the scroll having come to rest. */
const REST_MS = 180;
/** How near a chapter's start (a share of the screen height) the scroll must rest for the page to settle onto it. */
const NEAR = 0.22;

/**
 * Snap between products: when a wheel or touch scroll comes to rest near the start of a product chapter, the page
 * settles onto it. It acts only once the scroll has stopped (so never against a fast scroll or touch momentum, which
 * is why it is not Lenis Snap, whose timer can fire mid-momentum on phones), never under a finger still on the screen,
 * only after the visitor's own wheel or touch scroll (not a tap, a link, the keyboard or the scrollbar, nor input while
 * a menu or panel holds the page still), only on the chapters, and not at all with reduced motion.
 */
export function ChapterSnap({ ids }: { ids: string[] }) {
  const lenis = useLenis();
  const key = ids.join(' ');

  useEffect(() => {
    if (!lenis) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const chapters = key.split(' ');
    let timer = 0;
    let byHand = false;
    let settling = false;
    let touching = false;

    const settle = () => {
      // A finger still on the screen holds the page; lifting it checks again.
      if (!byHand || touching || reduce.matches) return;
      byHand = false;
      const y = lenis.scroll;
      const near = window.innerHeight * NEAR;
      let target: number | null = null;
      for (const id of chapters) {
        const el = document.getElementById(id);
        if (!el) continue;
        const start = el.getBoundingClientRect().top + y;
        if (Math.abs(start - y) <= near && (target === null || Math.abs(start - y) < Math.abs(target - y))) target = start;
      }
      if (target === null || Math.abs(target - y) < 2) return;
      settling = true;
      lenis.scrollTo(target, { duration: 1, onComplete: () => (settling = false) });
    };

    const onScroll = () => {
      window.clearTimeout(timer);
      if (!settling) timer = window.setTimeout(settle, REST_MS);
    };
    // The visitor's own wheel or touch scroll; it also takes over from a settle that is still moving. Lenis reports
    // every touchstart (and a tap's touchend) with no movement, and input while it is stopped behind a menu or panel;
    // neither counts.
    const onInput = ({ deltaX, deltaY, event }: { deltaX: number; deltaY: number; event: Event }) => {
      if (event.type === 'touchstart' || event.type === 'touchmove') touching = true;
      if (event.type === 'touchend') {
        touching = false;
        onScroll();
      }
      if (lenis.isStopped || (deltaX === 0 && deltaY === 0)) return;
      byHand = true;
      settling = false;
    };

    lenis.on('virtual-scroll', onInput);
    lenis.on('scroll', onScroll);
    return () => {
      window.clearTimeout(timer);
      lenis.off('virtual-scroll', onInput);
      lenis.off('scroll', onScroll);
    };
  }, [lenis, key]);

  return null;
}
