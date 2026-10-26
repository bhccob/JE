import type { CSSProperties } from 'react';
import { tierById, type TierId } from '@/lib/loyalty';
import { clsx } from '@/lib/clsx';

const SIZES = { sm: 20, md: 30, lg: 44 } as const;

/** CSS-only tier emblems. No SVG, no images. */
const face: Record<TierId, CSSProperties> = {
  sunbeam: {
    background:
      'radial-gradient(circle at 50% 50%, #fff3cf 0 26%, transparent 27%), repeating-conic-gradient(from 0deg, #c9a253 0 9deg, transparent 9deg 30deg), radial-gradient(circle, #f3e1b5 0 60%, #e8c67a 61% 100%)',
    boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.6), 0 0 0 1px rgb(90 74 42 / 0.35)',
  },
  tradewind: {
    background:
      'repeating-linear-gradient(135deg, rgb(255 255 255 / 0.45) 0 1px, transparent 1px 3px), radial-gradient(circle at 35% 30%, #f4f7fb, #b8c4d0 70%, #8e9cab)',
    boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.8), inset 0 0 0 3px rgb(22 32 43 / 0.12), 0 0 0 1px rgb(58 71 86 / 0.35)',
  },
  solarflare: {
    background: 'radial-gradient(circle at 50% 45%, #fff0c4 0 18%, #ffc24d 34%, #f5a623 58%, #d97e05 100%)',
    boxShadow: '0 0 14px 1px rgb(245 166 35 / 0.55), inset 0 1px 0 rgb(255 255 255 / 0.5)',
  },
  eclipse: {
    background: 'radial-gradient(circle at 42% 50%, #0b2545 0 54%, #3a2e6b 55% 62%, #f5a623 63% 66%, transparent 67%), #0b2545',
    boxShadow: 'inset 0 0 0 1px rgb(245 166 35 / 0.6), 0 0 12px rgb(245 166 35 / 0.25)',
  },
};

export function TierBadge({ tier, size = 'md', label, className }: { tier: TierId; size?: keyof typeof SIZES; label?: boolean; className?: string }) {
  const px = SIZES[size];
  const t = tierById(tier);
  return (
    <span className={clsx('inline-flex items-center gap-2', className)}>
      <span
        role={label ? undefined : 'img'}
        aria-label={label ? undefined : t.name}
        aria-hidden={label ? true : undefined}
        className="inline-block shrink-0 rounded-full"
        style={{ width: px, height: px, ...face[tier] }}
      />
      {label && <span className="font-serif text-[0.9375rem] font-medium tracking-tight">{t.name}</span>}
    </span>
  );
}
