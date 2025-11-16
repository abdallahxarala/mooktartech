import { type Locale } from '@/i18n.config';

const currencyFormats: Record<string, {
  currency: string;
  style: Intl.NumberFormatOptions;
}> = {
  fr: {
    currency: 'XOF',
    style: {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  },
  en: {
    currency: 'XOF',
    style: {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  },
  wo: {
    currency: 'XOF',
    style: {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  },
};

export function formatCurrency(amount: number, locale: Locale): string {
  const format = currencyFormats[locale] || currencyFormats.fr;
  return new Intl.NumberFormat(locale, format.style).format(amount);
}

export function parseCurrency(value: string, locale: Locale): number {
  const format = currencyFormats[locale] || currencyFormats.fr;
  const cleanValue = value.replace(format.currency, '').trim();
  return parseFloat(cleanValue.replace(/[^\d.-]/g, ''));
}