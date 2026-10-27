import type { Metadata } from 'next';
import { CatalogProvider } from '@/components/catalog/CatalogProvider';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/sections/Footer';
import { QuoteForm } from '@/components/quote/QuoteForm';
import { StoreCard } from '@/components/quote/StoreCard';
import { Words } from '@/components/ui/Split';
import { topicsFrom } from '@/lib/quote';
import { SERVICE_LINE } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Request a quote | Jontai Energy',
  description: 'Ask Jontai Energy for current prices and stock on solar, power, lighting, cameras and furniture. Your request goes to the store by email.',
};

/** A quote request by email. `?for=` preselects what it is for (the product panels and chapters link here with one). */
export default function QuotePage({ searchParams }: { searchParams: { for?: string | string[] } }) {
  return (
    <CatalogProvider>
      <Header base="/" />
      <main id="main" className="quote">
        <div className="container quote__grid">
          {/* On phones the form comes straight after the heading, and the store's details follow it. */}
          <div className="quote__intro">
            <div className="quote__head">
              <h1 className="h-section" data-words>
                <Words text="Request a quote." />
              </h1>
              <p className="lead">Tell us what you need. Jontai Energy replies by email with current prices and what is in stock.</p>
            </div>
            <div className="quote__aside">
              <StoreCard />
              <p className="quote__service">{SERVICE_LINE}</p>
            </div>
          </div>
          <QuoteForm initial={topicsFrom(searchParams.for)} />
        </div>
      </main>
      <Footer base="/" />
    </CatalogProvider>
  );
}
