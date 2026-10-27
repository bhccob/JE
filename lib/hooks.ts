'use client';

import { useMemo, useSyncExternalStore } from 'react';

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', cb);
    return () => mql.removeEventListener('change', cb);
  };
}

export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useMemo(() => subscribeMedia(query), [query]);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useIsMobile = () => useMediaQuery('(max-width: 767px)');

/**
 * Reduced motion, safe for markup: false on the server and through hydration, then the visitor's real setting.
 * (Motion's useReducedMotion reads the setting on the first client render, which mismatches server HTML.)
 */
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
