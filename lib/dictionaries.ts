import type { Locale } from '@/i18n.config';

const defaultMessages = {
  products: {
    empty: "Aucun produit trouvé",
    addToCart: "Ajouter au panier",
    inStock: "En stock",
    onOrder: "Sur commande",
    sort: {
      title: "Trier par",
      newest: "Plus récents",
      priceAsc: "Prix croissant",
      priceDesc: "Prix décroissant",
      popularity: "Popularité"
    },
    shipping: {
      time: "Livraison 24-48h"
    }
  }
};

type Dictionary = {
  [key: string]: any;
};

export async function getMessages(locale: string): Promise<Dictionary> {
  try {
    // Load messages directly
    const messages = (await import(`../messages/${locale}.json`)).default;
    if (!messages) {
      throw new Error(`No messages found for locale ${locale}`);
    }
    return {
      ...defaultMessages,
      ...messages
    };
  } catch (e) {
    console.error(`Failed to load messages for locale ${locale}:`, e);
    // Return default messages as fallback
    return defaultMessages;
  }
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  try {
    const messages = await getMessages(locale);
    if (!messages || Object.keys(messages).length === 0) {
      throw new Error(`No translations available for locale ${locale}`);
    }
    return messages;
  } catch (error) {
    console.error(`Error loading dictionary for ${locale}:`, error);
    // Return default messages as fallback
    return defaultMessages;
  }
}