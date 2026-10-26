import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Bricolage_Grotesque, Fraunces } from 'next/font/google';
import { Toaster } from 'sonner';
import { Header } from '@/components/ui/Header';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { DemoBanner } from '@/components/ui/DemoBanner';
import { isLocale, locales } from '@/i18n/routing';
import { BUSINESS, SITE_URL } from '@/lib/site';
import '../globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-bricolage',
  display: 'swap',
});

// Fraunces is reserved for The Circle (tier names, member cards).
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  variable: '--font-fraunces',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(SITE_URL),
    title: t('siteTitle'),
    description: t('siteDescription'),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: 'website',
      siteName: BUSINESS.name,
      title: t('siteTitle'),
      description: t('siteDescription'),
      images: [{ url: '/og.png', width: 1200, height: 630, alt: BUSINESS.name }],
      locale,
    },
    twitter: { card: 'summary_large_image', images: ['/og.png'] },
    icons: { icon: '/icon.svg' },
  };
}

export const viewport: Viewport = {
  themeColor: '#050c08',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: BUSINESS.name,
  description: 'Solar panels, batteries and LED lighting, designed and installed in Aruba.',
  url: SITE_URL,
  image: `${SITE_URL}/og.png`,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.street,
    addressLocality: BUSINESS.city,
    addressCountry: BUSINESS.country,
  },
  areaServed: 'Aruba',
  priceRange: '$$',
};

export default async function LocaleLayout({ children, params: { locale } }: { children: ReactNode; params: { locale: string } }) {
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'nav' });

  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable} ${bricolage.variable} ${fraunces.variable}`}>
      <body>
        <noscript>
          <style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <div aria-hidden="true" id="top-sentinel" className="pointer-events-none absolute inset-x-0 top-0 h-6" />
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main"
            className="sr-only z-[90] rounded-full bg-bone px-4 py-2 text-night-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            {t('skip')}
          </a>
          <Header />
          <DemoBanner />
          {children}
          <WhatsAppButton />
        </NextIntlClientProvider>
        <Toaster
          theme="dark"
          position="bottom-center"
          offset={88}
          toastOptions={{
            style: {
              background: '#0f2018',
              border: '1px solid rgba(234,241,235,0.12)',
              color: '#eaf1eb',
              borderRadius: '16px',
              fontFamily: 'var(--font-geist-sans)',
            },
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      </body>
    </html>
  );
}
