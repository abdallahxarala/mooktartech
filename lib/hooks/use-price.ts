"use client";

import { useMemo } from 'react';
import { currencies, defaultCurrency, VAT_RATE, type Currency } from '@/lib/config/currency';

interface PriceOptions {
  amount: number;
  currency?: Currency;
  includeVAT?: boolean;
  showCurrency?: boolean;
}

interface UsePriceReturn {
  formatted: string;
  raw: number;
  withVAT: number;
  withoutVAT: number;
  vatAmount: number;
  convert: (targetCurrency: Currency) => number;
}

export function usePrice({
  amount,
  currency = defaultCurrency,
  includeVAT = true,
  showCurrency = true,
}: PriceOptions): UsePriceReturn {
  return useMemo(() => {
    // Calcul des montants avec et sans TVA
    const withoutVAT = amount;
    const vatAmount = withoutVAT * VAT_RATE;
    const withVAT = withoutVAT + vatAmount;

    // Montant final à afficher
    const finalAmount = includeVAT ? withVAT : withoutVAT;

    // Formatage du nombre
    const numberFormat = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: currency.format.decimals,
      maximumFractionDigits: currency.format.decimals,
      useGrouping: true,
    });

    // Construction de la chaîne formatée
    let formatted = numberFormat.format(finalAmount);
    formatted = formatted.replace(',', currency.format.decimalSeparator);
    formatted = formatted.replace(/\s/g, currency.format.thousandsSeparator);

    if (showCurrency) {
      formatted = currency.format.position === 'before'
        ? `${currency.symbol}${currency.format.spaceBetween ? ' ' : ''}${formatted}`
        : `${formatted}${currency.format.spaceBetween ? ' ' : ''}${currency.symbol}`;
    }

    // Fonction de conversion
    const convert = (targetCurrency: Currency): number => {
      const eurAmount = finalAmount / currency.rate;
      return eurAmount * targetCurrency.rate;
    };

    return {
      formatted,
      raw: finalAmount,
      withVAT,
      withoutVAT,
      vatAmount,
      convert,
    };
  }, [amount, currency, includeVAT, showCurrency]);
}

// Fonction utilitaire pour formater directement un prix (sans hook)
export function formatPrice(amount: number, options: Omit<PriceOptions, 'amount'> = {}): string {
  const currency = options.currency || defaultCurrency;
  const includeVAT = options.includeVAT !== false;
  const showCurrency = options.showCurrency !== false;

  // Calcul des montants avec et sans TVA
  const withoutVAT = amount;
  const vatAmount = withoutVAT * VAT_RATE;
  const withVAT = withoutVAT + vatAmount;

  // Montant final à afficher
  const finalAmount = includeVAT ? withVAT : withoutVAT;

  // Formatage du nombre
  const numberFormat = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: currency.format.decimals,
    maximumFractionDigits: currency.format.decimals,
    useGrouping: true,
  });

  // Construction de la chaîne formatée
  let formatted = numberFormat.format(finalAmount);
  formatted = formatted.replace(',', currency.format.decimalSeparator);
  formatted = formatted.replace(/\s/g, currency.format.thousandsSeparator);

  if (showCurrency) {
    formatted = currency.format.position === 'before'
      ? `${currency.symbol}${currency.format.spaceBetween ? ' ' : ''}${formatted}`
      : `${formatted}${currency.format.spaceBetween ? ' ' : ''}${currency.symbol}`;
  }

  return formatted;
}