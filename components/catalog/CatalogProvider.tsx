'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { PanelId } from '@/lib/products';
import { CategoryDrawer } from './CategoryDrawer';

interface CatalogContext {
  open: (id: PanelId, trigger?: HTMLElement | null) => void;
}

const Ctx = createContext<CatalogContext | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<PanelId | null>(null);
  const [returnTo, setReturnTo] = useState<HTMLElement | null>(null);

  const open = useCallback((id: PanelId, trigger?: HTMLElement | null) => {
    setReturnTo(trigger ?? (document.activeElement as HTMLElement | null));
    setActive(id);
  }, []);
  const close = useCallback(() => setActive(null), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <CategoryDrawer id={active} onClose={close} returnTo={returnTo} />
    </Ctx.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCatalog must be used inside <CatalogProvider>');
  return ctx;
}
