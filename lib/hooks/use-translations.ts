"use client";

import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { format as formatDate } from 'date-fns';
import { fr, en } from 'date-fns/locale';

const locales = {
  fr,
  en,
  wo: fr, // Use French formatting for Wolof
};

export function useTranslations(translations: any, namespace?: string) {
  const { locale = 'fr' } = useParams();

  const t = useCallback((key: string, params?: Record<string, any>) => {
    try {
      // Get translation from passed messages
      let translation = namespace 
        ? translations[namespace]?.[key] 
        : translations[key];

      // Replace parameters
      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          translation = translation.replace(`{${param}}`, value);
        });
      }

      return translation || key;
    } catch (error) {
      console.error(`Translation not found: ${namespace ? `${namespace}.` : ''}${key}`);
      return key;
    }
  }, [translations, namespace]);

  const formatDateTime = useCallback((date: Date | string, format = 'PPP') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDate(dateObj, format, {
      locale: locales[locale as keyof typeof locales] || locales.fr,
    });
  }, [locale]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, [locale]);

  const formatPhoneNumber = useCallback((phone: string) => {
    // Format for Senegal: +221 XX XXX XX XX
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(?:221)?(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+221 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    return phone;
  }, []);

  const formatAddress = useCallback((address: {
    street?: string;
    city?: string;
    region?: string;
    country?: string;
  }) => {
    const parts = [
      address.street,
      address.city,
      address.region,
      address.country || 'Sénégal',
    ].filter(Boolean);
    return parts.join(', ');
  }, []);

  return {
    t,
    formatDateTime,
    formatCurrency,
    formatPhoneNumber,
    formatAddress,
  };
}