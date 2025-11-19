-- ============================================================================
-- Script SQL: Identifier les produits Imprimantes PVC de Mooktar Tech
-- Date: 2025-02-02
-- Description: Liste tous les produits Imprimantes PVC pour vérification avant copie
-- ============================================================================

-- Voir tous les produits Imprimantes PVC de Mooktar Tech
SELECT 
  id,
  name,
  category,
  brand,
  price,
  stock,
  featured,
  short_description,
  image_url,
  organization_id,
  created_at
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
ORDER BY brand, name;

-- Compter les produits par catégorie pour Mooktar
SELECT 
  category,
  COUNT(*) as count,
  string_agg(name, ', ') as products
FROM products
WHERE organization_id = '0e973c3f-f507-4071-bb72-a01b92430186'
GROUP BY category
ORDER BY count DESC;

