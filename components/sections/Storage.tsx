'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { DeviceMobile, SealCheck, ShieldCheck, Wind } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { sectionProgress, useScrollStore } from '@/lib/scrollStore';
import { clsx } from '@/lib/clsx';
import { SectionShell } from './SectionShell';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export function Storage() {
  const t = useTranslations('storage');
  const pct = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [inverterOn, setInverterOn] = useState(false);

  // Mirrors the battery LED strip: both follow storage section progress from the store.
  useEffect(
    () =>
      useScrollStore.subscribe((s) => {
        const p = sectionProgress(s.ranges, 'storage', s.progress);
        if (pct.current) pct.current.textContent = `${Math.round(p * 100)}%`;
        if (bar.current) bar.current.style.transform = `scaleX(${p})`;
        setInverterOn(p >= 0.9);
      }),
    [],
  );

  const trust = [
    { icon: SealCheck, label: t('trustCertified') },
    { icon: ShieldCheck, label: t('trustWarranty') },
    { icon: DeviceMobile, label: t('trustApp') },
  ];

  return (
    <SectionShell id="storage" labelledBy="storage-title" className="h-[230vh]">
      <div className="sticky top-0 flex h-screen items-end pb-10 md:items-center md:pb-0">
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{ background: 'linear-gradient(270deg, rgb(5 12 8 / 0.85) 0%, rgb(5 12 8 / 0.45) 40%, transparent 62%)' }}
        />
        <div aria-hidden="true" className="scrim-bottom absolute inset-x-0 bottom-0 h-[62%] md:hidden" />
        <div className="page-x relative flex md:justify-end">
          <div className="pointer-events-auto max-w-[29rem]">
            <div data-reveal style={i(0)} className="mb-6 inline-flex items-center gap-3 rounded-full border border-leaf-400/30 bg-leaf-400/[0.07] py-1.5 pl-2 pr-4">
              <span className="grid size-7 place-items-center rounded-full bg-leaf-400 text-night-950">
                <Wind size={16} weight="bold" aria-hidden="true" />
              </span>
              <span className="text-[0.875rem] font-medium text-leaf-200">{t('badge')}</span>
              <span className="hidden text-[0.8125rem] text-mist lg:inline">{t('badgeDetail')}</span>
            </div>
            <h2 id="storage-title" data-reveal style={i(1)} className="h-section">
              {t('headline')}
            </h2>
            <p data-reveal style={i(2)} className="lede mt-5">
              {t('body')}
            </p>

            <div data-reveal style={i(3)} className="mt-8 flex items-center gap-4">
              <span className="text-[0.8125rem] text-mist">{t('charge')}</span>
              <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <span ref={bar} className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-leaf-600 to-leaf-300" style={{ transform: 'scaleX(0)' }} />
              </span>
              <span ref={pct} className="num w-12 text-right text-[0.9375rem] text-bone">
                0%
              </span>
            </div>
            <p data-reveal style={i(3)} className="mt-3 flex items-center gap-2 text-[0.8125rem]" role="status">
              <span className={clsx('size-1.5 rounded-full transition-colors duration-500', inverterOn ? 'bg-leaf-400' : 'bg-white/25')} aria-hidden="true" />
              <span className={inverterOn ? 'text-leaf-300' : 'text-moss'}>{inverterOn ? t('inverterOn') : t('inverterIdle')}</span>
            </p>

            <ul data-reveal style={i(4)} className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6">
              {trust.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-[0.9375rem] text-bone">
                  <Icon size={20} className="text-leaf-300" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
