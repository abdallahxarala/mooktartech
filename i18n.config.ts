import { Pathnames } from 'next-intl/navigation';

/**
 * Configuration i18n pour Xarala Solutions
 * Supporte le français, l'anglais et le wolof
 */

export const locales = ['fr', 'en', 'wo'] as const;
export type Locale = (typeof locales)[number];

// Configuration des chemins localisés
export const pathnames = {
  '/': '/',
  '/products': {
    fr: '/produits',
    en: '/products',
    wo: '/jumtukaay',
  },
  '/cart': {
    fr: '/panier',
    en: '/cart',
    wo: '/panier',
  },
  '/checkout': {
    fr: '/commande',
    en: '/checkout',
    wo: '/fey',
  },
  '/dashboard': {
    fr: '/tableau-de-bord',
    en: '/dashboard',
    wo: '/tablo',
  },
  '/auth': {
    fr: '/connexion',
    en: '/auth',
    wo: '/dugg',
  },
  '/card-editor': {
    fr: '/editeur-cartes',
    en: '/card-editor',
    wo: '/soppi-kart',
  },
  '/qr-generator': {
    fr: '/generateur-qr',
    en: '/qr-generator',
    wo: '/sos-qr',
  },
  '/nfc': {
    fr: '/nfc',
    en: '/nfc',
    wo: '/nfc',
  },
  '/analytics': {
    fr: '/analytiques',
    en: '/analytics',
    wo: '/xamal',
  },
  '/admin': {
    fr: '/administration',
    en: '/admin',
    wo: '/màggal',
  },
  '/contacts': {
    fr: '/contacts',
    en: '/contacts',
    wo: '/gëstu',
  },
  '/payments': {
    fr: '/paiements',
    en: '/payments',
    wo: '/fey',
  },
} satisfies Pathnames<typeof locales>;

export const defaultLocale = 'fr' as const;

// Noms des langues
export const localeNames = {
  fr: 'Français',
  en: 'English',
  wo: 'Wolof',
} as const;

// Drapeaux des langues
export const localeFlags = {
  fr: '🇫🇷',
  en: '🇬🇧',
  wo: '🇸🇳',
} as const;

// Types pour TypeScript
export type PathnameLocale = keyof typeof pathnames;

// Configuration des formats de date et nombre
export const getRequestConfig = async ({ locale }: { locale: Locale }) => ({
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
});