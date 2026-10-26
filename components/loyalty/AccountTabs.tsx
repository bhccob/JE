'use client';

import { useRef, type KeyboardEvent } from 'react';
import { ClockCounterClockwise, Gift, SquaresFour, UserCircle } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { clsx } from '@/lib/clsx';

export const ACCOUNT_TABS = ['overview', 'rewards', 'history', 'profile'] as const;
export type AccountTab = (typeof ACCOUNT_TABS)[number];

const ICONS = { overview: SquaresFour, rewards: Gift, history: ClockCounterClockwise, profile: UserCircle };

/** WAI-ARIA tablist: roving tabindex, arrow keys in both axes (vertical on desktop, horizontal on mobile), Home/End. */
export function AccountTabs({ value, onChange }: { value: AccountTab; onChange: (t: AccountTab) => void }) {
  const t = useTranslations('account');
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, k: number) => {
    const n = ACCOUNT_TABS.length;
    const map: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | null = null;
    if (e.key in map) next = (k + map[e.key] + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault();
    refs.current[next]?.focus();
    onChange(ACCOUNT_TABS[next]);
  };

  return (
    <div role="tablist" aria-label={t('tabsLabel')} aria-orientation="vertical" className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
      {ACCOUNT_TABS.map((tab, k) => {
        const Icon = ICONS[tab];
        const selected = value === tab;
        return (
          <button
            key={tab}
            ref={(el) => {
              refs.current[k] = el;
            }}
            id={`tab-${tab}`}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={`panel-${tab}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab)}
            onKeyDown={(e) => onKey(e, k)}
            className={clsx(
              'flex h-11 shrink-0 items-center gap-3 rounded-full px-4 text-[0.9375rem] transition-colors duration-300 ease-[var(--ease-out-expo)] lg:rounded-[12px]',
              selected ? 'bg-bone text-night-950' : 'text-mist hover:bg-white/[0.05] hover:text-bone',
            )}
          >
            <Icon size={18} weight={selected ? 'fill' : 'regular'} aria-hidden="true" />
            {t(`tabs.${tab}`)}
          </button>
        );
      })}
    </div>
  );
}
