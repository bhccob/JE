'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';

/** No scroll for this long counts as the scroll having come to rest. */
const REST_MS = 180;

/**
 * Settles the page once a wheel or touch scroll comes to rest: `pick` gets the scroll position and the direction the
 * visitor last scrolled (1 down, -1 up), and returns where to settle, or null to stay. It acts only once the scroll has
 * stopped (so never against a fast scroll or touch
 * momentum, which is why it is not Lenis Snap, whose timer can fire mid-momentum on phones), never under a finger
 * still on the screen, only after the visitor's own wheel or touch scroll (not a tap, a link, the keyboard or the
 * scrollbar, nor input while a menu or panel holds the page still), and not at all with reduced motion.
 */
export function useSettle(pick: (y: number, dir: number) => number | null) {
  const lenis = useLenis();
  const latest = useRef(pick);

  useEffect(() => {
    latest.current = pick;
  });

  useEffect(() => {
    if (!lenis) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0;
    let byHand = false;
    let settling = false;
    let touching = false;
    let dir = 0;

    const settle = () => {
      // A finger still on the screen holds the page; lifting it checks again.
      if (!byHand || touching || reduce.matches) return;
      byHand = false;
      const y = lenis.scroll;
      const target = latest.current(y, dir);
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
      if (deltaY !== 0) dir = Math.sign(deltaY);
    };

    lenis.on('virtual-scroll', onInput);
    lenis.on('scroll', onScroll);
    return () => {
      window.clearTimeout(timer);
      lenis.off('virtual-scroll', onInput);
      lenis.off('scroll', onScroll);
    };
  }, [lenis]);
}
