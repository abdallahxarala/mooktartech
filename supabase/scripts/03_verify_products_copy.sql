-- ============================================================================
-- Script SQL: Vérifier la copie des produits
-- Date: 2025-02-02
-- Description: Vérifie que les produits ont été correctement copiés vers Xarala
-- ============================================================================

-- 1. Vérifier le nombre de produits par organisation
SELECT 
  o.name as organization,
  o.slug,
  COUNT(p.id) as products_count,
  string_agg(DISTINCT p.category, ', ' ORDER BY p.category) as categories,
  COUNT(CASE WHEN p.category ILIKE '%imprimante%' OR p.category ILIKE '%printer%' THEN 1 END) as printer_count
FROM organizations o
LEFT JOIN products p ON p.organization_id = o.id
WHERE o.slug IN ('xarala-solutions', 'mooktartech-com')
GROUP BY o.id, o.name, o.slug
ORDER BY o.name;

-- 2. Détail des produits Imprimantes pour chaque organisation
SELECT 
  o.name as organization,
  p.name,
  p.brand,
  p.category,
  p.price,
  p.featured,
  p.created_at
FROM organizations o
JOIN products p ON p.organization_id = o.id
WHERE o.slug IN ('xarala-solutions', 'mooktartech-com')
AND (
  p.category ILIKE '%imprimante%' 
  OR p.category ILIKE '%printer%'
  OR p.category = 'Imprimantes PVC'
  OR p.brand IN ('HiTi', 'Entrust', 'Datacard')
)
ORDER BY o.name, p.brand, p.name;

-- 3. Vérifier les produits featured pour Xarala
SELECT 
  name,
  brand,
  price,
  featured,
  image_url
FROM products
WHERE organization_id = '08aca8c3-584d-4d83-98d0-90476ec40f3d' -- Xarala
AND featured = true
ORDER BY brand, name;

-- 4. Statistiques globales
SELECT 
  'Total produits Mooktar' as metric,
  COUNT(*)::text as value
FROM products
WHERE organization_id = '0e973c3f-f507-4071-bb72-a01b92430186'
UNION ALL
SELECT 
  'Total produits Xarala' as metric,
  COUNT(*)::text as value
FROM products
WHERE organization_id = '08aca8c3-584d-4d83-98d0-90476ec40f3d'
UNION ALL
SELECT 
  'Imprimantes Mooktar' as metric,
  COUNT(*)::text as value
FROM products
WHERE organization_id = '0e973c3f-f507-4071-bb72-a01b92430186'
AND (
  category ILIKE '%imprimante%' 
  OR category ILIKE '%printer%'
  OR brand IN ('HiTi', 'Entrust', 'Datacard')
)
UNION ALL
SELECT 
  'Imprimantes Xarala' as metric,
  COUNT(*)::text as value
FROM products
WHERE organization_id = '08aca8c3-584d-4d83-98d0-90476ec40f3d'
AND (
  category ILIKE '%imprimante%' 
  OR category ILIKE '%printer%'
  OR brand IN ('HiTi', 'Entrust', 'Datacard')
);

