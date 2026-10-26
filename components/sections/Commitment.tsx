'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { clsx } from '@/lib/clsx';
import { SectionShell } from './SectionShell';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

// TODO: replace with photos of real Jontai installations (these are the existing site's brand images).
const GALLERY = [
  { src: '/media/rooftops.webp', w: 1600, h: 905, key: 'rooftop', span: true },
  { src: '/media/crew.webp', w: 1600, h: 1195, key: 'crew' },
  { src: '/media/service.webp', w: 1600, h: 1195, key: 'service' },
  { src: '/media/battery-wall.webp', w: 1000, h: 750, key: 'battery' },
] as const;

// TODO: confirm which certifications apply to the installed product range.
const CERTS = ['IEC 61215', 'IEC 61730', 'UL 1741', 'ISO 9001'];

export function Commitment() {
  const t = useTranslations('commitment');
  const testimonials = (['a', 'b'] as const).map((k) => ({
    quote: t(`testimonials.${k}.quote`),
    name: t(`testimonials.${k}.name`),
    district: t(`testimonials.${k}.district`),
  }));
  const captions: Record<(typeof GALLERY)[number]['key'], string> = {
    rooftop: t('gallery.rooftop'),
    crew: t('gallery.crew'),
    service: t('gallery.service'),
    battery: t('gallery.battery'),
  };

  return (
    <SectionShell id="commitment" labelledBy="commitment-title" className="bg-night-950 pb-28 md:pb-36">
      <div className="page-x">
        <div className="max-w-[38rem]">
          <h2 id="commitment-title" data-reveal style={i(0)} className="h-section">
            {t('headline')}
          </h2>
          <p data-reveal style={i(1)} className="lede mt-5">
            {t('body')}
          </p>
        </div>

        <ul className="mt-12 grid gap-3 md:grid-cols-3">
          {GALLERY.map((g, k) => (
            <li key={g.key} data-reveal style={i(2 + k)} className={clsx('group', 'span' in g && g.span && 'md:col-span-2')}>
              <figure>
                <div className={clsx('relative overflow-hidden rounded-[20px] bg-night-800', 'span' in g && g.span ? 'aspect-[16/9] md:aspect-auto md:h-[22rem]' : 'aspect-[4/3] md:aspect-auto md:h-[22rem]')}>
                  <Image
                    src={g.src}
                    alt={captions[g.key]}
                    fill
                    sizes="(min-width: 768px) 66vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                  />
                </div>
                <figcaption className="mt-2.5 text-[0.8125rem] text-mist">{captions[g.key]}</figcaption>
              </figure>
            </li>
          ))}
          {/* Cert card fills the last slot so the 3 x 2 grid has no empty cell. */}
          <li data-reveal style={i(6)} className="flex min-h-[14rem] flex-col justify-between rounded-[20px] border border-white/10 p-6 md:h-[22rem]">
            <p className="text-[0.9375rem] font-medium text-bone">{t('certTitle')}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {CERTS.map((c) => (
                <li key={c} className="num rounded-full border border-white/12 px-3 py-1.5 text-[0.8125rem] text-mist">
                  {c}
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <div className="mt-20 grid gap-10 md:grid-cols-2 md:gap-6">
          <h3 className="sr-only">{t('testimonialsTitle')}</h3>
          {testimonials.map((q, k) => (
            <figure key={q.name} data-reveal style={i(k)} className="border-t border-white/12 pt-8">
              <blockquote className="font-display text-[clamp(1.375rem,2.4vw,1.875rem)] font-medium leading-[1.2] tracking-[-0.02em] text-bone">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-leaf-800 font-mono text-xs text-leaf-200">
                  {q.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')}
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-medium text-bone">{q.name}</span>
                  <span className="block text-[0.8125rem] text-mist">{q.district}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
