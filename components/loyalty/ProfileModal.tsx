'use client';

import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useLoyaltyStore } from '@/lib/loyaltyStore';

export function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('account');
  const tr = useTranslations('register');
  const user = useLoyaltyStore((s) => s.user);
  const updateProfile = useLoyaltyStore((s) => s.updateProfile);
  const dialog = useRef<HTMLDivElement>(null);

  const schema = useMemo(
    () => z.object({ name: z.string().trim().min(2, tr('errors.name')), email: z.string().trim().email(tr('errors.email')) }),
    [tr],
  );
  type Values = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!open || !user) return;
    reset({ name: user.name, email: user.email });
    const returnTo = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => dialog.current?.querySelector<HTMLInputElement>('input')?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialog.current) {
        const nodes = dialog.current.querySelectorAll<HTMLElement>('input, button');
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
      window.removeEventListener('keydown', onKey);
      returnTo?.focus();
    };
  }, [open, user, reset, onClose]);

  if (!open || !user) return null;

  const onSubmit = (v: Values) => {
    updateProfile(v);
    toast.success(t('saved'));
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] grid place-items-center bg-night-950/80 px-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="profile-edit-title" className="surface-solid relative w-full max-w-[420px] p-6 md:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={t('cancel')}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-mist transition-colors hover:bg-white/10 hover:text-bone"
        >
          <X size={16} aria-hidden="true" />
        </button>
        <h2 id="profile-edit-title" className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-bone">
          {t('editTitle')}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-5">
          <div>
            <label htmlFor="profile-name" className="field-label">
              {t('name')}
            </label>
            <input id="profile-name" {...register('name')} aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? 'profile-name-error' : undefined} className="field" />
            {errors.name && (
              <p id="profile-name-error" role="alert" className="field-error">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="profile-email" className="field-label">
              {t('email')}
            </label>
            <input
              id="profile-email"
              type="email"
              {...register('email')}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'profile-email-error' : undefined}
              className="field"
            />
            {errors.email && (
              <p id="profile-email-error" role="alert" className="field-error">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
