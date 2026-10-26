import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Locale routing only. Loyalty auth is deliberately client-side (see app/[locale]/account/page.tsx).
export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(en|pap|nl)/:path*', '/((?!api|_next|_vercel|posters|media|.*\\..*).*)'],
};
