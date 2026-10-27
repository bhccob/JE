import { STORE } from './store.ts';

/** A WhatsApp chat with the store, optionally opened with a question already typed. */
export function whatsappLink(text?: string) {
  return text ? `${STORE.whatsapp}?text=${encodeURIComponent(text)}` : STORE.whatsapp;
}

export const DIRECTIONS_URL = STORE.maps;
