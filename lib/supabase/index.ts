/**
 * Export principal des utilitaires Supabase pour Xarala Solutions
 * Point d'entrée unique pour tous les clients et utilitaires Supabase
 */

// === CLIENTS ===
export { createSupabaseBrowserClient } from './client'
// Note: createSupabaseServerClient is NOT exported here to avoid bundling issues
// Server components and route handlers should import directly from './server'

// === MIDDLEWARE ===
export { 
  supabaseMiddleware,
  checkAuth,
  checkAdminPermissions,
  getCurrentUserWithProfile,
  handleAuthError,
  SUPABASE_MIDDLEWARE_CONFIG
} from './middleware'

// === HOOKS ===
export {
  useSupabaseQuery,
  useSupabaseListQuery,
  useSupabaseMutation,
  useSupabaseRealtimeQuery,
  useSupabaseCachedQuery,
  useSupabaseDebouncedQuery,
  useSupabaseResilientQuery
} from '../hooks/use-supabase-query'

// === TYPES ===
export type { Database } from '../types/database.types'
export type {
  User,
  Product,
  Order,
  OrderItem,
  VirtualCard,
  CardTemplate,
  CardAnalytics,
  Contact,
  Webhook,
  UserInsert,
  ProductInsert,
  OrderInsert,
  OrderItemInsert,
  VirtualCardInsert,
  CardTemplateInsert,
  CardAnalyticsInsert,
  ContactInsert,
  WebhookInsert,
  UserUpdate,
  ProductUpdate,
  OrderUpdate,
  OrderItemUpdate,
  VirtualCardUpdate,
  CardTemplateUpdate,
  CardAnalyticsUpdate,
  ContactUpdate,
  WebhookUpdate,
  UserRole,
  OrderStatus,
  OrderWithItems,
  VirtualCardWithTemplate,
  ContactWithCard,
  CardAnalyticsWithCard,
  PaginatedResponse,
  ApiError,
  ApiSuccess,
  ApiResponse,
  ProductFilters,
  OrderFilters,
  VirtualCardFilters,
  ContactFilters,
  OrderStats,
  CardStats,
  UserStats,
  GlobalStats,
  CardMetadata,
  ContactMetadata,
  AnalyticsMetadata,
  WebhookEvent,
  WebhookPayload,
  WebhookConfig,
  SearchResult,
  SearchFacets,
  ExportFormat,
  ExportConfig,
  ExportResult
} from '../types/database.types'

// === UTILITAIRES ===
export {
  isNetworkError,
  isAuthError,
  isRLSError,
  isUniqueConstraintError,
  isForeignKeyError,
  formatSupabaseError,
  isValidEmail,
  isValidSenegalPhone,
  isValidUUID,
  validateVirtualCardData,
  validateOrderData,
  transformUser,
  transformProduct,
  transformOrder,
  generateShortId,
  generateOrderNumber,
  formatPrice,
  formatDate,
  formatSenegalPhone,
  calculatePagination,
  getPaginationParams,
  SupabaseCache,
  supabaseCache,
  withRetry,
  debounce,
  throttle,
  logSupabaseQuery,
  measureQueryTime
} from './utils'

// === EXEMPLES ===
export {
  getProductsExample,
  createVirtualCardExample,
  processOrderExample,
  // Note: getAdminStatsExample removed from exports - it uses server client and should not be accessible to client components
  useProductsExample,
  useCreateVirtualCardExample,
  useCardAnalyticsExample,
  robustErrorHandlingExample,
  useOptimizedProductsExample,
  useSearchProductsExample,
  testSupabaseFunctions,
  useSupabaseWithZustand
} from './examples'

// === CONFIGURATION ===
export const SUPABASE_CONFIG = {
  // Configuration des retry
  RETRY: {
    MAX_RETRIES: 3,
    DELAY: 1000,
    BACKOFF_MULTIPLIER: 2
  },
  
  // Configuration du cache
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
    STALE_TIME: 1 * 60 * 1000,  // 1 minute
    MAX_SIZE: 100
  },
  
  // Configuration de la pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  },
  
  // Configuration des requêtes
  QUERIES: {
    DEBOUNCE_DELAY: 300,
    REFETCH_INTERVAL: 30000,
    TIMEOUT: 10000
  },
  
  // Configuration des erreurs
  ERRORS: {
    NETWORK_RETRY_COUNT: 5,
    NETWORK_RETRY_DELAY: 2000
  }
} as const

// === FONCTIONS UTILITAIRES GLOBALES ===

/**
 * Initialise la configuration Supabase
 */
export function initializeSupabase() {
  if (typeof window !== 'undefined') {
    // Configuration côté client
    console.log('🚀 Supabase initialisé pour Xarala Solutions')
  } else {
    // Configuration côté serveur
    console.log('🚀 Supabase Server initialisé pour Xarala Solutions')
  }
}

/**
 * Vérifie la connectivité Supabase
 */
export async function checkSupabaseConnection() {
  try {
    const { createSupabaseBrowserClient } = await import('./client')
    const supabase = createSupabaseBrowserClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      throw error
    }
    
    return {
      connected: true,
      message: 'Connexion Supabase réussie'
    }
  } catch (error) {
    return {
      connected: false,
      message: `Erreur de connexion Supabase: ${error}`
    }
  }
}

/**
 * Obtient les statistiques de l'application
 * 
 * NOTE: This function is NOT exported to avoid bundling server code in client components.
 * Server components and route handlers should import createSupabaseServerClient directly
 * from '@/lib/supabase/server' and implement their own stats queries.
 */
async function getAppStats() {
  try {
    const { createSupabaseServerClient } = await import('./server')
    const supabase = createSupabaseServerClient()
    
    const [
      { data: users },
      { data: products },
      { data: orders },
      { data: cards }
    ] = await Promise.all([
      supabase.supabase.from('users').select('count', { count: 'exact' }),
      supabase.supabase.from('products').select('count', { count: 'exact' }),
      supabase.supabase.from('orders').select('count', { count: 'exact' }),
      supabase.supabase.from('virtual_cards').select('count', { count: 'exact' })
    ])
    
    return {
      users: users?.[0]?.count || 0,
      products: products?.[0]?.count || 0,
      orders: orders?.[0]?.count || 0,
      cards: cards?.[0]?.count || 0
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return {
      users: 0,
      products: 0,
      orders: 0,
      cards: 0
    }
  }
}

// === EXPORTS PAR DÉFAUT ===
export default {
  // Clients (only browser client exported)
  createSupabaseBrowserClient,
  
  // Hooks
  useSupabaseQuery,
  useSupabaseMutation,
  
  // Utilitaires
  formatSupabaseError,
  isValidEmail,
  isValidSenegalPhone,
  formatPrice,
  formatDate,
  
  // Configuration
  SUPABASE_CONFIG,
  initializeSupabase,
  checkSupabaseConnection
  // Note: getAppStats removed from default export - it uses server client and should not be accessible to client components
} as const
