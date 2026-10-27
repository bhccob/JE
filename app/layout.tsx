import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { Hanken_Grotesk } from 'next/font/google';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { CursorGlow } from '@/components/ui/CursorGlow';
import { RevealObserver } from '@/components/ui/RevealObserver';
import { SITE_URL, STORE } from '@/lib/store';
import './globals.css';

const gambetta = localFont({
  src: [
    { path: './fonts/Gambetta-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Gambetta-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-gambetta',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken', display: 'swap' });

const title = 'Jontai Energy | Solar, power, lighting and furniture in Oranjestad, Aruba';
const description =
  'A retail store at Cumana 73, Oranjestad: solar panels, inverters, generators, power stations, LED lighting, solar cameras and solar air conditioning, with furniture on the second floor. Large-item delivery available.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: { type: 'website', title: 'Jontai Energy', description, locale: 'en', siteName: 'Jontai Energy' },
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#f7f5ec',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const HEAD_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');
try{var c=navigator.connection;if(matchMedia('(prefers-reduced-motion: reduce)').matches||(c&&c.saveData)||!window.createImageBitmap)d.classList.add('still')}catch(e){}
try{if(location.pathname==='/'&&!sessionStorage.getItem('jontai-daybreak'))d.classList.add('before-dawn')}catch(e){}})()`;

// Verified business facts only (lib/store.ts). Hours confirmed by the owner on 2026-10-27.
const store = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: STORE.name,
  description,
  url: SITE_URL,
  telephone: STORE.phone,
  email: STORE.email,
  address: { '@type': 'PostalAddress', streetAddress: STORE.street, addressLocality: STORE.city, addressCountry: 'AW' },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '10:00', closes: '14:00' },
  ],
  sameAs: [STORE.facebook, STORE.instagram],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${gambetta.variable} ${hanken.variable}`} suppressHydrationWarning>
      <head>
        {/* Before paint: mark scripting on (reveals and the film need it), choose stills over the film for reduced
            motion, Save-Data or a browser that cannot decode frames off the main thread, cover the home page with the
            loading screen on the first visit of the session, and apply the remembered day/night colours (day unless the visitor chose evening) so the page never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <RevealObserver />
        <CursorGlow />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(store) }} />
      </body>
    </html>
  );
}
