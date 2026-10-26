'use client';

import type { Reward } from '@/lib/loyalty';
import { clsx } from '@/lib/clsx';
import { RewardCard } from './RewardCard';

export function RewardsGrid({
  rewards,
  balance,
  mode = 'toast',
  className,
}: {
  rewards: Reward[];
  balance?: number;
  mode?: 'toast' | 'disabled';
  className?: string;
}) {
  return (
    <div className={clsx('grid gap-3 md:grid-cols-2', className)}>
      {rewards.map((r) => (
        <RewardCard key={r.id} reward={r} balance={balance} mode={mode} />
      ))}
    </div>
  );
}
