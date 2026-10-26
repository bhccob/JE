import { create } from 'zustand';
import type { SectionId } from './cameraKeyframes';

/**
 * Every section is measured in page-progress units (0-1):
 *   holdStart/holdEnd  the stretch where the section's sticky content is pinned and the camera rests.
 *   spanStart          where the previous section's hold ends, i.e. where the camera starts flying in.
 * A section's local progress runs spanStart -> holdEnd so set pieces can start assembling during the approach.
 */
export interface SectionRange {
  id: SectionId;
  spanStart: number;
  holdStart: number;
  holdEnd: number;
}

interface ScrollState {
  progress: number;
  velocity: number;
  activeSection: SectionId;
  ranges: SectionRange[];
  near: Partial<Record<SectionId, boolean>>;
  temperature: number;
  hotspot: string | null;
  /** True once the Capture panel is assembled enough for its 3D hotspots to be shown. */
  hotspotsReady: boolean;
  setProgress: (progress: number, velocity: number) => void;
  setActiveSection: (id: SectionId) => void;
  setRanges: (ranges: SectionRange[]) => void;
  markNear: (id: SectionId) => void;
  setTemperature: (kelvin: number) => void;
  setHotspot: (id: string | null) => void;
}

export const useScrollStore = create<ScrollState>()((set, get) => ({
  progress: 0,
  velocity: 0,
  activeSection: 'hero',
  ranges: [],
  near: { hero: true, source: true, capture: true },
  temperature: 3000,
  hotspot: null,
  hotspotsReady: false,
  setProgress: (progress, velocity) => set({ progress, velocity }),
  setActiveSection: (activeSection) => {
    if (get().activeSection !== activeSection) set({ activeSection });
  },
  setRanges: (ranges) => set({ ranges }),
  markNear: (id) => {
    if (!get().near[id]) set({ near: { ...get().near, [id]: true } });
  },
  setTemperature: (temperature) => set({ temperature }),
  setHotspot: (hotspot) => set({ hotspot }),
}));

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function sectionProgress(ranges: SectionRange[], id: SectionId, progress: number) {
  const r = ranges.find((s) => s.id === id);
  if (!r) return 0;
  const len = r.holdEnd - r.spanStart;
  if (len <= 0) return progress >= r.holdEnd ? 1 : 0;
  return clamp01((progress - r.spanStart) / len);
}

/** Read-only snapshot for useFrame loops; avoids React re-renders. */
export const readScroll = () => useScrollStore.getState();
