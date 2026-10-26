'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Minus, Plus, Trash } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { PROPERTY_TYPES } from '@/lib/loyalty';
import { productById } from '@/lib/products';
import { useQuoteStore } from '@/lib/quoteStore';
import { useHydrated } from '@/lib/hooks';
import { clsx } from '@/lib/clsx';

export function QuoteForm({ showItems = false, idPrefix = 'q' }: { showItems?: boolean; idPrefix?: string }) {
  const t = useTranslations('form');
  const hydrated = useHydrated();
  const items = useQuoteStore((s) => s.items);
  const removeItem = useQuoteStore((s) => s.remove);
  const setQty = useQuoteStore((s) => s.setQty);
  const clearItems = useQuoteStore((s) => s.clear);
  const [sending, setSending] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t('errors.name')),
        phone: z
          .string()
          .trim()
          .min(7, t('errors.phone'))
          .regex(/^[+\d\s().-]+$/, t('errors.phone')),
        email: z.string().trim().email(t('errors.email')),
        propertyType: z.enum(PROPERTY_TYPES as [string, ...string[]], { errorMap: () => ({ message: t('errors.propertyType') }) }),
        message: z.string().trim().min(10, t('errors.message')).max(2000),
      }),
    [t],
  );
  type Values = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', email: '', propertyType: '', message: '' },
  });

  const onSubmit = async (values: Values) => {
    setSending(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, items: showItems ? items : [] }),
      });
      if (!res.ok) throw new Error(String(res.status));
      toast.success(t('success'));
      reset();
      if (showItems) clearItems();
    } catch {
      toast.error(t('failure'));
    } finally {
      setSending(false);
    }
  };

  const id = (name: string) => `${idPrefix}-${name}`;
  const err = (name: keyof Values) =>
    errors[name] ? (
      <p id={id(`${name}-error`)} className="field-error" role="alert">
        {errors[name]?.message}
      </p>
    ) : null;
  const a11y = (name: keyof Values) => ({
    id: id(name),
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? id(`${name}-error`) : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {showItems && (
        <div className="surface p-5">
          <p className="text-[0.9375rem] font-medium text-bone">{t('itemsTitle')}</p>
          {hydrated && items.length > 0 ? (
            <ul className="mt-3 flex flex-col">
              {items.map((line) => {
                const p = productById(line.productId);
                if (!p) return null;
                return (
                  <li key={line.productId} className="flex items-center gap-3 border-t border-white/[0.07] py-3 first:border-t-0">
                    <span className="h-9 w-9 shrink-0 rounded-lg" style={{ background: `linear-gradient(135deg, ${p.swatch[0]}, ${p.swatch[1]})` }} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.9375rem] text-bone">{p.name}</span>
                      <span className="block text-[0.8125rem] text-mist">{p.headline}</span>
                    </span>
                    <span className="flex items-center gap-1" role="group" aria-label={`${t('qty')}: ${p.name}`}>
                      <button type="button" onClick={() => setQty(p.id, line.qty - 1)} className="grid size-8 place-items-center rounded-full text-mist hover:bg-white/10 hover:text-bone" aria-label="-1">
                        <Minus size={14} aria-hidden="true" />
                      </button>
                      <span className="num w-6 text-center text-bone">{line.qty}</span>
                      <button type="button" onClick={() => setQty(p.id, line.qty + 1)} className="grid size-8 place-items-center rounded-full text-mist hover:bg-white/10 hover:text-bone" aria-label="+1">
                        <Plus size={14} aria-hidden="true" />
                      </button>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(p.id)}
                      aria-label={t('remove', { name: p.name })}
                      className="grid size-8 place-items-center rounded-full text-mist hover:bg-white/10 hover:text-bone"
                    >
                      <Trash size={16} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-[0.875rem] text-mist">{t('itemsEmpty')}</p>
          )}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id('name')} className="field-label">
            {t('name')}
          </label>
          <input {...register('name')} {...a11y('name')} autoComplete="name" className="field" />
          {err('name')}
        </div>
        <div>
          <label htmlFor={id('phone')} className="field-label">
            {t('phone')}
          </label>
          <input {...register('phone')} {...a11y('phone')} type="tel" autoComplete="tel" inputMode="tel" className="field" />
          {err('phone')}
        </div>
        <div>
          <label htmlFor={id('email')} className="field-label">
            {t('email')}
          </label>
          <input {...register('email')} {...a11y('email')} type="email" autoComplete="email" className="field" />
          {err('email')}
        </div>
        <div>
          <label htmlFor={id('propertyType')} className="field-label">
            {t('propertyType')}
          </label>
          <select {...register('propertyType')} {...a11y('propertyType')} className="field">
            <option value="" disabled>
              {t('choose')}
            </option>
            {PROPERTY_TYPES.map((p) => (
              <option key={p} value={p}>
                {t(`propertyTypes.${p}`)}
              </option>
            ))}
          </select>
          {err('propertyType')}
        </div>
      </div>
      <div>
        <label htmlFor={id('message')} className="field-label">
          {t('message')}
        </label>
        <textarea {...register('message')} {...a11y('message')} rows={4} className="field" aria-describedby={errors.message ? id('message-error') : id('message-help')} />
        {errors.message ? err('message') : (
          <p id={id('message-help')} className="field-help">
            {t('messageHint')}
          </p>
        )}
      </div>
      <div>
        <button type="submit" disabled={sending} className={clsx('btn btn-primary', sending && 'cursor-wait')}>
          {sending ? t('sending') : t('submit')}
        </button>
      </div>
    </form>
  );
}
