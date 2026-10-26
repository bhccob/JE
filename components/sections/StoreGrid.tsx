'use client';

import { useState } from 'react';
import { Check, Plus } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { CATEGORIES, products, type Category } from '@/lib/products';
import { useQuoteStore } from '@/lib/quoteStore';
import { useHydrated } from '@/lib/hooks';
import { ProductPoster } from '@/components/ui/ProductPoster';

export function StoreGrid() {
  const t = useTranslations('store');
  const tc = useTranslations('categories');
  const tq = useTranslations('collection');
  const hydrated = useHydrated();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const items = useQuoteStore((s) => s.items);
  const add = useQuoteStore((s) => s.add);
  const visible = filter === 'all' ? products : products.filter((p) => p.category === filter);

  return (
    <>
      <div role="group" aria-label={t('filterLabel')} className="no-scrollbar -mx-4 mt-14 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        {(['all', ...CATEGORIES] as const).map((c) => (
          <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)} className="chip shrink-0">
            {c === 'all' ? t('all') : tc(c)}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => {
          const inQuote = hydrated && items.some((i) => i.productId === p.id);
          return (
            <li key={p.id}>
              <article>
                <ProductPoster product={p} />
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[0.8125rem] text-moss">{tc(p.category)}</p>
                    <h2 className="mt-0.5 font-display text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-bone">{p.name}</h2>
                    <p className="mt-1 text-[0.9375rem] text-mist">{p.tagline}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      add(p.id);
                      toast.success(tq('added', { name: p.name }));
                    }}
                    aria-label={`${tq('addToQuote')}: ${p.name}`}
                    className={inQuote ? 'btn btn-ghost btn-sm shrink-0 !px-3' : 'btn btn-primary btn-sm shrink-0 !px-3'}
                  >
                    {inQuote ? <Check size={16} weight="bold" aria-hidden="true" /> : <Plus size={16} weight="bold" aria-hidden="true" />}
                  </button>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-white/[0.08] pt-4">
                  {p.specs.slice(0, 4).map((s) => (
                    <div key={s.label}>
                      <dt className="text-[0.75rem] text-moss">{s.label}</dt>
                      <dd className="num text-[0.875rem] text-bone">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}
