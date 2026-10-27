// Colour temperature for the LED bulb slider. The store carries bulbs from warm 3000K to daylight 6500K (the owner's
// range); the bulb is rendered at eight temperatures and the slider mixes the two nearest renders.

export type KelvinName = 'Warm white' | 'Neutral white' | 'Daylight';

const clampByte = (v: number) => Math.round(Math.min(255, Math.max(0, v)));

/** Approximate sRGB of a black body at `k` kelvin (Tanner Helland's fit), clamped to 1000-40000K. */
export function kelvinToRgb(k: number): [number, number, number] {
  const t = (Number.isFinite(k) ? Math.min(40000, Math.max(1000, k)) : 6500) / 100;
  const r = t <= 66 ? 255 : 329.698727446 * (t - 60) ** -0.1332047592;
  const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * (t - 60) ** -0.0755148492;
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  return [clampByte(r), clampByte(g), clampByte(b)];
}

export function kelvinLabel(k: number): KelvinName {
  if (k < 3500) return 'Warm white';
  if (k < 5000) return 'Neutral white';
  return 'Daylight';
}

/** "4000 K, neutral white", for the slider's aria-valuetext. */
export function kelvinValueText(k: number): string {
  return `${Math.round(k)} K, ${kelvinLabel(k).toLowerCase()}`;
}

/** The two rendered stills either side of `k` (ascending kelvin list) and the mix from a to b. */
export function kelvinStill(k: number, stills: number[]): { a: number; b: number; t: number } {
  const last = stills.length - 1;
  const v = Math.min(stills[last], Math.max(stills[0], k));
  let a = 0;
  while (a < last && stills[a + 1] <= v) a++;
  if (a === last) return { a: last, b: last, t: 0 };
  return { a, b: a + 1, t: (v - stills[a]) / (stills[a + 1] - stills[a]) };
}
