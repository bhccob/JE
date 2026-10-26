'use client';

import { useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from '@/lib/hooks';
import { SectionShell } from './SectionShell';
import { ArubaMap } from './ArubaMap';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export function Source() {
  const t = useTranslations('source');
  const reduced = useReducedMotion();
  const scope = useRef<HTMLDivElement>(null);

  // One scrubbed timeline: the coastline draws itself, the island fills, the rays reach across it.
  useGSAP(
    () => {
      if (reduced) {
        gsap.set('.aruba-line', { strokeDashoffset: 0 });
        return;
      }
      gsap
        .timeline({ scrollTrigger: { trigger: scope.current, start: 'top 85%', end: 'center 45%', scrub: 1 } })
        .fromTo('.aruba-line', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
        .fromTo('.aruba-fill', { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.4 }, 0.6)
        .fromTo('.aruba-rays', { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none', duration: 0.8 }, 0.15)
        .fromTo('.aruba-city', { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.2 }, 0.8);
    },
    { scope, dependencies: [reduced] },
  );

  const stats = [
    { value: t('irradianceValue'), unit: t('irradianceUnit'), label: t('irradianceLabel') },
    { value: t('paybackValue'), unit: t('paybackUnit'), label: t('paybackLabel') },
    { value: t('targetValue'), unit: t('targetUnit'), label: t('targetLabel') },
  ];

  return (
    <SectionShell id="source" labelledBy="source-title" className="min-h-[135vh] py-[16vh]">
      <div ref={scope} className="page-x grid items-center gap-y-14 md:grid-cols-12 md:gap-x-10">
        <div className="pointer-events-auto md:col-span-6 lg:col-span-5">
          <h2 id="source-title" data-reveal style={i(0)} className="h-section">
            {t('headline')}
          </h2>
          <p data-reveal style={i(1)} className="lede mt-6">
            {t('body')}
          </p>
          <dl data-reveal style={i(2)} className="mt-10 flex flex-wrap gap-2.5">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-2 rounded-full border border-white/12 bg-night-950/50 py-2 pl-4 pr-5 backdrop-blur-md">
                <dt className="sr-only">{s.label}</dt>
                <dd className="flex items-baseline gap-2">
                  <span className="num text-[1.0625rem] font-medium text-bone">{s.value}</span>
                  <span className="text-[0.8125rem] text-mist">{s.unit}</span>
                  <span aria-hidden="true" className="ml-1 hidden text-[0.8125rem] text-moss sm:inline">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div data-reveal style={i(1)} className="md:col-span-6 md:col-start-7">
          <div className="mx-auto w-full max-w-[400px] md:mr-0">
            <ArubaMap label={t('mapLabel')} />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
