export const CARD_THEMES = {
  minimal: {
    id: 'minimal',
    name: 'Minimaliste',
    description: 'Design épuré et moderne',
    colors: {
      primary: '#F97316',
      secondary: '#111827',
      background: '#FFFFFF'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      size: 14
    },
    preview: 'bg-white border-2 border-gray-200',
    style: 'Épuré, beaucoup d\'espace blanc'
  },
  
  corporate: {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professionnel et élégant',
    colors: {
      primary: '#F59E0B',
      secondary: '#FFFFFF',
      background: '#1E3A8A'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Roboto',
      size: 14
    },
    preview: 'bg-blue-900 border-2 border-yellow-500',
    style: 'Professionnel, élégant'
  },
  
  creative: {
    id: 'creative',
    name: 'Créatif',
    description: 'Moderne et dynamique',
    colors: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      background: 'linear-gradient(135deg, #F97316, #EC4899, #8B5CF6)'
    },
    fonts: {
      heading: 'Poppins',
      body: 'Montserrat',
      size: 14
    },
    preview: 'bg-gradient-to-br from-orange-500 to-pink-500 border-2 border-white',
    style: 'Moderne, dynamique'
  },
  
  elegant: {
    id: 'elegant',
    name: 'Élégant',
    description: 'Luxe et sophistiqué',
    colors: {
      primary: '#F97316',
      secondary: '#F8FAFC',
      background: '#0F172A'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lato',
      size: 14
    },
    preview: 'bg-gray-900 border-2 border-orange-500',
    style: 'Luxe, sophistiqué'
  },
  
  modern: {
    id: 'modern',
    name: 'Moderne',
    description: 'Tech et contemporain',
    colors: {
      primary: '#06B6D4',
      secondary: '#1F2937',
      background: '#F3F4F6'
    },
    fonts: {
      heading: 'Inter',
      body: 'IBM Plex Sans',
      size: 14
    },
    preview: 'bg-gray-100 border-2 border-cyan-500',
    style: 'Tech, contemporain'
  },
  
  luxury: {
    id: 'luxury',
    name: 'Luxe',
    description: 'Premium et haut de gamme',
    colors: {
      primary: '#FCD34D',
      secondary: '#FCD34D',
      background: '#7C2D12'
    },
    fonts: {
      heading: 'Cormorant',
      body: 'Crimson Text',
      size: 14
    },
    preview: 'bg-red-900 border-2 border-yellow-400',
    style: 'Premium, haut de gamme'
  },
  
  tech: {
    id: 'tech',
    name: 'Tech',
    description: 'Cyberpunk et futuriste',
    colors: {
      primary: '#34D399',
      secondary: '#10B981',
      background: '#000000'
    },
    fonts: {
      heading: 'Space Mono',
      body: 'Courier New',
      size: 14
    },
    preview: 'bg-black border-2 border-green-500',
    style: 'Cyberpunk, futuriste'
  },
  
  natural: {
    id: 'natural',
    name: 'Naturel',
    description: 'Organique et apaisant',
    colors: {
      primary: '#92400E',
      secondary: '#065F46',
      background: '#D1FAE5'
    },
    fonts: {
      heading: 'Georgia',
      body: 'Merriweather',
      size: 14
    },
    preview: 'bg-green-100 border-2 border-green-800',
    style: 'Organique, apaisant'
  }
} as const

export type ThemeId = keyof typeof CARD_THEMES

export function getThemeById(id: ThemeId) {
  return CARD_THEMES[id]
}

export function getAllThemes() {
  return Object.values(CARD_THEMES)
}

export function getThemePreview(themeId: ThemeId) {
  const theme = CARD_THEMES[themeId]
  return {
    ...theme,
    previewStyle: {
      background: theme.colors.background.includes('gradient') 
        ? theme.colors.background 
        : theme.colors.background,
      color: theme.colors.primary,
      fontFamily: theme.fonts.heading
    }
  }
}
