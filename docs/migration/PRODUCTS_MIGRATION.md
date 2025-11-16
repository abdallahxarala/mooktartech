# Product Data Migration Guide

## Overview

This guide documents the migration of product data from local JSON files and Zustand stores to Supabase PostgreSQL.

## Migration Steps

### 1. Database Migration

Apply the products table enhancements migration:

```bash
npm run db:push
# Or manually apply: supabase/migrations/20250130010000_products_enhancements.sql
```

This migration adds:
- `external_id` for idempotent imports
- `price_unit`, `currency`, `is_new`
- SEO fields (`og_title`, `og_description`, `canonical_url`, `focus_keyword`)
- Additional metadata fields (`applications`, `options`, `vendor`, `warranty`, etc.)
- Indexes for performance (slug, brand, category, full-text search)

### 2. Import Products

Run the import script:

```bash
npm run import:supabase
```

**Prerequisites:**
- Set environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

**What it does:**
- Reads JSON files from `data/products-seo-optimized.json` and `data/cartes-pvc-collection.json`
- Validates product data with Zod
- Creates categories if they don't exist
- Upserts products (insert or update based on `external_id`)
- Provides detailed import statistics

### 3. Verify Import

Check products in Supabase:

```sql
-- Count products
SELECT COUNT(*) FROM products WHERE is_active = true;

-- Check categories
SELECT * FROM categories ORDER BY name;

-- Verify a product
SELECT id, name, slug, price, brand, category_id 
FROM products 
WHERE external_id = 'entrust-sigma-dse';
```

## Architecture Changes

### Before (JSON + Zustand)

```
JSON Files → Zustand Store → Components
```

- Products stored in JSON files
- Zustand store as source of truth
- Client-side filtering/search
- No persistence across sessions (except localStorage cache)

### After (Supabase + Cache)

```
Supabase → API Routes → Zustand Cache → Components
```

- Products stored in Supabase PostgreSQL
- API routes (`/api/products`, `/api/products/[slug]`)
- Zustand store as UI cache only (5-minute expiry)
- Server-side filtering/search with pagination
- Persistent database with proper indexing

## File Structure

### New Files

```
scripts/
  └── import-products.ts          # Import script

lib/
  ├── supabase/queries/
  │   └── products.ts             # Server-side product queries
  ├── types/
  │   └── products.ts              # Product types and mappers
  └── store/
      └── products-store.ts        # Refactored as cache layer

hooks/
  └── use-products.ts              # React hooks for fetching products

app/
  ├── api/products/
  │   ├── route.ts                 # GET /api/products (list)
  │   └── [slug]/route.ts          # GET /api/products/[slug] (detail)
  └── [locale]/products/
      ├── page.tsx                  # Refactored product list
      └── [slug]/page.tsx           # Refactored product detail
```

### Updated Files

- `app/[locale]/products/page.tsx` - Now uses `useProducts()` hook
- `app/[locale]/products/[slug]/page.tsx` - Now uses `useProduct()` hook
- `lib/store/products-store.ts` - Refactored as cache layer

## Data Mapping

### JSON → Supabase Mapping

| JSON Field | Supabase Column | Notes |
|------------|----------------|-------|
| `id` | `external_id` | For idempotency |
| `slug` | `slug` | Normalized |
| `name` | `name` | Trimmed |
| `shortDescription` | `short_description` | |
| `description` | `description` | |
| `price` | `price` | Decimal |
| `priceUnit` | `price_unit` | Default 'XOF' |
| `brand` | `brand` | |
| `category` | `category_id` | Resolved via categories table |
| `stock` | `stock` | Integer |
| `featured` | `is_featured` | Boolean |
| `new` | `is_new` | Boolean |
| `mainImage` | `image_url` | |
| `images` | `gallery` | JSONB array |
| `features` | `features` | JSONB array |
| `specifications` | `specifications` | JSONB object |
| `applications` | `applications` | JSONB array |
| `options` | `options` | JSONB array |
| `seo.metaTitle` | `meta_title` | |
| `seo.metaDescription` | `meta_description` | |
| `seo.keywords` | `meta_keywords` | JSONB array |
| `seo.ogTitle` | `og_title` | |
| `seo.ogDescription` | `og_description` | |
| `seo.canonicalUrl` | `canonical_url` | |
| `vendor` | `vendor` | |
| `warranty` | `warranty` | |
| `delivery` | `delivery` | |
| `training` | `training` | |
| `support` | `support` | |
| `pdfSource` | `pdf_source` | |

## Usage Examples

### Fetch Products (Client Component)

```typescript
import { useProducts } from '@/hooks/use-products'

function ProductsList() {
  const { products, isLoading, error, refetch } = useProducts({
    category: 'imprimantes',
    featured: true,
    limit: 20
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

### Fetch Single Product

```typescript
import { useProduct } from '@/hooks/use-products'

function ProductDetail({ slug }: { slug: string }) {
  const { product, isLoading, error } = useProduct(slug)

  if (isLoading) return <div>Loading...</div>
  if (error || !product) return <div>Not found</div>

  return <div>{product.name}</div>
}
```

### Server Component (Alternative)

```typescript
import { getProducts } from '@/lib/supabase/queries/products'

export default async function ProductsPage() {
  const { products } = await getProducts({
    page: 1,
    limit: 20,
    filters: {
      featured: true
    }
  })

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

## Performance Optimizations

### Indexes Created

- `products_slug_idx` - Fast slug lookups
- `products_brand_idx` - Brand filtering
- `products_category_id_idx` - Category filtering
- `products_search_idx` - Full-text search (French)
- `products_active_featured_idx` - Featured products query
- `products_price_idx` - Price range queries
- `products_stock_idx` - Stock queries

### Caching Strategy

- **Zustand Cache**: 5-minute expiry
- **API Routes**: Can add Next.js cache headers
- **Supabase**: Uses connection pooling

## Testing

### Manual Testing Checklist

- [ ] Import script runs successfully
- [ ] Products appear in Supabase
- [ ] Product list page loads
- [ ] Product detail page loads
- [ ] Search works
- [ ] Category filter works
- [ ] Brand filter works
- [ ] Featured products show badge
- [ ] New products show badge
- [ ] Stock status displays correctly
- [ ] Images load
- [ ] SEO metadata present

### Test Queries

```sql
-- Test full-text search
SELECT * FROM products 
WHERE to_tsvector('french', name || ' ' || description) 
  @@ to_tsquery('french', 'imprimante');

-- Test category filter
SELECT p.*, c.name as category_name 
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'imprimantes';

-- Test featured products
SELECT * FROM products 
WHERE is_featured = true 
ORDER BY created_at DESC 
LIMIT 8;
```

## Rollback Plan

If issues occur:

1. **Keep JSON files** - They remain as backup
2. **Revert pages** - Use git to revert page changes
3. **Disable API routes** - Comment out API route handlers
4. **Restore old store** - Use previous `products-store.ts`

## Next Steps

1. ✅ Database migration
2. ✅ Import script
3. ✅ API routes
4. ✅ Refactored pages
5. ⏳ Update admin pages to use Supabase
6. ⏳ Add product management UI
7. ⏳ Add product image upload to Supabase Storage
8. ⏳ Add product variants support
9. ⏳ Add product reviews/ratings

## Troubleshooting

### Import Fails

- Check environment variables
- Verify Supabase connection
- Check JSON file format
- Review error logs

### Products Not Showing

- Check `is_active = true`
- Verify category exists
- Check API route logs
- Clear Zustand cache

### Performance Issues

- Check indexes exist
- Review query plans
- Consider pagination
- Add API caching

## Support

For issues or questions:
1. Check migration logs
2. Review Supabase logs
3. Check browser console
4. Review API route responses

