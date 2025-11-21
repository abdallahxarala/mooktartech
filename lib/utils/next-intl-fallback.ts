'use client';

/**
 * Fallback temporaire pour next-intl
 * À utiliser jusqu'à ce que next-intl soit réactivé
 */

export function useTranslations(namespace?: string) {
  return (key: string, params?: Record<string, any>) => {
    // Pour l'instant, retourner juste la clé ou la dernière partie après le point
    const displayKey = key.includes('.') ? key.split('.').pop() || key : key;
    
    if (params) {
      let result = displayKey;
      Object.entries(params).forEach(([param, value]) => {
        result = result.replace(`{${param}}`, String(value));
      });
      return result;
    }
    return displayKey;
  };
}

export function useLocale() {
  // Retourner 'fr' par défaut
  return 'fr' as const;
}

// Server-side fallback
export async function getTranslations(namespace?: string) {
  return (key: string, params?: Record<string, any>) => {
    const displayKey = key.includes('.') ? key.split('.').pop() || key : key;
    
    if (params) {
      let result = displayKey;
      Object.entries(params).forEach(([param, value]) => {
        result = result.replace(`{${param}}`, String(value));
      });
      return result;
    }
    return displayKey;
  };
}

