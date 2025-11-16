/**
 * Types pour les produits exposants
 */

import type { Database } from './database.types'

export type ExhibitorProduct = Database['public']['Tables']['exhibitor_products']['Row']
export type ExhibitorProductInsert = Database['public']['Tables']['exhibitor_products']['Insert']
export type ExhibitorProductUpdate = Database['public']['Tables']['exhibitor_products']['Update']

export interface ProductFormData {
  name: string
  description: string
  price: number | null
  currency: 'XOF' | 'EUR' | 'USD'
  price_on_request: boolean
  category: string
  tags: string[]
  stock_quantity: number | null
  unlimited_stock: boolean
  is_available: boolean
  is_featured: boolean
  images: string[]
  featured_image: string | null
}

export interface ProductStats {
  total_products: number
  visible_products: number
  total_views: number
  total_orders: number
  total_revenue: number
}

export interface Order {
  id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
  total: number
  customer_name: string
  customer_email: string
  customer_phone: string
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export type OrderStatus = Order['status']

export interface CreateProductParams extends Omit<ProductFormData, 'images' | 'featured_image'> {
  exhibitor_id: string
  images?: string[]
  featured_image?: string | null
}

export interface UpdateProductParams {
  product_id: string
  updates: Partial<ProductFormData>
}

export interface GenerateDescriptionParams {
  productName: string
  images: string[]
  category?: string
}

