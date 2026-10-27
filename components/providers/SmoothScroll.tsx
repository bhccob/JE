'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { ReactLenis, useLenis, type LenisRef } from 'lenis/react';
import { useReducedMotion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis drives the real window scroll, so Motion's useScroll, IntersectionObserver and ScrollTrigger all keep working.
 * One clock: GSAP's ticker advances Lenis, and every Lenis scroll tells ScrollTrigger to update, so pinned
 * GSAP sequences and Motion-driven sections never drift apart.
 * lerp ~0.09 gives the weighted, buttery wheel feel; touch keeps native momentum.
 * Reduced-motion visitors get plain native scrolling.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const tick = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.09, wheelMultiplier: 0.95, smoothWheel: !reduced, anchors: { offset: -80 } }}
    >
      <ScrollTriggerSync />
      {process.env.NODE_ENV === 'development' && <DevHandle />}
      {children}
    </ReactLenis>
  );
}

function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}

// Dev only: lets tooling drive Lenis (window.scrollTo gets overridden by Lenis' own position).
function DevHandle() {
  const lenis = useLenis();
  useEffect(() => {
    (window as unknown as { __lenis?: unknown }).__lenis = lenis;
  }, [lenis]);
  return null;
}
