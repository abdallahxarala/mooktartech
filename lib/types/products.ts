/**
 * Product types for frontend use
 * 
 * These types match the Supabase products table structure
 */

export interface Product {
  id: string
  external_id: string | null
  name: string
  slug: string
  short_description: string | null
  description: string | null
  price: number
  price_unit: string
  currency: string
  brand: string | null
  category_id: string | null
  stock: number
  is_featured: boolean
  is_new: boolean
  is_active: boolean
  track_stock: boolean
  image_url: string | null
  gallery: string[] | null
  features: string[] | null
  specifications: Record<string, unknown> | null
  applications: string[] | null
  options: string[] | null
  vendor: string | null
  warranty: string | null
  delivery: string | null
  training: string | null
  support: string | null
  pdf_source: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  focus_keyword: string | null
  og_title: string | null
  og_description: string | null
  canonical_url: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductWithCategory extends Product {
  category: Category | null
}

/**
 * Helper to convert Supabase product to frontend format
 */
export function mapSupabaseProductToFrontend(
  dbProduct: any
): ProductWithCategory {
  return {
    id: dbProduct.id,
    external_id: dbProduct.external_id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    short_description: dbProduct.short_description,
    description: dbProduct.description,
    price: parseFloat(dbProduct.price.toString()),
    price_unit: dbProduct.price_unit || 'XOF',
    currency: dbProduct.currency || 'XOF',
    brand: dbProduct.brand,
    category_id: dbProduct.category_id,
    stock: dbProduct.stock || 0,
    is_featured: dbProduct.is_featured || false,
    is_new: dbProduct.is_new || false,
    is_active: dbProduct.is_active ?? true,
    track_stock: dbProduct.track_stock ?? true,
    image_url: dbProduct.image_url,
    gallery: Array.isArray(dbProduct.gallery) ? dbProduct.gallery : null,
    features: Array.isArray(dbProduct.features) ? dbProduct.features : null,
    specifications: dbProduct.specifications || null,
    applications: Array.isArray(dbProduct.applications) ? dbProduct.applications : null,
    options: Array.isArray(dbProduct.options) ? dbProduct.options : null,
    vendor: dbProduct.vendor,
    warranty: dbProduct.warranty,
    delivery: dbProduct.delivery,
    training: dbProduct.training,
    support: dbProduct.support,
    pdf_source: dbProduct.pdf_source,
    meta_title: dbProduct.meta_title,
    meta_description: dbProduct.meta_description,
    meta_keywords: Array.isArray(dbProduct.meta_keywords) ? dbProduct.meta_keywords : null,
    focus_keyword: dbProduct.focus_keyword,
    og_title: dbProduct.og_title,
    og_description: dbProduct.og_description,
    canonical_url: dbProduct.canonical_url,
    tags: Array.isArray(dbProduct.tags) ? dbProduct.tags : null,
    created_at: dbProduct.created_at,
    updated_at: dbProduct.updated_at,
    category: dbProduct.category || null
  }
}

