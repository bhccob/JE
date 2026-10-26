import type { ReactNode } from 'react';
import { clsx } from '@/lib/clsx';

const tones = {
  neutral: 'border-white/12 bg-white/[0.04] text-mist',
  leaf: 'border-leaf-400/30 bg-leaf-400/10 text-leaf-300',
  sun: 'border-sun-400/35 bg-sun-400/10 text-sun-300',
} as const;

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: keyof typeof tones; className?: string }) {
  return (
    <span className={clsx('inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-[0.75rem] font-medium', tones[tone], className)}>
      {children}
    </span>
  );
}
