'use client';

import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { useScrollStore } from '@/lib/scrollStore';
import { KELVIN_MAX, KELVIN_MIN, kelvinToCss } from '@/lib/kelvin';
import { SectionShell } from './SectionShell';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export function Light() {
  const t = useTranslations('light');
  const kelvin = useScrollStore((s) => s.temperature);
  const setTemperature = useScrollStore((s) => s.setTemperature);
  const fill = ((kelvin - KELVIN_MIN) / (KELVIN_MAX - KELVIN_MIN)) * 100;

  return (
    <SectionShell id="light" labelledBy="light-title" className="h-[210vh]">
      <div className="sticky top-0 flex h-screen items-end pb-24 md:pb-16">
        <div aria-hidden="true" className="scrim-bottom absolute inset-x-0 bottom-0 h-[64%]" />
        <div className="page-x relative grid gap-8 md:grid-cols-12 md:items-end">
          <div className="pointer-events-auto md:col-span-6 lg:col-span-5">
            <h2 id="light-title" data-reveal style={i(0)} className="h-section">
              {t('headline')}
            </h2>
            <p data-reveal style={i(1)} className="lede mt-5">
              {t('body')}
            </p>
          </div>

          <div data-reveal style={i(2)} className="pointer-events-auto md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <div className="surface p-5 backdrop-blur-md md:p-6">
              <div className="flex items-end justify-between gap-4">
                <label htmlFor="kelvin" className="text-[0.9375rem] font-medium text-bone">
                  {t('slider')}
                </label>
                <output htmlFor="kelvin" aria-live="polite" className="num text-[2rem] leading-none" style={{ color: kelvinToCss(kelvin) }}>
                  {t('kelvin', { k: kelvin })}
                </output>
              </div>
              <input
                id="kelvin"
                type="range"
                min={KELVIN_MIN}
                max={KELVIN_MAX}
                step={100}
                value={kelvin}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="range range-kelvin mt-5"
                style={{ '--fill': `${fill}%` } as CSSProperties}
                aria-valuetext={t('kelvin', { k: kelvin })}
              />
              <div className="mt-2 flex justify-between text-[0.75rem] text-moss" aria-hidden="true">
                <span>{t('warm')}</span>
                <span>{t('neutral')}</span>
                <span>{t('daylight')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
