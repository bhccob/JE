'use client';

import { useScrollStore } from '@/lib/scrollStore';
import { clsx } from '@/lib/clsx';

const POSTERS = ['hero', 'source', 'capture', 'storage', 'light', 'collection'] as const;

/** prefers-reduced-motion: static renders of each set piece, cross-faded by active section. */
export function Posters() {
  const active = useScrollStore((s) => s.activeSection);
  const current = (POSTERS as readonly string[]).includes(active) ? active : 'collection';
  return (
    <div className="absolute inset-0">
      {POSTERS.map((id) => (
        <div
          key={id}
          className={clsx(
            'absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-[var(--ease-out-expo)]',
            id === current ? 'opacity-100' : 'opacity-0',
          )}
          style={{ backgroundImage: `url(/posters/${id}.webp)` }}
        />
      ))}
    </div>
  );
}
