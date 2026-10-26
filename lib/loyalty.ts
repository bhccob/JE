// The Circle: tiers, rewards and mock member data. Front-end only, nothing here is sent anywhere.
export type TierId = 'sunbeam' | 'tradewind' | 'solarflare' | 'eclipse';

export interface Tier {
  id: TierId;
  name: string;
  points: number;
  perk: string;
  tagline: string;
  /** Card face gradient, from -> to. */
  gradient: [string, string];
  /** Text color that clears AA on the gradient. */
  ink: string;
  inkSoft: string;
  finish: 'matte' | 'brushed' | 'glow' | 'rim';
  backPercent: number;
}

export const TIERS: Tier[] = [
  {
    id: 'sunbeam',
    name: 'Sunbeam',
    points: 0,
    perk: 'Welcome bonus 500 pts',
    tagline: 'Where every member starts.',
    gradient: ['#F3E1B5', '#E8C67A'],
    ink: '#2B2212',
    inkSoft: '#5A4A2A',
    finish: 'matte',
    backPercent: 0,
  },
  {
    id: 'tradewind',
    name: 'Trade Wind',
    points: 1000,
    perk: '2% back on all LED',
    tagline: 'For the steady savers.',
    gradient: ['#D9E2EC', '#B8C4D0'],
    ink: '#16202B',
    inkSoft: '#3A4756',
    finish: 'brushed',
    backPercent: 2,
  },
  {
    id: 'solarflare',
    name: 'Solar Flare',
    points: 2500,
    perk: 'Priority install slots, 5% back',
    tagline: 'For the solar-curious.',
    gradient: ['#F5A623', '#D97E05'],
    ink: '#2A1500',
    inkSoft: '#4A2A05',
    finish: 'glow',
    backPercent: 5,
  },
  {
    id: 'eclipse',
    name: 'Eclipse',
    points: 6000,
    perk: 'Free annual maintenance, 8% back, dedicated manager',
    tagline: 'For the fully powered.',
    gradient: ['#0B2545', '#3A2E6B'],
    ink: '#F4F1FA',
    inkSoft: '#C9C3DE',
    finish: 'rim',
    backPercent: 8,
  },
];

export const tierById = (id: TierId) => TIERS.find((t) => t.id === id) ?? TIERS[0];

export function tierForPoints(points: number): Tier {
  return [...TIERS].reverse().find((t) => points >= t.points) ?? TIERS[0];
}

export function nextTier(id: TierId): Tier | null {
  const i = TIERS.findIndex((t) => t.id === id);
  return i >= 0 && i < TIERS.length - 1 ? TIERS[i + 1] : null;
}

export interface Reward {
  id: string;
  title: string;
  points: number;
  description: string;
}

export const REWARDS: Reward[] = [
  { id: 'led50', title: '50 AWG off any LED order', points: 1000, description: 'Applied at checkout on bulbs, panels or strips.' },
  { id: 'inspect', title: 'Free installation inspection', points: 1500, description: 'A technician checks wiring, mounts and output.' },
  { id: 'clean', title: 'Free panel cleaning', points: 800, description: 'Salt and dust off. Up to 12 panels.' },
  { id: 'quote100', title: '100 AWG off your solar quote', points: 2500, description: 'Taken off any new system or expansion.' },
  { id: 'thermostat', title: 'Free smart thermostat', points: 4000, description: 'Installed and paired with your monitoring app.' },
];

export type PropertyType = 'home' | 'apartment' | 'hotel' | 'business' | 'other';
export const PROPERTY_TYPES: PropertyType[] = ['home', 'apartment', 'hotel', 'business', 'other'];

export interface Member {
  name: string;
  email: string;
  tier: TierId;
  points: number;
  memberId: string;
  referralCode: string;
  memberSince: string;
  propertyType?: PropertyType;
}

/**
 * FNV-1a, 32-bit. Deterministic and dependency-free so a given email always maps to the
 * same member ID / referral code across reloads. Not a security primitive.
 */
export function hashString(input: string, seed = 0x811c9dc5): number {
  let h = seed >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

const ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Draw n symbols by re-hashing with a per-symbol seed, so every position gets fresh entropy.
function pick(input: string, alphabet: string, n: number, salt: string) {
  let out = '';
  for (let i = 0; i < n; i++) out += alphabet[hashString(`${salt}:${i}:${input}`) % alphabet.length];
  return out;
}

export function memberIdFromEmail(email: string) {
  const key = email.trim().toLowerCase();
  return `JNT-${pick(key, ID_ALPHABET, 4, 'a')}-${pick(key, ID_ALPHABET, 4, 'b')}`;
}

export function referralCodeFromEmail(email: string) {
  return `JNT-${pick(email.trim().toLowerCase(), LETTERS, 6, 'ref')}`;
}

export function nameFromEmail(email: string) {
  const local = email.split('@')[0] ?? '';
  const words = local
    .split(/[._\-+]+/)
    .map((w) => w.replace(/\d+/g, ''))
    .filter(Boolean);
  if (!words.length) return 'Circle Member';
  return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export function memberSinceFromEmail(email: string) {
  const h = hashString(email.trim().toLowerCase(), 0x9e3779b9);
  const year = 2023 + (h % 3);
  const month = 1 + ((h >>> 3) % 12);
  const day = 1 + ((h >>> 7) % 27);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || 'JC'
  );
}

export const PREVIEW_MEMBER: Member = {
  name: 'Alex Croes',
  email: 'alex@example.com',
  tier: 'solarflare',
  points: 3240,
  memberId: 'JNT-AB12-CD34',
  referralCode: referralCodeFromEmail('alex@example.com'),
  memberSince: '2024-03-18',
  propertyType: 'home',
};

export function fabricateMember(email: string, name?: string, propertyType?: PropertyType): Member {
  return {
    name: name?.trim() || nameFromEmail(email),
    email: email.trim(),
    tier: 'solarflare',
    points: 3240,
    memberId: memberIdFromEmail(email),
    referralCode: referralCodeFromEmail(email),
    memberSince: memberSinceFromEmail(email),
    propertyType,
  };
}

export interface ActivityRow {
  id: string;
  date: string;
  description: string;
  points: number;
}

// Ten static rows; they sum to the mock balance of 3,240.
export const MOCK_ACTIVITY: ActivityRow[] = [
  { id: 'a10', date: '2026-10-14', description: 'Connector & Cable Kit', points: 170 },
  { id: 'a09', date: '2026-09-02', description: 'Roof Mounting Kit add-on', points: 340 },
  { id: 'a08', date: '2026-08-21', description: 'Referral: Maritza K.', points: 500 },
  { id: 'a07', date: '2026-07-09', description: 'Battery inspection', points: 150 },
  { id: 'a06', date: '2026-06-17', description: 'Redeemed: Free panel cleaning', points: -800 },
  { id: 'a05', date: '2026-05-03', description: 'Panel cleaning service', points: 180 },
  { id: 'a04', date: '2026-02-26', description: 'Ceiling Panel 60, 4 units', points: 620 },
  { id: 'a03', date: '2025-12-11', description: 'LED retrofit, 24 Filament A60 bulbs', points: 1080 },
  { id: 'a02', date: '2025-06-30', description: 'Referral: Ruben T.', points: 500 },
  { id: 'a01', date: '2024-03-18', description: 'Welcome bonus', points: 500 },
];

export const LOYALTY_RATES = {
  pointsPerAwg: 1,
  referralPoints: 500,
  maxBackPercent: 8,
  refereeDiscountPercent: 5,
} as const;
