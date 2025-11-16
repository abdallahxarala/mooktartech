export interface AssetContext {
  region: 'west-africa' | 'africa' | 'global';
  country?: string;
  industry?: string;
  usage?: string[];
  tags?: string[];
}

export interface AssetMetadata {
  src: string;
  alt: string;
  context: AssetContext;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
}

// Images contextuelles pour différentes sections
export const contextualAssets: Record<string, AssetMetadata[]> = {
  'hero-business': [
    {
      src: 'https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a',
      alt: 'Entrepreneurs sénégalais en réunion',
      context: {
        region: 'west-africa',
        country: 'senegal',
        industry: 'business',
        tags: ['meeting', 'office', 'professional'],
      },
      width: 1920,
      height: 1080,
      priority: true,
    },
    {
      src: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2',
      alt: 'Équipe commerciale à Dakar',
      context: {
        region: 'west-africa',
        country: 'senegal',
        industry: 'business',
        tags: ['team', 'office', 'collaboration'],
      },
      width: 1920,
      height: 1080,
    },
  ],
  'testimonials': [
    {
      src: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3',
      alt: 'Entrepreneur tech à Dakar',
      context: {
        region: 'west-africa',
        country: 'senegal',
        industry: 'technology',
        tags: ['portrait', 'professional'],
      },
      width: 400,
      height: 400,
    },
  ],
  'use-cases': [
    {
      src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
      alt: 'Professionnel utilisant une carte NFC',
      context: {
        region: 'west-africa',
        country: 'senegal',
        industry: 'technology',
        tags: ['nfc', 'card', 'usage'],
      },
      width: 800,
      height: 600,
    },
  ],
};

// Exemples d'organisations locales
export const localOrganizations = [
  {
    name: 'Wave Sénégal',
    logo: 'https://example.com/wave-logo.png',
    testimonial: {
      text: "Les cartes NFC de Xarala ont révolutionné notre système d'identification des agents.",
      author: 'Directeur des Opérations',
    },
  },
  {
    name: 'Orange Digital Center Sénégal',
    logo: 'https://example.com/orange-logo.png',
    testimonial: {
      text: "Un outil indispensable pour notre programme de formation tech.",
      author: 'Responsable Innovation',
    },
  },
];

// Fallback images globales
export const fallbackAssets: Record<string, AssetMetadata> = {
  'default-hero': {
    src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
    alt: 'Professional business environment',
    context: {
      region: 'global',
      industry: 'business',
    },
    width: 1920,
    height: 1080,
  },
};