'use client';

import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator } from '@/components/ui/Calculator';
import { SectionShell } from './SectionShell';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export function Impact() {
  const t = useTranslations('impact');
  return (
    <SectionShell id="impact" labelledBy="impact-title" className="bg-night-950 pb-28 pt-8 md:pb-36">
      <div className="page-x">
        <div className="max-w-[40rem]">
          <h2 id="impact-title" data-reveal style={i(0)} className="h-section">
            {t('headline')}
          </h2>
          <p data-reveal style={i(1)} className="lede mt-5">
            {t('body')}
          </p>
        </div>
        <div data-reveal style={i(2)} className="mt-12">
          <Calculator />
        </div>
      </div>
    </SectionShell>
  );
}
