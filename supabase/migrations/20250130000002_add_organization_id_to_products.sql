BEGIN;

-- 1. Ajouter organization_id (nullable)
ALTER TABLE products ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE shipping_zones ADD COLUMN IF NOT EXISTS organization_id UUID;

-- 2. Ajouter les foreign keys
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_organization_id_fkey'
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_organization_id_fkey
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_organization_id_fkey'
  ) THEN
    ALTER TABLE orders
      ADD CONSTRAINT orders_organization_id_fkey
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'shipping_zones_organization_id_fkey'
  ) THEN
    ALTER TABLE shipping_zones
      ADD CONSTRAINT shipping_zones_organization_id_fkey
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE RESTRICT;
  END IF;
END $$;

-- 3. Créer les indexes
CREATE INDEX IF NOT EXISTS idx_products_organization_id ON products(organization_id);
CREATE INDEX IF NOT EXISTS idx_orders_organization_id ON orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_shipping_zones_organization_id ON shipping_zones(organization_id);

-- 4. Lier les données à mooktartech-com
UPDATE products 
SET organization_id = '0e973c3f-f507-4071-bb72-a01b92430186'
WHERE organization_id IS NULL;

UPDATE orders 
SET organization_id = '0e973c3f-f507-4071-bb72-a01b92430186'
WHERE organization_id IS NULL;

UPDATE shipping_zones 
SET organization_id = '0e973c3f-f507-4071-bb72-a01b92430186'
WHERE organization_id IS NULL;

-- 5. Rendre organization_id NOT NULL
ALTER TABLE products ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE orders ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE shipping_zones ALTER COLUMN organization_id SET NOT NULL;

COMMIT;

