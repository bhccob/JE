'use client';

import type { CSSProperties } from 'react';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { REWARDS } from '@/lib/loyalty';
import { SectionShell } from '@/components/sections/SectionShell';
import { LoyaltyHowItWorks } from './LoyaltyHowItWorks';
import { RewardCard } from './RewardCard';
import { TierFan } from './TierFan';

const i = (n: number) => ({ '--i': n }) as CSSProperties;
const PREVIEW = ['led50', 'clean', 'inspect'];

/** The Circle on the main journey. DOM only: no canvas, no 3D imports. */
export function LoyaltyHero() {
  const t = useTranslations('loyalty');

  const stats = [
    { value: t('statEarnValue'), label: t('statEarnLabel') },
    { value: t('statReferralValue'), label: t('statReferralLabel') },
    { value: t('statSaveValue'), label: t('statSaveLabel') },
  ];

  return (
    <SectionShell id="loyalty" labelledBy="loyalty-title" className="overflow-hidden bg-night-950 py-28 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 78% 30%, rgb(245 166 35 / 0.09), transparent 70%), radial-gradient(50% 40% at 10% 90%, rgb(99 215 155 / 0.06), transparent 70%)' }}
      />
      <div className="page-x relative">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 id="loyalty-title" data-reveal style={i(0)} className="h-section max-w-[14ch]">
              {t('headline')}
            </h2>
            <p data-reveal style={i(1)} className="mt-6 font-serif text-[1.375rem] leading-snug tracking-tight text-sun-300">
              {t('subhead')}
            </p>
            <div className="mt-12">
              <LoyaltyHowItWorks revealFrom={2} />
            </div>
          </div>
          <div data-reveal style={i(2)} className="flex items-center lg:col-span-7">
            <TierFan label={t('tiersLabel')} className="w-full" />
          </div>
        </div>

        <dl data-reveal style={i(3)} className="mt-20 grid gap-px overflow-hidden rounded-[20px] border border-white/10 bg-white/10 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-3 bg-night-900 px-6 py-5">
              <dt className="sr-only">{s.label}</dt>
              <dd className="flex items-baseline gap-3">
                <span className="num text-[1.75rem] text-bone">{s.value}</span>
                <span className="text-[0.9375rem] text-mist">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14">
          <h3 data-reveal style={i(4)} className="text-[0.9375rem] font-medium text-mist">
            {t('rewardsTitle')}
          </h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {PREVIEW.map((id, k) => {
              const reward = REWARDS.find((r) => r.id === id)!;
              return (
                <div key={id} data-reveal style={i(5 + k)}>
                  <RewardCard reward={reward} mode="preview" className="h-full" />
                </div>
              );
            })}
          </div>
          <div data-reveal style={i(8)} className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/account/register" className="btn btn-primary">
              {t('join')}
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
            <Link href="/account/login" className="btn btn-ghost">
              {t('login')}
            </Link>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
