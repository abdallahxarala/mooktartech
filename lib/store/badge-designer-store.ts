'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types pour le badge designer
export type BadgeTemplate = 'classic' | 'minimal' | 'corporate' | 'event'

export interface BadgeElement {
  id: string
  type: 'text' | 'image' | 'shape' | 'qr' | 'barcode'
  variant?: string // 'name' | 'company' | 'role' | 'photo' | 'logo' | 'rectangle' | 'circle' | etc.
  name: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  opacity: number
  locked: boolean
  visible: boolean
  layer: number
  
  // Propriétés spécifiques par type
  properties: {
    // Text
    text?: string
    fontFamily?: string
    fontSize?: number
    fontWeight?: string | number
    color?: string
    alignment?: 'left' | 'center' | 'right'
    italic?: boolean
    underline?: boolean
    
    // Image
    src?: string
    crop?: { x: number; y: number; width: number; height: number }
    borderRadius?: number
    
    // Shape
    shape?: 'rectangle' | 'circle' | 'container'
    fillColor?: string
    strokeColor?: string
    strokeWidth?: number
    borderRadius?: number
    
    // QR/Barcode
    data?: string
    format?: string
  }
}

export interface BadgeDesign {
  elements: BadgeElement[]
  background: {
    type: 'color' | 'gradient' | 'image'
    color?: string
    gradient?: { from: string; to: string; direction: number }
    image?: string
  }
  template: BadgeTemplate
  dimensions: {
    width: number // mm
    height: number // mm
    dpi: number
  }
}

// État du designer
interface BadgeDesignerState {
  // Design actuel
  currentDesign: BadgeDesign | null
  
  // Canvas
  selectedElementId: string | null
  zoom: number
  showGrid: boolean
  showGuides: boolean
  
  // UI
  activeTool: string | null
  
  // Actions
  initializeDesign: (template?: BadgeTemplate) => void
  setTemplate: (template: BadgeTemplate) => void
  addElement: (elementInput: Omit<BadgeElement, 'id'>) => void
  updateElement: (id: string, updates: Partial<BadgeElement>) => void
  removeElement: (id: string) => void
  duplicateElement: (id: string) => void
  setSelectedElement: (id: string | null) => void
  setZoom: (zoom: number) => void
  toggleGrid: () => void
  toggleGuides: () => void
  setActiveTool: (tool: string | null) => void
}

// Design par défaut
const createDefaultDesign = (template: BadgeTemplate = 'classic'): BadgeDesign => {
  const templateConfigs = {
    classic: {
      background: { type: 'color' as const, color: '#FFFFFF' },
      primaryColor: '#1f2937',
      secondaryColor: '#f97316',
    },
    minimal: {
      background: { type: 'color' as const, color: '#F9FAFB' },
      primaryColor: '#111827',
      secondaryColor: '#6B7280',
    },
    corporate: {
      background: { type: 'gradient' as const, gradient: { from: '#1e293b', to: '#334155', direction: 135 } },
      primaryColor: '#FFFFFF',
      secondaryColor: '#94a3b8',
    },
    event: {
      background: { type: 'gradient' as const, gradient: { from: '#f97316', to: '#ec4899', direction: 45 } },
      primaryColor: '#FFFFFF',
      secondaryColor: '#FED7AA',
    },
  }
  
  const config = templateConfigs[template]
  
  return {
    elements: [],
    background: config.background,
    template,
    dimensions: {
      width: 85.6, // CR80 standard
      height: 53.98,
      dpi: 300,
    },
  }
}

// Store
export const useBadgeDesignerStore = create<BadgeDesignerState>()(
  persist(
    (set, get) => ({
      // État initial
      currentDesign: null,
      selectedElementId: null,
      zoom: 100,
      showGrid: true,
      showGuides: true,
      activeTool: null,

      // Initialiser le design
      initializeDesign: (template = 'classic') => {
        const design = createDefaultDesign(template)
        set({ currentDesign: design })
      },

      // Changer le template
      setTemplate: (template) => {
        const { currentDesign } = get()
        if (!currentDesign) {
          get().initializeDesign(template)
          return
        }
        
        const newDesign = createDefaultDesign(template)
        set({
          currentDesign: {
            ...newDesign,
            elements: currentDesign.elements, // Garder les éléments existants
          },
        })
      },

      // Ajouter un élément
      addElement: (elementInput) => {
        const { currentDesign } = get()
        if (!currentDesign) {
          get().initializeDesign()
          return
        }

        const element: BadgeElement = {
          ...elementInput,
          id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }

        set({
          currentDesign: {
            ...currentDesign,
            elements: [...currentDesign.elements, element],
          },
          selectedElementId: element.id,
        })
      },

      // Mettre à jour un élément
      updateElement: (id, updates) => {
        const { currentDesign } = get()
        if (!currentDesign) return

        set({
          currentDesign: {
            ...currentDesign,
            elements: currentDesign.elements.map((el) =>
              el.id === id ? { ...el, ...updates } : el
            ),
          },
        })
      },

      // Supprimer un élément
      removeElement: (id) => {
        const { currentDesign, selectedElementId } = get()
        if (!currentDesign) return

        set({
          currentDesign: {
            ...currentDesign,
            elements: currentDesign.elements.filter((el) => el.id !== id),
          },
          selectedElementId: selectedElementId === id ? null : selectedElementId,
        })
      },

      // Dupliquer un élément
      duplicateElement: (id) => {
        const { currentDesign } = get()
        if (!currentDesign) return

        const element = currentDesign.elements.find((el) => el.id === id)
        if (!element) return

        const duplicated: BadgeElement = {
          ...element,
          id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          position: {
            x: element.position.x + 10,
            y: element.position.y + 10,
          },
        }

        set({
          currentDesign: {
            ...currentDesign,
            elements: [...currentDesign.elements, duplicated],
          },
          selectedElementId: duplicated.id,
        })
      },

      // Sélectionner un élément
      setSelectedElement: (id) => {
        set({ selectedElementId: id })
      },

      // Zoom
      setZoom: (zoom) => {
        set({ zoom: Math.max(25, Math.min(400, zoom)) })
      },

      // Grid & Guides
      toggleGrid: () => {
        set((state) => ({ showGrid: !state.showGrid }))
      },

      toggleGuides: () => {
        set((state) => ({ showGuides: !state.showGuides }))
      },

      // Outil actif
      setActiveTool: (tool) => {
        set({ activeTool: tool })
      },
    }),
    {
      name: 'badge-designer-storage',
      partialize: (state) => ({
        currentDesign: state.currentDesign,
        zoom: state.zoom,
        showGrid: state.showGrid,
        showGuides: state.showGuides,
      }),
    }
  )
)

