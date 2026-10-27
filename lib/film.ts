// The home page is one film of an Aruban day, rendered in Blender and scrubbed by scroll. Each chapter owns a run of
// frames; the last frame of one chapter is the first of the next, so the picture never cuts. Hours run on past 24 so
// the morning after reads as a continuation of the same day.

export type ChapterId = 'dawn' | 'noon' | 'heat' | 'afternoon' | 'dusk' | 'night' | 'outage' | 'morning';
export type FrameSize = 'd' | 'm';

export interface FilmChapter {
  id: ChapterId;
  /** Clock hours at the chapter's first and last frame. */
  hours: [number, number];
  /** Frame counts for desktop (1920x1080) and phone (1080x1440). */
  frames: Record<FrameSize, number>;
  /** Where the chapter's product sits in the frame it arrives on (fractions from the top left), for its marker.
   *  Measured in Blender by tools/blender/film/spots.py; re-run it when a camera key or a product moves. */
  spot: Record<FrameSize, [number, number]>;
}

/** Pixel size of the rendered frames. */
export const FRAME_SIZE: Record<FrameSize, [number, number]> = { d: [1920, 1080], m: [1080, 1440] };

export const FILM: FilmChapter[] = [
  { id: 'dawn', hours: [5.5, 9], frames: { d: 72, m: 48 }, spot: { d: [0.763, 0.4725], m: [0.5184, 0.4522] } },
  { id: 'noon', hours: [9, 13], frames: { d: 72, m: 48 }, spot: { d: [0.6302, 0.4483], m: [0.4874, 0.4021] } },
  { id: 'heat', hours: [13, 15], frames: { d: 60, m: 40 }, spot: { d: [0.5584, 0.226], m: [0.2973, 0.2631] } },
  { id: 'afternoon', hours: [15, 17.5], frames: { d: 60, m: 40 }, spot: { d: [0.7707, 0.5354], m: [0.5, 0.3735] } },
  { id: 'dusk', hours: [17.5, 20], frames: { d: 60, m: 40 }, spot: { d: [0.8093, 0.5249], m: [0.6571, 0.3002] } },
  { id: 'night', hours: [20, 22.5], frames: { d: 48, m: 36 }, spot: { d: [0.5697, 0.4101], m: [0.4983, 0.3565] } },
  { id: 'outage', hours: [22.5, 29.5], frames: { d: 48, m: 36 }, spot: { d: [0.6862, 0.5793], m: [0.5, 0.4185] } },
  { id: 'morning', hours: [29.5, 31], frames: { d: 72, m: 48 }, spot: { d: [0.3353, 0.5265], m: [0.3625, 0.4386] } },
];

export function chapterById(id: ChapterId): FilmChapter | undefined {
  return FILM.find((c) => c.id === id);
}

const clamp01 = (p: number) => (Number.isFinite(p) ? Math.min(1, Math.max(0, p)) : 0);

/** The frame for a 0..1 progress through `count` frames, and how far to mix toward the next one. */
export function frameAt(progress: number, count: number): { i: number; t: number } {
  if (!(count > 0)) return { i: 0, t: 0 };
  const pos = clamp01(progress) * (count - 1);
  const i = Math.floor(pos);
  if (i >= count - 1) return { i: count - 1, t: 0 };
  return { i, t: pos - i };
}

/**
 * Film progress for a chapter that holds on its product: the film plays over the first `length` screens of the
 * chapter and stays on its last frame for the `hold` screens after, so the visitor sees they have arrived.
 */
export function filmProgress(progress: number, length: number, hold: number): number {
  if (!(hold > 0)) return clamp01(progress);
  return Math.min(1, clamp01(progress) * ((length + hold) / length));
}

/** A point given as fractions of a frame, on screen once the frame is drawn to cover the viewport (centred). */
export function coverPoint(
  [x, y]: [number, number],
  [fw, fh]: [number, number],
  [vw, vh]: [number, number],
): [number, number] {
  const s = Math.max(vw / fw, vh / fh);
  return [(vw - fw * s) / 2 + x * fw * s, (vh - fh * s) / 2 + y * fh * s];
}

/** The clock hour (0..24) at a 0..1 progress through a chapter. */
export function hourAt(chapter: FilmChapter, progress: number): number {
  const [from, to] = chapter.hours;
  return (from + (to - from) * clamp01(progress)) % 24;
}

/** 18.5 -> "18:30"; hours past midnight wrap. */
export function formatHour(h: number): string {
  const minutes = ((Math.round(h * 60) % 1440) + 1440) % 1440;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

export function framePath(id: ChapterId, size: FrameSize, i: number): string {
  return `/film/${size}/${id}/${String(i + 1).padStart(4, '0')}.webp`;
}
