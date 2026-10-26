import { getRequestConfig } from 'next-intl/server';
import { isLocale, routing } from './routing';
import { getMessages } from '@/content';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : routing.defaultLocale;
  return { locale, messages: getMessages(locale) };
});
