import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/supabase/queries/products'
import type { ProductListOptions } from '@/lib/supabase/queries/products'
import { mapSupabaseProductToFrontend } from '@/lib/types/products'

/**
 * GET /api/products
 * 
 * Fetch products with filters, pagination, and search
 * 
 * Query parameters:
 *   - page: Page number (default: 1)
 *   - limit: Items per page (default: 20)
 *   - category: Category slug or ID
 *   - brand: Brand name
 *   - featured: true/false
 *   - isNew: true/false
 *   - minPrice: Minimum price
 *   - maxPrice: Maximum price
 *   - inStock: true/false
 *   - search: Search query
 *   - sortBy: name|price|created_at|featured
 *   - sortOrder: asc|desc
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const options: ProductListOptions = {
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '20', 10),
      sortBy: (searchParams.get('sortBy') as any) || 'created_at',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
      filters: {
        category: searchParams.get('category') || undefined,
        brand: searchParams.get('brand') || undefined,
        featured: searchParams.get('featured') === 'true' ? true : 
                  searchParams.get('featured') === 'false' ? false : undefined,
        isNew: searchParams.get('isNew') === 'true' ? true :
               searchParams.get('isNew') === 'false' ? false : undefined,
        minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
        maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
        inStock: searchParams.get('inStock') === 'true' ? true :
                 searchParams.get('inStock') === 'false' ? false : undefined,
        search: searchParams.get('search') || undefined
      }
    }

    const result = await getProducts(options)

    // Map to frontend format
    const products = result.products.map(mapSupabaseProductToFrontend)

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products'
      },
      { status: 500 }
    )
  }
}


