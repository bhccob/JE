import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface QuoteLine {
  productId: string;
  qty: number;
}

interface QuoteState {
  items: QuoteLine[];
  add: (productId: string) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (productId) => {
        const existing = get().items.find((i) => i.productId === productId);
        set({
          items: existing
            ? get().items.map((i) => (i.productId === productId ? { ...i, qty: i.qty + 1 } : i))
            : [...get().items, { productId, qty: 1 }],
        });
      },
      remove: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQty: (productId, qty) =>
        set({ items: get().items.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i)) }),
      clear: () => set({ items: [] }),
    }),
    { name: 'jontai.quote', storage: createJSONStorage(() => localStorage) },
  ),
);
