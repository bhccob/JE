'use client';

import { Copy, UsersThree } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function ReferralWidget({ code }: { code: string }) {
  const t = useTranslations('account');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); fall back to a hidden textarea.
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    toast.success(t('copied'));
  };

  return (
    <section aria-labelledby="referral-title" className="surface p-5">
      <span className="grid size-10 place-items-center rounded-full bg-leaf-400/10 text-leaf-300">
        <UsersThree size={20} aria-hidden="true" />
      </span>
      <h2 id="referral-title" className="mt-4 font-medium text-bone">
        {t('referralTitle')}
      </h2>
      <p className="mt-1 text-[0.875rem] text-mist">{t('referralLine')}</p>
      <p className="mt-5 text-[0.75rem] text-moss" id="referral-code-label">
        {t('referralCodeLabel')}
      </p>
      <div className="mt-1.5 flex items-center gap-2 rounded-[12px] border border-white/12 bg-night-950/60 p-1.5 pl-4">
        <code aria-labelledby="referral-code-label" className="num flex-1 text-[1.0625rem] tracking-wide text-bone">
          {code}
        </code>
        <button type="button" onClick={copy} className="btn btn-primary btn-sm">
          <Copy size={16} aria-hidden="true" />
          {t('copy')}
        </button>
      </div>
    </section>
  );
}
