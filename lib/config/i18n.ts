export const locales = ['fr', 'en', 'wo'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const localeNames = {
  fr: 'Français',
  en: 'English',
  wo: 'Wolof',
} as const;

export const localeFlags = {
  fr: '🇫🇷',
  en: '🇬🇧',
  wo: '🇸🇳',
} as const;

export function getLocaleFromString(locale: string): Locale {
  if (locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  return defaultLocale;
}

export function getLocaleFromAcceptLanguage(acceptLanguage: string): Locale {
  const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0]);
  
  for (const language of languages) {
    const locale = language.substring(0, 2);
    if (locales.includes(locale as Locale)) {
      return locale as Locale;
    }
  }
  
  return defaultLocale;
}

export function getLocaleFromNavigator(): Locale {
  if (typeof navigator === 'undefined') return defaultLocale;
  
  const [browserLanguage] = navigator.language.split('-');
  return getLocaleFromString(browserLanguage);
}