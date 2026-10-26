'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { localeLabels, locales, type Locale } from '@/i18n/routing';
import { clsx } from '@/lib/clsx';

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div
      role="group"
      aria-label={t('language')}
      className={clsx('flex h-9 items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5', pending && 'opacity-70', className)}
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={l === locale}
          aria-label={localeLabels[l].name}
          onClick={() => startTransition(() => router.replace(pathname, { locale: l, scroll: false }))}
          className={clsx(
            'h-8 min-w-10 rounded-full px-2.5 font-mono text-[0.75rem] tracking-wide transition-colors duration-300 ease-[var(--ease-out-expo)]',
            l === locale ? 'bg-bone text-night-950' : 'text-mist hover:text-bone',
          )}
        >
          {localeLabels[l].short}
        </button>
      ))}
    </div>
  );
}
