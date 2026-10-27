'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { introDone } from './intro';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The hero's entrance, after the loader hands over: JONTAI rises letter by letter, then the meta line, the headline
 * word by word, the copy and the list. Leaving the hero, the letters slip back up into their line, each at its own
 * speed. CSS holds the starting states (only with scripts and without reduced motion), so nothing flashes first.
 */
export function HeroMotion() {
  useGSAP(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const letters = hero.querySelectorAll('.wordmark .ci');
      const words = hero.querySelectorAll('h1 .wi');
      const meta = hero.querySelectorAll('.hero__meta [data-hero]');
      const copy = hero.querySelectorAll('.hero__copy [data-hero]');
      const list = hero.querySelectorAll('.index [data-hero]');
      // y: 0 because GSAP reads the CSS starting offset as pixels and would keep it under yPercent.
      gsap.set(letters, { y: 0, yPercent: 110 });
      gsap.set(words, { y: 0, yPercent: 115 });

      let live = true;
      let entrance: gsap.core.Timeline | undefined;
      introDone.then(() => {
        if (!live) return;
        entrance = gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .to(letters, { yPercent: 0, duration: 1.25, stagger: 0.055 }, 0)
          .to(meta, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.15)
          .to(words, { yPercent: 0, duration: 1.05, stagger: 0.045 }, 0.3)
          .to(copy, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.55)
          .to(list, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05 }, 0.45);
      });

      gsap.to(hero.querySelectorAll('.wordmark .c'), {
        yPercent: (i: number) => -38 - i * 13,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });

      return () => {
        live = false;
        entrance?.kill();
      };
    });
  });

  return null;
}
