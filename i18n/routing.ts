import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr', 'wo'],
  defaultLocale: 'fr',
  pathnames: {
    '/': '/',
    '/org/[slug]': '/org/[slug]'
  }
});

export type Locale = (typeof routing.locales)[number];

