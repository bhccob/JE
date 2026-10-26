// Sample catalog. Replace names and specs with supplier datasheets before launch.
export const CATEGORIES = ['panels', 'inverters', 'batteries', 'led', 'streetLights', 'accessories'] as const;
export type Category = (typeof CATEGORIES)[number];

export type ModelKind = 'panel' | 'inverter' | 'battery' | 'bulb' | 'ledPanel' | 'streetLight' | 'rail' | 'connector';

export interface Product {
  id: string;
  name: string;
  category: Category;
  kind: ModelKind;
  variant?: 'bifacial' | 'commercial' | 'large' | 'solar';
  tagline: string;
  headline: string;
  specs: { label: string; value: string }[];
  /** Poster colors for the DOM fallback and the /store grid. */
  swatch: [string, string];
}

export const products: Product[] = [
  {
    id: 'mono-450',
    name: 'Mono 450',
    category: 'panels',
    kind: 'panel',
    tagline: 'The everyday rooftop panel.',
    headline: '450 W',
    specs: [
      { label: 'Power', value: '450 W' },
      { label: 'Efficiency', value: '21.5%' },
      { label: 'Cells', value: '144 half-cut mono' },
      { label: 'Warranty', value: '25 yr performance' },
    ],
    swatch: ['#123a5a', '#0b1a2b'],
  },
  {
    id: 'bifacial-550',
    name: 'Bifacial 550',
    category: 'panels',
    kind: 'panel',
    variant: 'bifacial',
    tagline: 'Glass on both sides, for carports and flat roofs.',
    headline: '550 W',
    specs: [
      { label: 'Power', value: '550 W' },
      { label: 'Efficiency', value: '22.3%' },
      { label: 'Build', value: 'Glass-glass' },
      { label: 'Warranty', value: '30 yr performance' },
    ],
    swatch: ['#1b4a6b', '#0d2236'],
  },
  {
    id: 'hybrid-8',
    name: 'Hybrid Inverter 8 kW',
    category: 'inverters',
    kind: 'inverter',
    tagline: 'Runs the panels and the battery from one box.',
    headline: '8 kW',
    specs: [
      { label: 'Output', value: '8 kW single-phase' },
      { label: 'Battery ready', value: 'Yes, 48 V' },
      { label: 'Monitoring', value: 'Wi-Fi + app' },
      { label: 'Warranty', value: '10 yr' },
    ],
    swatch: ['#2b3a34', '#121a17'],
  },
  {
    id: 'string-15',
    name: 'String Inverter 15 kW',
    category: 'inverters',
    kind: 'inverter',
    variant: 'commercial',
    tagline: 'Three-phase output for hotels and shops.',
    headline: '15 kW',
    specs: [
      { label: 'Output', value: '15 kW three-phase' },
      { label: 'MPPT inputs', value: '2' },
      { label: 'Enclosure', value: 'IP66, salt-mist tested' },
      { label: 'Warranty', value: '10 yr' },
    ],
    swatch: ['#33403a', '#151d19'],
  },
  {
    id: 'stack-10',
    name: 'Modular Stack 10',
    category: 'batteries',
    kind: 'battery',
    tagline: 'Two modules. Evenings and short outages covered.',
    headline: '10 kWh',
    specs: [
      { label: 'Capacity', value: '10 kWh' },
      { label: 'Chemistry', value: 'LiFePO4' },
      { label: 'Expandable', value: 'Up to 30 kWh' },
      { label: 'Warranty', value: '10 yr' },
    ],
    swatch: ['#dfe7e2', '#9fb0a6'],
  },
  {
    id: 'stack-20',
    name: 'Modular Stack 20',
    category: 'batteries',
    kind: 'battery',
    variant: 'large',
    tagline: 'Four modules. Run the whole house through the night.',
    headline: '20 kWh',
    specs: [
      { label: 'Capacity', value: '20 kWh' },
      { label: 'Chemistry', value: 'LiFePO4' },
      { label: 'Backup switch', value: 'Under 20 ms' },
      { label: 'Warranty', value: '10 yr' },
    ],
    swatch: ['#e4ece7', '#a7b8ae'],
  },
  {
    id: 'filament-a60',
    name: 'Filament A60',
    category: 'led',
    kind: 'bulb',
    tagline: 'Looks like a classic bulb. Uses a ninth of the power.',
    headline: '7 W',
    specs: [
      { label: 'Power', value: '7 W (60 W equal)' },
      { label: 'Color', value: '3000-6400 K tunable' },
      { label: 'Base', value: 'E27' },
      { label: 'Life', value: '25,000 h' },
    ],
    swatch: ['#5a4318', '#1d160a'],
  },
  {
    id: 'panel-600',
    name: 'Ceiling Panel 60',
    category: 'led',
    kind: 'ledPanel',
    tagline: 'Flat, even light for offices and shops.',
    headline: '36 W',
    specs: [
      { label: 'Power', value: '36 W' },
      { label: 'Size', value: '60 x 60 cm' },
      { label: 'Color', value: '4000 K' },
      { label: 'Life', value: '50,000 h' },
    ],
    swatch: ['#d8dde0', '#8e989e'],
  },
  {
    id: 'solar-street-60',
    name: 'Solar Street Light 60',
    category: 'streetLights',
    kind: 'streetLight',
    variant: 'solar',
    tagline: 'Its own panel and battery. No trenching, no bill.',
    headline: '60 W',
    specs: [
      { label: 'Power', value: '60 W LED' },
      { label: 'Autonomy', value: '3 nights' },
      { label: 'Sensor', value: 'Dusk + motion' },
      { label: 'Pole', value: '6 m' },
    ],
    swatch: ['#2a3a44', '#10181d'],
  },
  {
    id: 'street-120',
    name: 'Street Light 120',
    category: 'streetLights',
    kind: 'streetLight',
    tagline: 'Grid-tied road and parking lighting.',
    headline: '120 W',
    specs: [
      { label: 'Power', value: '120 W LED' },
      { label: 'Output', value: '16,800 lm' },
      { label: 'Enclosure', value: 'IP66' },
      { label: 'Pole', value: '8 m' },
    ],
    swatch: ['#31404a', '#141b20'],
  },
  {
    id: 'rail-kit',
    name: 'Roof Mounting Kit',
    category: 'accessories',
    kind: 'rail',
    tagline: 'Anodized rails and clamps rated for island winds.',
    headline: '4 panels',
    specs: [
      { label: 'Material', value: 'Anodized aluminum' },
      { label: 'Fits', value: 'Zinc, concrete, tile' },
      { label: 'Wind rating', value: 'Category 4' },
      { label: 'Includes', value: 'Rails, clamps, bolts' },
    ],
    swatch: ['#b9c2c6', '#6c767b'],
  },
  {
    id: 'mc4-kit',
    name: 'Connector & Cable Kit',
    category: 'accessories',
    kind: 'connector',
    tagline: 'UV-rated cable and MC4 connectors, cut to length.',
    headline: '6 mm²',
    specs: [
      { label: 'Cable', value: '6 mm² solar DC' },
      { label: 'Connectors', value: 'MC4, IP68' },
      { label: 'UV rated', value: 'Yes' },
      { label: 'Length', value: 'Cut to order' },
    ],
    swatch: ['#3b2a24', '#16100d'],
  },
];

export const productById = (id: string) => products.find((p) => p.id === id);
