-- ============================================================================
-- Script d'audit pour Foire Dakar 2025
-- Date: 2025-02-02
-- Organization ID: 6559a4ed-0ac4-4157-980e-756369fc683c
-- Slug: foire-dakar-2025
-- ============================================================================

-- 1. Vérifier l'organization
SELECT 
  id,
  name,
  slug,
  created_at
FROM organizations
WHERE id = '6559a4ed-0ac4-4157-980e-756369fc683c'
  OR slug = 'foire-dakar-2025';

-- 2. Vérifier les événements
SELECT 
  id,
  name,
  slug,
  start_date,
  end_date,
  location,
  organization_id,
  created_at
FROM events
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c';

-- 3. Vérifier les exposants
SELECT 
  e.id,
  e.company_name,
  e.slug,
  e.contact_email,
  e.contact_phone,
  e.payment_status,
  e.payment_method,
  e.approval_status,
  e.event_id,
  ev.name as event_name,
  ev.organization_id
FROM exhibitors e
INNER JOIN events ev ON e.event_id = ev.id
WHERE ev.organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c';

-- 4. Compter les exposants par statut
SELECT 
  payment_status,
  approval_status,
  COUNT(*) as count
FROM exhibitors e
INNER JOIN events ev ON e.event_id = ev.id
WHERE ev.organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
GROUP BY payment_status, approval_status;

-- 5. Vérifier les tickets (si table existe)
SELECT 
  COUNT(*) as total_tickets,
  COUNT(CASE WHEN used = true THEN 1 END) as tickets_used,
  COUNT(CASE WHEN used = false THEN 1 END) as tickets_available,
  SUM(total_price) as total_revenue
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c';

-- 6. Vérifier l'isolation multitenant
-- Cette requête doit retourner UNIQUEMENT les données de Foire Dakar
SELECT 
  'exhibitors' as table_name,
  COUNT(*) as count
FROM exhibitors e
INNER JOIN events ev ON e.event_id = ev.id
WHERE ev.organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'

UNION ALL

SELECT 
  'events' as table_name,
  COUNT(*) as count
FROM events
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'

UNION ALL

SELECT 
  'tickets' as table_name,
  COUNT(*) as count
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c';

-- 7. Vérifier qu'il n'y a PAS de fuite de données
-- Cette requête doit retourner 0 pour chaque table
SELECT 
  'exhibitors_leak_check' as check_name,
  COUNT(*) as leak_count
FROM exhibitors e
INNER JOIN events ev ON e.event_id = ev.id
WHERE ev.organization_id != '6559a4ed-0ac4-4157-980e-756369fc683c'
  AND e.company_name IN (
    SELECT company_name 
    FROM exhibitors e2
    INNER JOIN events ev2 ON e2.event_id = ev2.id
    WHERE ev2.organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
  );

-- 8. Vérifier les colonnes critiques
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'exhibitors'
  AND column_name IN ('payment_status', 'payment_method', 'payment_reference', 'approval_status')
ORDER BY ordinal_position;

-- 9. Vérifier les contraintes CHECK
SELECT 
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE constraint_name LIKE '%exhibitors%'
  OR constraint_name LIKE '%payment%';

