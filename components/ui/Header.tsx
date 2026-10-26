'use client';

import { useEffect, useRef, useState } from 'react';
import { List, X } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useHydrated } from '@/lib/hooks';
import { useLoyaltyStore } from '@/lib/loyaltyStore';
import { useQuoteStore } from '@/lib/quoteStore';
import { initials } from '@/lib/loyalty';
import { clsx } from '@/lib/clsx';
import { Wordmark } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const hydrated = useHydrated();
  const count = useQuoteStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const user = useLoyaltyStore((s) => s.user);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sentinel = document.getElementById('top-sentinel');
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector<HTMLElement>('a,button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const links = [
    { href: '/#capture', label: t('solar') },
    { href: '/store', label: t('store') },
    { href: '/loyalty', label: t('circle') },
  ] as const;

  const quoteCount = hydrated ? count : 0;

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-40 h-[var(--header-h)] transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-out-expo)]',
        scrolled || open ? 'border-b border-white/[0.06] bg-night-950/75 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center gap-6 px-4 md:px-8">
        <Link href="/" aria-label={t('home')} className="shrink-0 rounded-full">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                'rounded-full px-3.5 py-2 text-[0.9375rem] transition-colors duration-300',
                pathname === l.href ? 'text-bone' : 'text-mist hover:text-bone',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <LanguageSwitcher className="hidden sm:flex" />
          {hydrated && user && (
            <Link
              href="/account"
              aria-label={t('account')}
              className="hidden size-9 place-items-center rounded-full border border-sun-400/40 bg-sun-400/10 font-mono text-xs text-sun-300 transition-colors hover:bg-sun-400/20 sm:grid"
            >
              {initials(user.name)}
            </Link>
          )}
          <Link href="/quote" className="btn btn-primary btn-sm hidden sm:inline-flex">
            {t('quote')}
            {quoteCount > 0 && (
              <span className="num -mr-1 grid h-5 min-w-5 place-items-center rounded-full bg-night-950 px-1.5 text-[0.6875rem] text-leaf-300">
                <span aria-hidden="true">{quoteCount}</span>
                <span className="sr-only">{t('quoteCount', { count: quoteCount })}</span>
              </span>
            )}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            className="btn btn-ghost btn-sm !px-3 lg:hidden"
          >
            {open ? <X size={18} aria-hidden="true" /> : <List size={18} aria-hidden="true" />}
            <span>{open ? t('close') : t('menu')}</span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="site-menu"
          ref={menuRef}
          className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 flex flex-col gap-10 overflow-y-auto bg-night-950/95 px-4 pb-10 pt-8 backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {[...links, { href: '/quote', label: t('quote') }, ...(user ? [{ href: '/account', label: t('account') }] : [])].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/[0.06] py-4 font-display text-[2rem] font-semibold tracking-[-0.03em] text-bone"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher className="self-start" />
        </div>
      )}
    </header>
  );
}
