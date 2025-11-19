import { createSupabaseBrowserClient } from '@/lib/supabase/client'

import type { ExhibitorStaff, ExhibitorStaffInsert, StaffBadgeExport } from '@/lib/types/exhibitor-staff'

export async function createStaffMembers(
  exhibitorId: string,
  staffMembers: Array<{
    firstName: string
    lastName: string
    function: string
    email?: string
    phone?: string
    photoUrl?: string
  }>
) {
  const supabase = createSupabaseBrowserClient()

  const staffInserts: ExhibitorStaffInsert[] = staffMembers.map((staff) => ({
    exhibitor_id: exhibitorId,
    first_name: staff.firstName,
    last_name: staff.lastName,
    function: staff.function,
    email: staff.email || null,
    phone: staff.phone || null,
    badge_photo_url: staff.photoUrl || null,
    badge_id: `BADGE-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    access_level: 'exhibitor',
    is_primary_contact: false,
  }))

  const { data, error } = await supabase
    .from('exhibitor_staff')
    .insert(staffInserts)
    .select()

  return { data, error }
}

export async function getStaffByExhibitor(exhibitorId: string) {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase
    .from('exhibitor_staff')
    .select('*')
    .eq('exhibitor_id', exhibitorId)
    .order('created_at', { ascending: true })

  return { data: data as ExhibitorStaff[] | null, error }
}

export async function updateStaffMember(
  staffId: string,
  updates: Partial<ExhibitorStaffInsert>
) {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase
    .from('exhibitor_staff')
    .update(updates)
    .eq('id', staffId)
    .select()
    .single()

  return { data, error }
}

export async function deleteStaffMember(staffId: string) {
  const supabase = createSupabaseBrowserClient()

  const { error } = await supabase
    .from('exhibitor_staff')
    .delete()
    .eq('id', staffId)

  return { error }
}

export async function markBadgeAsPrinted(staffId: string) {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase
    .from('exhibitor_staff')
    .update({
      badge_printed: true,
      badge_printed_at: new Date().toISOString(),
    })
    .eq('id', staffId)
    .select()
    .single()

  return { data, error }
}

// ============================================
// EXPORT CSV POUR BADGES
// ============================================

export async function getStaffBadgesForEvent(eventId: string): Promise<StaffBadgeExport[]> {
  const supabase = createSupabaseBrowserClient()

  // D'abord, récupérer tous les exhibitors de l'événement
  const { data: exhibitors, error: exhibitorsError } = await supabase
    .from('exhibitors')
    .select('id, company_name, booth_number, booth_location')
    .eq('event_id', eventId)

  if (exhibitorsError || !exhibitors) {
    console.error('Error fetching exhibitors:', exhibitorsError)
    return []
  }

  const exhibitorIds = exhibitors.map((e) => e.id)

  if (exhibitorIds.length === 0) {
    return []
  }

  // Ensuite, récupérer tous les staff de ces exhibitors
  const { data: staffData, error: staffError } = await supabase
    .from('exhibitor_staff')
    .select('*')
    .in('exhibitor_id', exhibitorIds)
    .order('created_at', { ascending: true })

  if (staffError || !staffData) {
    console.error('Error fetching staff badges:', staffError)
    return []
  }

  // Créer un map pour accéder rapidement aux exhibitors
  const exhibitorMap = new Map(exhibitors.map((e) => [e.id, e]))

  // Mapper les données
  return staffData
    .map((staff: any) => {
      const exhibitor = exhibitorMap.get(staff.exhibitor_id)
      if (!exhibitor) return null

      return {
        badge_id: staff.badge_id,
        company_name: exhibitor.company_name,
        booth_number: exhibitor.booth_number || 'N/A',
        first_name: staff.first_name,
        last_name: staff.last_name,
        function: staff.function || '',
        email: staff.email || '',
        phone: staff.phone || '',
        photo_url: staff.badge_photo_url || '',
        access_level: staff.access_level,
      }
    })
    .filter((item): item is StaffBadgeExport => item !== null)
    .sort((a, b) => a.company_name.localeCompare(b.company_name))
}

export function exportStaffBadgesToCSV(badges: StaffBadgeExport[], eventName: string): string {
  // En-têtes CSV
  const headers = [
    'Badge ID',
    'Entreprise',
    'Stand',
    'Prénom',
    'Nom',
    'Fonction',
    'Email',
    'Téléphone',
    'Photo URL',
    'Niveau d\'accès',
  ]

  // Lignes de données
  const rows = badges.map((badge) => [
    badge.badge_id,
    badge.company_name,
    badge.booth_number,
    badge.first_name,
    badge.last_name,
    badge.function,
    badge.email,
    badge.phone,
    badge.photo_url,
    badge.access_level,
  ])

  // Construire le CSV
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  return csvContent
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Fonction principale pour exporter les badges d'un événement
export async function exportEventBadges(eventId: string, eventName: string) {
  const badges = await getStaffBadgesForEvent(eventId)
  
  if (badges.length === 0) {
    throw new Error('Aucun badge à exporter')
  }

  const csvContent = exportStaffBadgesToCSV(badges, eventName)
  const filename = `badges-${eventName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.csv`
  
  downloadCSV(csvContent, filename)
  
  return { success: true, count: badges.length }
}

