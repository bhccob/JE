import { create } from 'zustand';
import { products } from './products';

interface CollectionState {
  /** Continuous ring position in item units; the 3D ring eases toward `target`. */
  target: number;
  /** Extra spin applied to every model while dragging, decays in the canvas. */
  spin: number;
  quicklook: string | null;
  qlYaw: number;
  qlPitch: number;
  qlZoom: number;
  setTarget: (target: number) => void;
  nudge: (delta: number) => void;
  addSpin: (v: number) => void;
  openQuicklook: (id: string) => void;
  closeQuicklook: () => void;
  orbit: (dYaw: number, dPitch: number) => void;
  zoom: (delta: number) => void;
}

export const useCollectionStore = create<CollectionState>()((set, get) => ({
  target: 0,
  spin: 0,
  quicklook: null,
  qlYaw: -0.5,
  qlPitch: 0.15,
  qlZoom: 1,
  setTarget: (target) => set({ target }),
  nudge: (delta) => set({ target: Math.round(get().target) + delta }),
  addSpin: (v) => set({ spin: get().spin + v }),
  openQuicklook: (quicklook) => set({ quicklook, qlYaw: -0.5, qlPitch: 0.15, qlZoom: 1 }),
  closeQuicklook: () => set({ quicklook: null }),
  orbit: (dYaw, dPitch) => set({ qlYaw: get().qlYaw + dYaw, qlPitch: Math.max(-0.6, Math.min(0.9, get().qlPitch + dPitch)) }),
  zoom: (delta) => set({ qlZoom: Math.max(0.7, Math.min(1.6, get().qlZoom + delta)) }),
}));

/** Wraps any ring position onto a product index. */
export function indexAt(target: number) {
  const n = products.length;
  return ((Math.round(target) % n) + n) % n;
}
