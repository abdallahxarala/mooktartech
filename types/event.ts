export type EventStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
export type ZoneType = 'general' | 'vip' | 'backstage' | 'expo' | 'conference'
export type AccessLevel = 'attendee' | 'vip' | 'staff' | 'exhibitor' | 'speaker'

export interface Event {
  id: string
  organization_id: string
  name: string
  slug: string
  description?: string
  start_date: string
  end_date: string
  location?: string
  location_address?: string
  max_attendees?: number
  status: EventStatus
  settings?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface EventZone {
  id: string
  event_id: string
  name: string
  type: ZoneType
  capacity?: number
  access_levels: AccessLevel[]
  description?: string
  created_at: string
}

export interface EventAttendee {
  id: string
  event_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  company?: string
  badge_id: string
  access_level: AccessLevel
  checked_in: boolean
  check_in_time?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface AccessScan {
  id: string
  event_id: string
  attendee_id: string
  zone_id?: string
  scanned_at: string
  scanner_device?: string
  access_granted: boolean
  denial_reason?: string
  metadata?: Record<string, any>
}

export interface EventWithStats extends Event {
  total_attendees?: number
  checked_in_count?: number
  zones_count?: number
  organization?: {
    id: string
    name: string
    slug: string
  }
}

export interface AttendeeWithEvent extends EventAttendee {
  event?: Event
}

