/**
 * Service pour la gestion des produits exposants
 */

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type {
  ExhibitorProduct,
  ExhibitorProductInsert,
  ExhibitorProductUpdate,
  ProductStats,
  Order,
} from '@/lib/types/exhibitor-product'

export interface CreateProductParams {
  exhibitor_id: string
  name: string
  description?: string
  price?: number
  currency?: 'XOF' | 'EUR' | 'USD'
  price_on_request?: boolean
  category?: string
  tags?: string[]
  stock_quantity?: number
  unlimited_stock?: boolean
  is_available?: boolean
  is_featured?: boolean
  images?: string[]
  featured_image?: string
}

export interface CreateProductResult {
  product: ExhibitorProduct | null
  error: string | null
}

export interface UpdateProductParams {
  product_id: string
  updates: Partial<ExhibitorProductUpdate>
}

export interface UpdateProductResult {
  product: ExhibitorProduct | null
  error: string | null
}

/**
 * Créer un produit
 */
export async function createProduct(
  params: CreateProductParams
): Promise<CreateProductResult> {
  try {
    const supabase = createSupabaseServerClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return { product: null, error: 'Non authentifié' }
    }

    const insertData: ExhibitorProductInsert = {
      exhibitor_id: params.exhibitor_id,
      name: params.name,
      description: params.description || null,
      price: params.price || null,
      currency: params.currency || 'XOF',
      price_on_request: params.price_on_request || false,
      category: params.category || null,
      tags: params.tags || [],
      stock_quantity: params.stock_quantity || null,
      unlimited_stock: params.unlimited_stock ?? true,
      is_available: params.is_available ?? true,
      is_featured: params.is_featured || false,
      images: params.images || [],
      featured_image: params.featured_image || null,
    }

    const { data: product, error } = await supabase
      .from('exhibitor_products')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return { product: null, error: error.message }
    }

    return { product: product || null, error: null }
  } catch (error) {
    console.error('Error in createProduct:', error)
    return {
      product: null,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Mettre à jour un produit
 */
export async function updateProduct(
  params: UpdateProductParams
): Promise<UpdateProductResult> {
  try {
    const supabase = createSupabaseServerClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return { product: null, error: 'Non authentifié' }
    }

    const { data: product, error } = await supabase
      .from('exhibitor_products')
      .update({
        ...params.updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.product_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      return { product: null, error: error.message }
    }

    return { product: product || null, error: null }
  } catch (error) {
    console.error('Error in updateProduct:', error)
    return {
      product: null,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Supprimer un produit
 */
export async function deleteProduct(productId: string): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const supabase = createSupabaseServerClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: 'Non authentifié' }
    }

    const { error } = await supabase
      .from('exhibitor_products')
      .delete()
      .eq('id', productId)

    if (error) {
      console.error('Error deleting product:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Error in deleteProduct:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Récupérer les produits d'un exposant
 */
export async function getProductsByExhibitor(exhibitorId: string): Promise<{
  products: ExhibitorProduct[]
  error: string | null
}> {
  try {
    const supabase = createSupabaseServerClient()

    const { data: products, error } = await supabase
      .from('exhibitor_products')
      .select('*')
      .eq('exhibitor_id', exhibitorId)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      return { products: [], error: error.message }
    }

    return { products: products || [], error: null }
  } catch (error) {
    return {
      products: [],
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Récupérer les stats d'un exposant
 */
export async function getExhibitorStats(exhibitorId: string): Promise<{
  stats: ProductStats | null
  error: string | null
}> {
  try {
    const supabase = createSupabaseServerClient()

    // Récupérer les produits
    const { data: products, error: productsError } = await supabase
      .from('exhibitor_products')
      .select('id, is_available')
      .eq('exhibitor_id', exhibitorId)

    if (productsError) {
      return { stats: null, error: productsError.message }
    }

    // TODO: Récupérer les vraies stats depuis les tables d'interactions/commandes
    // Pour l'instant, on retourne des stats basiques
    const stats: ProductStats = {
      total_products: products?.length || 0,
      visible_products: products?.filter((p) => p.is_available).length || 0,
      total_views: 0, // À implémenter avec exhibitor_interactions
      total_orders: 0, // À implémenter avec exhibitor_orders
      total_revenue: 0, // À implémenter avec exhibitor_orders
    }

    return { stats, error: null }
  } catch (error) {
    return {
      stats: null,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Récupérer les commandes d'un exposant
 */
export async function getOrdersByExhibitor(exhibitorId: string): Promise<{
  orders: Order[]
  error: string | null
}> {
  try {
    const supabase = createSupabaseServerClient()

    // TODO: Implémenter avec la vraie table exhibitor_orders
    // Pour l'instant, on retourne un tableau vide
    const orders: Order[] = []

    return { orders, error: null }
  } catch (error) {
    return {
      orders: [],
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

