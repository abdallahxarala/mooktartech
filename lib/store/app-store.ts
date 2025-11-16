import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Product {
  id: string
  name: string
  slug: string
  brand: string
  category: string
  shortDescription: string
  description: string
  price: number
  priceUnit: string
  stock: number
  featured: boolean
  new: boolean
  mainImage: string
  images: string[]
  features?: string[]
  specifications?: Record<string, string>
  applications?: string[]
  createdAt?: string
  updatedAt?: string
}

interface AppStore {
  products: Product[]
  addProduct: (product: Product) => Promise<void>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  resetProducts: () => Promise<void>
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      products: [
        {
          id: 'hiti-cs200e',
          name: 'HiTi CS200e',
          slug: 'hiti-cs200e',
          brand: 'HiTi',
          category: 'Imprimantes',
          price: 950000,
          priceUnit: 'FCFA',
          stock: 8,
          shortDescription: 'Imprimante recto-verso automatique ultra-rapide. 225 cartes/heure. Idéale pour gros volumes.',
          description: 'La HiTi CS200e est une imprimante professionnelle de cartes plastiques avec retournement automatique pour impression recto-verso. Vitesse exceptionnelle de 225 cartes/heure en couleur recto-verso.\n\nParfaite pour les établissements nécessitant une production importante : universités, grandes entreprises, administrations. Fiabilité éprouvée et coût par carte optimisé.',
          features: [
            'Impression recto-verso automatique',
            'Vitesse : 225 cartes/h (couleur R/V)',
            'Résolution 300 dpi',
            'Chargeur 100 cartes',
            'Sortie 100 cartes',
            'Compatible Windows & Mac',
            'Garantie 36 mois',
            'Formation incluse'
          ],
          specifications: {
            'Technologie': 'Sublimation thermique',
            'Vitesse couleur R/V': '225 cartes/h',
            'Vitesse mono R/V': '850 cartes/h',
            'Résolution': '300 dpi (11.8 dots/mm)',
            'Capacité chargeur': '100 cartes',
            'Capacité sortie': '100 cartes',
            'Interface': 'USB 2.0',
            'Dimensions': '372 x 254 x 232 mm',
            'Poids': '8.5 kg'
          },
          applications: [
            'Cartes étudiants universitaires',
            'Badges entreprises (>500 employés)',
            "Cartes d'accès gouvernementales",
            'Cartes de membre associations',
            'Badges événements (gros volumes)'
          ],
          mainImage: '',
          images: [],
          featured: true,
          new: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'sigma-ds1',
          name: 'Sigma DS1',
          slug: 'sigma-ds1',
          brand: 'Sigma',
          category: 'Imprimantes',
          price: 550000,
          priceUnit: 'FCFA',
          stock: 15,
          shortDescription: "L'imprimante la plus vendue au Sénégal ! Simple, fiable et abordable. Parfaite pour PME et associations.",
          description: "La Sigma DS1 est devenue l'imprimante de cartes la plus populaire au Sénégal grâce à son excellent rapport qualité-prix. Simple d'utilisation, fiable et abordable, elle répond aux besoins de 80% des entreprises sénégalaises.\n\nAvec plus de 200 clients satisfaits à Dakar, la DS1 s'est imposée comme LA référence pour les PME, associations et petites administrations. Impression recto simple, qualité professionnelle, et prix imbattable.",
          features: [
            '⭐ Imprimante #1 au Sénégal',
            'Impression recto simple',
            '300 cartes/heure',
            'Qualité 300 dpi',
            'Chargeur 100 cartes',
            'Plug & Play - facile',
            'Prix imbattable',
            'Stock permanent Dakar'
          ],
          specifications: {
            'Technologie': 'Sublimation thermique',
            'Vitesse': '300 cartes/h',
            'Résolution': '300 dpi',
            'Capacité chargeur': '100 cartes',
            'Interface': 'USB 2.0'
          },
          applications: [
            'PME et associations',
            'Écoles et centres de formation',
            'Clubs et organisations'
          ],
          mainImage: '',
          images: [],
          featured: true,
          new: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'evolis-primacy-2',
          name: 'Evolis Primacy 2',
          slug: 'evolis-primacy-2',
          brand: 'Evolis',
          category: 'Imprimantes',
          price: 890000,
          priceUnit: 'FCFA',
          stock: 12,
          shortDescription: 'Référence professionnelle Evolis. Rapide, fiable, idéale pour volumes moyens.',
          description: "Evolis Primacy 2 est une imprimante de badges hautes performances, reconnue pour sa fiabilité et sa rapidité. Adaptée aux entreprises et administrations exigeantes.",
          features: [
            'Impression rapide',
            'Qualité 300 dpi',
            'Chargeur 100 cartes',
            'Écosystème Evolis',
            'Garantie 24-36 mois'
          ],
          specifications: {
            'Technologie': 'Sublimation thermique',
            'Vitesse': '225 cartes/h',
            'Résolution': '300 dpi',
            'Capacité chargeur': '100 cartes'
          },
          applications: [
            'Entreprises et administrations',
            'Écoles et universités'
          ],
          mainImage: '',
          images: [],
          featured: true,
          new: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],

      addProduct: async (product) => {
        set((state) => ({
          products: [...state.products, product]
        }))
        
        // Notifier changement
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('products-changed'))
        }
      },

      updateProduct: async (id, updates) => {
        set((state) => ({
          products: state.products.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        }))
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('products-changed'))
        }
      },

      deleteProduct: async (id) => {
        set((state) => ({
          products: state.products.filter(p => p.id !== id)
        }))
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('products-changed'))
        }
      },

      resetProducts: async () => {
        if (confirm('⚠️ Supprimer TOUS les produits ?')) {
          set({ products: [] })
          
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('products-changed'))
          }
        }
      },
    }),
    {
      name: 'xarala-products',
    }
  )
)