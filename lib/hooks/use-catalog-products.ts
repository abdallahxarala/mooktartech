/**
 * Hook pour récupérer et filtrer les produits du catalogue
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { ExhibitorProduct } from '@/lib/types/exhibitor-product'

export interface ProductFilters {
  category?: string
  exhibitor_id?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}

export interface UseCatalogProductsOptions {
  eventId: string
  filters?: ProductFilters
  pageSize?: number
}

export interface UseCatalogProductsReturn {
  products: (ExhibitorProduct & { exhibitor_name?: string; exhibitor_booth?: string })[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refetch: () => void
  total: number
}

export function useCatalogProducts({
  eventId,
  filters = {},
  pageSize = 12,
}: UseCatalogProductsOptions): UseCatalogProductsReturn {
  const [products, setProducts] = useState<
    (ExhibitorProduct & { exhibitor_name?: string; exhibitor_booth?: string })[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const supabase = createSupabaseBrowserClient()

  const fetchProducts = useCallback(
    async (pageNum: number, reset = false) => {
      setIsLoading(true)
      setError(null)

      try {
        let query = supabase
          .from('exhibitor_products')
          .select(
            `
            *,
            exhibitors!inner(
              id,
              company_name,
              booth_number,
              booth_location,
              event_id
            )
          `,
            { count: 'exact' }
          )
          .eq('is_available', true)
          .eq('exhibitors.event_id', eventId)

        // Appliquer les filtres
        if (filters.category) {
          query = query.eq('category', filters.category)
        }

        if (filters.exhibitor_id) {
          query = query.eq('exhibitor_id', filters.exhibitor_id)
        }

        if (filters.minPrice !== undefined) {
          query = query.gte('price', filters.minPrice)
        }

        if (filters.maxPrice !== undefined) {
          query = query.lte('price', filters.maxPrice)
        }

        if (filters.search) {
          query = query.or(
            `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tags.cs.{${filters.search}}`
          )
        }

        // Pagination
        const from = (pageNum - 1) * pageSize
        const to = from + pageSize - 1

        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false }).range(from, to)

        const { data, error: queryError, count } = await query

        if (queryError) {
          throw new Error(queryError.message)
        }

        // Transformer les données pour inclure les infos exposant
        const transformedProducts =
          data?.map((item: any) => ({
            ...item,
            exhibitor_name: item.exhibitors?.company_name,
            exhibitor_booth: item.exhibitors?.booth_number || item.exhibitors?.booth_location,
          })) || []

        if (reset) {
          setProducts(transformedProducts)
        } else {
          setProducts((prev) => [...prev, ...transformedProducts])
        }

        setTotal(count || 0)
        setHasMore((count || 0) > pageNum * pageSize)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement')
      } finally {
        setIsLoading(false)
      }
    },
    [eventId, filters, pageSize, supabase]
  )

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(nextPage, false)
    }
  }, [page, isLoading, hasMore, fetchProducts])

  const refetch = useCallback(() => {
    setPage(1)
    setProducts([])
    fetchProducts(1, true)
  }, [fetchProducts])

  // Charger les produits au montage et quand les filtres changent
  useEffect(() => {
    setPage(1)
    setProducts([])
    fetchProducts(1, true)
  }, [eventId, JSON.stringify(filters)])

  return {
    products,
    isLoading,
    error,
    hasMore,
    loadMore,
    refetch,
    total,
  }
}

