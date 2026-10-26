import type { PartialMessages } from './en';

// Papiamento (Aruba). Nav + hero only; everything else falls back to English.
// TODO: translate the remaining sections, and have a native speaker review these lines.
const pap: PartialMessages = {
  nav: {
    solar: 'Solar',
    store: 'Tienda',
    circle: 'The Circle',
    quote: 'Pidi un cotisacion',
    account: 'Cuenta',
    menu: 'Menu',
    close: 'Cera',
    language: 'Idioma',
    skip: 'Bai na e contenido',
  },
  hero: {
    line1: 'Bo isla.',
    line2: 'Bo solo.',
    line3: 'Bo energia.',
    tagline: 'Captura e solo. Ilumina e isla.',
    explore: 'Descubri solar',
    quote: 'Pidi un cotisacion',
    scroll: 'Baha',
  },
};

export default pap;
