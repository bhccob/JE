'use client';

import { useEffect, useRef } from 'react';
import { useCatalog } from '@/components/catalog/CatalogProvider';
import { FRAME_SIZE, chapterById, coverPoint, type ChapterId, type FrameSize } from '@/lib/film';
import type { PanelId } from '@/lib/products';

/**
 * The marker that appears on a product once the camera has arrived at it: a pulsing point on the product itself and
 * a "See product info" label that opens its panel. Placed through the same cover crop the film is drawn with.
 */
export function ProductSpot({ chapter, panel, name }: { chapter: ChapterId; panel: PanelId; name: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { open } = useCatalog();

  useEffect(() => {
    const el = ref.current;
    const c = chapterById(chapter);
    if (!el || !c) return;
    const place = () => {
      const size: FrameSize = window.matchMedia('(orientation: portrait)').matches ? 'm' : 'd';
      const [x, y] = coverPoint(c.spot[size], FRAME_SIZE[size], [window.innerWidth, window.innerHeight]);
      el.style.setProperty('--spot-x', `${Math.round(x)}px`);
      el.style.setProperty('--spot-y', `${Math.round(y)}px`);
      // Near the right edge the label goes on the left of the point, so it never runs off screen.
      el.dataset.flip = String(x + 200 > window.innerWidth - 16);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [chapter]);

  return (
    <button ref={ref} type="button" className="spot" onClick={(e) => open(panel, e.currentTarget)} aria-label={`See product info: ${name}`}>
      <span className="spot__dot" aria-hidden="true" />
      <span className="spot__label glass" aria-hidden="true">
        See product info
      </span>
    </button>
  );
}
