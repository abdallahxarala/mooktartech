'use client';

/**
 * Hook de remplacement temporaire pour useTranslations de next-intl
 * Retourne simplement la clé si la traduction n'est pas disponible
 */
export function useTranslations(namespace?: string) {
  return (key: string, params?: Record<string, any>) => {
    // Pour l'instant, retourner juste la clé
    // TODO: Réactiver next-intl plus tard
    if (params) {
      let result = key;
      Object.entries(params).forEach(([param, value]) => {
        result = result.replace(`{${param}}`, String(value));
      });
      return result;
    }
    return key;
  };
}

export function useLocale() {
  // Retourner 'fr' par défaut
  return 'fr';
}

