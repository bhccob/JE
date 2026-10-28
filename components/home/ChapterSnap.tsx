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
 * is why it is not Lenis Snap, whose timer can fire mid-momentum on phones), only after the visitor's own wheel or
 * touch (never after links, the keyboard or the scrollbar), only on the chapters, and not at all with reduced motion.
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

    const settle = () => {
      if (!byHand || reduce.matches) return;
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

    // The visitor's own wheel or touch; it also takes over from a settle that is still moving.
    const onInput = () => {
      byHand = true;
      settling = false;
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      if (!settling) timer = window.setTimeout(settle, REST_MS);
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
