'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowsHorizontal } from '@phosphor-icons/react';

/**
 * Chapter 04's bulb, live in 3D (bulbScene): drag it to turn it, and the slider colours its filaments. The picture
 * shows first and stays for assistive tech; three.js loads only as the bulb comes near the screen (from below, or from
 * the side on the product rail), and the scene takes over once its first frame is drawn. Without WebGL, or if the
 * context is lost, the picture simply stays. A bulb with no real size yet starts once it grows to one.
 */
export function Bulb3D({ src, alt }: { src: string; alt: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let stop: (() => void) | undefined;
    let gone = false;
    let close = false;
    let started = false;
    const start = () => {
      if (started || !close || el.clientWidth < 40) return;
      started = true;
      near.disconnect();
      grown.disconnect();
      import('./bulbScene')
        .then(({ createBulb }) => {
          if (gone) return;
          stop = createBulb(el, { onReady: () => setLive(true), onTouch: () => setTouched(true), onLost: () => setLive(false) });
        })
        .catch(() => {
          // No WebGL (or the chunk failed): the picture stays.
        });
    };
    const near = new IntersectionObserver(
      (entries) => {
        close = entries[entries.length - 1].isIntersecting;
        start();
      },
      { rootMargin: '600px 100%' },
    );
    const grown = new ResizeObserver(start);
    near.observe(el);
    grown.observe(el);
    return () => {
      gone = true;
      near.disconnect();
      grown.disconnect();
      stop?.();
    };
  }, []);

  return (
    <div ref={host} className="bulb3d" data-live={live}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="bulb3d__pic feather" src={src} alt={alt} width={800} height={800} loading="lazy" decoding="async" />
      {live && (
        <span className="bulb3d__hint glass" data-gone={touched} aria-hidden="true">
          <ArrowsHorizontal size={16} weight="bold" />
          Drag to turn
        </span>
      )}
    </div>
  );
}
