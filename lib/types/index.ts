/**
 * Types TypeScript pour Xarala Solutions
 * Définitions des interfaces et types utilisés dans l'application
 */

// Types de base
export type Locale = 'fr' | 'en' | 'wo'
export type Currency = 'XOF' | 'EUR' | 'USD'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentMethod = 'card' | 'mobile' | 'bank' | 'cash'
export type UserRole = 'user' | 'admin' | 'moderator'

// Types pour l'authentification
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  company?: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
  avatar?: string
}

export interface AuthSession {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: string
}

// Types pour les produits
export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: Currency
  category: ProductCategory
  images: string[]
  specifications: Record<string, string>
  inStock: boolean
  stockQuantity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  tags: string[]
  rating?: number
  reviewCount?: number
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Types pour le panier
export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  addedAt: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  createdAt: string
  updatedAt: string
}

// Types pour les commandes
export interface Order {
  id: string
  orderNumber: string
  userId: string
  user: User
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  notes?: string
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  trackingNumber?: string
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  total: number
}

// Types pour les adresses
export interface Address {
  id: string
  userId: string
  firstName: string
  lastName: string
  company?: string
  street: string
  city: string
  region: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

// Types pour les cartes virtuelles
export interface VirtualCard {
  id: string
  userId: string
  template: CardTemplate
  data: CardData
  design: CardDesign
  isActive: boolean
  isPublic: boolean
  views: number
  shares: number
  createdAt: string
  updatedAt: string
}

export interface CardTemplate {
  id: string
  name: string
  description: string
  category: 'classic' | 'modern' | 'elegant' | 'corporate' | 'creative'
  preview: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CardData {
  name: string
  title: string
  company: string
  email: string
  phone: string
  website?: string
  address?: string
  socialMedia?: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
}

export interface CardDesign {
  backgroundColor: string
  textColor: string
  accentColor: string
  fontFamily: string
  fontSize: number
  logo?: string
  backgroundImage?: string
  layout: 'horizontal' | 'vertical'
}

// Types pour les codes QR
export interface QRCode {
  id: string
  userId: string
  type: 'text' | 'url' | 'email' | 'phone' | 'wifi' | 'vcard'
  data: string
  size: number
  color: string
  backgroundColor: string
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  isActive: boolean
  views: number
  createdAt: string
  updatedAt: string
}

// Types pour NFC
export interface NFCTag {
  id: string
  userId: string
  name: string
  type: 'text' | 'url' | 'email' | 'phone' | 'wifi' | 'vcard'
  data: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Types pour les analytics
export interface Analytics {
  id: string
  userId: string
  type: 'page_view' | 'product_view' | 'card_view' | 'qr_scan' | 'nfc_tap'
  entityId: string
  entityType: 'product' | 'card' | 'qr' | 'nfc' | 'page'
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  referrer?: string
  createdAt: string
}

// Types pour les notifications
export interface Notification {
  id: string
  userId: string
  type: 'order' | 'payment' | 'shipping' | 'general' | 'promotion'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
  readAt?: string
}

// Types pour les paramètres
export interface Settings {
  id: string
  userId: string
  theme: 'light' | 'dark' | 'system'
  language: Locale
  currency: Currency
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    showEmail: boolean
    showPhone: boolean
    showAddress: boolean
  }
  createdAt: string
  updatedAt: string
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
  filter?: Record<string, any>
}

// Types pour les formulaires
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'tel' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio'
  required: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

// Types pour les erreurs
export interface FormError {
  field: string
  message: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

// Types pour les événements
export interface AppEvent {
  type: string
  payload: any
  timestamp: string
  userId?: string
}

// Types pour les hooks
export interface UseApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export interface UseApiResult<T = any> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: any[]) => Promise<T>
  reset: () => void
}

// Types pour les composants
export interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends ComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'xarala' | 'senegal'
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

export interface InputProps extends ComponentProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'search'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
}

// Types pour les stores Zustand
export interface AppState {
  user: User | null
  cart: Cart | null
  settings: Settings | null
  theme: 'light' | 'dark' | 'system'
  language: Locale
  currency: Currency
}

export interface AppActions {
  setUser: (user: User | null) => void
  setCart: (cart: Cart | null) => void
  setSettings: (settings: Settings) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLanguage: (language: Locale) => void
  setCurrency: (currency: Currency) => void
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateCartItem: (productId: string, quantity: number) => void
  clearCart: () => void
  logout: () => void
}
