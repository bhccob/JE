import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

// /account, /account/login and /account/register are never indexed (and are left out of the sitemap).
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('accountTitle'),
    robots: { index: false, follow: false },
  };
}

export default function AccountLayout({ children }: { children: ReactNode }) {
  return children;
}
