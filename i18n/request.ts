import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate locale
  const locales = ['en', 'fr', 'wo'];
  if (!locale || !locales.includes(locale)) {
    locale = 'fr';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
