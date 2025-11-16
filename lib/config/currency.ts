export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Taux de conversion par rapport à l'EUR
  format: {
    position: 'before' | 'after';
    spaceBetween: boolean;
    thousandsSeparator: string;
    decimalSeparator: string;
    decimals: number;
  };
}

export const currencies: Record<string, Currency> = {
  XOF: {
    code: 'XOF',
    symbol: 'FCFA',
    name: 'Franc CFA BCEAO',
    rate: 655.957,
    format: {
      position: 'after',
      spaceBetween: true,
      thousandsSeparator: ' ',
      decimalSeparator: ',',
      decimals: 0,
    },
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rate: 1,
    format: {
      position: 'after',
      spaceBetween: true,
      thousandsSeparator: ' ',
      decimalSeparator: ',',
      decimals: 2,
    },
  },
};

export const defaultCurrency = currencies.XOF;

export const VAT_RATE = 0.18; // TVA à 18% au Sénégal