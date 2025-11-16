/**
 * Service pour la gestion des foires
 * Extension du module events pour les foires spécifiques
 */

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Event = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']

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

export interface CreateFoireResult {
  foire: Event | null
  error: string | null
}

/**
 * Créer une nouvelle foire
 */
export async function createFoire(
  params: CreateFoireParams
): Promise<CreateFoireResult> {
  try {
    const supabase = createSupabaseServerClient()

    // Vérifier que l'utilisateur est authentifié
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return {
        foire: null,
        error: 'Non authentifié',
      }
    }

    // Vérifier que l'utilisateur est membre de l'organisation avec rôle admin/owner
    const { data: member } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', params.organization_id)
      .eq('user_id', session.user.id)
      .single()

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return {
        foire: null,
        error: 'Permissions insuffisantes pour créer une foire',
      }
    }

    // Vérifier que le slug n'existe pas déjà
    const { data: existing } = await supabase
      .from('events')
      .select('id')
      .eq('slug', params.slug)
      .single()

    if (existing) {
      return {
        foire: null,
        error: 'Un événement avec ce slug existe déjà',
      }
    }

    // Créer la foire
    const insertData: EventInsert = {
      organization_id: params.organization_id,
      name: params.name,
      slug: params.slug,
      event_type: 'foire',
      description: params.description || null,
      start_date: params.start_date,
      end_date: params.end_date,
      location: params.location || null,
      location_address: params.location_address || null,
      status: 'draft',
      foire_config: params.foire_config || {},
    }

    const { data: foire, error } = await supabase
      .from('events')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error creating foire:', error)
      return {
        foire: null,
        error: error.message,
      }
    }

    return {
      foire,
      error: null,
    }
  } catch (error) {
    console.error('Unexpected error creating foire:', error)
    return {
      foire: null,
      error: 'Erreur inattendue lors de la création de la foire',
    }
  }
}

/**
 * Créer la foire Dakar 2025 (utilitaire pour seed)
 */
export async function createFoireDakar2025(
  organizationId: string
): Promise<CreateFoireResult> {
  const foireConfig: FoireConfig = {
    lieu: 'CICES Dakar',
    adresse: 'Boulevard du Général de Gaulle, Dakar',
    zones: ['A', 'B', 'C'],
    pavillons: {
      A: {
        nom: 'Pavillon International',
        capacite: 200,
        superficie: 5000,
        description: 'Pavillon dédié aux exposants internationaux',
      },
      B: {
        nom: 'Pavillon Local',
        capacite: 150,
        superficie: 4000,
        description: 'Pavillon pour les entreprises sénégalaises',
      },
      C: {
        nom: 'Pavillon Innovation',
        capacite: 100,
        superficie: 3000,
        description: 'Espace dédié aux startups et innovations',
      },
    },
    superficie_totale: 15000,
    unite: 'm²',
    horaires: {
      ouverture: '08:00',
      fermeture: '18:00',
      jours: [
        'lundi',
        'mardi',
        'mercredi',
        'jeudi',
        'vendredi',
        'samedi',
        'dimanche',
      ],
    },
    contact: {
      email: 'contact@foire-dakar-2025.sn',
      telephone: '+221 XX XXX XX XX',
    },
  }

  return createFoire({
    organization_id: organizationId,
    name: 'Foire Internationale de Dakar 2025',
    slug: 'foire-dakar-2025',
    description:
      'La plus grande foire internationale du Sénégal. Rassemblement de centaines d\'exposants locaux et internationaux dans les secteurs de l\'agriculture, de l\'industrie, des services et de l\'innovation.',
    start_date: '2025-12-01T08:00:00+00:00',
    end_date: '2025-12-15T18:00:00+00:00',
    location: 'CICES Dakar',
    location_address: 'Boulevard du Général de Gaulle, Dakar, Sénégal',
    foire_config: foireConfig,
  })
}

/**
 * Récupérer une foire par son slug
 */
export async function getFoireBySlug(
  slug: string
): Promise<{ foire: Event | null; error: string | null }> {
  try {
    const supabase = createSupabaseServerClient()

    const { data: foire, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .eq('event_type', 'foire')
      .single()

    if (error) {
      return {
        foire: null,
        error: error.message,
      }
    }

    return {
      foire,
      error: null,
    }
  } catch (error) {
    console.error('Error fetching foire:', error)
    return {
      foire: null,
      error: 'Erreur lors de la récupération de la foire',
    }
  }
}

/**
 * Récupérer toutes les foires d'une organisation
 */
export async function getFoiresByOrganization(
  organizationId: string
): Promise<{ foires: Event[]; error: string | null }> {
  try {
    const supabase = createSupabaseServerClient()

    const { data: foires, error } = await supabase
      .from('events')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('event_type', 'foire')
      .order('start_date', { ascending: false })

    if (error) {
      return {
        foires: [],
        error: error.message,
      }
    }

    return {
      foires: foires || [],
      error: null,
    }
  } catch (error) {
    console.error('Error fetching foires:', error)
    return {
      foires: [],
      error: 'Erreur lors de la récupération des foires',
    }
  }
}

