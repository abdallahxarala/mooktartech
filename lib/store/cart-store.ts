import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  brand?: string
  slug?: string
  shortDescription?: string
  stock?: number
  mainImage?: string
  options?: {
    nfcType?: string
    finish?: string
    customization?: string
  }
}

interface CartState {
  items: CartItem[]
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  
  // Getters
  getItemCount: () => number
  getTotal: () => number
  getSubtotal: () => number
  getTaxAmount: () => number
  getTotalWithTax: () => number
  getItem: (productId: string) => CartItem | undefined
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const id = crypto.randomUUID()
        
        console.log('🛒 Adding new item:', {
          id,
          productId: item.productId,
          name: item.name,
          quantity: item.quantity
        })
        
        set((state) => ({
          items: [...state.items, { ...item, id, quantity: item.quantity || 1 }],
        }))
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId)
        }))
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          )
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.price * item.quantity),
          0
        )
      },
      
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.price * item.quantity),
          0
        )
      },
      
      getTaxAmount: () => {
        const subtotal = get().getSubtotal()
        const TAX_RATE = 0.18 // 18% TVA au Sénégal
        return subtotal * TAX_RATE
      },
      
      getTotalWithTax: () => {
        const subtotal = get().getSubtotal()
        const tax = get().getTaxAmount()
        return subtotal + tax
      },
      
      getItem: (productId) => {
        return get().items.find((item) => item.productId === productId)
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)