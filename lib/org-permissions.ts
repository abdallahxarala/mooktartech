import type { Database } from '@/lib/types/database.types'

export type OrganizationPlan = 'free' | 'pro' | 'team'
export type OrganizationRole = 'owner' | 'admin' | 'member'

export interface PlanLimits {
  name: string
  price: number
  currency: 'XOF'
  maxUsers: number | null
  maxCards: number | null
  features: string[]
}

const PLAN_LIMITS: Record<OrganizationPlan, PlanLimits> = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'XOF',
    maxUsers: 1,
    maxCards: 1,
    features: ['Templates basiques']
  },
  pro: {
    name: 'Pro',
    price: 5000,
    currency: 'XOF',
    maxUsers: 5,
    maxCards: null,
    features: ['Statistiques avancées', 'Templates personnalisés']
  },
  team: {
    name: 'Team',
    price: 15000,
    currency: 'XOF',
    maxUsers: null,
    maxCards: null,
    features: ['Accès API', 'Marque blanche', 'CRM intégré']
  }
}

export function getPlanLimits(plan: OrganizationPlan | null | undefined): PlanLimits {
  return PLAN_LIMITS[plan ?? 'free']
}

export function canManageMembers(role: OrganizationRole) {
  return role === 'owner' || role === 'admin'
}

export function canManageBilling(role: OrganizationRole) {
  return role === 'owner'
}

export function canManageTemplates(role: OrganizationRole) {
  return role !== 'member'
}

export function canManageCards(role: OrganizationRole) {
  return role !== 'member'
}

export function isOverUserLimit(plan: OrganizationPlan, memberCount: number) {
  const limit = getPlanLimits(plan).maxUsers
  return typeof limit === 'number' && memberCount >= limit
}

export function isOverCardLimit(plan: OrganizationPlan, cardCount: number) {
  const limit = getPlanLimits(plan).maxCards
  return typeof limit === 'number' && cardCount >= limit
}

export type OrganizationRow = Database['public']['Tables']['organizations']['Row']
export type OrganizationMemberRow =
  Database['public']['Tables']['organization_members']['Row']

