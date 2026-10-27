'use client';

import { useEffect } from 'react';

/**
 * One observer for every [data-reveal] on the page: adds .is-in as each enters, once.
 * The CSS only hides them under html.js, so without scripts everything is already visible.
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }),
      { rootMargin: '0px 0px -12% 0px' },
    );
    const watch = () => document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    watch();
    // Sections that mount later (drawers, lazy scenes) still get observed.
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
