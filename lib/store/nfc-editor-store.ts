import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProfileTheme = 'sunset' | 'ocean' | 'forest' | 'midnight' | 'royal' | 'dawn' | 'custom'
export type CardMode = 'personal' | 'business'
export type CardTemplate = 'classic' | 'minimalist' | 'corporate' | 'creative'

export interface SocialLink {
  id: string
  platform: string // 'linkedin', 'twitter', 'instagram', etc.
  url: string
  icon: string
  order: number
}

export interface CustomField {
  id: string
  label: string
  value: string
  icon?: string
  type: 'text' | 'url' | 'email' | 'phone'
  order: number
}

export interface NFCProfile {
  id: string
  
  // Basic Info
  mode: CardMode
  firstName: string
  lastName: string
  title: string
  company: string
  tagline?: string
  bio?: string
  
  // Contact
  email: string
  phone: string
  website: string
  location: string
  
  // Social
  socialLinks: SocialLink[]
  
  // Custom Fields
  customFields: CustomField[]
  
  // Design
  theme: ProfileTheme
  template?: CardTemplate // Layout template: classic, minimalist, corporate, creative
  primaryColor: string
  secondaryColor: string
  logo?: string // URL ou base64
  avatar?: string
  backgroundImage?: string
  
  // Features
  enableLeadCapture: boolean
  enableAnalytics: boolean
  enableQRCode: boolean
  enableNFC: boolean
  
  // Settings
  slug: string // URL unique: app.domain.com/u/slug
  isPublished: boolean
  isPremium: boolean
  
  // Meta
  createdAt: string
  updatedAt: string
  views: number
  saves: number
  shares: number
}

export interface Lead {
  id: string
  profileId: string
  name: string
  email: string
  phone?: string
  company?: string
  notes?: string
  source: 'nfc' | 'qr' | 'link'
  location?: string
  capturedAt: string
}

export interface Analytics {
  profileId: string
  totalViews: number
  totalSaves: number
  totalShares: number
  viewsByDay: Record<string, number>
  viewsBySource: Record<'nfc' | 'qr' | 'link', number>
  topLocations: Array<{ city: string; count: number }>
  conversionRate: number
}

interface NFCEditorState {
  // Current profile being edited
  currentProfile: NFCProfile | null
  
  // Wizard state
  wizardStep: number
  wizardProgress: number // 0-100
  wizardCompleted: boolean
  
  // User's profiles
  profiles: NFCProfile[]
  
  // Leads
  leads: Lead[]
  
  // Analytics
  analytics: Record<string, Analytics>
  
  // Actions - Profile
  createProfile: (mode: CardMode) => void
  updateProfile: (updates: Partial<NFCProfile>) => void
  publishProfile: () => void
  deleteProfile: (id: string) => void
  duplicateProfile: (id: string) => void
  setCurrentProfile: (id: string) => void
  
  // Actions - Wizard
  setWizardStep: (step: number) => void
  nextWizardStep: () => void
  prevWizardStep: () => void
  resetWizard: () => void
  updateWizardProgress: () => void
  
  // Actions - Social
  addSocialLink: (link: Omit<SocialLink, 'id' | 'order'>) => void
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => void
  deleteSocialLink: (id: string) => void
  
  // Actions - Custom Fields
  addCustomField: (field: Omit<CustomField, 'id' | 'order'>) => void
  updateCustomField: (id: string, updates: Partial<CustomField>) => void
  deleteCustomField: (id: string) => void
  
  // Actions - Leads
  addLead: (lead: Omit<Lead, 'id' | 'capturedAt'>) => void
  getLeadsByProfile: (profileId: string) => Lead[]
  
  // Actions - Analytics
  trackView: (profileId: string, source: 'nfc' | 'qr' | 'link') => void
  trackSave: (profileId: string) => void
  trackShare: (profileId: string) => void
  getAnalytics: (profileId: string) => Analytics | null
}

const createEmptyProfile = (mode: CardMode): NFCProfile => ({
  id: Date.now().toString(),
  mode,
  firstName: '',
  lastName: '',
  title: '',
  company: '',
  tagline: '',
  bio: '',
  email: '',
  phone: '',
  website: '',
  location: '',
  socialLinks: [],
  customFields: [],
  theme: 'sunset',
  template: 'classic' as CardTemplate,
  primaryColor: '#f97316',
  secondaryColor: '#ec4899',
  enableLeadCapture: false,
  enableAnalytics: true,
  enableQRCode: true,
  enableNFC: true,
  slug: `user-${Date.now()}`,
  isPublished: false,
  isPremium: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  views: 0,
  saves: 0,
  shares: 0
})

export const useNFCEditorStore = create<NFCEditorState>()(
  persist(
    (set, get) => ({
      currentProfile: null,
      wizardStep: 1,
      wizardProgress: 0,
      wizardCompleted: false,
      profiles: [],
      leads: [],
      analytics: {},
      
      createProfile: (mode: CardMode) => {
        const newProfile = createEmptyProfile(mode)
        set({
          currentProfile: newProfile,
          profiles: [...get().profiles, newProfile],
          wizardStep: 1,
          wizardProgress: 0,
          wizardCompleted: false
        })
      },
      
      updateProfile: (updates: Partial<NFCProfile>) => {
        const current = get().currentProfile
        if (!current) return
        
        const updatedProfile = {
          ...current,
          ...updates,
          updatedAt: new Date().toISOString()
        }
        
        set({
          currentProfile: updatedProfile,
          profiles: get().profiles.map(p =>
            p.id === current.id ? updatedProfile : p
          )
        })
        
        // Auto-save progress
        get().updateWizardProgress()
      },
      
      publishProfile: () => {
        get().updateProfile({ isPublished: true })
      },
      
      deleteProfile: (id: string) => {
        set({
          profiles: get().profiles.filter(p => p.id !== id),
          currentProfile: get().currentProfile?.id === id ? null : get().currentProfile
        })
      },
      
      duplicateProfile: (id: string) => {
        const profile = get().profiles.find(p => p.id === id)
        if (!profile) return
        
        const duplicate: NFCProfile = {
          ...profile,
          id: Date.now().toString(),
          slug: `${profile.slug}-copy-${Date.now()}`,
          isPublished: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 0,
          saves: 0,
          shares: 0
        }
        
        set({
          profiles: [...get().profiles, duplicate]
        })
      },
      
      setCurrentProfile: (id: string) => {
        const profile = get().profiles.find(p => p.id === id)
        if (profile) {
          set({ currentProfile: profile })
        }
      },
      
      setWizardStep: (step: number) => {
        set({ wizardStep: step })
        get().updateWizardProgress()
      },
      
      nextWizardStep: () => {
        const current = get().wizardStep
        if (current < 6) {
          set({ wizardStep: current + 1 })
          get().updateWizardProgress()
        }
      },
      
      prevWizardStep: () => {
        const current = get().wizardStep
        if (current > 1) {
          set({ wizardStep: current - 1 })
        }
      },
      
      resetWizard: () => {
        set({
          wizardStep: 1,
          wizardProgress: 0,
          wizardCompleted: false
        })
      },
      
      updateWizardProgress: () => {
        const profile = get().currentProfile
        if (!profile) return
        
        let progress = 0
        const step = get().wizardStep
        
        // Base progress from step
        progress = ((step - 1) / 5) * 100
        
        // Bonus for completed fields
        if (profile.firstName && profile.lastName) progress += 5
        if (profile.email) progress += 5
        if (profile.title) progress += 5
        if (profile.socialLinks.length > 0) progress += 5
        
        progress = Math.min(progress, 100)
        
        set({
          wizardProgress: progress,
          wizardCompleted: progress >= 90 && step === 6
        })
      },
      
      addSocialLink: (link: Omit<SocialLink, 'id' | 'order'>) => {
        const current = get().currentProfile
        if (!current) return
        
        const newLink: SocialLink = {
          ...link,
          id: Date.now().toString(),
          order: current.socialLinks.length
        }
        
        get().updateProfile({
          socialLinks: [...current.socialLinks, newLink]
        })
      },
      
      updateSocialLink: (id: string, updates: Partial<SocialLink>) => {
        const current = get().currentProfile
        if (!current) return
        
        get().updateProfile({
          socialLinks: current.socialLinks.map(link =>
            link.id === id ? { ...link, ...updates } : link
          )
        })
      },
      
      deleteSocialLink: (id: string) => {
        const current = get().currentProfile
        if (!current) return
        
        get().updateProfile({
          socialLinks: current.socialLinks.filter(link => link.id !== id)
        })
      },
      
      addCustomField: (field: Omit<CustomField, 'id' | 'order'>) => {
        const current = get().currentProfile
        if (!current) return
        
        const newField: CustomField = {
          ...field,
          id: Date.now().toString(),
          order: current.customFields.length
        }
        
        get().updateProfile({
          customFields: [...current.customFields, newField]
        })
      },
      
      updateCustomField: (id: string, updates: Partial<CustomField>) => {
        const current = get().currentProfile
        if (!current) return
        
        get().updateProfile({
          customFields: current.customFields.map(field =>
            field.id === id ? { ...field, ...updates } : field
          )
        })
      },
      
      deleteCustomField: (id: string) => {
        const current = get().currentProfile
        if (!current) return
        
        get().updateProfile({
          customFields: current.customFields.filter(field => field.id !== id)
        })
      },
      
      addLead: (lead: Omit<Lead, 'id' | 'capturedAt'>) => {
        const newLead: Lead = {
          ...lead,
          id: Date.now().toString(),
          capturedAt: new Date().toISOString()
        }
        
        set({
          leads: [...get().leads, newLead]
        })
      },
      
      getLeadsByProfile: (profileId: string) => {
        return get().leads.filter(lead => lead.profileId === profileId)
      },
      
      trackView: (profileId: string, source: 'nfc' | 'qr' | 'link') => {
        const analytics = get().analytics[profileId] || {
          profileId,
          totalViews: 0,
          totalSaves: 0,
          totalShares: 0,
          viewsByDay: {},
          viewsBySource: { nfc: 0, qr: 0, link: 0 },
          topLocations: [],
          conversionRate: 0
        }
        
        const today = new Date().toISOString().split('T')[0]
        
        set({
          analytics: {
            ...get().analytics,
            [profileId]: {
              ...analytics,
              totalViews: analytics.totalViews + 1,
              viewsByDay: {
                ...analytics.viewsByDay,
                [today]: (analytics.viewsByDay[today] || 0) + 1
              },
              viewsBySource: {
                ...analytics.viewsBySource,
                [source]: analytics.viewsBySource[source] + 1
              }
            }
          }
        })
        
        // Update profile views
        const profile = get().profiles.find(p => p.id === profileId)
        if (profile) {
          get().updateProfile({ views: profile.views + 1 })
        }
      },
      
      trackSave: (profileId: string) => {
        const analytics = get().analytics[profileId]
        if (analytics) {
          set({
            analytics: {
              ...get().analytics,
              [profileId]: {
                ...analytics,
                totalSaves: analytics.totalSaves + 1
              }
            }
          })
        }
        
        const profile = get().profiles.find(p => p.id === profileId)
        if (profile) {
          get().updateProfile({ saves: profile.saves + 1 })
        }
      },
      
      trackShare: (profileId: string) => {
        const analytics = get().analytics[profileId]
        if (analytics) {
          set({
            analytics: {
              ...get().analytics,
              [profileId]: {
                ...analytics,
                totalShares: analytics.totalShares + 1
              }
            }
          })
        }
        
        const profile = get().profiles.find(p => p.id === profileId)
        if (profile) {
          get().updateProfile({ shares: profile.shares + 1 })
        }
      },
      
      getAnalytics: (profileId: string) => {
        return get().analytics[profileId] || null
      }
    }),
    {
      name: 'nfc-editor-storage',
      partialize: (state) => ({
        profiles: state.profiles,
        leads: state.leads,
        analytics: state.analytics
      })
    }
  )
)

