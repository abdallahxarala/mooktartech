/**
 * Fallback temporaire pour next-intl/server
 * À utiliser jusqu'à ce que next-intl soit réactivé
 */

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

