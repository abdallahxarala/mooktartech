import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales, pathnames } from './i18n.config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is supported
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Africa/Dakar',
    now: new Date(),
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        },
        long: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }
      },
      number: {
        currency: {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }
      }
    }
  };
});

export const { Link, redirect, usePathname, useRouter } = 
  createSharedPathnamesNavigation({ locales, pathnames });