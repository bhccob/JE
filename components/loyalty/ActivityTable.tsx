'use client';

import { Sun } from '@phosphor-icons/react/dist/ssr';
import { useLocale, useTranslations } from 'next-intl';
import type { ActivityRow } from '@/lib/loyalty';
import { clsx } from '@/lib/clsx';

export function ActivityTable({ rows, caption }: { rows: ActivityRow[]; caption: string }) {
  const t = useTranslations('account');
  const locale = useLocale();
  const fmt = new Intl.DateTimeFormat(locale === 'pap' ? 'nl' : locale, { day: 'numeric', month: 'short', year: 'numeric' });

  if (!rows.length) {
    return (
      <div className="surface flex flex-col items-center px-6 py-14 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-sun-400/10 text-sun-300">
          <Sun size={22} aria-hidden="true" />
        </span>
        <p className="mt-4 font-medium text-bone">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="surface overflow-hidden">
      <table className="w-full text-left text-[0.9375rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="text-[0.75rem] text-moss">
            <th scope="col" className="px-5 py-3 font-medium">
              {t('columns.date')}
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              {t('columns.description')}
            </th>
            <th scope="col" className="px-5 py-3 text-right font-medium">
              {t('columns.points')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-white/[0.06]">
              <td className="num whitespace-nowrap px-5 py-3.5 text-[0.8125rem] text-mist">{fmt.format(new Date(`${r.date}T12:00:00`))}</td>
              <td className="px-5 py-3.5 text-bone">{r.description}</td>
              <td className={clsx('num whitespace-nowrap px-5 py-3.5 text-right', r.points >= 0 ? 'text-leaf-300' : 'text-mist')}>
                {r.points >= 0 ? '+' : '−'}
                {Math.abs(r.points).toLocaleString('en-US')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
