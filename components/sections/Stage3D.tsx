'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useHydrated, useIsMobile, useReducedMotion } from '@/lib/hooks';
import { useCollectionStore } from '@/lib/collectionStore';
import { clsx } from '@/lib/clsx';
import { Posters } from './Posters';

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false });
const LevaPanel =
  process.env.NODE_ENV === 'development' ? dynamic(() => import('leva').then((m) => m.Leva), { ssr: false }) : null;

/**
 * The one sticky, page-wide canvas zone. It spans Hero through Collection; Loyalty and
 * everything after it are plain DOM below this wrapper. Sections scroll over the canvas
 * (they're pulled up by -100vh) and keep pointer-events off except on their controls.
 */
export function Stage3D({ children }: { children: ReactNode }) {
  const t = useTranslations('a11y');
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const quicklook = useCollectionStore((s) => s.quicklook);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);

  // Mount only after the browser is idle AND the stage is on screen (the hero on a normal visit),
  // so LCP is pure DOM. Observing the whole stage zone also covers reloads that restore mid-page.
  const zone = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced) return;
    const hero = zone.current;
    let idle = false;
    let seen = false;
    const go = () => idle && seen && setMount(true);
    const hasIdle = typeof window.requestIdleCallback === 'function';
    const onIdle = () => {
      idle = true;
      go();
    };
    const handle = hasIdle ? window.requestIdleCallback(onIdle, { timeout: 2000 }) : window.setTimeout(onIdle, 250);
    const cancel = () => (hasIdle ? window.cancelIdleCallback(handle) : window.clearTimeout(handle));
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        seen = true;
        go();
      }
    });
    if (hero) io.observe(hero);
    return () => {
      cancel();
      io.disconnect();
    };
  }, [reduced]);

  const showCanvas = hydrated && !reduced && mount;

  return (
    <div ref={zone} className="relative">
      <div
        aria-hidden="true"
        className={clsx('sticky top-0 h-screen w-full overflow-hidden', quicklook ? 'z-[60]' : 'z-0')}
      >
        <div className="stage-backdrop absolute inset-0" />
        {hydrated && reduced && <Posters />}
        {showCanvas && (
          <div className={clsx('absolute inset-0 transition-opacity duration-1000 ease-[var(--ease-out-expo)]', ready ? 'opacity-100' : 'opacity-0')}>
            <Scene isMobile={isMobile} onReady={() => setReady(true)} />
          </div>
        )}
      </div>
      <p className="sr-only">{t('scene')}</p>
      {LevaPanel && hydrated && <LevaPanel hidden={!new URLSearchParams(window.location.search).has('leva')} />}
      <div className="pointer-events-none relative z-10 -mt-[100vh]">{children}</div>
    </div>
  );
}
