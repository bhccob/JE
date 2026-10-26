'use client';

import { useMemo, type CSSProperties } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useLoyaltyStore } from '@/lib/loyaltyStore';
import { TIERS } from '@/lib/loyalty';
import { Badge } from '@/components/ui/Badge';
import { MemberCard } from './MemberCard';

// Back to front: -8°, 0°, +8°, each a little lower. Only the front card tilts.
const LOGIN_FAN = [
  { id: 'sunbeam', rz: -8, x: '-14%', y: '-16%' },
  { id: 'tradewind', rz: 0, x: '0%', y: '0%' },
  { id: 'solarflare', rz: 8, x: '14%', y: '16%' },
] as const;

/**
 * Mock sign-in. Nothing here touches the network: the password lives only in the form state for
 * validation and is never stored; signIn() receives the email alone.
 */
export function LoginView() {
  const t = useTranslations('login');
  const router = useRouter();
  const signIn = useLoyaltyStore((s) => s.signIn);
  const preview = useLoyaltyStore((s) => s.preview);

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().trim().email(t('errors.email')),
        password: z.string().min(6, t('errors.password')),
      }),
    [t],
  );
  type Values = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const onSubmit = ({ email }: Values) => {
    signIn({ email });
    router.push('/account');
  };
  const onPreview = () => {
    preview();
    router.push('/account');
  };

  return (
    <main id="main" className="grid min-h-dvh pt-[var(--header-h)] lg:grid-cols-2">
      <div className="relative hidden flex-col items-center justify-center overflow-hidden border-r border-white/[0.06] px-10 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(60% 50% at 50% 45%, rgb(245 166 35 / 0.12), transparent 70%)' }}
        />
        <div className="relative aspect-[16/12] w-full max-w-[520px] [perspective:1600px]">
          {LOGIN_FAN.map((c, k) => {
            const tier = TIERS.find((x) => x.id === c.id)!;
            return (
              <div
                key={c.id}
                className="absolute left-1/2 top-1/2 w-[76%]"
                style={{ zIndex: k + 1, transform: `translate(-50%, -50%) translate(${c.x}, ${c.y}) rotate(${c.rz}deg)` }}
              >
                <div className="hero-in" style={{ '--i': k } as CSSProperties}>
                  <MemberCard
                    tier={tier.id}
                    name={tier.tagline}
                    points={tier.points === 0 ? 'Free' : tier.points.toLocaleString('en-US')}
                    pointsLabel={tier.points === 0 ? undefined : 'pts'}
                    tilt={k === LOGIN_FAN.length - 1}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="relative mt-16 font-serif text-[1.5rem] tracking-tight text-sun-300">{t('caption')}</p>
      </div>

      <div className="flex items-center justify-center px-4 py-14 md:px-8">
        <div className="surface-solid w-full max-w-[440px] p-6 md:p-9">
          <h1 className="font-display text-[2.25rem] font-semibold leading-tight tracking-[-0.03em] text-bone">{t('title')}</h1>
          <p className="mt-2 text-mist">{t('body')}</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-5">
            <div>
              <label htmlFor="login-email" className="field-label">
                {t('email')}
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                {...register('email')}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
                className="field"
              />
              {errors.email && (
                <p id="login-email-error" role="alert" className="field-error">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="login-password" className="field-label">
                {t('password')}
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={errors.password ? 'login-password-error' : 'login-password-help'}
                className="field"
              />
              {errors.password ? (
                <p id="login-password-error" role="alert" className="field-error">
                  {errors.password.message}
                </p>
              ) : (
                <p id="login-password-help" className="field-help">
                  {t('passwordHelp')}
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-full">
              {t('submit')}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4 text-[0.8125rem] text-moss" aria-hidden="true">
            <span className="h-px flex-1 bg-white/10" />
            {t('or')}
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <button type="button" onClick={onPreview} className="btn btn-ghost w-full">
            <Eye size={18} aria-hidden="true" />
            {t('preview')}
            <Badge tone="sun" className="ml-1">
              {t('demoOnly')}
            </Badge>
          </button>

          <p className="mt-8 text-center text-[0.9375rem] text-mist">
            {t('noAccount')}{' '}
            <Link href="/account/register" className="btn-link">
              {t('join')}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
