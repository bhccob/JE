import type { Messages } from '@/content/en';

declare global {
  // Typed message keys for next-intl's useTranslations / getTranslations.
  interface IntlMessages extends Messages {}
}
