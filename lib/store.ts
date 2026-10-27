// Store facts, taken from the current jontaienergy pages. Opening hours confirmed by the owner on 2026-10-27.

/** Clock hours as the site writes them: 9 -> "9:00 AM", 19 -> "7:00 PM", 18.5 -> "6:30 PM". */
export function clock(hour: number) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

const span = (days: string, from: number, to: number) => ({ days, from, to, time: `${clock(from)} to ${clock(to)}` });

export const STORE = {
  name: 'Jontai Energy',
  street: 'Cumana 73',
  city: 'Oranjestad',
  country: 'Aruba',
  hours: [span('Monday to Saturday', 9, 19), span('Sunday', 10, 14)],
  phone: '+297 586 5323',
  whatsapp: 'https://wa.me/2975865323',
  email: 'jontai@qq.com',
  facebook: 'https://www.facebook.com/JontaiEnergy/',
  instagram: 'https://instagram.com/jontaienergy',
  maps: 'https://www.google.com/maps/search/?api=1&query=Jontai%20Energy%2C%20Cumana%2073%2C%20Oranjestad%2C%20Aruba',
} as const;

/** The opening hours on a weekday, 0 being Sunday. */
export const hoursOn = (day: number) => STORE.hours[day === 0 ? 1 : 0];

/** The weekday and clock hour in Aruba (UTC-4, no daylight saving), whatever the visitor's own time zone. */
export function arubaNow(at: Date = new Date()) {
  const t = new Date(at.getTime() - 4 * 3600_000);
  return { day: t.getUTCDay(), hour: t.getUTCHours() + t.getUTCMinutes() / 60 };
}

/** Whether the store is open at a moment in Aruba, and what to say about it. The store opens every day. */
export function openState(day: number, hour: number) {
  const today = hoursOn(day);
  if (hour >= today.from && hour < today.to) return { open: true, line: `Open now, until ${clock(today.to)}` };
  if (hour < today.from) return { open: false, line: `Closed now, opens at ${clock(today.from)}` };
  return { open: false, line: `Closed now, opens tomorrow at ${clock(hoursOn((day + 1) % 7).from)}` };
}

/** The service line from the owner's brief, verbatim. */
export const SERVICE_LINE =
  'Jontai Energy is a retail store and does not provide installation services. Delivery is available for large items such as furniture.';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

/** The store's own website. */
export const OFFICIAL_URL = 'https://www.jontaienergy.com/';

/**
 * This build is a concept redesign, not the store's own site: it says so on every page, keeps out of search engines
 * and sends nothing to the store. Set NEXT_PUBLIC_OFFICIAL_SITE=1 only once the owner adopts it as the real site.
 */
export const CONCEPT = process.env.NEXT_PUBLIC_OFFICIAL_SITE !== '1';
