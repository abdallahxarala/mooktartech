'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types pour le designer de cartes
export interface CardProject {
  id: string
  name: string
  description: string
  template: string
  dimensions: {
    width: number // mm
    height: number // mm
    dpi: number
  }
  recto: CardDesign
  verso: CardDesign
  dataSource?: DataSource
  dataSourceConfig?: DataSourceConfig
  variables?: VariableDefinition[]
  security: SecurityFeatures
  createdAt: string
  updatedAt: string
  version: number
}

export interface CardDesign {
  elements: DesignElement[]
  background: BackgroundSettings
  bleed: number // mm
  safeArea: number // mm
}

export interface DesignElement {
  id: string
  type: 'text' | 'image' | 'shape' | 'qr' | 'barcode' | 'line' | 'security'
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
    fontWeight?: string
    color?: string
    alignment?: 'left' | 'center' | 'right'
    
    // Image
    src?: string
    crop?: { x: number; y: number; width: number; height: number }
    
    // Shape
    shape?: 'rectangle' | 'circle' | 'polygon'
    fillColor?: string
    strokeColor?: string
    strokeWidth?: number
    
    // QR/Barcode
    data?: string
    format?: string
    
    // Security
    securityType?: 'hologram' | 'watermark' | 'microtext'
  }
}

export interface BackgroundSettings {
  type: 'color' | 'gradient' | 'image' | 'pattern'
  color?: string
  gradient?: { from: string; to: string; direction: number }
  image?: string
  pattern?: string
}

export interface DataSource {
  type: 'excel' | 'csv' | 'json'
  url?: string
  fields: string[]
  mapping: Record<string, string>
}

export interface VariableDefinition {
  id: string
  name: string // "nom", "email", "entreprise"
  type: "text" | "qr" | "barcode" | "image"
  defaultValue?: string
  required?: boolean
}

export interface DataSourceConfig {
  type: "manual" | "csv" | "api"
  csvFile?: string
  csvMapping?: Record<string, string> // column → variable
  apiEndpoint?: string
}

export interface SecurityFeatures {
  hologram: boolean
  watermark: boolean
  microtext: boolean
  qrSecure: boolean
  uvInk: boolean
}

export interface PrintSettings {
  quantity: number
  paperSize: string
  orientation: 'portrait' | 'landscape'
  colorMode: 'cmyk' | 'rgb'
  resolution: number
  bleed: number
  cropMarks: boolean
  registrationMarks: boolean
}

// État du designer
interface CardDesignerState {
  // Projet actuel
  currentProject: CardProject | null
  projects: CardProject[]
  
  // Canvas
  canvasMode: 'recto' | 'verso'
  zoom: number
  selectedElements: string[]
  clipboard: DesignElement[]
  
  // UI
  activeTool: string
  activePanel: string
  showGrid: boolean
  showGuides: boolean
  showRulers: boolean
  
  // Historique
  history: CardProject[]
  historyIndex: number
  
  // Actions
  createProject: (template: string) => void
  loadProject: (id: string) => void
  saveProject: () => Promise<void>
  duplicateProject: (id: string) => void
  
  // Canvas
  setCanvasMode: (mode: 'recto' | 'verso') => void
  setZoom: (zoom: number) => void
  selectElements: (ids: string[]) => void
  
  // Éléments
  addElement: (element: Omit<DesignElement, 'id'>) => void
  updateElement: (id: string, updates: Partial<DesignElement>) => void
  deleteElement: (id: string) => void
  duplicateElement: (id: string) => void
  
  // Historique
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  
  // UI
  setActiveTool: (tool: string) => void
  setActivePanel: (panel: string) => void
  toggleGrid: () => void
  toggleGuides: () => void
  toggleRulers: () => void
  
  // Import/Export
  importData: (data: any[]) => void
  exportPDF: () => Promise<void>
  exportPNG: () => Promise<void>
  
  // Impression
  generateBatch: (settings: PrintSettings) => Promise<void>
  
  // Variable management
  addVariable: (variable: VariableDefinition) => void
  removeVariable: (variableId: string) => void
  updateVariable: (variableId: string, updates: Partial<VariableDefinition>) => void
  initializeProjectVariables: () => void
}

// Projet par défaut
const defaultProject: CardProject = {
  id: '',
  name: 'Nouveau Projet',
  description: '',
  template: 'blank',
  dimensions: {
    width: 85.6,
    height: 53.98,
    dpi: 300
  },
  recto: {
    elements: [],
    background: { type: 'color', color: '#FFFFFF' },
    bleed: 3,
    safeArea: 2
  },
  verso: {
    elements: [],
    background: { type: 'color', color: '#FFFFFF' },
    bleed: 3,
    safeArea: 2
  },
  security: {
    hologram: false,
    watermark: false,
    microtext: false,
    qrSecure: false,
    uvInk: false
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1
}

// Variables par défaut
export const DEFAULT_VARIABLES: VariableDefinition[] = [
  {
    id: "nom",
    name: "nom",
    type: "text",
    defaultValue: "John Doe",
    required: true,
  },
  {
    id: "prenom",
    name: "prenom",
    type: "text",
    defaultValue: "John",
    required: false,
  },
  {
    id: "email",
    name: "email",
    type: "text",
    defaultValue: "john@example.com",
    required: false,
  },
  {
    id: "entreprise",
    name: "entreprise",
    type: "text",
    defaultValue: "Acme Corp",
    required: false,
  },
  {
    id: "poste",
    name: "poste",
    type: "text",
    defaultValue: "Developer",
    required: false,
  },
  {
    id: "telephone",
    name: "telephone",
    type: "text",
    defaultValue: "+33 6 12 34 56 78",
    required: false,
  },
  {
    id: "qr",
    name: "qr",
    type: "qr",
    defaultValue: "https://example.com/profile/johndoe",
    required: false,
  },
]

// Store
export const useCardDesignerStore = create<CardDesignerState>()(
  persist(
    (set, get) => ({
      // État initial
      currentProject: null,
      projects: [],
      canvasMode: 'recto',
      zoom: 100,
      selectedElements: [],
      clipboard: [],
      activeTool: 'pointer',
      activePanel: 'elements',
      showGrid: true,
      showGuides: true,
      showRulers: true,
      history: [],
      historyIndex: -1,

      // Actions projet
      createProject: (template) => {
        const project: CardProject = {
          ...defaultProject,
          id: `project-${Date.now()}`,
          name: `Projet ${Date.now()}`,
          template,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        set((state) => ({
          currentProject: project,
          projects: [...state.projects, project],
          history: [project],
          historyIndex: 0
        }))
      },

      loadProject: (id) => {
        const project = get().projects.find(p => p.id === id)
        if (project) {
          set({
            currentProject: project,
            history: [project],
            historyIndex: 0
          })
        }
      },

      saveProject: async () => {
        const { currentProject } = get()
        if (!currentProject) return

        const updatedProject = {
          ...currentProject,
          updatedAt: new Date().toISOString(),
          version: currentProject.version + 1
        }

        set((state) => ({
          currentProject: updatedProject,
          projects: state.projects.map(p => 
            p.id === updatedProject.id ? updatedProject : p
          )
        }))

        // TODO: Sauvegarder en base de données
        console.log('Projet sauvegardé:', updatedProject)
      },

      duplicateProject: (id) => {
        const project = get().projects.find(p => p.id === id)
        if (project) {
          const duplicated: CardProject = {
            ...project,
            id: `project-${Date.now()}`,
            name: `${project.name} (Copie)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1
          }
          
          set((state) => ({
            projects: [...state.projects, duplicated]
          }))
        }
      },

      // Canvas
      setCanvasMode: (mode) => set({ canvasMode: mode }),
      setZoom: (zoom) => set({ zoom }),
      selectElements: (ids) => set({ selectedElements: ids }),

      // Éléments
      addElement: (elementData) => {
        const element: DesignElement = {
          ...elementData,
          id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }

        set((state) => {
          if (!state.currentProject) return state

          const currentDesign = state.canvasMode === 'recto' 
            ? state.currentProject.recto 
            : state.currentProject.verso

          const updatedDesign = {
            ...currentDesign,
            elements: [...currentDesign.elements, element]
          }

          const updatedProject = {
            ...state.currentProject,
            [state.canvasMode]: updatedDesign,
            updatedAt: new Date().toISOString()
          }

          return {
            currentProject: updatedProject,
            history: [...state.history.slice(0, state.historyIndex + 1), updatedProject],
            historyIndex: state.historyIndex + 1
          }
        })
      },

      updateElement: (id, updates) => {
        set((state) => {
          if (!state.currentProject) return state

          const currentDesign = state.canvasMode === 'recto' 
            ? state.currentProject.recto 
            : state.currentProject.verso

          const updatedElements = currentDesign.elements.map(el =>
            el.id === id ? { ...el, ...updates } : el
          )

          const updatedDesign = {
            ...currentDesign,
            elements: updatedElements
          }

          const updatedProject = {
            ...state.currentProject,
            [state.canvasMode]: updatedDesign,
            updatedAt: new Date().toISOString()
          }

          return {
            currentProject: updatedProject,
            history: [...state.history.slice(0, state.historyIndex + 1), updatedProject],
            historyIndex: state.historyIndex + 1
          }
        })
      },

      deleteElement: (id) => {
        set((state) => {
          if (!state.currentProject) return state

          const currentDesign = state.canvasMode === 'recto' 
            ? state.currentProject.recto 
            : state.currentProject.verso

          const updatedElements = currentDesign.elements.filter(el => el.id !== id)

          const updatedDesign = {
            ...currentDesign,
            elements: updatedElements
          }

          const updatedProject = {
            ...state.currentProject,
            [state.canvasMode]: updatedDesign,
            updatedAt: new Date().toISOString()
          }

          return {
            currentProject: updatedProject,
            history: [...state.history.slice(0, state.historyIndex + 1), updatedProject],
            historyIndex: state.historyIndex + 1
          }
        })
      },

      duplicateElement: (id) => {
        const { currentProject, canvasMode } = get()
        if (!currentProject) return

        const currentDesign = canvasMode === 'recto' 
          ? currentProject.recto 
          : currentProject.verso

        const element = currentDesign.elements.find(el => el.id === id)
        if (element) {
          const duplicated: DesignElement = {
            ...element,
            id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            position: {
              x: element.position.x + 10,
              y: element.position.y + 10
            }
          }

          get().addElement(duplicated)
        }
      },

      // Historique
      undo: () => {
        const { historyIndex } = get()
        if (historyIndex > 0) {
          set((state) => ({
            currentProject: state.history[state.historyIndex - 1],
            historyIndex: state.historyIndex - 1
          }))
        }
      },

      redo: () => {
        const { historyIndex, history } = get()
        if (historyIndex < history.length - 1) {
          set((state) => ({
            currentProject: state.history[state.historyIndex + 1],
            historyIndex: state.historyIndex + 1
          }))
        }
      },

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      // UI
      setActiveTool: (tool) => set({ activeTool: tool }),
      setActivePanel: (panel) => set({ activePanel: panel }),
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleGuides: () => set((state) => ({ showGuides: !state.showGuides })),
      toggleRulers: () => set((state) => ({ showRulers: !state.showRulers })),

      // Import/Export
      importData: (data) => {
        console.log('Import de données:', data)
        // TODO: Implémenter l'import de données
      },

      exportPDF: async () => {
        console.log('Export PDF')
        // TODO: Implémenter l'export PDF
      },

      exportPNG: async () => {
        console.log('Export PNG')
        // TODO: Implémenter l'export PNG
      },

      generateBatch: async (settings) => {
        console.log('Génération par lots:', settings)
        // TODO: Implémenter la génération par lots
      },

      // Variable management
      addVariable: (variable) => {
        set((state) => ({
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                variables: [...(state.currentProject.variables || []), variable],
                updatedAt: new Date().toISOString(),
              }
            : null,
        }))
      },

      removeVariable: (variableId) => {
        set((state) => ({
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                variables: state.currentProject.variables?.filter(
                  (v) => v.id !== variableId
                ) || [],
                updatedAt: new Date().toISOString(),
              }
            : null,
        }))
      },

      updateVariable: (variableId, updates) => {
        set((state) => ({
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                variables: state.currentProject.variables?.map((v) =>
                  v.id === variableId ? { ...v, ...updates } : v
                ) || [],
                updatedAt: new Date().toISOString(),
              }
            : null,
        }))
      },

      initializeProjectVariables: () => {
        set((state) => ({
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                variables: DEFAULT_VARIABLES,
                updatedAt: new Date().toISOString(),
              }
            : null,
        }))
      },
    }),
    {
      name: 'card-designer-storage',
      partialize: (state) => ({ 
        projects: state.projects,
        currentProject: state.currentProject 
      }),
    }
  )
)
