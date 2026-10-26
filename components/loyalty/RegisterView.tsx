'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useLoyaltyStore } from '@/lib/loyaltyStore';
import { PROPERTY_TYPES, TIERS, type PropertyType } from '@/lib/loyalty';
import { MemberCard } from './MemberCard';

/** No password field by design. Submitting creates a local mock member; nothing is sent anywhere. */
export function RegisterView() {
  const t = useTranslations('register');
  const tf = useTranslations('form');
  const tl = useTranslations('loyalty');
  const router = useRouter();
  const signIn = useLoyaltyStore((s) => s.signIn);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t('errors.name')),
        email: z.string().trim().email(t('errors.email')),
        propertyType: z.enum(PROPERTY_TYPES as [PropertyType, ...PropertyType[]], { errorMap: () => ({ message: t('errors.propertyType') }) }),
      }),
    [t],
  );
  type Values = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', propertyType: '' as unknown as PropertyType },
  });

  const onSubmit = (v: Values) => {
    signIn({ email: v.email, name: v.name, propertyType: v.propertyType });
    router.push('/account');
  };

  const field = (name: keyof Values) => ({
    id: `reg-${name}`,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `reg-${name}-error` : undefined,
  });
  const error = (name: keyof Values) =>
    errors[name] ? (
      <p id={`reg-${name}-error`} role="alert" className="field-error">
        {errors[name]?.message}
      </p>
    ) : null;

  return (
    <main id="main" className="pb-24 pt-[calc(var(--header-h)+48px)]">
      <div className="page-x">
        <div className="mx-auto max-w-[480px]">
          <h1 className="display text-[clamp(2.5rem,6vw,4rem)]">{t('title')}</h1>
          <p className="lede mt-4">{t('body')}</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="surface-solid mt-10 flex flex-col gap-5 p-6 md:p-8">
            <div>
              <label htmlFor="reg-name" className="field-label">
                {t('fullName')}
              </label>
              <input {...register('name')} {...field('name')} autoComplete="name" className="field" />
              {error('name')}
            </div>
            <div>
              <label htmlFor="reg-email" className="field-label">
                {t('email')}
              </label>
              <input {...register('email')} {...field('email')} type="email" autoComplete="email" className="field" />
              {error('email')}
            </div>
            <div>
              <label htmlFor="reg-propertyType" className="field-label">
                {t('propertyType')}
              </label>
              <select {...register('propertyType')} {...field('propertyType')} className="field">
                <option value="" disabled>
                  {tf('choose')}
                </option>
                {PROPERTY_TYPES.map((p) => (
                  <option key={p} value={p}>
                    {tf(`propertyTypes.${p}`)}
                  </option>
                ))}
              </select>
              {error('propertyType')}
            </div>
            <button type="submit" className="btn btn-primary w-full">
              {t('submit')}
            </button>
            <p className="text-center text-[0.8125rem] text-mist">{t('microcopy')}</p>
          </form>
          <p className="mt-6 text-center text-[0.9375rem] text-mist">
            {t('haveAccount')}{' '}
            <Link href="/account/login" className="btn-link">
              {t('signIn')}
            </Link>
          </p>
        </div>

        <section aria-labelledby="reg-tiers" className="mt-24">
          <h2 id="reg-tiers" className="text-[0.9375rem] font-medium text-mist">
            {t('tiersTitle')}
          </h2>
          <ul className="no-scrollbar -mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
            {TIERS.map((tier) => (
              <li key={tier.id} className="w-[78%] shrink-0 snap-start md:w-auto">
                <MemberCard
                  tier={tier.id}
                  name={tier.tagline}
                  points={tier.points === 0 ? 'Free' : tier.points.toLocaleString('en-US')}
                  pointsLabel={tier.points === 0 ? undefined : 'pts'}
                />
                <p className="mt-3 text-[0.875rem] text-mist">{tier.perk}</p>
                <p className="num mt-0.5 text-[0.75rem] text-moss">
                  {tier.points === 0 ? '0 pts' : tl('from', { points: tier.points.toLocaleString('en-US') })}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
