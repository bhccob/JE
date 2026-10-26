import en, { type Messages, type PartialMessages } from './en';
import nl from './nl';
import pap from './pap';
import type { Locale } from '@/i18n/routing';

type Tree = { [key: string]: string | Tree };

function deepMerge(base: Tree, override: Tree): Tree {
  const out: Tree = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    out[key] = typeof value === 'object' && typeof current === 'object' ? deepMerge(current, value) : value;
  }
  return out;
}

const overrides: Record<Locale, PartialMessages> = { en: {}, pap, nl };

export function getMessages(locale: Locale): Messages {
  return deepMerge(en as unknown as Tree, overrides[locale] as unknown as Tree) as unknown as Messages;
}
