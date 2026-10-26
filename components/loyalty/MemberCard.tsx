'use client';

import { useRef, type CSSProperties, type MouseEvent } from 'react';
import { tierById, type TierId } from '@/lib/loyalty';
import { useReducedMotion } from '@/lib/hooks';
import { clsx } from '@/lib/clsx';
import { TierBadge } from './TierBadge';

interface Props {
  tier: TierId;
  name: string;
  memberId?: string;
  /** Bottom-right number; strings allowed for showcase cards ("From 1,000"). */
  points: number | string;
  pointsLabel?: string;
  tilt?: boolean;
  className?: string;
  style?: CSSProperties;
}

const finishLayer: Record<ReturnType<typeof tierById>['finish'], string> = {
  matte: 'none',
  brushed: 'repeating-linear-gradient(90deg, rgb(255 255 255 / 0.14) 0 1px, transparent 1px 3px, rgb(22 32 43 / 0.05) 3px 4px)',
  glow: 'radial-gradient(120% 90% at 85% 10%, rgb(255 240 196 / 0.55), transparent 55%)',
  rim: 'radial-gradient(90% 70% at 100% 0%, rgb(245 166 35 / 0.22), transparent 60%)',
};

/**
 * Physical-feeling member card. Tilt is CSS-only: pointer position is written to --rx/--ry/--mx/--my
 * on the element itself (no React state), so moving the mouse never re-renders.
 */
export function MemberCard({ tier, name, memberId, points, pointsLabel, tilt = true, className, style }: Props) {
  const t = tierById(tier);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const canTilt = tilt && !reduced;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(x - 0.5) * 14}deg`);
    el.style.setProperty('--rx', `${(0.5 - y) * 12}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const formatted = typeof points === 'number' ? points.toLocaleString('en-US') : points;

  return (
    <div className={clsx('[perspective:1200px]', className)} style={style}>
      <div
        ref={ref}
        onMouseMove={canTilt ? onMove : undefined}
        onMouseLeave={canTilt ? onLeave : undefined}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl [container-type:inline-size] [transform-style:preserve-3d]"
        style={
          {
            color: t.ink,
            background: `linear-gradient(135deg, ${t.gradient[0]} 0%, ${t.gradient[1]} 100%)`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.1), 0 24px 50px -24px rgba(0,0,0,.65)${
              t.finish === 'rim' ? ', inset 0 0 0 1px rgba(245,166,35,.6)' : ''
            }${t.finish === 'glow' ? ', 0 0 40px -8px rgba(245,166,35,.45)' : ''}`,
            transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
            transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
          } as CSSProperties
        }
      >
        <div aria-hidden="true" className="absolute inset-0" style={{ background: finishLayer[t.finish] }} />
        {/* Grain */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.18] mix-blend-multiply"
          style={{ background: 'radial-gradient(rgb(0 0 0 / 0.5) 0.6px, transparent 0.8px) 0 0 / 3px 3px' }}
        />
        {/* Glare follows the pointer */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60 mix-blend-soft-light"
          style={{ background: 'radial-gradient(60% 80% at var(--mx, 30%) var(--my, 0%), rgb(255 255 255 / 0.55), transparent 60%)' }}
        />
        {/* Embossed chip */}
        <div
          aria-hidden="true"
          className="absolute left-[6%] top-[38%] h-[17%] w-[11%] rounded-[1.4cqw]"
          style={{
            background: 'linear-gradient(135deg, rgb(255 255 255 / 0.35), rgb(0 0 0 / 0.12)), linear-gradient(90deg, transparent 32%, rgb(0 0 0 / 0.12) 33% 35%, transparent 36% 64%, rgb(0 0 0 / 0.12) 65% 67%, transparent 68%)',
            boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.35), inset 0 -1px 0 rgb(0 0 0 / 0.15)',
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-between p-[6%]">
          <div className="flex items-start justify-between">
            <TierBadge tier={tier} size="md" />
            <span className="flex items-center gap-[1.2cqw] text-[3.4cqw] font-semibold tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display)' }}>
              <span
                aria-hidden="true"
                className="inline-block size-[4cqw] rounded-full"
                style={{ background: `linear-gradient(180deg, currentColor 0 52%, transparent 52% 61%, currentColor 61%)`, opacity: 0.85 }}
              />
              Jontai
            </span>
          </div>
          <div className="flex items-end justify-between gap-[3cqw]">
            <div className="min-w-0">
              <p className="truncate text-[4.4cqw] font-medium leading-tight tracking-[-0.01em]">{name}</p>
              {memberId && (
                <p className="num mt-[0.8cqw] text-[2.6cqw]" style={{ color: t.inkSoft }}>
                  {memberId}
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="font-serif text-[3.6cqw] font-medium leading-none tracking-tight" style={{ color: t.inkSoft }}>
                {t.name}
              </p>
              <p className="num mt-[1cqw] text-[6.4cqw] font-medium leading-none">
                {formatted}
                {pointsLabel && <span className="ml-[1cqw] text-[2.6cqw] font-normal">{pointsLabel}</span>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
