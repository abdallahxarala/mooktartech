/**
 * Products Store - UI Cache Layer Only
 * 
 * This store now acts as a cache for products fetched from Supabase.
 * It no longer manages the source of truth (Supabase is the source).
 */

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductWithCategory } from '@/lib/types/products'

interface ProductsState {
  products: ProductWithCategory[]
  isLoading: boolean
  lastFetch: number | null
  cacheExpiry: number // milliseconds

  // Actions
  setProducts: (products: ProductWithCategory[]) => void
  addProduct: (product: ProductWithCategory) => void
  updateProduct: (id: string, updates: Partial<ProductWithCategory>) => void
  removeProduct: (id: string) => void
  getProductById: (id: string) => ProductWithCategory | undefined
  getProductBySlug: (slug: string) => ProductWithCategory | undefined
  clearCache: () => void
  isCacheValid: () => boolean
}

const CACHE_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      lastFetch: null,
      cacheExpiry: CACHE_EXPIRY_MS,

      setProducts: (products) => {
        set({
          products,
          lastFetch: Date.now()
        })
      },

      addProduct: (product) => {
        set((state) => ({
          products: [...state.products, product]
        }))
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          )
        }))
      },

      removeProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id)
        }))
      },

      getProductById: (id) => {
        return get().products.find((p) => p.id === id)
      },

      getProductBySlug: (slug) => {
        return get().products.find((p) => p.slug === slug)
      },

      clearCache: () => {
        set({
          products: [],
          lastFetch: null
        })
      },

      isCacheValid: () => {
        const { lastFetch, cacheExpiry } = get()
        if (!lastFetch) return false
        return Date.now() - lastFetch < cacheExpiry
      }
    }),
    {
      name: 'xarala-products-cache',
      partialize: (state) => ({
        products: state.products,
        lastFetch: state.lastFetch
      })
    }
  )
)
