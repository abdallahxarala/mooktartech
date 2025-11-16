#!/usr/bin/env tsx
/**
 * Script de seed pour créer l'organisation et l'événement Foire Dakar 2025
 * 
 * Usage:
 *   tsx scripts/seed-foire-dakar-2025.ts
 * 
 * Ou avec npm:
 *   npm run seed:foire
 * 
 * Environment variables required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('🌱 Démarrage du seed Foire Dakar 2025...\n')

  try {
    // 1. Créer l'organisation
    console.log('📦 Création de l\'organisation...')
    
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .upsert({
        name: 'Foire Internationale de Dakar 2025',
        slug: 'foire-dakar-2025',
        plan: 'pro',
        max_users: 50,
      }, {
        onConflict: 'slug',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (orgError) {
      console.error('❌ Erreur lors de la création de l\'organisation:', orgError.message)
      process.exit(1)
    }

    if (!org) {
      console.error('❌ Organisation non créée')
      process.exit(1)
    }

    console.log('✅ Organisation créée:', org.name)
    console.log('   Slug:', org.slug)
    console.log('   ID:', org.id)
    console.log('')

    // 2. Créer l'événement foire
    console.log('🎪 Création de l\'événement foire...')
    
    const foireConfig = {
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
        jours: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
      },
      contact: {
        email: 'contact@foire-dakar-2025.sn',
        telephone: '+221 XX XXX XX XX',
      },
    }

    const { data: foire, error: foireError } = await supabase
      .from('events')
      .upsert({
        organization_id: org.id,
        name: 'Foire Internationale de Dakar 2025',
        slug: 'foire-dakar-2025',
        event_type: 'foire',
        description: 'La plus grande foire internationale du Sénégal. Rassemblement de centaines d\'exposants locaux et internationaux dans les secteurs de l\'agriculture, de l\'industrie, des services et de l\'innovation.',
        start_date: '2025-12-01T08:00:00+00:00',
        end_date: '2025-12-15T18:00:00+00:00',
        location: 'CICES Dakar',
        location_address: 'Boulevard du Général de Gaulle, Dakar, Sénégal',
        status: 'published',
        foire_config: foireConfig,
      }, {
        onConflict: 'slug',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (foireError) {
      console.error('❌ Erreur lors de la création de la foire:', foireError.message)
      process.exit(1)
    }

    if (!foire) {
      console.error('❌ Foire non créée')
      process.exit(1)
    }

    console.log('✅ Foire créée:', foire.name)
    console.log('   Slug:', foire.slug)
    console.log('   Dates:', foire.start_date, '→', foire.end_date)
    console.log('   Type:', foire.event_type)
    console.log('')

    console.log('🎉 Seed terminé avec succès!')
    console.log('')
    console.log('📋 Résumé:')
    console.log('   Organisation:', org.slug)
    console.log('   Foire:', foire.slug)
    console.log('   URL:', `/fr/org/${org.slug}/foires/${foire.slug}`)
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
    process.exit(1)
  }
}

main()

