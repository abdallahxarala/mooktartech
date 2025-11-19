-- ============================================================================
-- Script de vérification : Ticket créé
-- Date: 2025-02-02
-- Description: Vérifie qu'un ticket a été créé correctement avec organization_id
-- ============================================================================

-- 1. Voir le dernier ticket créé
SELECT 
  id,
  organization_id, -- ✅ Doit être rempli
  event_id,
  ticket_type,
  quantity,
  unit_price,
  total_price,
  buyer_name,
  buyer_email,
  buyer_phone,
  payment_status,
  payment_method,
  payment_reference,
  qr_code,
  used,
  created_at
FROM tickets
ORDER BY created_at DESC
LIMIT 1;

-- 2. Vérifier que organization_id correspond à Foire Dakar 2025
SELECT 
  t.id as ticket_id,
  t.organization_id,
  o.name as organization_name,
  o.slug as organization_slug,
  CASE 
    WHEN t.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025') 
    THEN '✅ Correct'
    ELSE '❌ Incorrect'
  END as verification
FROM tickets t
LEFT JOIN organizations o ON t.organization_id = o.id
ORDER BY t.created_at DESC
LIMIT 1;

-- 3. Vérifier l'événement associé
SELECT 
  t.id as ticket_id,
  t.event_id,
  e.name as event_name,
  e.slug as event_slug,
  e.organization_id as event_organization_id,
  CASE 
    WHEN t.organization_id = e.organization_id 
    THEN '✅ Cohérent'
    ELSE '❌ Incohérent'
  END as coherence_check
FROM tickets t
LEFT JOIN events e ON t.event_id = e.id
ORDER BY t.created_at DESC
LIMIT 1;

-- 4. Statistiques des tickets créés aujourd'hui
SELECT 
  COUNT(*) as total_tickets_today,
  COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_today,
  COUNT(CASE WHEN payment_status = 'unpaid' THEN 1 END) as unpaid_today,
  SUM(CASE WHEN payment_status = 'paid' THEN total_price ELSE 0 END) as revenue_today_fcfa
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND DATE(t.created_at) = CURRENT_DATE;

-- 5. Vérifier l'isolation multitenant pour ce ticket
SELECT 
  'Isolation Check' as test,
  COUNT(*) as tickets_from_other_orgs
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE t.id = (SELECT id FROM tickets ORDER BY created_at DESC LIMIT 1)
  AND ev.organization_id != (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025');

-- Résultat attendu : 0 ✅

