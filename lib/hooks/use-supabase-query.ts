import { useState, useEffect, useCallback, useRef } from 'react'
import type { Database } from '@/lib/types/database.types'

/**
 * Hook personnalisé pour les requêtes Supabase
 * Gestion des états de chargement, erreurs et retry logic
 */

// Types pour les options du hook
interface UseSupabaseQueryOptions<T> {
  immediate?: boolean
  retryCount?: number
  retryDelay?: number
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  onRetry?: (attempt: number) => void
  refetchOnWindowFocus?: boolean
  refetchInterval?: number
  enabled?: boolean
}

// Types pour le résultat du hook
interface UseSupabaseQueryResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  mutate: (data: T | null) => void
  reset: () => void
  retry: () => Promise<void>
  isRetrying: boolean
  retryCount: number
}

// Types pour les fonctions de requête
type QueryFunction<T> = () => Promise<{ data: T | null; error: string | null }>

/**
 * Hook principal pour les requêtes Supabase
 */
export function useSupabaseQuery<T>(
  queryFn: QueryFunction<T>,
  options: UseSupabaseQueryOptions<T> = {}
): UseSupabaseQueryResult<T> {
  const {
    immediate = true,
    retryCount: maxRetries = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    onRetry,
    refetchOnWindowFocus = false,
    refetchInterval,
    enabled = true,
  } = options

  // États
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Refs pour éviter les fuites mémoire
  const mountedRef = useRef(true)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fonction de requête avec retry logic
  const executeQuery = useCallback(async (isRetry = false): Promise<void> => {
    if (!enabled || !mountedRef.current) return

    try {
      if (isRetry) {
        setIsRetrying(true)
        onRetry?.(retryCount + 1)
      } else {
        setLoading(true)
        setError(null)
      }

      const result = await queryFn()

      if (!mountedRef.current) return

      if (result.error) {
        throw new Error(result.error)
      }

      setData(result.data)
      setError(null)
      setRetryCount(0)
      setIsRetrying(false)
      onSuccess?.(result.data as T)

    } catch (err) {
      if (!mountedRef.current) return

      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite'
      setError(errorMessage)
      setIsRetrying(false)
      onError?.(errorMessage)

      // Retry logic
      if (retryCount < maxRetries && !isRetry) {
        const delay = retryDelay * Math.pow(2, retryCount) // Exponential backoff
        setRetryCount(prev => prev + 1)
        
        retryTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            executeQuery(true)
          }
        }, delay)
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [queryFn, enabled, maxRetries, retryDelay, retryCount, onSuccess, onError, onRetry])

  // Fonction de refetch
  const refetch = useCallback(async (): Promise<void> => {
    setRetryCount(0)
    await executeQuery()
  }, [executeQuery])

  // Fonction de mutation
  const mutate = useCallback((newData: T | null): void => {
    setData(newData)
  }, [])

  // Fonction de reset
  const reset = useCallback((): void => {
    setData(null)
    setError(null)
    setRetryCount(0)
    setIsRetrying(false)
    setLoading(false)
  }, [])

  // Fonction de retry manuel
  const retry = useCallback(async (): Promise<void> => {
    setRetryCount(0)
    await executeQuery()
  }, [executeQuery])

  // Effet pour l'exécution initiale
  useEffect(() => {
    if (immediate && enabled) {
      executeQuery()
    }
  }, [immediate, enabled, executeQuery])

  // Effet pour le refetch sur focus de la fenêtre
  useEffect(() => {
    if (!refetchOnWindowFocus) return

    const handleFocus = () => {
      if (enabled) {
        refetch()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refetchOnWindowFocus, enabled, refetch])

  // Effet pour le refetch par intervalle
  useEffect(() => {
    if (!refetchInterval || !enabled) return

    intervalRef.current = setInterval(() => {
      refetch()
    }, refetchInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [refetchInterval, enabled, refetch])

  // Nettoyage
  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    data,
    loading,
    error,
    refetch,
    mutate,
    reset,
    retry,
    isRetrying,
    retryCount,
  }
}

/**
 * Hook pour les requêtes de liste avec pagination
 */
export function useSupabaseListQuery<T>(
  queryFn: (offset: number, limit: number) => Promise<{ data: T[] | null; error: string | null; total?: number }>,
  options: UseSupabaseQueryOptions<T[]> & {
    pageSize?: number
    initialPage?: number
  } = {}
) {
  const {
    pageSize = 10,
    initialPage = 1,
    ...queryOptions
  } = options

  const [page, setPage] = useState(initialPage)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const offset = (page - 1) * pageSize

  const query = useCallback(async () => {
    const result = await queryFn(offset, pageSize)
    if (result.total !== undefined) {
      setTotal(result.total)
      setHasMore(offset + pageSize < result.total)
    }
    return result
  }, [queryFn, offset, pageSize])

  const result = useSupabaseQuery(query, queryOptions)

  const nextPage = useCallback(() => {
    if (hasMore && !result.loading) {
      setPage(prev => prev + 1)
    }
  }, [hasMore, result.loading])

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }, [page])

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(total / pageSize)) {
      setPage(newPage)
    }
  }, [total, pageSize])

  const resetPagination = useCallback(() => {
    setPage(initialPage)
    setTotal(0)
    setHasMore(true)
  }, [initialPage])

  return {
    ...result,
    page,
    total,
    hasMore,
    totalPages: Math.ceil(total / pageSize),
    nextPage,
    prevPage,
    goToPage,
    resetPagination,
  }
}

/**
 * Hook pour les mutations (create, update, delete)
 */
export function useSupabaseMutation<T, V = any>(
  mutationFn: (variables: V) => Promise<{ data: T | null; error: string | null }>,
  options: {
    onSuccess?: (data: T) => void
    onError?: (error: string) => void
    onSettled?: () => void
  } = {}
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const mutate = useCallback(async (variables: V): Promise<T | null> => {
    try {
      setLoading(true)
      setError(null)

      const result = await mutationFn(variables)

      if (result.error) {
        throw new Error(result.error)
      }

      setData(result.data)
      options.onSuccess?.(result.data as T)
      return result.data

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite'
      setError(errorMessage)
      options.onError?.(errorMessage)
      return null
    } finally {
      setLoading(false)
      options.onSettled?.()
    }
  }, [mutationFn, options])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    mutate,
    data,
    loading,
    error,
    reset,
  }
}

/**
 * Hook pour les requêtes en temps réel avec Supabase Realtime
 */
export function useSupabaseRealtimeQuery<T>(
  queryFn: QueryFunction<T>,
  table: string,
  options: UseSupabaseQueryOptions<T> & {
    filter?: string
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  } = {}
) {
  const result = useSupabaseQuery(queryFn, options)

  useEffect(() => {
    // Ici, vous pouvez ajouter la logique pour écouter les changements en temps réel
    // avec supabase.channel().on('postgres_changes', ...)
    // Pour l'instant, on utilise le refetch par intervalle comme fallback
  }, [table, options.filter, options.event])

  return result
}

/**
 * Hook pour les requêtes avec cache local
 */
export function useSupabaseCachedQuery<T>(
  queryFn: QueryFunction<T>,
  cacheKey: string,
  options: UseSupabaseQueryOptions<T> & {
    cacheTime?: number // en millisecondes
    staleTime?: number // en millisecondes
  } = {}
) {
  const { cacheTime = 5 * 60 * 1000, staleTime = 1 * 60 * 1000, ...queryOptions } = options

  const [cache, setCache] = useState<Map<string, { data: T; timestamp: number }>>(new Map())

  const getCachedData = useCallback((): T | null => {
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data
    }
    return null
  }, [cache, cacheKey, cacheTime])

  const setCachedData = useCallback((data: T) => {
    setCache(prev => new Map(prev.set(cacheKey, { data, timestamp: Date.now() })))
  }, [cacheKey])

  const query = useCallback(async () => {
    // Vérifier le cache d'abord
    const cachedData = getCachedData()
    if (cachedData) {
      return { data: cachedData, error: null }
    }

    // Sinon, exécuter la requête
    const result = await queryFn()
    if (result.data) {
      setCachedData(result.data)
    }
    return result
  }, [queryFn, getCachedData, setCachedData])

  const result = useSupabaseQuery(query, queryOptions)

  // Mettre à jour le cache quand les données changent
  useEffect(() => {
    if (result.data) {
      setCachedData(result.data)
    }
  }, [result.data, setCachedData])

  return result
}

/**
 * Hook pour les requêtes avec debounce
 */
export function useSupabaseDebouncedQuery<T>(
  queryFn: QueryFunction<T>,
  delay: number = 300,
  options: UseSupabaseQueryOptions<T> = {}
) {
  const [debouncedQueryFn, setDebouncedQueryFn] = useState<QueryFunction<T>>(() => queryFn)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQueryFn(() => queryFn)
    }, delay)

    return () => clearTimeout(timer)
  }, [queryFn, delay])

  return useSupabaseQuery(debouncedQueryFn, options)
}

/**
 * Hook pour les requêtes avec retry automatique en cas d'erreur réseau
 */
export function useSupabaseResilientQuery<T>(
  queryFn: QueryFunction<T>,
  options: UseSupabaseQueryOptions<T> & {
    networkRetryCount?: number
    networkRetryDelay?: number
  } = {}
) {
  const {
    networkRetryCount = 5,
    networkRetryDelay = 2000,
    ...queryOptions
  } = options

  const isNetworkError = useCallback((error: string): boolean => {
    return error.includes('network') || 
           error.includes('fetch') || 
           error.includes('timeout') ||
           error.includes('connection')
  }, [])

  const resilientQueryFn = useCallback(async () => {
    let lastError: string | null = null

    for (let i = 0; i < networkRetryCount; i++) {
      try {
        const result = await queryFn()
        if (result.error && isNetworkError(result.error)) {
          lastError = result.error
          if (i < networkRetryCount - 1) {
            await new Promise(resolve => setTimeout(resolve, networkRetryDelay))
            continue
          }
        }
        return result
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Erreur inconnue'
        if (isNetworkError(lastError) && i < networkRetryCount - 1) {
          await new Promise(resolve => setTimeout(resolve, networkRetryDelay))
          continue
        }
        return { data: null, error: lastError }
      }
    }

    return { data: null, error: lastError || 'Erreur de réseau' }
  }, [queryFn, networkRetryCount, networkRetryDelay, isNetworkError])

  return useSupabaseQuery(resilientQueryFn, queryOptions)
}
