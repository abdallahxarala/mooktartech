export interface MenuItem {
  label: string
  href: string
  icon?: string
  badge?: number
  submenu?: MenuItem[]
}

export interface NavigationConfig {
  logo: {
    text: string
    subtitle?: string
    icon?: string
    image?: string
  }
  mainMenu: MenuItem[]
  ctaButton?: {
    label: string
    href: string
    variant: 'primary' | 'secondary'
  }
}

export const NAVIGATION_CONFIG: Record<string, NavigationConfig> = {
  'mooktartech-com': {
    logo: {
      text: 'MOOKTAR',
      subtitle: 'Technologies',
      icon: '⚡',
      // image: '/logos/mooktar-logo.png' // Optionnel : utiliser une image si disponible
    },
    mainMenu: [
      {
        label: 'Accueil',
        href: '/fr/org/mooktartech-com',
        icon: '🏠'
      },
      {
        label: 'Boutique',
        href: '/fr/org/mooktartech-com/shop',
        icon: '🛍️',
        submenu: [
          { label: '💻 Laptops', href: '/fr/org/mooktartech-com/shop?category=Laptops' },
          { label: '📱 Smartphones', href: '/fr/org/mooktartech-com/shop?category=Smartphones' },
          { label: '🎮 Gaming', href: '/fr/org/mooktartech-com/shop?category=Gaming' },
          { label: '🖨️ Imprimantes', href: '/fr/org/mooktartech-com/shop?category=Imprimantes' },
          { label: '📦 Tous les produits', href: '/fr/org/mooktartech-com/shop' }
        ]
      },
      {
        label: 'Services',
        href: '/fr/org/mooktartech-com/services',
        icon: '💼'
      },
      {
        label: 'À propos',
        href: '/fr/org/mooktartech-com/about',
        icon: 'ℹ️'
      },
      {
        label: 'Contact',
        href: '/fr/org/mooktartech-com/contact',
        icon: '📞'
      }
    ],
    ctaButton: {
      label: 'Devis Gratuit',
      href: '/fr/org/mooktartech-com/quote',
      variant: 'primary'
    }
  },

  'xarala-solutions': {
    logo: {
      text: 'Xarala Solutions',
      subtitle: 'Identification Pro',
      icon: '🎴'
    },
    mainMenu: [
      {
        label: 'Accueil',
        href: '/fr/org/xarala-solutions',
        icon: '🏠'
      },
      {
        label: 'Cartes NFC',
        href: '/fr/org/xarala-solutions/nfc',
        icon: '🎴',
        submenu: [
          { label: 'Cartes Visite NFC', href: '/fr/org/xarala-solutions/nfc/business' },
          { label: 'Cartes Événement', href: '/fr/org/xarala-solutions/nfc/event' },
          { label: 'Cartes Accès', href: '/fr/org/xarala-solutions/nfc/access' }
        ]
      },
      {
        label: 'Badges',
        href: '/fr/org/xarala-solutions/badges',
        icon: '🏷️',
        submenu: [
          { label: 'Badges Professionnels', href: '/fr/org/xarala-solutions/badges/pro' },
          { label: 'Badges Événements', href: '/fr/org/xarala-solutions/badges/event' },
          { label: 'Badges Étudiants', href: '/fr/org/xarala-solutions/badges/student' }
        ]
      },
      {
        label: 'Produits',
        href: '/fr/org/xarala-solutions/products',
        icon: '📦'
      },
      {
        label: 'Contact',
        href: '/fr/org/xarala-solutions/contact',
        icon: '📞'
      }
    ],
    ctaButton: {
      label: 'Devis gratuit',
      href: '/fr/org/xarala-solutions/quote',
      variant: 'primary'
    }
  },

  'foire-dakar-2025': {
    logo: {
      text: 'Foire Dakar',
      subtitle: '2025',
      icon: '🎪'
    },
    mainMenu: [
      {
        label: 'Accueil',
        href: '/fr/org/foire-dakar-2025',
        icon: '🏠'
      },
      {
        label: 'Billetterie',
        href: '/fr/org/foire-dakar-2025/tickets',
        icon: '🎟️',
        submenu: [
          { label: 'Billets Visiteurs', href: '/fr/org/foire-dakar-2025/tickets/visitor' },
          { label: 'Passes VIP', href: '/fr/org/foire-dakar-2025/tickets/vip' },
          { label: 'Groupes Scolaires', href: '/fr/org/foire-dakar-2025/tickets/groups' }
        ]
      },
      {
        label: 'Exposants',
        href: '/fr/org/foire-dakar-2025/exhibitors',
        icon: '🏢'
      },
      {
        label: 'Programme',
        href: '/fr/org/foire-dakar-2025/program',
        icon: '📅'
      },
      {
        label: 'Contact',
        href: '/fr/org/foire-dakar-2025/contact',
        icon: '📞'
      }
    ],
    ctaButton: {
      label: 'Réserver',
      href: '/fr/org/foire-dakar-2025/tickets',
      variant: 'primary'
    }
  }
}

export function getNavigationConfig(slug: string): NavigationConfig {
  return NAVIGATION_CONFIG[slug] || NAVIGATION_CONFIG['xarala-solutions']
}

