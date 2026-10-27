'use client';

import { useRef, useState } from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { ChapterId } from '@/lib/products';

gsap.registerPlugin(useGSAP);

interface IndexItem {
  id: ChapterId;
  number: string;
  name: string;
  image: string;
}

/**
 * What is in the store, as ruled rows that lead down to each chapter. With a mouse, a small sun-coloured disc follows
 * the pointer just left of it and shows the product of the row you are on, tilting a little as it moves. Touch screens
 * and reduced motion get the rows alone.
 */
export function HeroIndex({ items }: { items: IndexItem[] }) {
  const root = useRef<HTMLElement>(null);
  const peek = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const disc = peek.current;
        const list = root.current?.querySelector('ol');
        if (!disc || !list) return;
        gsap.set(disc, { xPercent: -112, yPercent: -50, scale: 0.5, opacity: 0 });
        const toX = gsap.quickTo(disc, 'x', { duration: 0.55, ease: 'power3' });
        const toY = gsap.quickTo(disc, 'y', { duration: 0.55, ease: 'power3' });
        const tilt = gsap.quickTo(disc, 'rotation', { duration: 0.6, ease: 'power3' });
        let lastX = 0;
        let settle = 0;
        const enter = (e: PointerEvent) => {
          gsap.set(disc, { x: e.clientX, y: e.clientY });
          lastX = e.clientX;
          gsap.to(disc, { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
        };
        const leave = () => gsap.to(disc, { scale: 0.5, opacity: 0, duration: 0.3, ease: 'expo.out', overwrite: 'auto' });
        const move = (e: PointerEvent) => {
          toX(e.clientX);
          toY(e.clientY);
          tilt(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.8));
          lastX = e.clientX;
          window.clearTimeout(settle);
          settle = window.setTimeout(() => tilt(0), 90);
        };
        list.addEventListener('pointerenter', enter);
        list.addEventListener('pointerleave', leave);
        list.addEventListener('pointermove', move);
        return () => {
          window.clearTimeout(settle);
          list.removeEventListener('pointerenter', enter);
          list.removeEventListener('pointerleave', leave);
          list.removeEventListener('pointermove', move);
        };
      });
    },
    { scope: root },
  );

  return (
    <nav ref={root} className="index" aria-label="In the store">
      <p className="label index__title" data-hero>
        In the store
      </p>
      <ol>
        {items.map((it, i) => (
          <li key={it.id} data-hero>
            <a href={`#${it.id}`} onPointerEnter={() => setOn(i)}>
              <span className="index__n">{it.number}</span>
              <span className="index__name">{it.name}</span>
              <ArrowRight size={22} weight="bold" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
      <div ref={peek} className="peek" aria-hidden="true">
        <div className="peek__disc">
          {items.map((it, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={it.id} className="feather" src={it.image} alt="" width={800} height={800} loading="lazy" decoding="async" data-on={i === on} />
          ))}
        </div>
      </div>
    </nav>
  );
}
