export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // ============================================
      // TABLES EXISTANTES (garder)
      // ============================================
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
          id?: string
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
      }
      
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          website: string | null
          phone: string | null
          email: string | null
          address: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: string
          image_url: string | null
          stock: number
          featured: boolean
          organization_id: string
          brand: string | null
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
          featured?: boolean
          organization_id: string
          brand?: string | null
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
          featured?: boolean
          organization_id?: string
          brand?: string | null
          created_at?: string
          updated_at?: string
        }
      }

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
          payment_method: string | null
          payment_id: string | null
          transaction_id: string | null
          notes: string | null
          organization_id: string
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
          payment_method?: string | null
          payment_id?: string | null
          transaction_id?: string | null
          notes?: string | null
          organization_id: string
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
          payment_method?: string | null
          payment_id?: string | null
          transaction_id?: string | null
          notes?: string | null
          organization_id?: string
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================
      // NOUVELLES TABLES FOIRE
      // ============================================
      events: {
        Row: {
          id: string
          organization_id: string
          name: string
          slug: string
          description: string | null
          event_type: string
          start_date: string
          end_date: string
          location: string | null
          location_address: string | null
          banner_url: string | null
          is_active: boolean
          status: string | null
          foire_config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          slug: string
          description?: string | null
          event_type: string
          start_date: string
          end_date: string
          location?: string | null
          location_address?: string | null
          banner_url?: string | null
          is_active?: boolean
          status?: string | null
          foire_config?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          slug?: string
          description?: string | null
          event_type?: string
          start_date?: string
          end_date?: string
          location?: string | null
          location_address?: string | null
          banner_url?: string | null
          is_active?: boolean
          status?: string | null
          foire_config?: Json | null
          created_at?: string
          updated_at?: string
        }
      }

      exhibitors: {
        Row: {
          id: string
          event_id: string
          organization_id: string
          company_name: string
          slug: string
          description: string | null
          logo_url: string | null
          banner_url: string | null
          contact_name: string
          contact_email: string
          contact_phone: string
          website: string | null
          booth_number: string | null
          booth_location: string | null
          category: string | null
          tags: string[] | null
          status: string
          payment_status: string
          payment_amount: number | null
          currency: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          organization_id: string
          company_name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          contact_name: string
          contact_email: string
          contact_phone: string
          website?: string | null
          booth_number?: string | null
          booth_location?: string | null
          category?: string | null
          tags?: string[] | null
          status?: string
          payment_status?: string
          payment_amount?: number | null
          currency?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          organization_id?: string
          company_name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          contact_name?: string
          contact_email?: string
          contact_phone?: string
          website?: string | null
          booth_number?: string | null
          booth_location?: string | null
          category?: string | null
          tags?: string[] | null
          status?: string
          payment_status?: string
          payment_amount?: number | null
          currency?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }

      exhibitor_products: {
        Row: {
          id: string
          exhibitor_id: string
          name: string
          description: string | null
          category: string | null
          price: number | null
          currency: string | null
          price_on_request: boolean
          stock_quantity: number | null
          unlimited_stock: boolean
          is_available: boolean
          is_featured: boolean
          images: string[] | null
          featured_image: string | null
          specifications: Json | null
          tags: string[] | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exhibitor_id: string
          name: string
          description?: string | null
          category?: string | null
          price?: number | null
          currency?: string | null
          price_on_request?: boolean
          stock_quantity?: number | null
          unlimited_stock?: boolean
          is_available?: boolean
          is_featured?: boolean
          images?: string[] | null
          featured_image?: string | null
          specifications?: Json | null
          tags?: string[] | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exhibitor_id?: string
          name?: string
          description?: string | null
          category?: string | null
          price?: number | null
          currency?: string | null
          price_on_request?: boolean
          stock_quantity?: number | null
          unlimited_stock?: boolean
          is_available?: boolean
          is_featured?: boolean
          images?: string[] | null
          featured_image?: string | null
          specifications?: Json | null
          tags?: string[] | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }

      exhibitor_staff: {
        Row: {
          id: string
          exhibitor_id: string
          first_name: string
          last_name: string
          function: string | null
          email: string | null
          phone: string | null
          badge_photo_url: string | null
          badge_id: string
          badge_printed: boolean
          badge_printed_at: string | null
          access_level: string
          is_primary_contact: boolean
          manager: boolean | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exhibitor_id: string
          first_name: string
          last_name: string
          function?: string | null
          email?: string | null
          phone?: string | null
          badge_photo_url?: string | null
          badge_id: string
          badge_printed?: boolean
          badge_printed_at?: string | null
          access_level?: string
          is_primary_contact?: boolean
          manager?: boolean | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exhibitor_id?: string
          first_name?: string
          last_name?: string
          function?: string | null
          email?: string | null
          phone?: string | null
          badge_photo_url?: string | null
          badge_id?: string
          badge_printed?: boolean
          badge_printed_at?: string | null
          access_level?: string
          is_primary_contact?: boolean
          manager?: boolean | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }

      event_attendees: {
        Row: {
          id: string
          event_id: string
          ticket_type: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          company: string | null
          quantity: number
          total_amount: number
          currency: string
          payment_status: string
          payment_method: string | null
          qr_code: string | null
          is_checked_in: boolean
          checked_in_at: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          ticket_type: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          company?: string | null
          quantity?: number
          total_amount: number
          currency?: string
          payment_status?: string
          payment_method?: string | null
          qr_code?: string | null
          is_checked_in?: boolean
          checked_in_at?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          ticket_type?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          company?: string | null
          quantity?: number
          total_amount?: number
          currency?: string
          payment_status?: string
          payment_method?: string | null
          qr_code?: string | null
          is_checked_in?: boolean
          checked_in_at?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      exhibitors_with_stats: {
        Row: {
          id: string
          event_id: string
          company_name: string
          slug: string
          logo_url: string | null
          category: string | null
          booth_location: string | null
          booth_number: string | null
          products_count: number
          page_views: number
          qr_scans: number
          unique_visitors: number
          status: string | null
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}

