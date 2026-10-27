'use client';

import type { ReactNode } from 'react';
import type { PanelId } from '@/lib/products';
import { useCatalog } from './CatalogProvider';

/** A button that opens the product panel (a category or one product) from server-rendered sections. */
export function OpenCategoryButton({ id, className, children }: { id: PanelId; className?: string; children: ReactNode }) {
  const { open } = useCatalog();
  return (
    <button type="button" onClick={(e) => open(id, e.currentTarget)} className={className}>
      {children}
    </button>
  );
}
