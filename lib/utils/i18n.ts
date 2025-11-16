import { type Locale, defaultLocale, locales } from '@/i18n.config';

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromAcceptLanguage(acceptLanguage: string): Locale {
  const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0]);
  
  for (const language of languages) {
    const locale = language.substring(0, 2);
    if (isValidLocale(locale)) {
      return locale;
    }
  }
  
  return defaultLocale;
}

export function getLocaleFromNavigator(): Locale {
  if (typeof navigator === 'undefined') return defaultLocale;
  
  const [browserLanguage] = navigator.language.split('-');
  return isValidLocale(browserLanguage) ? browserLanguage : defaultLocale;
}

export function getLocalizedUrl(path: string, locale: Locale): string {
  // Si l'URL est externe, ne pas modifier
  if (path.startsWith('http')) {
    return path;
  }

  // Si l'URL commence déjà par une locale, remplacer la locale
  const localePattern = new RegExp(`^/(${locales.join('|')})`);
  if (localePattern.test(path)) {
    return path.replace(localePattern, `/${locale}`);
  }

  // Sinon, ajouter la locale au début
  return `/${locale}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function removeLocaleFromPath(path: string): string {
  const localePattern = new RegExp(`^/(${locales.join('|')})`);
  return path.replace(localePattern, '');
}