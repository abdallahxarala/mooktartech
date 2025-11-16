export interface TenantConfig {
  id: string
  slug: string
  name: string
  domain: string
  domains: string[]
  supabaseUrl?: string      // Optionnel : Supabase dédié
  supabaseKey?: string      // Optionnel : Supabase dédié
  theme: {
    primary: string
    secondary: string
    accent: string
    logo: string
    favicon: string
  }
  contact: {
    phone: string
    email: string
    whatsapp: string
    address: string
    city: string
  }
  features: {
    multiLanguage: boolean
    defaultLocale: string
    availableLocales: string[]
    blog: boolean
    reviews: boolean
    loyalty: boolean
  }
  payment: {
    wave: boolean
    orangeMoney: boolean
    freeMoney: boolean
    cash: boolean
  }
  shipping: {
    freeShippingThreshold: number
    defaultCost: number
  }
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

export const TENANTS: Record<string, TenantConfig> = {
  xarala: {
    id: 'xarala',
    slug: 'xarala',
    name: 'Xarala Solutions',
    domain: 'xarala-solutions.com',
    domains: [
      'xarala-solutions.com',
      'www.xarala-solutions.com',
      'localhost:3000',
    ],
    // Utilise le Supabase existant
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    theme: {
      primary: '#f97316',
      secondary: '#ec4899',
      accent: '#8b5cf6',
      logo: '/logos/xarala.svg',
      favicon: '/favicons/xarala.ico',
    },
    contact: {
      phone: '+221 77 539 81 39',
      email: 'contact@xarala-solutions.com',
      whatsapp: '+221775398139',
      address: 'Sicap Liberté 6, Villa N°123, Dakar',
      city: 'Dakar',
    },
    features: {
      multiLanguage: true,
      defaultLocale: 'fr',
      availableLocales: ['fr', 'en'],
      blog: false,
      reviews: true,
      loyalty: false,
    },
    payment: {
      wave: true,
      orangeMoney: true,
      freeMoney: true,
      cash: true,
    },
    shipping: {
      freeShippingThreshold: 500000,
      defaultCost: 5000,
    },
    seo: {
      title: 'Xarala Solutions - Impression Professionnelle',
      description: 'Leader de l\'impression au Sénégal',
      keywords: ['impression', 'Sénégal', 'cartes PVC'],
    },
  },

  site2: {
    id: 'site2',
    slug: 'site2',
    name: 'Site 2',
    domain: 'site2.com',
    domains: ['site2.com', 'www.site2.com'],
    // Nouveau Supabase (à créer)
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_SITE2_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_SITE2_KEY,
    theme: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      logo: '/logos/site2.svg',
      favicon: '/favicons/site2.ico',
    },
    contact: {
      phone: '+221 XX XXX XX XX',
      email: 'contact@site2.com',
      whatsapp: '+221XXXXXXXXX',
      address: 'Adresse Site 2',
      city: 'Dakar',
    },
    features: {
      multiLanguage: false,
      defaultLocale: 'fr',
      availableLocales: ['fr'],
      blog: true,
      reviews: false,
      loyalty: true,
    },
    payment: {
      wave: true,
      orangeMoney: false,
      freeMoney: false,
      cash: true,
    },
    shipping: {
      freeShippingThreshold: 300000,
      defaultCost: 3000,
    },
    seo: {
      title: 'Site 2',
      description: 'Description Site 2',
      keywords: ['mot-clé 1', 'mot-clé 2'],
    },
  },
}

export function getTenantBySlug(slug: string): TenantConfig {
  return TENANTS[slug] || TENANTS.xarala
}

export function getTenantByDomain(domain: string): TenantConfig {
  const tenant = Object.values(TENANTS).find(t => 
    t.domains.some(d => domain.includes(d))
  )
  return tenant || TENANTS.xarala
}

export function getAllTenantSlugs(): string[] {
  return Object.keys(TENANTS)
}

