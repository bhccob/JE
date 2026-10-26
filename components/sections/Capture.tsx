'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { sectionProgress, useScrollStore } from '@/lib/scrollStore';
import { clsx } from '@/lib/clsx';
import { SectionShell } from './SectionShell';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export const CAPTURE_HOTSPOTS = ['wattage', 'efficiency', 'warranty'] as const;
export type CaptureHotspot = (typeof CAPTURE_HOTSPOTS)[number];

// Same windows the 3D panel uses (components/canvas/models/SolarPanel.tsx).
const STAGES = [
  { key: 'frame', from: 0, to: 0.2 },
  { key: 'cells', from: 0.2, to: 0.7 },
  { key: 'glass', from: 0.7, to: 1 },
] as const;

export function Capture() {
  const t = useTranslations('capture');
  const hotspot = useScrollStore((s) => s.hotspot);
  const setHotspot = useScrollStore((s) => s.setHotspot);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);

  // DOM readout and the 3D assembly read the same section progress, so they can't drift.
  useEffect(
    () =>
      useScrollStore.subscribe((s) => {
        const p = sectionProgress(s.ranges, 'capture', s.progress);
        STAGES.forEach((st, k) => {
          const el = bars.current[k];
          if (el) el.style.transform = `scaleX(${Math.min(1, Math.max(0, (p - st.from) / (st.to - st.from)))})`;
        });
      }),
    [],
  );

  return (
    <SectionShell id="capture" labelledBy="capture-title" className="h-[260vh]">
      <div className="sticky top-0 flex h-screen items-end pb-10 md:items-center md:pb-0">
        <div aria-hidden="true" className="scrim-left absolute inset-0 hidden md:block" />
        <div aria-hidden="true" className="scrim-bottom absolute inset-x-0 bottom-0 h-[62%] md:hidden" />
        <div className="page-x relative">
          <div className="pointer-events-auto max-w-[30rem]">
            <h2 id="capture-title" data-reveal style={i(0)} className="h-section">
              {t('headline')}
            </h2>
            <p data-reveal style={i(1)} className="lede mt-5">
              {t('body')}
            </p>

            <ol data-reveal style={i(2)} className="mt-8 grid grid-cols-3 gap-3" aria-hidden="true">
              {STAGES.map((st, k) => (
                <li key={st.key} className="text-[0.75rem] text-mist">
                  <span className="relative mb-2 block h-0.5 w-full overflow-hidden rounded-full bg-white/15">
                    <span
                      ref={(el) => {
                        bars.current[k] = el;
                      }}
                      className="absolute inset-0 origin-left bg-leaf-300"
                      style={{ transform: 'scaleX(0)' }}
                    />
                  </span>
                  {t(`stages.${st.key}`)}
                </li>
              ))}
            </ol>

            <ul data-reveal style={i(3)} className="mt-8 flex flex-col gap-2" aria-label={t('hint')}>
              {CAPTURE_HOTSPOTS.map((id) => {
                const active = hotspot === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      aria-expanded={active}
                      onMouseEnter={() => setHotspot(id)}
                      onMouseLeave={() => setHotspot(null)}
                      onFocus={() => setHotspot(id)}
                      onBlur={() => setHotspot(null)}
                      onClick={() => setHotspot(active ? null : id)}
                      className={clsx(
                        'group flex w-full items-start gap-4 rounded-[16px] border px-4 py-3 text-left transition-colors duration-300 ease-[var(--ease-out-expo)]',
                        active ? 'border-leaf-400/40 bg-leaf-400/[0.08]' : 'border-white/10 bg-night-950/40 hover:border-white/20',
                      )}
                    >
                      <span className="num w-[5.5rem] shrink-0 pt-px text-[1.0625rem] text-bone">{t(`hotspots.${id}.value`)}</span>
                      <span className="flex flex-col">
                        <span className="text-[0.9375rem] font-medium text-bone">{t(`hotspots.${id}.label`)}</span>
                        <span
                          className={clsx(
                            'grid text-[0.875rem] text-mist transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)]',
                            active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                          )}
                        >
                          <span className="overflow-hidden">{t(`hotspots.${id}.detail`)}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p data-reveal style={i(4)} className="mt-4 hidden text-[0.8125rem] text-moss md:block">
              {t('hint')}
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
