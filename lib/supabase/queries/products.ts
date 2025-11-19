/**
 * Product queries for Supabase
 * 
 * Server-side functions for fetching products from Supabase
 */

import { createSupabaseServerClient } from '../server'
import type { Database } from '../database.types'

type ProductRow = Database['public']['Tables']['products']['Row']
type CategoryRow = Database['public']['Tables']['categories']['Row']

export interface ProductWithCategory extends ProductRow {
  category: CategoryRow | null
}

export interface ProductFilters {
  category?: string
  brand?: string
  featured?: boolean
  isNew?: boolean
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  search?: string
}

export interface ProductListOptions {
  page?: number
  limit?: number
  sortBy?: 'name' | 'price' | 'created_at' | 'featured'
  sortOrder?: 'asc' | 'desc'
  filters?: ProductFilters
}

export interface ProductListResult {
  products: ProductWithCategory[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return null
  }

  return data as ProductWithCategory
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<ProductWithCategory | null> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return null
  }

  return data as ProductWithCategory
}

/**
 * Get products list with filters and pagination
 */
export async function getProducts(
  options: ProductListOptions = {}
): Promise<ProductListResult> {
  const supabase = await createSupabaseServerClient()

  const {
    page = 1,
    limit = 20,
    sortBy = 'created_at',
    sortOrder = 'desc',
    filters = {}
  } = options

  const offset = (page - 1) * limit

  // Build query
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `, { count: 'exact' })
    .eq('is_active', true)

  // Apply filters
  if (filters.category) {
    query = query.eq('category_id', filters.category)
  }

  if (filters.brand) {
    query = query.eq('brand', filters.brand)
  }

  if (filters.featured !== undefined) {
    query = query.eq('is_featured', filters.featured)
  }

  if (filters.isNew !== undefined) {
    query = query.eq('is_new', filters.isNew)
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice)
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice)
  }

  if (filters.inStock !== undefined) {
    if (filters.inStock) {
      query = query.gt('stock', 0)
    } else {
      query = query.eq('stock', 0)
    }
  }

  // Search (full-text search)
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`
    )
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return {
      products: [],
      total: 0,
      page,
      limit,
      totalPages: 0
    }
  }

  return {
    products: (data || []) as ProductWithCategory[],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 8): Promise<ProductWithCategory[]> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) {
    return []
  }

  return data as ProductWithCategory[]
}

/**
 * Get new products
 */
export async function getNewProducts(limit = 8): Promise<ProductWithCategory[]> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_active', true)
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) {
    return []
  }

  return data as ProductWithCategory[]
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
  categorySlug: string,
  limit = 20
): Promise<ProductWithCategory[]> {
  const supabase = await createSupabaseServerClient()

  // First get category
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!category) {
    return []
  }

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) {
    return []
  }

  return data as ProductWithCategory[]
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<CategoryRow[]> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error || !data) {
    return []
  }

  return data
}

/**
 * Get all brands
 */
export async function getAllBrands(): Promise<string[]> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('products')
    .select('brand')
    .eq('is_active', true)
    .not('brand', 'is', null)

  if (error || !data) {
    return []
  }

  // Get unique brands
  const brands = [...new Set(data.map((p) => p.brand).filter(Boolean))]
  return brands.sort()
}

