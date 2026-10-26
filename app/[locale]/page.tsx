import { setRequestLocale } from 'next-intl/server';
import { ScrollDirector } from '@/components/sections/ScrollDirector';
import { Stage3D } from '@/components/sections/Stage3D';
import { Hero } from '@/components/sections/Hero';
import { Source } from '@/components/sections/Source';
import { Capture } from '@/components/sections/Capture';
import { Storage } from '@/components/sections/Storage';
import { Light } from '@/components/sections/Light';
import { Collection } from '@/components/sections/Collection';
import { Loyalty } from '@/components/sections/Loyalty';
import { Impact } from '@/components/sections/Impact';
import { Commitment } from '@/components/sections/Commitment';
import { Footer } from '@/components/sections/Footer';

export default function JourneyPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return (
    <main id="main">
      <ScrollDirector />
      <Stage3D>
        <Hero />
        <Source />
        <Capture />
        <Storage />
        <Light />
        <Collection />
      </Stage3D>
      <Loyalty />
      <Impact />
      <Commitment />
      <Footer />
    </main>
  );
}
