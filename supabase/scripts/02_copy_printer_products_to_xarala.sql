-- ============================================================================
-- Script SQL: Copier les produits Imprimantes PVC vers Xarala Solutions
-- Date: 2025-02-02
-- Description: Copie TOUS les produits Imprimantes PVC de Mooktar vers Xarala
-- ⚠️ IMPORTANT: Ne supprime PAS les produits de Mooktar, les COPIER seulement
-- ============================================================================

BEGIN;

-- Vérifier d'abord combien de produits seront copiés
DO $$
DECLARE
  product_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count
  FROM products
  WHERE organization_id = '0e973c3f-f507-4071-bb72-a01b92430186' -- Mooktar
  AND (
    category ILIKE '%imprimante%' 
    OR category ILIKE '%printer%'
    OR category = 'Imprimantes PVC'
    OR name ILIKE '%imprimante%'
    OR name ILIKE '%printer%'
    OR brand IN ('HiTi', 'Entrust', 'Datacard')
  );
  
  RAISE NOTICE 'Nombre de produits à copier: %', product_count;
END $$;

-- Copier TOUTES les imprimantes vers Xarala
-- Note: Utilise seulement les colonnes qui existent dans la table products
INSERT INTO products (
  name, 
  description, 
  price, 
  stock, 
  category, 
  brand,
  featured, 
  short_description, 
  tags, 
  image_url,
  organization_id,
  created_at, 
  updated_at
)
SELECT 
  name, 
  description, 
  price, 
  stock, 
  category, 
  brand,
  featured, 
  short_description, 
  tags, 
  image_url,
  '08aca8c3-584d-4d83-98d0-90476ec40f3d' as organization_id, -- Xarala Solutions
  NOW() as created_at,
  NOW() as updated_at
FROM products
WHERE organization_id = '0e973c3f-f507-4071-bb72-a01b92430186' -- Mooktar Tech
AND (
  category ILIKE '%imprimante%' 
  OR category ILIKE '%printer%'
  OR category = 'Imprimantes PVC'
  OR name ILIKE '%imprimante%'
  OR name ILIKE '%printer%'
  OR brand IN ('HiTi', 'Entrust', 'Datacard')
)
ON CONFLICT DO NOTHING; -- Éviter les doublons si script exécuté plusieurs fois

-- Afficher le résultat
DO $$
DECLARE
  copied_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO copied_count
  FROM products
  WHERE organization_id = '08aca8c3-584d-4d83-98d0-90476ec40f3d' -- Xarala
  AND (
    category ILIKE '%imprimante%' 
    OR category ILIKE '%printer%'
    OR category = 'Imprimantes PVC'
  );
  
  RAISE NOTICE '✅ Produits copiés avec succès vers Xarala: %', copied_count;
END $$;

COMMIT;

