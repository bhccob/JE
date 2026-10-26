import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { StoreGrid } from '@/components/sections/StoreGrid';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('storeTitle'),
    description: t('storeDescription'),
    alternates: { canonical: `/${locale}/store` },
    openGraph: { title: t('storeTitle'), description: t('storeDescription'), images: ['/og.png'] },
  };
}

export default async function StorePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('store');
  return (
    <main id="main" className="pb-28 pt-[calc(var(--header-h)+48px)]">
      <div className="page-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <h1 className="display text-[clamp(2.75rem,6vw,5rem)]">{t('title')}</h1>
            <p className="lede mt-5">{t('body')}</p>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] lg:col-span-6">
            {/* TODO: replace with a photo of the real showroom */}
            <Image src="/media/showroom.webp" alt="" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
        <StoreGrid />
      </div>
    </main>
  );
}
