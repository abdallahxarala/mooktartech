/**
 * Store Zustand pour les favoris produits
 */

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ExhibitorProduct } from '@/lib/types/exhibitor-product'

interface FavoritesState {
  favorites: string[] // IDs des produits favoris
  addFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (productId) => {
        const current = get().favorites
        if (!current.includes(productId)) {
          set({ favorites: [...current, productId] })
        }
      },

      removeFavorite: (productId) => {
        set({
          favorites: get().favorites.filter((id) => id !== productId),
        })
      },

      toggleFavorite: (productId) => {
        const isFav = get().isFavorite(productId)
        if (isFav) {
          get().removeFavorite(productId)
        } else {
          get().addFavorite(productId)
        }
      },

      isFavorite: (productId) => {
        return get().favorites.includes(productId)
      },

      clearFavorites: () => {
        set({ favorites: [] })
      },
    }),
    {
      name: 'foire-favorites',
    }
  )
)

