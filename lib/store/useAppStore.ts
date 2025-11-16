import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Types pour le store de l'application
 */
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  variant?: string
}

interface AppState {
  // Panier
  cartItems: CartItem[]
  cartItemsCount: number
  
  // Actions du panier
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateCartItemQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  
  // État de l'interface
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  
  // Thème
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

/**
 * Store principal de l'application Xarala Solutions
 * Gère le panier, l'état de l'interface et les préférences utilisateur
 */
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // État initial du panier
      cartItems: [],
      cartItemsCount: 0,
      
      // Actions du panier
      addToCart: (item) => {
        const { cartItems } = get()
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id)
        
        if (existingItem) {
          // Augmenter la quantité si l'article existe déjà
          set({
            cartItems: cartItems.map(cartItem =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
            cartItemsCount: cartItems.reduce((total, cartItem) => 
              total + (cartItem.id === item.id ? cartItem.quantity + 1 : cartItem.quantity), 0
            )
          })
        } else {
          // Ajouter un nouvel article
          const newItem = { ...item, quantity: 1 }
          set({
            cartItems: [...cartItems, newItem],
            cartItemsCount: cartItems.length + 1
          })
        }
      },
      
      removeFromCart: (id) => {
        const { cartItems } = get()
        const itemToRemove = cartItems.find(item => item.id === id)
        
        if (itemToRemove) {
          set({
            cartItems: cartItems.filter(item => item.id !== id),
            cartItemsCount: cartItems.reduce((total, item) => 
              total + (item.id === id ? 0 : item.quantity), 0
            )
          })
        }
      },
      
      updateCartItemQuantity: (id, quantity) => {
        const { cartItems } = get()
        
        if (quantity <= 0) {
          get().removeFromCart(id)
          return
        }
        
        set({
          cartItems: cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
          cartItemsCount: cartItems.reduce((total, item) => 
            total + (item.id === id ? quantity : item.quantity), 0
          )
        })
      },
      
      clearCart: () => {
        set({
          cartItems: [],
          cartItemsCount: 0
        })
      },
      
      // État de l'interface
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => {
        set({ isMobileMenuOpen: open })
      },
      
      // Thème
      theme: 'system',
      setTheme: (theme) => {
        set({ theme })
      }
    }),
    {
      name: 'xarala-app-store',
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartItemsCount: state.cartItemsCount,
        theme: state.theme
      })
    }
  )
)

/**
 * Sélecteurs personnalisés pour optimiser les re-renders
 */
export const useCartItems = () => useAppStore(state => state.cartItems)
export const useCartItemsCount = () => useAppStore(state => state.cartItemsCount)
export const useCartActions = () => useAppStore(state => ({
  addToCart: state.addToCart,
  removeFromCart: state.removeFromCart,
  updateCartItemQuantity: state.updateCartItemQuantity,
  clearCart: state.clearCart
}))

export const useMobileMenu = () => useAppStore(state => ({
  isMobileMenuOpen: state.isMobileMenuOpen,
  setMobileMenuOpen: state.setMobileMenuOpen
}))

export const useTheme = () => useAppStore(state => ({
  theme: state.theme,
  setTheme: state.setTheme
}))