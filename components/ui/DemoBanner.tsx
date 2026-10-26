'use client';

import { useState } from 'react';
import { X } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { useLoyaltyStore } from '@/lib/loyaltyStore';
import { useHydrated } from '@/lib/hooks';

export function DemoBanner() {
  const t = useTranslations('common');
  const hydrated = useHydrated();
  const authed = useLoyaltyStore((s) => s.isAuthenticated);
  const [dismissed, setDismissed] = useState(false);

  if (!hydrated || !authed || dismissed) return null;

  return (
    <div role="status" className="pointer-events-none fixed inset-x-0 top-[calc(var(--header-h)+8px)] z-[45] flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-sun-400/30 bg-night-850/90 py-1.5 pl-4 pr-1.5 text-[0.8125rem] text-bone shadow-lg backdrop-blur-md">
        <span className="size-1.5 rounded-full bg-sun-400" aria-hidden="true" />
        <span>{t('demoBanner')}</span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={t('dismiss')}
          className="grid size-7 place-items-center rounded-full text-mist transition-colors hover:bg-white/10 hover:text-bone"
        >
          <X size={14} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
