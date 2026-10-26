import type { Metadata } from 'next';
import { ArrowUpRight, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { BUSINESS } from '@/lib/site';
import { QuoteForm } from '@/components/ui/QuoteForm';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('quoteTitle'),
    description: t('quoteDescription'),
    alternates: { canonical: `/${locale}/quote` },
    openGraph: { title: t('quoteTitle'), description: t('quoteDescription'), images: ['/og.png'] },
  };
}

export default async function QuotePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('quotePage');
  const f = await getTranslations('footer');
  return (
    <main id="main" className="pb-28 pt-[calc(var(--header-h)+48px)]">
      <div className="page-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h1 className="display text-[clamp(2.75rem,6vw,5rem)]">{t('title')}</h1>
          <p className="lede mt-5">{t('body')}</p>
          <div className="mt-10 flex flex-col gap-3 text-[0.9375rem]">
            <a href={BUSINESS.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost self-start">
              <WhatsappLogo size={18} weight="fill" aria-hidden="true" />
              {f('whatsapp')}
            </a>
            <Link href="/store" className="btn-link inline-flex items-center gap-1 self-start">
              {t('browse')}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 text-[0.9375rem]">
            <div>
              <dt className="text-moss">{f('visit')}</dt>
              <dd className="mt-1.5 text-bone">{f('address')}</dd>
            </div>
            <div>
              <dt className="text-moss">{f('talk')}</dt>
              <dd className="mt-1.5">
                <a href={`mailto:${BUSINESS.email}`} className="btn-link">
                  {f('email')}
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="surface-solid p-6 md:p-8">
            <QuoteForm showItems idPrefix="quote" />
          </div>
        </div>
      </div>
    </main>
  );
}
