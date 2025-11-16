/**
 * Types TypeScript pour le module Foire
 * Extension des types events pour les foires
 */

import type { Database } from './database.types'

export type Event = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']

export type Organization = Database['public']['Tables']['organizations']['Row']

/**
 * Configuration spécifique pour les foires
 */
export interface FoireConfig {
  lieu?: string
  adresse?: string
  zones?: string[]
  pavillons?: Record<
    string,
    {
      nom: string
      capacite: number
      superficie?: number
      description?: string
    }
  >
  superficie_totale?: number
  unite?: string
  horaires?: {
    ouverture: string
    fermeture: string
    jours: string[]
  }
  contact?: {
    email?: string
    telephone?: string
  }
}

/**
 * Type d'événement
 */
export type EventType =
  | 'standard'
  | 'foire'
  | 'conference'
  | 'exhibition'
  | 'seminar'
  | 'workshop'

/**
 * Statut d'événement
 */
export type EventStatus =
  | 'draft'
  | 'published'
  | 'ongoing'
  | 'completed'
  | 'cancelled'

/**
 * Foire avec configuration typée
 */
export interface Foire extends Omit<Event, 'foire_config'> {
  event_type: 'foire'
  foire_config: FoireConfig
}

/**
 * Paramètres pour créer une foire
 */
export interface CreateFoireParams {
  organization_id: string
  name: string
  slug: string
  description?: string
  start_date: string
  end_date: string
  location?: string
  location_address?: string
  foire_config?: FoireConfig
}

/**
 * Paramètres pour créer une organisation
 */
export interface CreateOrganizationParams {
  name: string
  slug: string
  plan?: 'free' | 'pro' | 'team'
  max_users?: number
  logo_url?: string
}

/**
 * Résultat de création
 */
export interface CreateResult<T> {
  data: T | null
  error: string | null
}

