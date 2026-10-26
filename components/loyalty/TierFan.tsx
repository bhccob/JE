'use client';

import type { CSSProperties } from 'react';
import { TIERS, type TierId } from '@/lib/loyalty';
import { useInView } from '@/lib/hooks';
import { clsx } from '@/lib/clsx';
import { MemberCard } from './MemberCard';

// Back to front, each card a little further right, higher and more rotated.
const FAN = [
  { tx: '-12%', ty: '22%', rz: '-13deg' },
  { tx: '-4%', ty: '9%', rz: '-6deg' },
  { tx: '4%', ty: '-4%', rz: '1deg' },
  { tx: '12%', ty: '-17%', rz: '8deg' },
];

export function TierFan({ tiers = TIERS.map((t) => t.id), label, className }: { tiers?: TierId[]; label: string; className?: string }) {
  const { ref, inView } = useInView<HTMLUListElement>({ rootMargin: '0px 0px -15% 0px' });

  return (
    <ul ref={ref} aria-label={label} className={clsx('tier-fan relative', inView && 'is-fanned', className)}>
      {tiers.map((id, k) => {
        const tier = TIERS.find((t) => t.id === id)!;
        const pos = FAN[FAN.length - tiers.length + k] ?? FAN[k];
        return (
          <li
            key={id}
            tabIndex={0}
            aria-label={`${tier.name}. ${tier.tagline} ${tier.perk}.`}
            className="tier-fan-card"
            style={{ '--tx': pos.tx, '--ty': pos.ty, '--rz': pos.rz, '--k': k, zIndex: k + 1 } as CSSProperties}
          >
            <MemberCard
              tier={id}
              name={tier.tagline}
              points={tier.points === 0 ? 'Free' : tier.points.toLocaleString('en-US')}
              pointsLabel={tier.points === 0 ? undefined : 'pts'}
              tilt={false}
            />
          </li>
        );
      })}
    </ul>
  );
}
