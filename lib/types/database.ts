export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          company: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          avatar_url?: string;
          phone?: string;
          company?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          phone?: string;
          company?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      virtual_cards: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          title: string;
          company: string;
          photo_url: string | null;
          template_id: string;
          metadata: Record<string, any>;
          is_public: boolean;
          version: number;
          short_id: string;
          qr_code_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          title: string;
          company: string;
          photo_url?: string;
          template_id: string;
          metadata?: Record<string, any>;
          is_public?: boolean;
          version?: number;
          short_id?: string;
          qr_code_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          title?: string;
          company?: string;
          photo_url?: string;
          template_id?: string;
          metadata?: Record<string, any>;
          is_public?: boolean;
          version?: number;
          short_id?: string;
          qr_code_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      card_templates: {
        Row: {
          id: string;
          name: string;
          description: string;
          preview_url: string;
          category: string;
          layout: Record<string, any>;
          colors: Record<string, any>;
          fonts: Record<string, any>;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          preview_url: string;
          category: string;
          layout: Record<string, any>;
          colors: Record<string, any>;
          fonts: Record<string, any>;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          preview_url?: string;
          category?: string;
          layout?: Record<string, any>;
          colors?: Record<string, any>;
          fonts?: Record<string, any>;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      card_analytics: {
        Row: {
          id: string;
          card_id: string;
          event_type: string;
          metadata: Record<string, any>;
          ip_address: string | null;
          user_agent: string | null;
          location: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          card_id: string;
          event_type: string;
          metadata?: Record<string, any>;
          ip_address?: string;
          user_agent?: string;
          location?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          card_id?: string;
          event_type?: string;
          metadata?: Record<string, any>;
          ip_address?: string;
          user_agent?: string;
          location?: string;
          created_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          card_id: string;
          name: string;
          email: string;
          phone: string;
          company: string;
          notes: string | null;
          tags: string[];
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_id: string;
          name: string;
          email: string;
          phone: string;
          company: string;
          notes?: string;
          tags?: string[];
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          card_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          company?: string;
          notes?: string;
          tags?: string[];
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      webhooks: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          events: string[];
          is_active: boolean;
          secret_key: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          events: string[];
          is_active?: boolean;
          secret_key?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          events?: string[];
          is_active?: boolean;
          secret_key?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}