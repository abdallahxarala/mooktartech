/**
 * Product Import Script
 * 
 * Migrates product data from JSON files to Supabase PostgreSQL
 * 
 * Usage:
 *   npm run import:products
 *   or
 *   tsx scripts/import-products.ts
 * 
 * Environment variables required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { z } from 'zod'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Zod schema for JSON product validation
const jsonProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  brand: z.string(),
  category: z.string(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  price: z.number(),
  priceUnit: z.string().default('XOF'),
  stock: z.number().default(0),
  featured: z.boolean().default(false),
  new: z.boolean().default(false),
  images: z.array(z.string()).optional(),
  mainImage: z.string().optional(),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.unknown()).optional(),
  applications: z.array(z.string()).optional(),
  options: z.array(z.string()).optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    focusKeyword: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    canonicalUrl: z.string().optional()
  }).optional(),
  vendor: z.string().optional(),
  warranty: z.string().optional(),
  delivery: z.string().optional(),
  training: z.string().optional(),
  support: z.string().optional(),
  pdfSource: z.string().optional()
})

type JsonProduct = z.infer<typeof jsonProductSchema>

interface ImportStats {
  total: number
  imported: number
  updated: number
  skipped: number
  errors: number
  categoriesCreated: number
}

/**
 * Normalize slug (ensure it's URL-safe)
 */
function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Get or create category
 */
async function getOrCreateCategory(
  categoryName: string,
  categorySlug: string
): Promise<string | null> {
  // Normalize category slug
  const slug = normalizeSlug(categorySlug || categoryName)

  // Try to find existing category
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    return existing.id
  }

  // Create new category
  const { data: newCategory, error } = await supabase
    .from('categories')
    .insert({
      name: categoryName,
      slug: slug,
      is_active: true
    })
    .select('id')
    .single()

  if (error) {
    console.error(`Failed to create category ${categoryName}:`, error.message)
    return null
  }

  return newCategory.id
}

/**
 * Map JSON product to Supabase product format
 */
async function mapProductToSupabase(
  jsonProduct: JsonProduct,
  stats: ImportStats
): Promise<Record<string, unknown> | null> {
  // Get or create category
  const categoryId = await getOrCreateCategory(
    jsonProduct.category,
    jsonProduct.category
  )

  if (!categoryId) {
    stats.skipped++
    return null
  }

  // Normalize slug
  const slug = normalizeSlug(jsonProduct.slug || jsonProduct.id)

  // Map product data
  const productData: Record<string, unknown> = {
    external_id: jsonProduct.id, // For idempotency
    name: jsonProduct.name.trim(),
    slug: slug,
    short_description: jsonProduct.shortDescription?.trim() || null,
    description: jsonProduct.description?.trim() || null,
    price: jsonProduct.price,
    price_unit: jsonProduct.priceUnit || 'XOF',
    currency: 'XOF',
    brand: jsonProduct.brand.trim(),
    category_id: categoryId,
    stock: jsonProduct.stock || 0,
    is_featured: jsonProduct.featured || false,
    is_new: jsonProduct.new || false,
    is_active: true,
    track_stock: true,
    image_url: jsonProduct.mainImage || jsonProduct.images?.[0] || null,
    gallery: jsonProduct.images && jsonProduct.images.length > 0 
      ? jsonProduct.images 
      : null,
    features: jsonProduct.features || null,
    specifications: jsonProduct.specifications || null,
    applications: jsonProduct.applications || null,
    options: jsonProduct.options || null,
    vendor: jsonProduct.vendor || null,
    warranty: jsonProduct.warranty || null,
    delivery: jsonProduct.delivery || null,
    training: jsonProduct.training || null,
    support: jsonProduct.support || null,
    pdf_source: jsonProduct.pdfSource || null,
    meta_title: jsonProduct.seo?.metaTitle || null,
    meta_description: jsonProduct.seo?.metaDescription || null,
    meta_keywords: jsonProduct.seo?.keywords || null,
    focus_keyword: jsonProduct.seo?.focusKeyword || null,
    og_title: jsonProduct.seo?.ogTitle || null,
    og_description: jsonProduct.seo?.ogDescription || null,
    canonical_url: jsonProduct.seo?.canonicalUrl || null,
    tags: jsonProduct.applications || null // Use applications as tags
  }

  return productData
}

/**
 * Import products from JSON file
 */
async function importProductsFromFile(
  filePath: string,
  stats: ImportStats
): Promise<void> {
  console.log(`\n📂 Reading ${filePath}...`)

  try {
    const fileContent = readFileSync(filePath, 'utf-8')
    const jsonData = JSON.parse(fileContent)

    // Handle different JSON structures
    const products: JsonProduct[] = jsonData.products || jsonData || []

    console.log(`   Found ${products.length} products`)

    for (const jsonProduct of products) {
      try {
        // Validate product
        const validatedProduct = jsonProductSchema.parse(jsonProduct)

        // Map to Supabase format
        const productData = await mapProductToSupabase(validatedProduct, stats)

        if (!productData) {
          continue
        }

        // Upsert product (insert or update based on external_id)
        const { data, error } = await supabase
          .from('products')
          .upsert(productData, {
            onConflict: 'external_id',
            ignoreDuplicates: false
          })
          .select('id')
          .single()

        if (error) {
          console.error(`   ❌ Error importing ${validatedProduct.name}:`, error.message)
          stats.errors++
          continue
        }

        // Check if it was an update or insert
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('external_id', validatedProduct.id)
          .single()

        if (existing && data.id === existing.id) {
          stats.updated++
          console.log(`   ✅ Updated: ${validatedProduct.name}`)
        } else {
          stats.imported++
          console.log(`   ✅ Imported: ${validatedProduct.name}`)
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(`   ⚠️  Validation error for product:`, error.errors)
        } else {
          console.error(`   ❌ Error processing product:`, error)
        }
        stats.errors++
      }
    }
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error)
    stats.errors++
  }
}

/**
 * Main import function
 */
async function main() {
  console.log('🚀 Starting product import...\n')

  const stats: ImportStats = {
    total: 0,
    imported: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    categoriesCreated: 0
  }

  // List of JSON files to import
  const jsonFiles = [
    join(process.cwd(), 'data', 'products-seo-optimized.json'),
    join(process.cwd(), 'data', 'cartes-pvc-collection.json')
  ]

  // Import from each file
  for (const filePath of jsonFiles) {
    try {
      await importProductsFromFile(filePath, stats)
    } catch (error) {
      console.error(`Failed to import from ${filePath}:`, error)
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Import Summary')
  console.log('='.repeat(50))
  console.log(`Total processed: ${stats.total}`)
  console.log(`✅ Imported: ${stats.imported}`)
  console.log(`🔄 Updated: ${stats.updated}`)
  console.log(`⏭️  Skipped: ${stats.skipped}`)
  console.log(`❌ Errors: ${stats.errors}`)
  console.log('='.repeat(50))

  if (stats.errors > 0) {
    console.log('\n⚠️  Some products failed to import. Check errors above.')
    process.exit(1)
  } else {
    console.log('\n✅ Import completed successfully!')
    process.exit(0)
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

export { main as importProducts }

