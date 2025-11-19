-- ============================================================================
-- Script SQL: Créer des produits spécifiques pour Xarala Solutions
-- Date: 2025-02-02
-- Description: Crée des produits spécifiques si certains manquent après la copie
-- ============================================================================

BEGIN;

-- Produit 1: HiTi CS-200e
INSERT INTO products (
  name,
  description,
  short_description,
  price,
  category,
  brand,
  featured,
  image_url,
  organization_id,
  stock,
  created_at,
  updated_at
) VALUES (
  'HiTi CS-200e',
  'Imprimante de badges compacte et silencieuse, idéale pour les petits volumes. Formation gratuite incluse.',
  'Formation gratuite incluse',
  1250000,
  'Imprimantes PVC',
  'HiTi',
  true,
  'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
  '08aca8c3-584d-4d83-98d0-90476ec40f3d', -- Xarala Solutions
  5,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- Produit 2: Entrust Sigma DSE
INSERT INTO products (
  name,
  description,
  short_description,
  price,
  category,
  brand,
  featured,
  image_url,
  organization_id,
  stock,
  created_at,
  updated_at
) VALUES (
  'Entrust Sigma DSE',
  'Imprimante de cartes haute sécurité avec encodage magnétique et puce. Parfaite pour les cartes d''identification professionnelles.',
  'Haute sécurité avec encodage',
  750000,
  'Imprimantes PVC',
  'Entrust',
  true,
  'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
  '08aca8c3-584d-4d83-98d0-90476ec40f3d', -- Xarala Solutions
  3,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- Produit 3: Datacard CD800
INSERT INTO products (
  name,
  description,
  short_description,
  price,
  category,
  brand,
  featured,
  image_url,
  organization_id,
  stock,
  created_at,
  updated_at
) VALUES (
  'Datacard CD800',
  'Imprimante de cartes professionnelle avec impression recto-verso et laminage. Idéale pour les grandes entreprises.',
  'Impression recto-verso + laminage',
  1650000,
  'Imprimantes PVC',
  'Datacard',
  true,
  'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
  '08aca8c3-584d-4d83-98d0-90476ec40f3d', -- Xarala Solutions
  2,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

COMMIT;

-- Vérifier les produits créés
SELECT 
  name,
  brand,
  price_fcfa,
  featured,
  stock
FROM products
WHERE organization_id = '08aca8c3-584d-4d83-98d0-90476ec40f3d'
AND brand IN ('HiTi', 'Entrust', 'Datacard')
ORDER BY brand, name;

