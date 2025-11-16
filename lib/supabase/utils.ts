/**
 * Utilitaires Supabase pour Xarala Solutions
 * Fonctions helper et utilitaires communs
 */

import type { Database } from '@/lib/types/database.types'

// === TYPES UTILITAIRES ===

export type SupabaseError = {
  message: string
  details?: string
  hint?: string
  code?: string
}

export type SupabaseResponse<T> = {
  data: T | null
  error: SupabaseError | null
}

// === GESTION D'ERREURS ===

/**
 * Vérifie si une erreur Supabase est une erreur de réseau
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false
  
  const message = error.message || error.toString()
  return message.includes('network') || 
         message.includes('fetch') || 
         message.includes('timeout') ||
         message.includes('connection') ||
         message.includes('ECONNREFUSED') ||
         message.includes('ENOTFOUND')
}

/**
 * Vérifie si une erreur Supabase est une erreur d'authentification
 */
export function isAuthError(error: any): boolean {
  if (!error) return false
  
  const message = error.message || error.toString()
  return message.includes('JWT') || 
         message.includes('auth') ||
         message.includes('unauthorized') ||
         message.includes('forbidden') ||
         error.code === 'PGRST301'
}

/**
 * Vérifie si une erreur Supabase est une erreur de permissions RLS
 */
export function isRLSError(error: any): boolean {
  if (!error) return false
  
  const message = error.message || error.toString()
  return message.includes('RLS') || 
         message.includes('row level security') ||
         message.includes('permission denied') ||
         error.code === '42501'
}

/**
 * Vérifie si une erreur Supabase est une erreur de contrainte unique
 */
export function isUniqueConstraintError(error: any): boolean {
  if (!error) return false
  
  const message = error.message || error.toString()
  return message.includes('duplicate key') || 
         message.includes('unique constraint') ||
         error.code === '23505'
}

/**
 * Vérifie si une erreur Supabase est une erreur de contrainte de clé étrangère
 */
export function isForeignKeyError(error: any): boolean {
  if (!error) return false
  
  const message = error.message || error.toString()
  return message.includes('foreign key') || 
         message.includes('referenced') ||
         error.code === '23503'
}

/**
 * Formate une erreur Supabase en message utilisateur
 */
export function formatSupabaseError(error: any): string {
  if (!error) return 'Une erreur inattendue s\'est produite'

  // Erreurs de réseau
  if (isNetworkError(error)) {
    return 'Problème de connexion. Vérifiez votre connexion internet.'
  }

  // Erreurs d'authentification
  if (isAuthError(error)) {
    return 'Session expirée. Veuillez vous reconnecter.'
  }

  // Erreurs de permissions
  if (isRLSError(error)) {
    return 'Accès non autorisé.'
  }

  // Erreurs de contrainte unique
  if (isUniqueConstraintError(error)) {
    return 'Cette ressource existe déjà.'
  }

  // Erreurs de clé étrangère
  if (isForeignKeyError(error)) {
    return 'Impossible de supprimer cette ressource car elle est utilisée ailleurs.'
  }

  // Erreur générique
  return error.message || 'Une erreur inattendue s\'est produite'
}

// === VALIDATION ===

/**
 * Valide un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valide un numéro de téléphone sénégalais
 */
export function isValidSenegalPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return /^(221|0)[0-9]{9}$/.test(cleaned)
}

/**
 * Valide un UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Valide les données d'une carte virtuelle
 */
export function validateVirtualCardData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Le nom est requis')
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push('L\'email n\'est pas valide')
  }

  if (data.phone && !isValidSenegalPhone(data.phone)) {
    errors.push('Le numéro de téléphone n\'est pas valide')
  }

  if (!data.template_id || data.template_id.trim().length === 0) {
    errors.push('Le template est requis')
  }

  if (!data.short_id || data.short_id.trim().length === 0) {
    errors.push('L\'ID court est requis')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Valide les données d'une commande
 */
export function validateOrderData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.user_id || !isValidUUID(data.user_id)) {
    errors.push('L\'ID utilisateur est requis et doit être valide')
  }

  if (!data.total || data.total <= 0) {
    errors.push('Le total doit être supérieur à 0')
  }

  if (!data.shipping_address) {
    errors.push('L\'adresse de livraison est requise')
  } else {
    const address = data.shipping_address
    if (!address.street || address.street.trim().length === 0) {
      errors.push('La rue est requise')
    }
    if (!address.city || address.city.trim().length === 0) {
      errors.push('La ville est requise')
    }
    if (!address.region || address.region.trim().length === 0) {
      errors.push('La région est requise')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// === TRANSFORMATION DE DONNÉES ===

/**
 * Transforme un utilisateur Supabase en format de l'application
 */
export function transformUser(user: Database['public']['Tables']['users']['Row']) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.full_name?.split(' ')[0] || '',
    lastName: user.full_name?.split(' ').slice(1).join(' ') || '',
    phone: user.phone,
    company: user.company,
    role: user.role,
    isActive: user.is_active,
    avatar: user.avatar_url,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  }
}

/**
 * Transforme un produit Supabase en format de l'application
 */
export function transformProduct(product: Database['public']['Tables']['products']['Row']) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image_url,
    inStock: product.stock > 0,
    stockQuantity: product.stock,
    isActive: product.is_active,
    createdAt: product.created_at,
    updatedAt: product.updated_at
  }
}

/**
 * Transforme une commande Supabase en format de l'application
 */
export function transformOrder(order: Database['public']['Tables']['orders']['Row']) {
  return {
    id: order.id,
    userId: order.user_id,
    status: order.status,
    total: order.total,
    shippingAddress: order.shipping_address,
    paymentIntentId: order.payment_intent_id,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  }
}

// === GÉNÉRATION D'ID ===

/**
 * Génère un ID court unique pour les cartes virtuelles
 */
export function generateShortId(name: string, company?: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Supprime les tirets multiples
    .trim()

  const companySuffix = company 
    ? `-${company.toLowerCase().replace(/[^a-z0-9]/g, '')}`
    : ''

  const timestamp = Date.now().toString(36)
  
  return `${base}${companySuffix}-${timestamp}`
}

/**
 * Génère un numéro de commande unique
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `XAR-${timestamp.slice(-6)}-${random}`
}

// === FORMATAGE ===

/**
 * Formate un prix en FCFA
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Formate une date selon la locale
 */
export function formatDate(date: string | Date, locale: string = 'fr'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

/**
 * Formate un numéro de téléphone sénégalais
 */
export function formatSenegalPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('221')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
  }
  
  if (cleaned.startsWith('0')) {
    return `+221 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`
  }
  
  return phone
}

// === PAGINATION ===

/**
 * Calcule les paramètres de pagination
 */
export function calculatePagination(page: number, pageSize: number, total: number) {
  const totalPages = Math.ceil(total / pageSize)
  const offset = (page - 1) * pageSize
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return {
    page,
    pageSize,
    total,
    totalPages,
    offset,
    hasNextPage,
    hasPrevPage
  }
}

/**
 * Génère les paramètres de requête pour la pagination
 */
export function getPaginationParams(page: number, pageSize: number) {
  return {
    limit: pageSize,
    offset: (page - 1) * pageSize
  }
}

// === CACHE ===

/**
 * Gère le cache local pour les requêtes Supabase
 */
export class SupabaseCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: string): boolean {
    const cached = this.cache.get(key)
    return cached ? Date.now() - cached.timestamp <= cached.ttl : false
  }
}

// Instance globale du cache
export const supabaseCache = new SupabaseCache()

// === RETRY LOGIC ===

/**
 * Exécute une fonction avec retry automatique
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (i < maxRetries - 1) {
        const backoffDelay = delay * Math.pow(2, i) // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, backoffDelay))
      }
    }
  }

  throw lastError!
}

// === DEBOUNCE ===

/**
 * Debounce une fonction
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// === THROTTLE ===

/**
 * Throttle une fonction
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// === UTILITAIRES DE DÉVELOPPEMENT ===

/**
 * Log les requêtes Supabase en mode développement
 */
export function logSupabaseQuery(operation: string, table: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Supabase] ${operation} on ${table}`, data)
  }
}

/**
 * Mesure le temps d'exécution d'une requête
 */
export async function measureQueryTime<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  
  try {
    const result = await queryFn()
    const end = performance.now()
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Supabase] ${queryName} took ${(end - start).toFixed(2)}ms`)
    }
    
    return result
  } catch (error) {
    const end = performance.now()
    
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Supabase] ${queryName} failed after ${(end - start).toFixed(2)}ms`, error)
    }
    
    throw error
  }
}
