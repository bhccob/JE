'use client';

import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { BUSINESS } from '@/lib/site';

export function WhatsAppButton() {
  const t = useTranslations('common');
  return (
    <a
      href={BUSINESS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp')}
      className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-50 flex items-center md:right-6"
    >
      <span className="pointer-events-none mr-3 hidden translate-x-2 rounded-full border border-white/10 bg-night-800/90 px-4 py-2 text-sm text-bone opacity-0 backdrop-blur-md transition-[opacity,transform] duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block">
        {t('whatsapp')}
      </span>
      <span className="grid size-14 place-items-center rounded-full bg-leaf-400 text-night-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_14px_34px_-10px_rgba(99,215,155,0.65)] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-active:scale-95">
        <WhatsappLogo size={28} weight="fill" aria-hidden="true" />
      </span>
    </a>
  );
}
