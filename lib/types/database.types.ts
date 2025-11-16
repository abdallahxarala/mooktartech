/**
 * Types de base de données Supabase pour Xarala Solutions
 * Générés automatiquement depuis le schéma SQL
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      // === UTILISATEURS ===
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          company: string | null
          role: 'customer' | 'admin' | 'moderator'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          company?: string | null
          role?: 'customer' | 'admin' | 'moderator'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          company?: string | null
          role?: 'customer' | 'admin' | 'moderator'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // === PRODUITS ===
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: string
          image_url: string | null
          stock: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category: string
          image_url?: string | null
          stock?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string
          image_url?: string | null
          stock?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // === COMMANDES ===
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string | null
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          subtotal: number | null
          shipping: number | null
          tax: number | null
          total: number
          currency: string | null
          shipping_address: Json | null
          payment_intent_id: string | null
          payment_status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'
          payment_method:
            | 'orange_money'
            | 'wave'
            | 'stripe'
            | 'cash'
            | 'bank_transfer'
            | 'mobile'
            | 'card'
            | null
          payment_id: string | null
          transaction_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number?: string | null
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          subtotal?: number | null
          shipping?: number | null
          tax?: number | null
          total: number
          currency?: string | null
          shipping_address?: Json | null
          payment_intent_id?: string | null
          payment_status?: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'
          payment_method?:
            | 'orange_money'
            | 'wave'
            | 'stripe'
            | 'cash'
            | 'bank_transfer'
            | 'mobile'
            | 'card'
            | null
          payment_id?: string | null
          transaction_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string | null
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          subtotal?: number | null
          shipping?: number | null
          tax?: number | null
          total?: number
          currency?: string | null
          shipping_address?: Json | null
          payment_intent_id?: string | null
          payment_status?: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'
          payment_method?:
            | 'orange_money'
            | 'wave'
            | 'stripe'
            | 'cash'
            | 'bank_transfer'
            | 'mobile'
            | 'card'
            | null
          payment_id?: string | null
          transaction_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      // === ORGANIZATIONS ===
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          plan: 'free' | 'pro' | 'team'
          max_users: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          plan?: 'free' | 'pro' | 'team'
          max_users?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          plan?: 'free' | 'pro' | 'team'
          max_users?: number | null
          created_at?: string
        }
        Relationships: []
      }

      organization_members: {
        Row: {
          id: string
          organization_id: string | null
          user_id: string | null
          role: 'owner' | 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      organization_templates: {
        Row: {
          id: string
          organization_id: string | null
          name: string
          design_json: Json
          is_default: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          name: string
          design_json: Json
          is_default?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          name?: string
          design_json?: Json
          is_default?: boolean | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }

      nfc_cards: {
        Row: {
          id: string
          user_id: string | null
          organization_id: string | null
          assigned_to: string | null
          data: Json | null
          is_active: boolean | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          assigned_to?: string | null
          data?: Json | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          assigned_to?: string | null
          data?: Json | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nfc_cards_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfc_cards_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfc_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      leads: {
        Row: {
          id: string
          card_id: string | null
          organization_id: string
          captured_by: string | null
          name: string
          email: string | null
          phone: string | null
          company: string | null
          notes: string | null
          source: string
          status: 'new' | 'contacted' | 'archived'
          contacted_at: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          card_id?: string | null
          organization_id: string
          captured_by?: string | null
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          notes?: string | null
          source?: string
          status?: 'new' | 'contacted' | 'archived'
          contacted_at?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          card_id?: string | null
          organization_id?: string
          captured_by?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          notes?: string | null
          source?: string
          status?: 'new' | 'contacted' | 'archived'
          contacted_at?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "nfc_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_captured_by_fkey"
            columns: ["captured_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      // === AUDIT LOGS ===
      audit_logs: {
        Row: {
          id: string
          event_type: string
          provider: string
          order_id: string | null
          payment_id: string | null
          transaction_id: string | null
          payload: Json | null
          metadata: Json | null
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          provider: string
          order_id?: string | null
          payment_id?: string | null
          transaction_id?: string | null
          payload?: Json | null
          metadata?: Json | null
          source?: string
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          provider?: string
          order_id?: string | null
          payment_id?: string | null
          transaction_id?: string | null
          payload?: Json | null
          metadata?: Json | null
          source?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }

      // === ARTICLES DE COMMANDE ===
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }

      // === CARTES VIRTUELLES ===
      virtual_cards: {
        Row: {
          id: string
          user_id: string
          name: string
          title: string | null
          company: string | null
          photo_url: string | null
          template_id: string
          metadata: Json
          is_public: boolean
          version: number
          short_id: string
          qr_code_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          title?: string | null
          company?: string | null
          photo_url?: string | null
          template_id: string
          metadata?: Json
          is_public?: boolean
          version?: number
          short_id: string
          qr_code_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          title?: string | null
          company?: string | null
          photo_url?: string | null
          template_id?: string
          metadata?: Json
          is_public?: boolean
          version?: number
          short_id?: string
          qr_code_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "virtual_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      // === TEMPLATES DE CARTES ===
      card_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          preview_url: string | null
          category: string
          layout: Json
          colors: Json
          fonts: Json
          is_premium: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          preview_url?: string | null
          category: string
          layout: Json
          colors: Json
          fonts: Json
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          preview_url?: string | null
          category?: string
          layout?: Json
          colors?: Json
          fonts?: Json
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // === ANALYTICS DE CARTES ===
      card_analytics: {
        Row: {
          id: string
          card_id: string
          event_type: string
          metadata: Json
          ip_address: string | null
          user_agent: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          card_id: string
          event_type: string
          metadata?: Json
          ip_address?: string | null
          user_agent?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          event_type?: string
          metadata?: Json
          ip_address?: string | null
          user_agent?: string | null
          location?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_analytics_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "virtual_cards"
            referencedColumns: ["id"]
          }
        ]
      }

      // === CONTACTS ===
      contacts: {
        Row: {
          id: string
          user_id: string
          card_id: string
          name: string
          email: string | null
          phone: string | null
          company: string | null
          notes: string | null
          tags: string[]
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          notes?: string | null
          tags?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          card_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          notes?: string | null
          tags?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "virtual_cards"
            referencedColumns: ["id"]
          }
        ]
      }

      // === WEBHOOKS ===
      webhooks: {
        Row: {
          id: string
          user_id: string
          url: string
          events: string[]
          is_active: boolean
          secret_key: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          events: string[]
          is_active?: boolean
          secret_key: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          events?: string[]
          is_active?: boolean
          secret_key?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'customer' | 'admin' | 'moderator'
      order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// === TYPES UTILITAIRES ===

// Types de base pour les tables
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Types pour les insertions
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']

// Types pour les mises à jour
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Types spécifiques aux entités
export type User = Tables<'users'>
export type Product = Tables<'products'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type VirtualCard = Tables<'virtual_cards'>
export type CardTemplate = Tables<'card_templates'>
export type CardAnalytics = Tables<'card_analytics'>
export type Contact = Tables<'contacts'>
export type Webhook = Tables<'webhooks'>

// Types pour les insertions
export type UserInsert = TablesInsert<'users'>
export type ProductInsert = TablesInsert<'products'>
export type OrderInsert = TablesInsert<'orders'>
export type OrderItemInsert = TablesInsert<'order_items'>
export type VirtualCardInsert = TablesInsert<'virtual_cards'>
export type CardTemplateInsert = TablesInsert<'card_templates'>
export type CardAnalyticsInsert = TablesInsert<'card_analytics'>
export type ContactInsert = TablesInsert<'contacts'>
export type WebhookInsert = TablesInsert<'webhooks'>

// Types pour les mises à jour
export type UserUpdate = TablesUpdate<'users'>
export type ProductUpdate = TablesUpdate<'products'>
export type OrderUpdate = TablesUpdate<'orders'>
export type OrderItemUpdate = TablesUpdate<'order_items'>
export type VirtualCardUpdate = TablesUpdate<'virtual_cards'>
export type CardTemplateUpdate = TablesUpdate<'card_templates'>
export type CardAnalyticsUpdate = TablesUpdate<'card_analytics'>
export type ContactUpdate = TablesUpdate<'contacts'>
export type WebhookUpdate = TablesUpdate<'webhooks'>

// Types pour les enums
export type UserRole = Enums<'user_role'>
export type OrderStatus = Enums<'order_status'>

// === TYPES COMPOSITES ===

// Type pour une commande avec ses articles et produits
export type OrderWithItems = Order & {
  order_items: (OrderItem & {
    products: Product
  })[]
  users: User
}

// Type pour une carte virtuelle avec son template
export type VirtualCardWithTemplate = VirtualCard & {
  card_templates: CardTemplate
  users: User
}

// Type pour un contact avec sa carte
export type ContactWithCard = Contact & {
  virtual_cards: VirtualCard
}

// Type pour les analytics d'une carte
export type CardAnalyticsWithCard = CardAnalytics & {
  virtual_cards: VirtualCard
}

// === TYPES POUR LES RÉPONSES API ===

// Type pour les réponses paginées
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Type pour les réponses d'erreur
export interface ApiError {
  error: string
  message: string
  code: string
  details?: Record<string, any>
}

// Type pour les réponses de succès
export interface ApiSuccess<T = any> {
  success: true
  data: T
  message?: string
}

// Type pour les réponses d'API
export type ApiResponse<T = any> = ApiSuccess<T> | ApiError

// === TYPES POUR LES FILTRES ===

// Filtres pour les produits
export interface ProductFilters {
  category?: string
  search?: string
  inStock?: boolean
  priceMin?: number
  priceMax?: number
  limit?: number
  offset?: number
  sortBy?: 'name' | 'price' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

// Filtres pour les commandes
export interface OrderFilters {
  status?: OrderStatus
  userId?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
  offset?: number
  sortBy?: 'created_at' | 'total' | 'status'
  sortOrder?: 'asc' | 'desc'
}

// Filtres pour les cartes virtuelles
export interface VirtualCardFilters {
  userId?: string
  isPublic?: boolean
  category?: string
  search?: string
  limit?: number
  offset?: number
  sortBy?: 'name' | 'created_at' | 'updated_at'
  sortOrder?: 'asc' | 'desc'
}

// Filtres pour les contacts
export interface ContactFilters {
  userId?: string
  cardId?: string
  search?: string
  tags?: string[]
  limit?: number
  offset?: number
  sortBy?: 'name' | 'created_at' | 'updated_at'
  sortOrder?: 'asc' | 'desc'
}

// === TYPES POUR LES STATISTIQUES ===

// Statistiques des commandes
export interface OrderStats {
  total: number
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  totalRevenue: number
  averageOrderValue: number
}

// Statistiques des cartes virtuelles
export interface CardStats {
  total: number
  public: number
  private: number
  totalViews: number
  totalShares: number
  averageViews: number
}

// Statistiques des utilisateurs
export interface UserStats {
  total: number
  active: number
  inactive: number
  customers: number
  admins: number
  moderators: number
}

// Statistiques globales
export interface GlobalStats {
  users: UserStats
  orders: OrderStats
  cards: CardStats
  products: {
    total: number
    active: number
    inStock: number
    outOfStock: number
  }
}

// === TYPES POUR LES MÉTADONNÉES ===

// Métadonnées d'une carte virtuelle
export interface CardMetadata {
  design?: {
    backgroundColor?: string
    textColor?: string
    accentColor?: string
    fontFamily?: string
    fontSize?: number
    layout?: 'horizontal' | 'vertical'
  }
  socialMedia?: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  customFields?: Record<string, any>
}

// Métadonnées d'un contact
export interface ContactMetadata {
  source?: string
  notes?: string
  customFields?: Record<string, any>
  tags?: string[]
}

// Métadonnées d'analytics
export interface AnalyticsMetadata {
  referrer?: string
  device?: 'mobile' | 'tablet' | 'desktop'
  browser?: string
  os?: string
  country?: string
  city?: string
  customData?: Record<string, any>
}

// === TYPES POUR LES WEBHOOKS ===

// Événements de webhook
export type WebhookEvent = 
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'order.created'
  | 'order.updated'
  | 'order.cancelled'
  | 'card.created'
  | 'card.updated'
  | 'card.deleted'
  | 'card.viewed'
  | 'card.shared'
  | 'contact.created'
  | 'contact.updated'
  | 'contact.deleted'

// Payload d'un webhook
export interface WebhookPayload {
  event: WebhookEvent
  data: any
  timestamp: string
  id: string
}

// Configuration d'un webhook
export interface WebhookConfig {
  url: string
  events: WebhookEvent[]
  secret: string
  isActive: boolean
}

// === TYPES POUR LES RECHERCHES ===

// Résultat de recherche
export interface SearchResult<T> {
  data: T[]
  total: number
  query: string
  filters: Record<string, any>
  took: number
}

// Facettes de recherche
export interface SearchFacets {
  categories: Array<{ value: string; count: number }>
  priceRanges: Array<{ min: number; max: number; count: number }>
  tags: Array<{ value: string; count: number }>
}

// === TYPES POUR LES EXPORTS ===

// Format d'export
export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf'

// Configuration d'export
export interface ExportConfig {
  format: ExportFormat
  fields: string[]
  filters?: Record<string, any>
  dateRange?: {
    from: string
    to: string
  }
}

// Résultat d'export
export interface ExportResult {
  url: string
  filename: string
  size: number
  expiresAt: string
}
