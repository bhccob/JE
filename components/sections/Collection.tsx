'use client';

import { useRef, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Cube, Plus } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';
import { CATEGORIES, products, type Category } from '@/lib/products';
import { indexAt, useCollectionStore } from '@/lib/collectionStore';
import { useQuoteStore } from '@/lib/quoteStore';
import { useIsMobile, useReducedMotion } from '@/lib/hooks';
import { ProductPoster } from '@/components/ui/ProductPoster';
import { QuickLookModal } from '@/components/ui/QuickLookModal';
import { SectionShell } from './SectionShell';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

/** Nearest ring position that lands on product `k`, so jumping categories never spins the long way. */
function nearestTarget(current: number, k: number) {
  const n = products.length;
  const base = Math.round(current);
  const delta = ((((k - base) % n) + n + Math.floor(n / 2)) % n) - Math.floor(n / 2);
  return base + delta;
}

export function Collection() {
  const t = useTranslations('collection');
  const tc = useTranslations('categories');
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const target = useCollectionStore((s) => s.target);
  const setTarget = useCollectionStore((s) => s.setTarget);
  const nudge = useCollectionStore((s) => s.nudge);
  const addSpin = useCollectionStore((s) => s.addSpin);
  const openQuicklook = useCollectionStore((s) => s.openQuicklook);
  const addToQuote = useQuoteStore((s) => s.add);
  const section = useRef<HTMLDivElement>(null);
  const quickBtn = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const drag = useRef<{ x: number; lastX: number; start: number } | null>(null);

  const index = indexAt(target);
  const product = products[index];
  const pxPerItem = isMobile ? 170 : 260;

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, lastX: e.clientX, start: useCollectionStore.getState().target };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    setTarget(d.start - (e.clientX - d.x) / pxPerItem);
    addSpin((e.clientX - d.lastX) * 0.012);
    d.lastX = e.clientX;
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setTarget(Math.round(useCollectionStore.getState().target));
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nudge(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nudge(1);
    }
  };

  const selectCategory = (c: Category) => {
    const k = products.findIndex((p) => p.category === c);
    setTarget(nearestTarget(useCollectionStore.getState().target, k));
  };
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, k: number) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const n = CATEGORIES.length;
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (k + (e.key === 'ArrowRight' ? 1 : -1) + n) % n;
    tabRefs.current[next]?.focus();
    selectCategory(CATEGORIES[next]);
  };

  const openLook = () => {
    // Park the section at its hold position so the sticky canvas fills the viewport behind the modal.
    const top = (section.current?.closest('section')?.getBoundingClientRect().top ?? 0) + window.scrollY;
    window.scrollTo({ top, behavior: 'auto' });
    openQuicklook(product.id);
  };

  const add = () => {
    addToQuote(product.id);
    toast.success(t('added', { name: product.name }));
  };

  return (
    <SectionShell id="collection" labelledBy="collection-title" className="h-screen min-h-[700px]">
      <div ref={section} className="page-x relative flex h-full flex-col pb-8 pt-[calc(var(--header-h)+4vh)]">
        <div className="pointer-events-auto flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[32rem]">
            <h2 id="collection-title" data-reveal style={i(0)} className="h-section">
              {t('headline')}
            </h2>
            <p data-reveal style={i(1)} className="lede mt-4 hidden md:block">
              {t('body')}
            </p>
          </div>
          <div data-reveal style={i(2)} role="tablist" aria-label={t('carouselLabel')} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:justify-end lg:px-0">
            {CATEGORIES.map((c, k) => {
              const selected = product.category === c;
              return (
                <button
                  key={c}
                  ref={(el) => {
                    tabRefs.current[k] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`tab-${c}`}
                  aria-selected={selected}
                  aria-controls="collection-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectCategory(c)}
                  onKeyDown={(e) => onTabKey(e, k)}
                  className="chip shrink-0"
                >
                  {tc(c)}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="collection-panel"
          role="tabpanel"
          aria-labelledby={`tab-${product.category}`}
          aria-roledescription="carousel"
          aria-label={t('dragSurface')}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="pointer-events-auto relative my-4 flex-1 cursor-grab touch-pan-y rounded-[20px] active:cursor-grabbing"
        >
          {reduced && (
            <div className="absolute inset-0 grid place-items-center">
              <ProductPoster product={product} size="lg" className="w-[min(100%,420px)]" />
            </div>
          )}
        </div>

        <div data-reveal style={i(3)} className="pointer-events-auto grid gap-5 md:grid-cols-[1fr_auto] md:items-end md:pr-16">
          <div aria-live="polite" className="min-w-0">
            <p className="num text-[0.75rem] text-moss">{t('position', { index: index + 1, total: products.length })}</p>
            <p className="mt-1 font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-bone">{product.name}</p>
            <p className="mt-1 text-[0.9375rem] text-mist">{product.tagline}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => nudge(-1)} aria-label={t('prev')} className="btn btn-ghost size-12 !px-0">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => nudge(1)} aria-label={t('next')} className="btn btn-ghost size-12 !px-0">
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button ref={quickBtn} type="button" onClick={openLook} className="btn btn-ghost">
              <Cube size={18} aria-hidden="true" />
              {t('quickLook')}
            </button>
            <button type="button" onClick={add} className="btn btn-primary">
              <Plus size={16} weight="bold" aria-hidden="true" />
              {t('addToQuote')}
            </button>
            <Link href="/store" className="btn-link ml-2 hidden items-center gap-1 text-[0.9375rem] xl:inline-flex">
              {t('viewAll')}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
      <QuickLookModal returnFocus={quickBtn} />
    </SectionShell>
  );
}
