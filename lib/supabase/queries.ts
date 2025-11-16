'use client'

import { createSupabaseBrowserClient as createClient } from './client'

export async function getCurrentOrganizationId() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('organizations')
    .select('id')
    .limit(1)
    .single()

  if (error || !data) {
    console.error('❌ Erreur récupération org:', error)
    return null
  }

  console.log('✅ Organization ID:', data.id)
  return data.id
}

