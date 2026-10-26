import type { CSSProperties } from 'react';
import { Coins, TrendUp, UserPlus, UsersThree } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';

const STEPS = [
  { key: 'join', icon: UserPlus },
  { key: 'earn', icon: Coins },
  { key: 'refer', icon: UsersThree },
  { key: 'climb', icon: TrendUp },
] as const;

export function LoyaltyHowItWorks({ revealFrom = 0 }: { revealFrom?: number }) {
  const t = useTranslations('loyalty');
  return (
    <div>
      <h3 className="sr-only">{t('howTitle')}</h3>
      <ol className="relative flex flex-col gap-6 before:absolute before:bottom-5 before:left-[19px] before:top-5 before:w-px before:bg-gradient-to-b before:from-sun-400/50 before:via-white/10 before:to-transparent">
        {STEPS.map(({ key, icon: Icon }, k) => (
          <li key={key} data-reveal style={{ '--i': revealFrom + k } as CSSProperties} className="relative flex gap-4">
            <span className="relative grid size-10 shrink-0 place-items-center rounded-full border border-white/12 bg-night-850 text-sun-300">
              <Icon size={18} aria-hidden="true" />
            </span>
            <div className="pt-1.5">
              <p className="font-medium text-bone">{t(`steps.${key}.title`)}</p>
              <p className="mt-1 text-[0.9375rem] text-mist">{t(`steps.${key}.body`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
