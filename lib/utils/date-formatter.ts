import { format, formatRelative, Locale } from 'date-fns';
import { fr, en } from 'date-fns/locale';

const dateLocales: Record<string, Locale> = {
  fr,
  en,
  wo: fr, // Utiliser le format français pour le wolof
};

export function formatDate(date: Date | string, formatStr: string, locale: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, {
    locale: dateLocales[locale] || dateLocales.fr,
  });
}

export function formatRelativeDate(date: Date | string, baseDate: Date | string, locale: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const baseObj = typeof baseDate === 'string' ? new Date(baseDate) : baseDate;
  
  return formatRelative(dateObj, baseObj, {
    locale: dateLocales[locale] || dateLocales.fr,
  });
}