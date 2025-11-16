'use client'

import { create } from 'zustand'

type CardFace = 'front' | 'back'

type ZoomLimits = {
  MIN: number
  MAX: number
  STEP: number
}

const ZOOM_LIMITS: ZoomLimits = {
  MIN: 0.25,
  MAX: 4,
  STEP: 0.1
}

type CardDesignerState = {
  // Face active : 'front' (recto) ou 'back' (verso)
  cardFace: CardFace

  // Deux canvas Fabric.js distincts
  canvases: {
    front: any | null
    back: any | null
  }

  canvasReady: boolean

  // Zoom & vue
  zoom: number
  showGrid: boolean
  showSafeZones: boolean

  // Layers (pour le futur panneau de calques)
  layers: any[]

  // ACTIONS
  setCardFace: (face: CardFace) => void
  flipCard: () => void

  registerCanvas: (face: CardFace, canvas: any | null) => void
  setCanvasReady: (ready: boolean) => void

  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void

  toggleGrid: () => void
  toggleSafeZones: () => void
}

export const useCardStore = create<CardDesignerState>((set, get) => ({
  cardFace: 'front',

  canvases: {
    front: null,
    back: null
  },

  canvasReady: false,

  zoom: 1,
  showGrid: false,
  showSafeZones: false,

  layers: [],

  setCardFace: (face) => set({ cardFace: face }),

  flipCard: () => {
    const current = get().cardFace
    const next: CardFace = current === 'front' ? 'back' : 'front'
    set({ cardFace: next })
  },

  registerCanvas: (face, canvas) =>
    set((state) => ({
      canvases: {
        ...state.canvases,
        [face]: canvas
      }
    })),

  setCanvasReady: (ready) => set({ canvasReady: ready }),

  zoomIn: () =>
    set((state) => {
      const next = Math.min(state.zoom + ZOOM_LIMITS.STEP, ZOOM_LIMITS.MAX)
      return { zoom: Number(next.toFixed(2)) }
    }),

  zoomOut: () =>
    set((state) => {
      const next = Math.max(state.zoom - ZOOM_LIMITS.STEP, ZOOM_LIMITS.MIN)
      return { zoom: Number(next.toFixed(2)) }
    }),

  resetZoom: () => set({ zoom: 1 }),

  toggleGrid: () =>
    set((state) => ({
      showGrid: !state.showGrid
    })),

  toggleSafeZones: () =>
    set((state) => ({
      showSafeZones: !state.showSafeZones
    }))
}))
