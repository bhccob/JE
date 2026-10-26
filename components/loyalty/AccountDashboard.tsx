'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PencilSimple, SignOut } from '@phosphor-icons/react/dist/ssr';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useHydrated } from '@/lib/hooks';
import { useLoyaltyStore } from '@/lib/loyaltyStore';
import { initials, MOCK_ACTIVITY, REWARDS, tierById, type ActivityRow } from '@/lib/loyalty';
import { clsx } from '@/lib/clsx';
import { AccountTabs, type AccountTab } from './AccountTabs';
import { ActivityTable } from './ActivityTable';
import { MemberCard } from './MemberCard';
import { ProfileModal } from './ProfileModal';
import { ReferralWidget } from './ReferralWidget';
import { RewardsGrid } from './RewardsGrid';
import { TierBadge } from './TierBadge';
import { TierProgress } from './TierProgress';

type Filter = 'all' | 'earned' | 'redeemed' | 'referrals';
const FILTERS: Filter[] = ['all', 'earned', 'redeemed', 'referrals'];

function applyFilter(rows: ActivityRow[], f: Filter) {
  if (f === 'earned') return rows.filter((r) => r.points > 0 && !r.description.startsWith('Referral'));
  if (f === 'redeemed') return rows.filter((r) => r.points < 0);
  if (f === 'referrals') return rows.filter((r) => r.description.startsWith('Referral'));
  return rows;
}

/**
 * Client-side guard: nothing renders until the persisted store has hydrated, and a signed-out
 * visitor is replaced to /account/login before any dashboard markup exists. No middleware.
 */
export function AccountDashboard() {
  const t = useTranslations('account');
  const locale = useLocale();
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useLoyaltyStore((s) => s.user);
  const authed = useLoyaltyStore((s) => s.isAuthenticated);
  const signOut = useLoyaltyStore((s) => s.signOut);
  const [tab, setTab] = useState<AccountTab>('overview');
  const [sort, setSort] = useState<'low' | 'high'>('low');
  const [filter, setFilter] = useState<Filter>('all');
  const [editing, setEditing] = useState(false);
  const closeEditor = useCallback(() => setEditing(false), []);
  // Set on sign-out so the guard below doesn't race the redirect to /loyalty.
  const leaving = useRef(false);

  useEffect(() => {
    if (hydrated && !authed && !leaving.current) router.replace('/account/login');
  }, [hydrated, authed, router]);

  const sortedRewards = useMemo(() => [...REWARDS].sort((a, b) => (sort === 'low' ? a.points - b.points : b.points - a.points)), [sort]);

  if (!hydrated || !authed || !user) return <main id="main" aria-busy="true" className="min-h-dvh" />;

  const tier = tierById(user.tier);
  const memberSince = new Intl.DateTimeFormat(locale === 'pap' ? 'nl' : locale, { month: 'long', year: 'numeric' }).format(new Date(`${user.memberSince}T12:00:00`));

  const onSignOut = () => {
    leaving.current = true;
    signOut();
    router.push('/loyalty');
  };

  return (
    <main id="main" className="pb-24 pt-[calc(var(--header-h)+40px)]">
      <div className="mx-auto grid max-w-[1320px] gap-8 px-4 md:px-8 lg:grid-cols-[232px_minmax(0,1fr)_300px] lg:gap-10">
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+40px)] lg:h-[calc(100dvh-var(--header-h)-80px)]">
          <div className="flex h-full flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-sun-400/40 bg-sun-400/10 font-mono text-sm text-sun-300">
                {initials(user.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-bone">{user.name}</p>
                <TierBadge tier={user.tier} size="sm" label className="text-sun-300" />
              </div>
            </div>
            <AccountTabs value={tab} onChange={setTab} />
            <button type="button" onClick={onSignOut} className="mt-auto hidden items-center gap-2 self-start rounded-full px-4 py-2 text-[0.9375rem] text-mist transition-colors hover:text-bone lg:flex">
              <SignOut size={18} aria-hidden="true" />
              {t('signOut')}
            </button>
          </div>
        </aside>

        <section id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} className="min-w-0 outline-none">
          {tab === 'overview' && (
            <div className="flex flex-col gap-10">
              <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.03em] text-bone">
                {t('welcome', { name: user.name.split(' ')[0] })}
              </h1>
              <MemberCard tier={user.tier} name={user.name} memberId={user.memberId} points={user.points} pointsLabel={t('points')} />
              <TierProgress tier={user.tier} points={user.points} />
              <div>
                <h2 className="mb-4 text-[1.0625rem] font-medium text-bone">{t('rewardsTitle')}</h2>
                <RewardsGrid rewards={REWARDS.slice(0, 4)} balance={user.points} />
              </div>
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[1.0625rem] font-medium text-bone">{t('activityTitle')}</h2>
                  <button type="button" onClick={() => setTab('history')} className="btn-link text-[0.875rem]">
                    {t('viewHistory')}
                  </button>
                </div>
                <ActivityTable rows={MOCK_ACTIVITY.slice(0, 5)} caption={t('activityTitle')} />
              </div>
            </div>
          )}

          {tab === 'rewards' && (
            <div>
              <h1 className="font-display text-[2rem] font-semibold tracking-[-0.03em] text-bone">{t('rewardsTitle')}</h1>
              <div role="group" aria-label={t('sortBy')} className="mt-6 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[0.875rem] text-mist">{t('sortBy')}</span>
                {(['low', 'high'] as const).map((s) => (
                  <button key={s} type="button" aria-pressed={sort === s} onClick={() => setSort(s)} className="chip">
                    {s === 'low' ? t('sortLow') : t('sortHigh')}
                  </button>
                ))}
              </div>
              <RewardsGrid rewards={sortedRewards} balance={user.points} mode="disabled" className="mt-6" />
            </div>
          )}

          {tab === 'history' && (
            <div>
              <h1 className="font-display text-[2rem] font-semibold tracking-[-0.03em] text-bone">{t('historyTitle')}</h1>
              <div role="group" aria-label={t('filterLabel')} className="mt-6 flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className="chip">
                    {t(`filters.${f}`)}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <ActivityTable rows={applyFilter(MOCK_ACTIVITY, filter)} caption={t('historyTitle')} />
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div>
              <div className="flex items-center justify-between gap-4">
                <h1 className="font-display text-[2rem] font-semibold tracking-[-0.03em] text-bone">{t('profileTitle')}</h1>
                <button type="button" onClick={() => setEditing(true)} className="btn btn-ghost btn-sm">
                  <PencilSimple size={16} aria-hidden="true" />
                  {t('edit')}
                </button>
              </div>
              <dl className="surface mt-6 divide-y divide-white/[0.06]">
                {[
                  [t('name'), user.name],
                  [t('email'), user.email],
                  [t('memberSince'), memberSince],
                  [t('memberId'), user.memberId],
                  [t('tier'), tier.name],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr]">
                    <dt className="text-[0.875rem] text-mist">{k}</dt>
                    <dd className={clsx('text-bone', k === t('memberId') && 'num', k === t('tier') && 'font-serif text-[1.0625rem]')}>{v}</dd>
                  </div>
                ))}
              </dl>
              <ProfileModal open={editing} onClose={closeEditor} />
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h)+40px)] lg:self-start">
          <ReferralWidget code={user.referralCode} />
          <button type="button" onClick={onSignOut} className="btn btn-ghost lg:hidden">
            <SignOut size={18} aria-hidden="true" />
            {t('signOut')}
          </button>
        </aside>
      </div>
    </main>
  );
}
