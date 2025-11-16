-- =============================================================================
-- Migration: Products table enhancements for JSON import
-- Description: Adds missing columns to support full product data from JSON
-- =============================================================================

-- Add missing columns if they don't exist
alter table public.products
  add column if not exists external_id text unique,
  add column if not exists price_unit text default 'XOF',
  add column if not exists is_new boolean default false,
  add column if not exists applications jsonb,
  add column if not exists options jsonb,
  add column if not exists vendor text,
  add column if not exists warranty text,
  add column if not exists delivery text,
  add column if not exists training text,
  add column if not exists support text,
  add column if not exists pdf_source text,
  add column if not exists og_title text,
  add column if not exists og_description text,
  add column if not exists canonical_url text,
  add column if not exists focus_keyword text,
  add column if not exists currency text default 'XOF';

-- Add index for external_id (for upsert operations)
create index if not exists products_external_id_idx on public.products(external_id);

-- Add index for slug (for lookups)
create index if not exists products_slug_idx on public.products(slug);

-- Add index for brand (for filtering)
create index if not exists products_brand_idx on public.products(brand);

-- Add index for category_id (for filtering)
create index if not exists products_category_id_idx on public.products(category_id);

-- Add full-text search index (PostgreSQL)
create index if not exists products_search_idx on public.products 
  using gin(to_tsvector('french', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(short_description, '')));

-- Add composite index for common queries
create index if not exists products_active_featured_idx on public.products(is_active, is_featured) 
  where is_active = true;

-- Add index for price range queries
create index if not exists products_price_idx on public.products(price) 
  where is_active = true;

-- Add index for stock queries
create index if not exists products_stock_idx on public.products(stock) 
  where track_stock = true;

-- Update existing products to set currency if null
update public.products 
set currency = 'XOF' 
where currency is null;

comment on column public.products.external_id is 'External ID from JSON import (for idempotency)';
comment on column public.products.price_unit is 'Price unit (XOF, FCFA, unit, etc.)';
comment on column public.products.is_new is 'Mark product as new';
comment on column public.products.applications is 'Array of application use cases';
comment on column public.products.options is 'Array of available options/accessories';
comment on column public.products.vendor is 'Product vendor/manufacturer';
comment on column public.products.warranty is 'Warranty information';
comment on column public.products.delivery is 'Delivery information';
comment on column public.products.training is 'Training information';
comment on column public.products.support is 'Support information';
comment on column public.products.pdf_source is 'Source PDF filename';
comment on column public.products.og_title is 'Open Graph title for social sharing';
comment on column public.products.og_description is 'Open Graph description for social sharing';
comment on column public.products.canonical_url is 'Canonical URL for SEO';
comment on column public.products.focus_keyword is 'Primary SEO keyword';
comment on column public.products.currency is 'Currency code (XOF, EUR, USD, etc.)';

