'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
  label: string
}

export interface ActionButton {
  id: string
  label: string
  url: string
  type: 'link' | 'phone' | 'email' | 'whatsapp' | 'download'
  icon: string
  color: string
}

export interface CardData {
  id: string
  
  // Images
  profilePhoto: string | null
  coverPhoto: string | null
  logo: string | null
  
  // Informations de base
  firstName: string
  lastName: string
  title: string
  company: string
  location: string
  bio: string
  
  // Contact
  email: string
  phone: string
  website: string
  
  // Design
  theme: 'minimal' | 'gradient' | 'glassmorphism' | 'bento'
  accentColor: string
  backgroundColor: string
  textColor: string
  
  // Liens sociaux
  socialLinks: SocialLink[]
  
  // Boutons d'action
  actionButtons: ActionButton[]
  
  // Paramètres
  showStats: boolean
  customDomain: string
  isPublic: boolean
  
  // Metadata
  slug: string
  views: number
  clicks: number
  createdAt: string
  updatedAt: string
}

interface CardEditorState {
  card: CardData
  activeTab: 'profile' | 'design' | 'links' | 'social' | 'settings'
  previewDevice: 'mobile' | 'tablet' | 'desktop'
  isSaving: boolean
  
  // Actions
  setActiveTab: (tab: string) => void
  setPreviewDevice: (device: string) => void
  updateCard: (updates: Partial<CardData>) => void
  setProfilePhoto: (url: string | null) => void
  setCoverPhoto: (url: string | null) => void
  setLogo: (url: string | null) => void
  setTheme: (theme: CardData['theme']) => void
  addSocialLink: (link: Omit<SocialLink, 'id'>) => void
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => void
  removeSocialLink: (id: string) => void
  addActionButton: (button: Omit<ActionButton, 'id'>) => void
  updateActionButton: (id: string, updates: Partial<ActionButton>) => void
  removeActionButton: (id: string) => void
  save: () => Promise<void>
  publish: () => Promise<void>
}

const defaultCard: CardData = {
  id: crypto.randomUUID ? crypto.randomUUID() : `card-${Date.now()}`,
  
  // Images
  profilePhoto: null,
  coverPhoto: null,
  logo: null,
  
  // Infos
  firstName: '',
  lastName: '',
  title: '',
  company: '',
  location: 'Dakar, Sénégal',
  bio: '',
  email: '',
  phone: '',
  website: '',
  
  // Design
  theme: 'minimal',
  accentColor: '#F97316',
  backgroundColor: '#FFFFFF',
  textColor: '#111827',
  
  // Liens - INITIALISER À TABLEAU VIDE
  socialLinks: [],
  actionButtons: [],
  
  // Paramètres
  showStats: true,
  customDomain: '',
  isPublic: true,
  slug: '',
  views: 0,
  clicks: 0,
  
  // Dates
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const useCardEditorStore = create<CardEditorState>()(
  persist(
    (set, get) => ({
      card: defaultCard,
      activeTab: 'profile',
      previewDevice: 'mobile',
      isSaving: false,

      setActiveTab: (tab) => set({ activeTab: tab as any }),
      setPreviewDevice: (device) => set({ previewDevice: device as any }),
      
      updateCard: (updates) =>
        set((state) => ({
          card: {
            ...state.card,
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        })),

      setProfilePhoto: (url) =>
        set((state) => ({
          card: { ...state.card, profilePhoto: url },
        })),

      setCoverPhoto: (url) =>
        set((state) => ({
          card: { ...state.card, coverPhoto: url },
        })),

      setLogo: (url) =>
        set((state) => ({
          card: { ...state.card, logo: url },
        })),

      setTheme: (theme) =>
        set((state) => ({
          card: { ...state.card, theme },
        })),

      addSocialLink: (link) =>
        set((state) => ({
          card: {
            ...state.card,
            socialLinks: [
              ...state.card.socialLinks,
              { ...link, id: crypto.randomUUID() },
            ],
          },
        })),

      updateSocialLink: (id, updates) =>
        set((state) => ({
          card: {
            ...state.card,
            socialLinks: state.card.socialLinks.map((link) =>
              link.id === id ? { ...link, ...updates } : link
            ),
          },
        })),

      removeSocialLink: (id) =>
        set((state) => ({
          card: {
            ...state.card,
            socialLinks: state.card.socialLinks.filter((link) => link.id !== id),
          },
        })),

      addActionButton: (button) =>
        set((state) => ({
          card: {
            ...state.card,
            actionButtons: [
              ...state.card.actionButtons,
              { ...button, id: crypto.randomUUID() },
            ],
          },
        })),

      updateActionButton: (id, updates) =>
        set((state) => ({
          card: {
            ...state.card,
            actionButtons: state.card.actionButtons.map((btn) =>
              btn.id === id ? { ...btn, ...updates } : btn
            ),
          },
        })),

      removeActionButton: (id) =>
        set((state) => ({
          card: {
            ...state.card,
            actionButtons: state.card.actionButtons.filter((btn) => btn.id !== id),
          },
        })),

      save: async () => {
        set({ isSaving: true })
        await new Promise((resolve) => setTimeout(resolve, 500))
        set({ isSaving: false })
      },

      publish: async () => {
        await get().save()
        // TODO: Publier sur serveur
      },
    }),
    {
      name: 'card-editor-storage',
    }
  )
)