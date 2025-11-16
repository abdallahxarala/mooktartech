/**
 * Store Zustand pour la gestion des foires et exposants
 * Suit les patterns existants du projet
 */

'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ExhibitorProduct, ProductStats, Order } from '@/lib/types/exhibitor-product'

interface FoireState {
  // Exposant actuel
  exhibitorId: string | null
  eventId: string | null

  // Produits
  products: ExhibitorProduct[]
  isLoadingProducts: boolean
  productsError: string | null

  // Stats
  stats: ProductStats | null
  isLoadingStats: boolean
  statsError: string | null

  // Commandes
  orders: Order[]
  isLoadingOrders: boolean
  ordersError: string | null

  // UI State
  selectedProduct: ExhibitorProduct | null
  isProductFormOpen: boolean
  isProductFormEditing: boolean
}

interface FoireActions {
  // Exposant
  setExhibitor: (exhibitorId: string, eventId: string) => void
  clearExhibitor: () => void

  // Produits
  setProducts: (products: ExhibitorProduct[]) => void
  addProduct: (product: ExhibitorProduct) => void
  updateProduct: (productId: string, updates: Partial<ExhibitorProduct>) => void
  removeProduct: (productId: string) => void
  setLoadingProducts: (loading: boolean) => void
  setProductsError: (error: string | null) => void

  // Stats
  setStats: (stats: ProductStats) => void
  setLoadingStats: (loading: boolean) => void
  setStatsError: (error: string | null) => void

  // Commandes
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  updateOrder: (orderId: string, updates: Partial<Order>) => void
  setLoadingOrders: (loading: boolean) => void
  setOrdersError: (error: string | null) => void

  // UI
  setSelectedProduct: (product: ExhibitorProduct | null) => void
  openProductForm: (product?: ExhibitorProduct) => void
  closeProductForm: () => void
}

type FoireStore = FoireState & FoireActions

const initialState: FoireState = {
  exhibitorId: null,
  eventId: null,
  products: [],
  isLoadingProducts: false,
  productsError: null,
  stats: null,
  isLoadingStats: false,
  statsError: null,
  orders: [],
  isLoadingOrders: false,
  ordersError: null,
  selectedProduct: null,
  isProductFormOpen: false,
  isProductFormEditing: false,
}

export const useFoireStore = create<FoireStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Exposant
      setExhibitor: (exhibitorId, eventId) => {
        set({ exhibitorId, eventId })
      },

      clearExhibitor: () => {
        set(initialState)
      },

      // Produits
      setProducts: (products) => {
        set({ products, productsError: null })
      },

      addProduct: (product) => {
        set((state) => ({
          products: [product, ...state.products],
        }))
      },

      updateProduct: (productId, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, ...updates } : p
          ),
          selectedProduct:
            state.selectedProduct?.id === productId
              ? { ...state.selectedProduct, ...updates }
              : state.selectedProduct,
        }))
      },

      removeProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
          selectedProduct:
            state.selectedProduct?.id === productId ? null : state.selectedProduct,
        }))
      },

      setLoadingProducts: (loading) => {
        set({ isLoadingProducts: loading })
      },

      setProductsError: (error) => {
        set({ productsError: error })
      },

      // Stats
      setStats: (stats) => {
        set({ stats, statsError: null })
      },

      setLoadingStats: (loading) => {
        set({ isLoadingStats: loading })
      },

      setStatsError: (error) => {
        set({ statsError: error })
      },

      // Commandes
      setOrders: (orders) => {
        set({ orders, ordersError: null })
      },

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }))
      },

      updateOrder: (orderId, updates) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, ...updates } : o
          ),
        }))
      },

      setLoadingOrders: (loading) => {
        set({ isLoadingOrders: loading })
      },

      setOrdersError: (error) => {
        set({ ordersError: error })
      },

      // UI
      setSelectedProduct: (product) => {
        set({ selectedProduct: product })
      },

      openProductForm: (product) => {
        set({
          isProductFormOpen: true,
          isProductFormEditing: !!product,
          selectedProduct: product || null,
        })
      },

      closeProductForm: () => {
        set({
          isProductFormOpen: false,
          isProductFormEditing: false,
          selectedProduct: null,
        })
      },
    }),
    { name: 'foire-store' }
  )
)

// Sélecteurs optimisés
export const useProducts = () => useFoireStore((state) => state.products)
export const useVisibleProducts = () =>
  useFoireStore((state) => state.products.filter((p) => p.is_available))
export const useStats = () => useFoireStore((state) => state.stats)
export const useOrders = () => useFoireStore((state) => state.orders)
export const usePendingOrders = () =>
  useFoireStore((state) => state.orders.filter((o) => o.status === 'pending'))

