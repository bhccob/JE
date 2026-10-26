'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { nextTier, tierById, type TierId } from '@/lib/loyalty';
import { useReducedMotion } from '@/lib/hooks';

export function TierProgress({ tier, points }: { tier: TierId; points: number }) {
  const t = useTranslations('account');
  const reduced = useReducedMotion();
  const next = nextTier(tier);
  const current = tierById(tier);
  const pct = next ? Math.min(100, (points / next.points) * 100) : 100;
  const [width, setWidth] = useState(reduced ? pct : 0);

  useEffect(() => {
    if (reduced) {
      setWidth(pct);
      return;
    }
    const raf = requestAnimationFrame(() => setWidth(pct));
    return () => cancelAnimationFrame(raf);
  }, [pct, reduced]);

  const label = next
    ? t('progress', { current: points.toLocaleString('en-US'), target: next.points.toLocaleString('en-US'), tier: next.name })
    : t('topTier');

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p id="tier-progress-label" className="num text-[0.9375rem] text-bone">
          {label}
        </p>
        {next && <p className="hidden text-[0.8125rem] text-mist sm:block">{t('nextPerk')}: {next.perk}</p>}
      </div>
      <div
        role="progressbar"
        aria-labelledby="tier-progress-label"
        aria-valuemin={0}
        aria-valuemax={next?.points ?? current.points}
        aria-valuenow={points}
        className="relative mt-3 h-2.5 rounded-full bg-white/[0.08]"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(90deg, #d97e05, #f5a623 70%, #ffd38a)',
            boxShadow: '0 0 18px -2px rgb(245 166 35 / 0.6)',
            transition: reduced ? 'none' : 'width 800ms cubic-bezier(.22,1,.36,1)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -top-1 h-[18px] w-[2px] -translate-x-1/2 rounded-full bg-bone"
          style={{ left: `${width}%`, transition: reduced ? 'none' : 'left 800ms cubic-bezier(.22,1,.36,1)' }}
        />
      </div>
    </div>
  );
}
