import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/supabase/queries/products'
import { mapSupabaseProductToFrontend } from '@/lib/types/products'

/**
 * GET /api/products/[slug]
 * 
 * Get a single product by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await getProductBySlug(params.slug)

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found'
        },
        { status: 404 }
      )
    }

    const mappedProduct = mapSupabaseProductToFrontend(product)

    return NextResponse.json({
      success: true,
      data: mappedProduct
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product'
      },
      { status: 500 }
    )
  }
}

