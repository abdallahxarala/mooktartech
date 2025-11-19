export interface TopBarConfig {
  show: boolean
  items: {
    icon: string
    text: string
    href?: string
  }[]
  backgroundColor: string
  textColor: string
}

export const TOPBAR_CONFIG: Record<string, TopBarConfig> = {
  'mooktartech-com': {
    show: true,
    items: [
      { icon: '📧', text: 'support@mooktar.com', href: 'mailto:support@mooktar.com' },
      { icon: '📍', text: 'Dakar, Sénégal' },
      { icon: '🕐', text: 'Lun-Sam: 8h-18h' },
      { icon: '🚚', text: 'Livraison 24h Dakar' }
    ],
    backgroundColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
    textColor: 'text-white'
  },
  'xarala-solutions': {
    show: true,
    items: [
      { icon: '📞', text: '+221 77 539 81 39', href: 'tel:+221775398139' },
      { icon: '📧', text: 'contact@xarala-solutions.com', href: 'mailto:contact@xarala-solutions.com' },
      { icon: '📍', text: 'Dakar, Sénégal' },
      { icon: '🚚', text: 'Livraison 24h Dakar' }
    ],
    backgroundColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
    textColor: 'text-white'
  },
  'foire-dakar-2025': {
    show: true,
    items: [
      { icon: '📞', text: '+221 77 539 81 39', href: 'tel:+221775398139' },
      { icon: '📧', text: 'contact@foire-dakar.com', href: 'mailto:contact@foire-dakar.com' },
      { icon: '📍', text: 'CICES, Dakar' },
      { icon: '📅', text: '15-30 Juin 2025' }
    ],
    backgroundColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
    textColor: 'text-white'
  }
}

export function getTopBarConfig(slug: string): TopBarConfig | null {
  const config = TOPBAR_CONFIG[slug]
  return config && config.show ? config : null
}

