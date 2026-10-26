'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { BUSINESS } from '@/lib/site';
import { QuoteForm } from '@/components/ui/QuoteForm';
import { Wordmark } from '@/components/ui/Logo';
import { SectionShell } from './SectionShell';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  return (
    <SectionShell id="footer" labelledBy="footer-title" className="border-t border-white/[0.06] bg-night-900">
      <div className="page-x grid gap-14 py-24 md:py-32 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="footer-title" data-reveal style={i(0)} className="h-section max-w-[12ch]">
            {t('headline')}
          </h2>
          <p data-reveal style={i(1)} className="lede mt-5">
            {t('body')}
          </p>
          <div data-reveal style={i(2)} className="relative mt-10 hidden aspect-[16/9] overflow-hidden rounded-[20px] lg:block">
            <Image src="/media/store.webp" alt={t('address')} fill sizes="40vw" className="object-cover" />
          </div>
          <dl data-reveal style={i(3)} className="mt-8 grid grid-cols-2 gap-6 text-[0.9375rem]">
            <div>
              <dt className="text-moss">{t('visit')}</dt>
              <dd className="mt-1.5 text-bone">{t('address')}</dd>
            </div>
            <div>
              <dt className="text-moss">{t('talk')}</dt>
              <dd className="mt-1.5 flex flex-col gap-1">
                <a href={BUSINESS.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-link">
                  {t('whatsapp')}
                </a>
                <a href={`mailto:${BUSINESS.email}`} className="btn-link">
                  {t('email')}
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <div data-reveal style={i(2)} className="lg:col-span-6 lg:col-start-7">
          <div className="surface-solid p-6 md:p-8">
            <QuoteForm idPrefix="footer" />
          </div>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="page-x flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <Wordmark />
          <nav aria-label={t('explore')} className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
            <Link href="/store" className="text-mist transition-colors hover:text-bone">
              {nav('store')}
            </Link>
            <Link href="/loyalty" className="text-mist transition-colors hover:text-bone">
              {nav('circle')}
            </Link>
            <Link href="/quote" className="text-mist transition-colors hover:text-bone">
              {nav('quote')}
            </Link>
          </nav>
          <p className="text-[0.8125rem] text-moss">{t('rights', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </SectionShell>
  );
}
