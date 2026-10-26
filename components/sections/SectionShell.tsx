'use client';

import { useEffect, type ReactNode } from 'react';
import { useInView } from '@/lib/hooks';
import { useScrollStore } from '@/lib/scrollStore';
import type { SectionId } from '@/lib/cameraKeyframes';
import { clsx } from '@/lib/clsx';

interface Props {
  id: SectionId;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
}

/**
 * Every journey section goes through this: it is what the scroll director measures ([data-section]),
 * what reveals children on enter (.is-in), and what tells the canvas to lazy-load a set piece
 * once the section is within 300px of the viewport.
 */
export function SectionShell({ id, className, labelledBy, children }: Props) {
  const { ref, inView } = useInView<HTMLElement>();
  const markNear = useScrollStore((s) => s.markNear);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          markNear(id);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, markNear, ref]);

  return (
    <section ref={ref} id={id} data-section={id} aria-labelledby={labelledBy} className={clsx('relative', inView && 'is-in', className)}>
      {children}
    </section>
  );
}
