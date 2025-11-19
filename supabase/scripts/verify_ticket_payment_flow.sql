-- ============================================================================
-- Script de vérification : Parcours paiement ticket
-- Date: 2025-02-02
-- Description: Vérifie l'état des tickets et le parcours de paiement
-- ============================================================================

-- 1. Voir tous les tickets créés pour Foire Dakar 2025
SELECT 
  id,
  ticket_type,
  quantity,
  total_price,
  buyer_name,
  buyer_email,
  payment_status,
  payment_method,
  payment_reference,
  payment_date,
  qr_code,
  qr_code_data IS NOT NULL as has_qr_data,
  created_at
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
ORDER BY created_at DESC;

-- 2. Statistiques des tickets
SELECT 
  'Tickets Créés' as metric,
  COUNT(*)::text as value
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'

UNION ALL

SELECT 
  'Tickets Payés' as metric,
  COUNT(*)::text as value
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
  AND payment_status = 'paid'

UNION ALL

SELECT 
  'Tickets Non Payés' as metric,
  COUNT(*)::text as value
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
  AND payment_status = 'unpaid'

UNION ALL

SELECT 
  'Tickets avec QR code' as metric,
  COUNT(*)::text as value
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
  AND qr_code IS NOT NULL

UNION ALL

SELECT 
  'Revenue Total' as metric,
  COALESCE(SUM(total_price), 0)::text || ' FCFA' as value
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
  AND payment_status = 'paid';

-- 3. Vérifier un ticket spécifique (remplacer l'ID)
-- SELECT 
--   id,
--   payment_status,
--   payment_method,
--   payment_reference,
--   payment_date,
--   qr_code,
--   qr_code_data,
--   created_at
-- FROM tickets
-- WHERE id = 'fdb7d14c-2049-4285-925d-3d8e5a30997f';

-- 4. Tickets prêts pour paiement (non payés)
SELECT 
  id,
  ticket_type,
  quantity,
  total_price,
  buyer_name,
  buyer_email,
  created_at,
  CONCAT(
    '/fr/org/foire-dakar-2025/foires/foire-dakar-2025/tickets/',
    id,
    '/payment'
  ) as payment_url
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
  AND payment_status = 'unpaid'
ORDER BY created_at DESC;

-- 5. Tickets payés avec QR code (prêts pour confirmation)
SELECT 
  id,
  ticket_type,
  quantity,
  total_price,
  buyer_name,
  buyer_email,
  payment_method,
  qr_code,
  created_at,
  CONCAT(
    '/fr/org/foire-dakar-2025/foires/foire-dakar-2025/tickets/',
    id,
    '/confirmation'
  ) as confirmation_url
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
  AND payment_status = 'paid'
  AND qr_code IS NOT NULL
ORDER BY created_at DESC;

-- 6. Vérification de cohérence : Tickets payés sans QR code
SELECT 
  id,
  payment_status,
  payment_date,
  qr_code,
  '⚠️ Ticket payé mais QR code manquant' as issue
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
  AND payment_status = 'paid'
  AND qr_code IS NULL;

-- 7. Distribution par type de billet
SELECT 
  ticket_type,
  COUNT(*) as total,
  COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid,
  COUNT(CASE WHEN payment_status = 'unpaid' THEN 1 END) as unpaid,
  SUM(CASE WHEN payment_status = 'paid' THEN total_price ELSE 0 END) as revenue_fcfa
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
GROUP BY ticket_type
ORDER BY ticket_type;

