import type { PartialMessages } from './en';

// Dutch. Nav + hero only; everything else falls back to English.
// TODO: translate the remaining sections.
const nl: PartialMessages = {
  nav: {
    solar: 'Zonne-energie',
    store: 'Winkel',
    circle: 'The Circle',
    quote: 'Offerte aanvragen',
    account: 'Account',
    menu: 'Menu',
    close: 'Sluiten',
    language: 'Taal',
    skip: 'Naar de inhoud',
  },
  hero: {
    line1: 'Jouw eiland.',
    line2: 'Jouw zon.',
    line3: 'Jouw energie.',
    tagline: 'Vang de zon. Verlicht het eiland.',
    explore: 'Ontdek zonne-energie',
    quote: 'Offerte aanvragen',
    scroll: 'Scroll',
  },
};

export default nl;
