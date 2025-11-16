/**
 * Service pour la gestion des organisations
 * Suit les patterns existants du projet Xarala Solutions
 */

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'

type Organization = Database['public']['Tables']['organizations']['Row']
type OrganizationInsert = Database['public']['Tables']['organizations']['Insert']
type OrganizationUpdate = Database['public']['Tables']['organizations']['Update']

export interface CreateOrganizationParams {
  name: string
  slug: string
  plan?: 'free' | 'pro' | 'team'
  max_users?: number
  logo_url?: string
}

export interface CreateOrganizationResult {
  organization: Organization | null
  error: string | null
}

/**
 * Créer une nouvelle organisation
 */
export async function createOrganization(
  params: CreateOrganizationParams
): Promise<CreateOrganizationResult> {
  try {
    const supabase = createSupabaseServerClient()

    // Vérifier que l'utilisateur est authentifié
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return {
        organization: null,
        error: 'Non authentifié',
      }
    }

    // Vérifier que le slug n'existe pas déjà
    const { data: existing } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', params.slug)
      .single()

    if (existing) {
      return {
        organization: null,
        error: 'Une organisation avec ce slug existe déjà',
      }
    }

    // Créer l'organisation
    const insertData: OrganizationInsert = {
      name: params.name,
      slug: params.slug,
      plan: params.plan || 'free',
      max_users: params.max_users || 1,
      logo_url: params.logo_url || null,
    }

    const { data: organization, error } = await supabase
      .from('organizations')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error creating organization:', error)
      return {
        organization: null,
        error: error.message,
      }
    }

    // Ajouter le créateur comme owner de l'organisation
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organization.id,
        user_id: session.user.id,
        role: 'owner',
      })

    if (memberError) {
      console.error('Error adding creator as owner:', memberError)
      // Ne pas échouer si l'ajout du membre échoue, l'org est créée
    }

    return {
      organization,
      error: null,
    }
  } catch (error) {
    console.error('Unexpected error creating organization:', error)
    return {
      organization: null,
      error: 'Erreur inattendue lors de la création de l\'organisation',
    }
  }
}

/**
 * Récupérer une organisation par son slug
 */
export async function getOrganizationBySlug(
  slug: string
): Promise<{ organization: Organization | null; error: string | null }> {
  try {
    const supabase = createSupabaseServerClient()

    const { data: organization, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      return {
        organization: null,
        error: error.message,
      }
    }

    return {
      organization,
      error: null,
    }
  } catch (error) {
    console.error('Error fetching organization:', error)
    return {
      organization: null,
      error: 'Erreur lors de la récupération de l\'organisation',
    }
  }
}

/**
 * Mettre à jour une organisation
 */
export async function updateOrganization(
  slug: string,
  updates: OrganizationUpdate
): Promise<{ organization: Organization | null; error: string | null }> {
  try {
    const supabase = createSupabaseServerClient()

    // Vérifier que l'utilisateur est authentifié et membre de l'org
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return {
        organization: null,
        error: 'Non authentifié',
      }
    }

    // Récupérer l'organisation
    const { data: organization } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .single()

    if (!organization) {
      return {
        organization: null,
        error: 'Organisation non trouvée',
      }
    }

    // Vérifier les permissions (owner ou admin)
    const { data: member } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organization.id)
      .eq('user_id', session.user.id)
      .single()

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return {
        organization: null,
        error: 'Permissions insuffisantes',
      }
    }

    // Mettre à jour
    const { data: updated, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', organization.id)
      .select()
      .single()

    if (error) {
      return {
        organization: null,
        error: error.message,
      }
    }

    return {
      organization: updated,
      error: null,
    }
  } catch (error) {
    console.error('Error updating organization:', error)
    return {
      organization: null,
      error: 'Erreur lors de la mise à jour de l\'organisation',
    }
  }
}

/**
 * Créer l'organisation Foire Dakar 2025 (utilitaire pour seed)
 */
export async function createFoireDakar2025Organization(): Promise<CreateOrganizationResult> {
  return createOrganization({
    name: 'Foire Internationale de Dakar 2025',
    slug: 'foire-dakar-2025',
    plan: 'pro',
    max_users: 50,
  })
}

