import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'pap', 'nl'] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, { short: string; name: string }> = {
  en: { short: 'EN', name: 'English' },
  pap: { short: 'PAP', name: 'Papiamento' },
  nl: { short: 'NL', name: 'Nederlands' },
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
