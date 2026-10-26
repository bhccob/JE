'use client';

import { useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useReducedMotion } from '@/lib/hooks';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { SectionShell } from './SectionShell';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export function Hero() {
  const t = useTranslations('hero');
  const reduced = useReducedMotion();
  const scope = useRef<HTMLDivElement>(null);

  // Section timeline: as the hero scrolls away, the copy lifts and thins out while the camera starts to rise.
  useGSAP(
    () => {
      if (reduced) return;
      gsap
        .timeline({ scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: 1 } })
        .to('.hero-line', { yPercent: -40, opacity: 0, stagger: 0.06, ease: 'none' }, 0)
        .to('.hero-foot', { y: -60, opacity: 0, ease: 'none' }, 0);
    },
    { scope, dependencies: [reduced] },
  );

  const explore = () => {
    document.getElementById('capture')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <SectionShell id="hero" labelledBy="hero-title" className="h-screen min-h-[620px]">
      <div aria-hidden="true" className="scrim-bottom absolute inset-x-0 bottom-0 h-[70%] md:hidden" />
      <div ref={scope} className="page-x relative flex h-full flex-col justify-end pb-32 md:pb-24">
        <div className="pointer-events-auto max-w-[62rem]">
          <p style={i(0)} className="hero-in mb-5 font-mono text-[0.75rem] uppercase tracking-[0.22em] text-leaf-300">
            {t('brand')}
          </p>
          <h1 id="hero-title" className="display text-[clamp(2.9rem,7.4vw,6.25rem)]">
            <span className="hero-line block">
              <span style={i(0)} className="hero-lift block">
                {t('line1')} {t('line2')}
              </span>
            </span>
            <span className="hero-line block">
              <span style={i(1)} className="hero-lift block text-leaf-300">
                {t('line3')}
              </span>
            </span>
          </h1>
          <div className="hero-foot mt-8 flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
            <p style={i(3)} className="hero-in max-w-[24ch] text-[1.125rem] leading-snug text-bone/85">
              {t('tagline')}
            </p>
            <div style={i(4)} className="hero-in flex flex-wrap gap-3">
              <button type="button" onClick={explore} className="btn btn-primary">
                {t('explore')}
                <ArrowDown size={16} weight="bold" aria-hidden="true" />
              </button>
              <Link href="/quote" className="btn btn-ghost">
                {t('quote')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ScrollIndicator />
    </SectionShell>
  );
}
