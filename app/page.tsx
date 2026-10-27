import { CatalogProvider } from '@/components/catalog/CatalogProvider';
import { Header } from '@/components/ui/Header';
import { DayFilm } from '@/components/film/DayFilm';
import { DayChapters } from '@/components/film/DayChapters';
import { SunDial } from '@/components/film/SunDial';
import { Loyalty } from '@/components/sections/Loyalty';
import { Visit } from '@/components/sections/Visit';
import { Footer } from '@/components/sections/Footer';

/** One Aruban day: dawn on the panel to the morning after upstairs, then loyalty and the visit. */
export default function Home() {
  return (
    <CatalogProvider>
      <Header />
      <main id="main">
        <DayFilm>
          <DayChapters />
        </DayFilm>
        <SunDial />
        {/* The wall and its tree shadow behind loyalty; the visit section sits apart on its own sand surface. */}
        <div className="backdrop">
          <Loyalty />
        </div>
        <Visit />
      </main>
      <Footer />
    </CatalogProvider>
  );
}
