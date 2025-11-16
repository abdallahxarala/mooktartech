/**
 * Types pour les tickets visiteur
 */

export type TicketType = 'standard' | 'vip'

export interface TicketTypeConfig {
  type: TicketType
  name: string
  price: number
  currency: 'XOF' | 'EUR' | 'USD'
  description: string
  features: string[]
  icon: string
}

export const TICKET_TYPES: Record<TicketType, TicketTypeConfig> = {
  standard: {
    type: 'standard',
    name: 'Ticket Standard',
    price: 2000,
    currency: 'XOF',
    description: 'Accès général à la foire',
    features: [
      'Accès à tous les pavillons',
      'Accès aux conférences',
      'Badge visiteur',
      'Support client',
    ],
    icon: '🎫',
  },
  vip: {
    type: 'vip',
    name: 'Ticket VIP',
    price: 5000,
    currency: 'XOF',
    description: 'Accès privilégié avec avantages',
    features: [
      'Tous les avantages Standard',
      'Accès zone VIP',
      'Parking réservé',
      'Cocktail de bienvenue',
      'Rencontres exclusives',
    ],
    icon: '⭐',
  },
}

export interface VisitorInfo {
  first_name: string
  last_name: string
  phone: string
  email?: string
}

export interface TicketPurchase {
  id: string
  event_id: string
  ticket_type: TicketType
  visitor_info: VisitorInfo
  amount: number
  currency: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: 'wave' | 'orange-money' | 'free-money'
  payment_id?: string
  qr_code_data: string
  qr_code_url: string
  badge_id: string
  sms_sent: boolean
  pdf_url?: string
  created_at: string
  updated_at: string
}

export interface CreateTicketPurchaseParams {
  event_id: string
  ticket_type: TicketType
  visitor_info: VisitorInfo
  return_url: string
  cancel_url: string
}

export interface WavePaymentResponse {
  checkout_url: string
  payment_id: string
  status: 'pending' | 'processing'
}

