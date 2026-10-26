'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import type { Reward } from '@/lib/loyalty';
import { clsx } from '@/lib/clsx';

interface Props {
  reward: Reward;
  /** Member balance, when shown inside the dashboard. */
  balance?: number;
  mode?: 'preview' | 'toast' | 'disabled';
  className?: string;
}

export function RewardCard({ reward, balance, mode = 'toast', className }: Props) {
  const t = useTranslations('account');
  const tl = useTranslations('loyalty');
  const affordable = balance !== undefined && balance >= reward.points;
  const tipId = `tip-${reward.id}`;

  return (
    <article className={clsx('surface group relative flex flex-col p-5', className)}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[1.0625rem] font-medium leading-snug text-bone">{reward.title}</h3>
        <span className="num shrink-0 rounded-full border border-sun-400/30 bg-sun-400/10 px-2.5 py-1 text-[0.8125rem] text-sun-300">
          {tl('points', { points: reward.points.toLocaleString('en-US') })}
        </span>
      </div>
      <p className="mt-2 text-[0.9375rem] text-mist">{reward.description}</p>
      {mode !== 'preview' && (
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          {balance !== undefined && (
            <span className={clsx('text-[0.8125rem]', affordable ? 'text-leaf-300' : 'text-moss')}>
              {affordable ? t('affordable') : t('needMore', { points: (reward.points - balance).toLocaleString('en-US') })}
            </span>
          )}
          {mode === 'toast' ? (
            <button type="button" onClick={() => toast(t('redeemToast'))} className="btn btn-ghost btn-sm ml-auto">
              {t('redeem')}
            </button>
          ) : (
            <span className="relative ml-auto">
              {/* aria-disabled (not disabled) keeps it focusable so keyboard users still reach the tooltip */}
              <button type="button" aria-disabled="true" aria-describedby={tipId} onClick={(e) => e.preventDefault()} className="btn btn-ghost btn-sm">
                {t('redeem')}
              </button>
              <span
                id={tipId}
                role="tooltip"
                className="pointer-events-none absolute bottom-[calc(100%+8px)] right-0 whitespace-nowrap rounded-lg border border-white/10 bg-night-800 px-3 py-1.5 text-[0.75rem] text-bone opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
              >
                {t('redeemSoon')}
              </span>
            </span>
          )}
        </div>
      )}
    </article>
  );
}
