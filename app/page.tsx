import { CatalogProvider } from '@/components/catalog/CatalogProvider';
import { Header } from '@/components/ui/Header';
import { Loader } from '@/components/home/Loader';
import { Hero } from '@/components/home/Hero';
import { InStore } from '@/components/home/InStore';
import { HOME_COPY } from '@/lib/products';
import { Statement } from '@/components/home/Statement';
import { Showroom } from '@/components/home/Showroom';
import { Numbers } from '@/components/home/Numbers';
import { Loyalty } from '@/components/sections/Loyalty';
import { Visit } from '@/components/sections/Visit';
import { Footer } from '@/components/sections/Footer';

/**
 * The type-led home page: the name, what is in the store, one statement, five product chapters, the store in numbers,
 * rewards, the visit.
 */
export default function Home() {
  return (
    <CatalogProvider>
      <Loader line={HOME_COPY.hero.title} />
      <Header />
      <main id="main">
        <Hero />
        <InStore />
        <Statement />
        <Showroom />
        <Numbers />
        <Loyalty />
        <Visit />
      </main>
      <Footer />
    </CatalogProvider>
  );
}
