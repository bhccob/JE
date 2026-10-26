'use client';

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent, type RefObject, type WheelEvent } from 'react';
import { createPortal } from 'react-dom';
import { HandGrabbing, Plus, X } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { productById } from '@/lib/products';
import { useCollectionStore } from '@/lib/collectionStore';
import { useQuoteStore } from '@/lib/quoteStore';
import { useReducedMotion } from '@/lib/hooks';
import { clsx } from '@/lib/clsx';
import { Badge } from './Badge';
import { ProductPoster } from './ProductPoster';

/**
 * Quick look renders its model through the same single canvas: while open, the sticky canvas is
 * raised above the page (Stage3D) and the scene switches to a focus mode. This dialog is the
 * DOM chrome on top: specs, add to quote, and a transparent drag surface that orbits the model.
 */
export function QuickLookModal({ returnFocus }: { returnFocus: RefObject<HTMLElement> }) {
  const t = useTranslations('collection');
  const tc = useTranslations('categories');
  const id = useCollectionStore((s) => s.quicklook);
  const close = useCollectionStore((s) => s.closeQuicklook);
  const orbit = useCollectionStore((s) => s.orbit);
  const zoom = useCollectionStore((s) => s.zoom);
  const addToQuote = useQuoteStore((s) => s.add);
  const reduced = useReducedMotion();
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [shown, setShown] = useState(false);
  const product = id ? productById(id) : undefined;

  useEffect(() => {
    if (!id) {
      setShown(false);
      return;
    }
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => setShown(true));
    closeBtn.current?.focus();
    const focusReturn = returnFocus.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab' && dialog.current) {
        const nodes = dialog.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prevOverflow;
      focusReturn?.focus();
    };
  }, [id, close, returnFocus]);

  if (!product) return null;

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    orbit((e.clientX - drag.current.x) * 0.008, (e.clientY - drag.current.y) * 0.006);
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = () => {
    drag.current = null;
  };
  const onWheel = (e: WheelEvent<HTMLDivElement>) => zoom(-e.deltaY * 0.0015);
  const onViewerKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, [number, number]> = { ArrowLeft: [-0.25, 0], ArrowRight: [0.25, 0], ArrowUp: [0, -0.15], ArrowDown: [0, 0.15] };
    if (map[e.key]) {
      e.preventDefault();
      orbit(...map[e.key]);
    } else if (e.key === '+' || e.key === '=') zoom(0.1);
    else if (e.key === '-') zoom(-0.1);
  };

  const add = () => {
    addToQuote(product.id);
    toast.success(t('added', { name: product.name }));
  };

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ql-title"
      className={clsx(
        'fixed inset-0 z-[70] flex flex-col transition-opacity duration-500 ease-[var(--ease-out-expo)] md:flex-row',
        shown ? 'opacity-100' : 'opacity-0',
        reduced && 'bg-night-950/95',
      )}
    >
      <div
        tabIndex={0}
        aria-label={t('rotateHint')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onKeyDown={onViewerKey}
        onDoubleClick={close}
        className="relative min-h-[42vh] flex-1 cursor-grab touch-none active:cursor-grabbing"
      >
        {reduced && (
          <div className="absolute inset-0 grid place-items-center p-8">
            <ProductPoster product={product} size="lg" className="w-[min(100%,520px)]" />
          </div>
        )}
        <p className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-night-950/60 px-4 py-2 text-[0.8125rem] text-mist backdrop-blur-md">
          <HandGrabbing size={16} aria-hidden="true" />
          {t('rotateHint')}
        </p>
      </div>

      <aside
        className={clsx(
          'surface-solid relative m-3 flex max-h-[55vh] flex-col overflow-y-auto p-6 transition-transform duration-500 ease-[var(--ease-out-expo)] md:m-4 md:max-h-none md:w-[420px] md:p-8',
          shown ? 'translate-y-0 md:translate-x-0' : 'translate-y-6 md:translate-x-6 md:translate-y-0',
        )}
      >
        <button
          ref={closeBtn}
          type="button"
          onClick={close}
          aria-label={t('close')}
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/10 text-mist transition-colors hover:border-white/25 hover:text-bone"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <Badge tone="leaf" className="self-start">
          {tc(product.category)}
        </Badge>
        <h2 id="ql-title" className="mt-4 pr-12 font-display text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.03em] text-bone">
          {product.name}
        </h2>
        <p className="mt-3 text-mist">{product.tagline}</p>

        <h3 className="mt-8 text-[0.8125rem] font-medium text-moss">{t('specs')}</h3>
        <dl className="mt-3 grid grid-cols-2 gap-2">
          {product.specs.map((s) => (
            <div key={s.label} className="rounded-[14px] border border-white/[0.07] bg-white/[0.025] p-3.5">
              <dt className="text-[0.75rem] text-moss">{s.label}</dt>
              <dd className="num mt-1 text-[0.9375rem] leading-snug text-bone">{s.value}</dd>
            </div>
          ))}
        </dl>

        <button type="button" onClick={add} className="btn btn-primary mt-8 w-full">
          <Plus size={16} weight="bold" aria-hidden="true" />
          {t('addToQuote')}
        </button>
      </aside>
    </div>,
    document.body,
  );
}
