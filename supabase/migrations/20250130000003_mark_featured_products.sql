-- Marquer 8 produits comme featured (pour carousel + bestsellers)
UPDATE products 
SET is_featured = true
WHERE organization_id = '0e973c3f-f507-4071-bb72-a01b92430186'
  AND id IN (
    SELECT id FROM products 
    WHERE organization_id = '0e973c3f-f507-4071-bb72-a01b92430186'
    ORDER BY created_at DESC
    LIMIT 8
  );

-- Vérifier
SELECT name, is_featured FROM products 
WHERE organization_id = '0e973c3f-f507-4071-bb72-a01b92430186'
  AND is_featured = true;

