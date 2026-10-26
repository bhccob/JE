import type { ReactNode } from 'react';

// The real <html> lives in app/[locale]/layout.tsx; this root only exists so app/not-found.tsx has a parent.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
