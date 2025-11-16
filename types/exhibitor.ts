export type ExhibitorStatus =
  | 'pending'
  | 'approved'
  | 'active'
  | 'rejected'
  | 'cancelled'

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed'

export type InteractionType =
  | 'page_view'
  | 'qr_scan'
  | 'product_view'
  | 'contact_request'
  | 'favorite'
  | 'share'
  | 'catalog_download'

export interface Exhibitor {
  id: string
  event_id: string
  organization_id: string

  company_name: string
  slug: string
  description?: string
  logo_url?: string
  banner_url?: string

  contact_name: string
  contact_email: string
  contact_phone?: string
  website?: string

  booth_number?: string
  booth_location?: string

  category?: string
  tags: string[]

  status: ExhibitorStatus

  payment_status: PaymentStatus
  payment_amount?: number
  currency: string
  stripe_payment_id?: string
  stripe_payment_intent_id?: string

  qr_code_data?: string
  qr_code_url?: string

  settings?: Record<string, unknown>
  social_links?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
    [key: string]: string | undefined
  }

  created_at: string
  updated_at: string
  approved_at?: string
}

export interface ExhibitorProduct {
  id: string
  exhibitor_id: string

  name: string
  description?: string

  price?: number
  currency: string
  price_on_request: boolean

  images: string[]
  featured_image?: string

  category?: string
  tags: string[]

  stock_quantity?: number
  unlimited_stock: boolean
  is_available: boolean

  is_featured: boolean
  display_order: number

  metadata?: Record<string, unknown>

  created_at: string
  updated_at: string
}

export interface ExhibitorInteraction {
  id: string
  event_id: string
  exhibitor_id: string
  visitor_id?: string

  interaction_type: InteractionType
  product_id?: string

  metadata?: Record<string, unknown>
  location_data?: unknown

  created_at: string
}

export interface ExhibitorWithStats extends Exhibitor {
  products_count: number
  featured_products_count: number
  total_interactions: number
  page_views: number
  qr_scans: number
  unique_visitors: number
  event?: {
    id: string
    name: string
    slug: string
  }
}

export interface ExhibitorWithProducts extends Exhibitor {
  products: ExhibitorProduct[]
}

export interface ProductWithExhibitor extends ExhibitorProduct {
  exhibitor: Exhibitor
}

export interface CreateExhibitorInput {
  event_id: string
  company_name: string
  description?: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  website?: string
  category?: string
  booth_number?: string
}

export interface CreateProductInput {
  exhibitor_id: string
  name: string
  description?: string
  price?: number
  price_on_request?: boolean
  category?: string
  images?: string[]
}

