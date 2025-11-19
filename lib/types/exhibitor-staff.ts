/**
 * Types pour les membres du staff des exposants (exhibitor_staff)
 */

// Types temporaires jusqu'à ce que la table soit ajoutée aux types générés
export interface ExhibitorStaff {
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
  access_level: 'exhibitor' | 'manager' | 'staff'
  is_primary_contact: boolean
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface ExhibitorStaffInsert {
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
  access_level?: 'exhibitor' | 'manager' | 'staff'
  is_primary_contact?: boolean
  metadata?: Record<string, any> | null
  created_at?: string
  updated_at?: string
}

export interface ExhibitorStaffUpdate {
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
  access_level?: 'exhibitor' | 'manager' | 'staff'
  is_primary_contact?: boolean
  metadata?: Record<string, any> | null
  created_at?: string
  updated_at?: string
}

export interface StaffBadgeExport {
  badge_id: string
  company_name: string
  booth_number: string
  first_name: string
  last_name: string
  function: string
  email: string
  phone: string
  photo_url: string
  access_level: string
}

export interface StaffFormData {
  firstName: string
  lastName: string
  function: string
  email?: string
  phone?: string
  photo?: File | null
  photoPreview?: string | null
}

