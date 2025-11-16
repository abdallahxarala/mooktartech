/**
 * Hook to fetch products from Supabase API
 * 
 * This hook fetches products from the API and updates the Zustand cache.
 * Use this instead of directly accessing the store.
 */

'use client'

import { useEffect, useState } from 'react'
import { useProductsStore } from '@/lib/store/products-store'
import type { ProductWithCategory } from '@/lib/types/products'

interface UseProductsOptions {
  category?: string
  brand?: string
  featured?: boolean
  isNew?: boolean
  search?: string
  limit?: number
  skipCache?: boolean
}

interface UseProductsResult {
  products: ProductWithCategory[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const {
    products: cachedProducts,
    setProducts,
    isCacheValid,
    isLoading: storeLoading
  } = useProductsStore()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (options.category) params.set('category', options.category)
      if (options.brand) params.set('brand', options.brand)
      if (options.featured !== undefined) params.set('featured', String(options.featured))
      if (options.isNew !== undefined) params.set('isNew', String(options.isNew))
      if (options.search) params.set('search', options.search)
      if (options.limit) params.set('limit', String(options.limit))

      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch products')
      }

      setProducts(data.data.products)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error fetching products:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Use cache if valid and not skipping
    if (!options.skipCache && isCacheValid() && cachedProducts.length > 0) {
      return
    }

    fetchProducts()
  }, [
    options.category,
    options.brand,
    options.featured,
    options.isNew,
    options.search,
    options.limit
  ])

  return {
    products: cachedProducts,
    isLoading: isLoading || storeLoading,
    error,
    refetch: fetchProducts
  }
}

/**
 * Hook to fetch a single product by slug
 */
export function useProduct(slug: string) {
  const { getProductBySlug, setProducts } = useProductsStore()
  const [product, setProduct] = useState<ProductWithCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check cache first
    const cached = getProductBySlug(slug)
    if (cached) {
      setProduct(cached)
      setIsLoading(false)
      return
    }

    // Fetch from API
    const fetchProduct = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/products/${slug}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Product not found')
        }

        const fetchedProduct = data.data
        setProduct(fetchedProduct)

        // Update cache
        setProducts([fetchedProduct])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        console.error('Error fetching product:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  return {
    product,
    isLoading,
    error
  }
}
