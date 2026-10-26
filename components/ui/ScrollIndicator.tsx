'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useScrollStore } from '@/lib/scrollStore';

/** Thin vertical line that fills with page progress. Writes the transform directly; no re-renders. */
export function ScrollIndicator() {
  const t = useTranslations('hero');
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(
    () =>
      useScrollStore.subscribe((s) => {
        if (fill.current) fill.current.style.transform = `scaleY(${Math.max(0.04, Math.min(1, s.progress * 6))})`;
      }),
    [],
  );

  return (
    <div className="group pointer-events-auto absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-mist opacity-0 transition-opacity duration-300 ease-[var(--ease-out-expo)] group-hover:opacity-100">
        {t('scroll')}
      </span>
      <span className="relative block h-16 w-px overflow-hidden bg-white/15" aria-hidden="true">
        <span ref={fill} className="absolute inset-0 origin-top bg-leaf-300" style={{ transform: 'scaleY(0.04)' }} />
      </span>
    </div>
  );
}
