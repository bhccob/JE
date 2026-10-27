// Where the film is: the active chapter and the progress through it. Written by DayFilm on every scroll update and
// read by the chapters (copy beats), the sun dial, the bulb and the loading screen, which write straight to the DOM
// instead of re-rendering React on every frame.

import { FILM, hourAt, type ChapterId } from '@/lib/film';

export interface FilmState {
  chapter: ChapterId;
  /** 0..1 through the active chapter. */
  progress: number;
  /** Clock hour 0..24. */
  hour: number;
  /** True while the film is on screen. */
  visible: boolean;
  /** True while the camera rests on the active chapter's product (its hold, or the hero at rest). */
  arrived: boolean;
  /** 0..1 of the opening loaded (the fonts and the sunrise frames); 1 once the film can start. */
  opening: number;
  /** True once the loading screen has begun to open; under it, the film's sunrise waits for this. */
  daybreak: boolean;
}

let state: FilmState = {
  chapter: 'dawn',
  progress: 0,
  hour: FILM[0].hours[0],
  visible: true,
  arrived: false,
  opening: 0,
  daybreak: false,
};
const listeners = new Set<(s: FilmState) => void>();

export const filmStore = {
  get: () => state,
  set(next: Partial<FilmState>) {
    state = { ...state, ...next };
    const c = FILM.find((f) => f.id === state.chapter);
    if (c) state.hour = hourAt(c, state.progress);
    listeners.forEach((l) => l(state));
  },
  subscribe(fn: (s: FilmState) => void) {
    listeners.add(fn);
    fn(state);
    return () => {
      listeners.delete(fn);
    };
  },
};

/** This chapter's progress given the film state: 0 before it, 1 after it. */
export function progressOf(id: ChapterId, s: FilmState) {
  if (s.chapter === id) return s.progress;
  const order = FILM.map((c) => c.id);
  return order.indexOf(id) < order.indexOf(s.chapter) ? 1 : 0;
}
