'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { CaretDown } from '@phosphor-icons/react/dist/ssr';
import type { ChapterId } from '@/lib/film';
import type { PanelId } from '@/lib/products';
import { ProductSpot } from './ProductSpot';
import { filmStore, progressOf } from './store';

interface Props {
  id: ChapterId;
  /** Scroll length of the film part of the chapter, in viewport heights. */
  length: number;
  /** Extra screens the film holds on the product once the camera arrives, so the visitor sees they are there. */
  hold?: number;
  /** The product the camera arrives at: its marker opens this panel. */
  product?: { panel: PanelId; name: string };
  /** Light copy for the dusk and night chapters. */
  tone?: 'light' | 'dark';
  /** Where the copy sits over the picture on wide screens. */
  place?: 'start' | 'end' | 'top';
  /** Alt text for the still shown to reduced-motion and no-JS visitors. */
  still: string;
  /** In-page anchors set partway into the chapter, at a 0..1 progress. */
  anchors?: { id: string; at: number }[];
  /** Full-bleed layer between the film and the copy (the bulb). */
  overlay?: ReactNode;
  children: ReactNode;
}

/**
 * One hour of the day. The section is tall so the film has room to play; its copy holds on screen (sticky, not
 * pinned) while the film runs behind it. Children marked `data-beat="from,to"` show only for that stretch of the
 * chapter. Without scripts, or with reduced motion, the chapter is an ordinary section: its still, then all its copy.
 */
export function Chapter({ id, length, hold = 0, product, tone = 'light', place = 'start', still, anchors = [], overlay, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const beats = Array.from(el.querySelectorAll<HTMLElement>('[data-beat]')).map((b) => {
      const [from, to] = (b.dataset.beat ?? '0,1').split(',').map(Number);
      return { b, from, to };
    });
    return filmStore.subscribe((s) => {
      const p = progressOf(id, s);
      for (const { b, from, to } of beats) {
        const on = String(p >= from && p <= to);
        if (b.dataset.on !== on) b.dataset.on = on;
      }
      const arrived = String(s.chapter === id && s.arrived);
      if (el.dataset.arrived !== arrived) el.dataset.arrived = arrived;
    });
  }, [id]);

  return (
    <section
      ref={ref}
      className="chapter"
      data-chapter={id}
      data-tone={tone}
      data-place={place}
      data-length={length}
      data-hold={hold}
      style={{ '--length': length + hold } as CSSProperties}
      aria-labelledby={`${id}-title`}
    >
      {anchors.map((a) => (
        <span key={a.id} id={a.id} className="chapter__anchor" style={{ '--at': a.at } as CSSProperties} />
      ))}
      <picture className="chapter__still">
        <source media="(orientation: portrait)" srcSet={`/film/m/${id}/poster.webp`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/film/d/${id}/poster.webp`} alt={still} loading="lazy" decoding="async" width={1920} height={1080} />
      </picture>
      <div className="chapter__pin">
        {overlay}
        <div className="container chapter__copy">{children}</div>
        {product && <ProductSpot chapter={id} panel={product.panel} name={product.name} />}
        {hold > 0 && (
          <p className="chapter__next" aria-hidden="true">
            Scroll to continue <CaretDown size={14} weight="bold" />
          </p>
        )}
      </div>
    </section>
  );
}
