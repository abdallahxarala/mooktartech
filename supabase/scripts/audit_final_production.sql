-- ============================================================================
-- AUDIT FINAL - FOIRE DAKAR 2025 - PRÊT POUR PRODUCTION
-- Date: 2025-02-02
-- Organization: Foire Internationale de Dakar 2025
-- Slug: foire-dakar-2025
-- ============================================================================

-- ============================================================================
-- 1. RÉSUMÉ GLOBAL
-- ============================================================================

SELECT 
  'Total Events' as metric,
  COUNT(*)::text as value
FROM events
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')

UNION ALL

SELECT 
  'Total Exhibitors' as metric,
  COUNT(*)::text as value
FROM exhibitors e
INNER JOIN events ev ON e.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')

UNION ALL

SELECT 
  'Exhibitors Approved' as metric,
  COUNT(*)::text as value
FROM exhibitors e
INNER JOIN events ev ON e.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND (e.approval_status = 'approved' OR e.status = 'approved')

UNION ALL

SELECT 
  'Exhibitors Pending' as metric,
  COUNT(*)::text as value
FROM exhibitors e
INNER JOIN events ev ON e.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND (e.approval_status = 'pending' OR e.status = 'pending')

UNION ALL

SELECT 
  'Total Tickets Created' as metric,
  COUNT(*)::text as value
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')

UNION ALL

SELECT 
  'Total Tickets Sold (Paid)' as metric,
  COUNT(*)::text as value
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND t.payment_status = 'paid'

UNION ALL

SELECT 
  'Total Tickets Unpaid' as metric,
  COUNT(*)::text as value
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND t.payment_status = 'unpaid'

UNION ALL

SELECT 
  'Total Revenue' as metric,
  COALESCE(SUM(total_price), 0)::text || ' FCFA' as value
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND t.payment_status = 'paid'

UNION ALL

SELECT 
  'Tickets Used' as metric,
  COUNT(*)::text as value
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND t.used = true

UNION ALL

SELECT 
  'Tickets with QR Code' as metric,
  COUNT(*)::text as value
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND t.qr_code IS NOT NULL;

-- ============================================================================
-- 2. DISTRIBUTION DES BILLETS PAR TYPE
-- ============================================================================

SELECT 
  ticket_type,
  COUNT(*) as count,
  SUM(quantity) as total_quantity,
  SUM(total_price) as revenue_fcfa,
  ROUND(AVG(total_price), 2) as avg_price_per_ticket
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND t.payment_status = 'paid'
GROUP BY ticket_type
ORDER BY ticket_type;

-- ============================================================================
-- 3. DISTRIBUTION DES BILLETS PAR MÉTHODE DE PAIEMENT
-- ============================================================================

SELECT 
  COALESCE(payment_method, 'non_defini') as payment_method,
  COUNT(*) as count,
  SUM(total_price) as revenue_fcfa
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND t.payment_status = 'paid'
GROUP BY payment_method
ORDER BY count DESC;

-- ============================================================================
-- 4. STATUT DES EXPOSANTS
-- ============================================================================

SELECT 
  COALESCE(e.approval_status, e.status, 'non_defini') as approval_status,
  e.payment_status,
  COUNT(*) as count
FROM exhibitors e
INNER JOIN events ev ON e.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
GROUP BY e.approval_status, e.status, e.payment_status
ORDER BY approval_status, e.payment_status;

-- ============================================================================
-- 5. VÉRIFICATION ISOLATION MULTITENANT (DOIT RETOURNER 0)
-- ============================================================================

-- Test 1: Tickets d'autres organisations avec mêmes emails
SELECT 
  COUNT(*) as leak_count,
  'Tickets d''autres tenants avec mêmes emails' as test
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id != (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND t.buyer_email IN (
    SELECT buyer_email FROM tickets t2
    INNER JOIN events ev2 ON t2.event_id = ev2.id
    WHERE ev2.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  )

UNION ALL

-- Test 2: Exposants d'autres organisations avec mêmes noms
SELECT 
  COUNT(*) as leak_count,
  'Exposants d''autres tenants avec mêmes noms' as test
FROM exhibitors e
INNER JOIN events ev ON e.event_id = ev.id
WHERE ev.organization_id != (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND e.company_name IN (
    SELECT company_name FROM exhibitors e2
    INNER JOIN events ev2 ON e2.event_id = ev2.id
    WHERE ev2.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  )

UNION ALL

-- Test 3: Événements d'autres organisations avec même slug
SELECT 
  COUNT(*) as leak_count,
  'Événements d''autres tenants avec même slug' as test
FROM events ev
WHERE ev.organization_id != (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND ev.slug = 'foire-dakar-2025';

-- ============================================================================
-- 6. VÉRIFICATION DES COLONNES CRITIQUES
-- ============================================================================

-- Vérifier que toutes les colonnes nécessaires existent
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name IN ('tickets', 'exhibitors', 'events')
  AND column_name IN (
    'approval_status', 'payment_status', 'payment_method', 
    'payment_reference', 'qr_code', 'qr_code_data', 
    'organization_id', 'event_id'
  )
ORDER BY table_name, column_name;

-- ============================================================================
-- 7. VÉRIFICATION DES CONTRAINTES CHECK
-- ============================================================================

SELECT 
  conname as constraint_name,
  conrelid::regclass as table_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE contype = 'c'
  AND (
    conname LIKE '%approval_status%' OR
    conname LIKE '%payment_status%' OR
    conname LIKE '%payment_method%' OR
    conname LIKE '%ticket_type%'
  )
ORDER BY table_name, constraint_name;

-- ============================================================================
-- 8. STATISTIQUES D'UTILISATION DES QR CODES
-- ============================================================================

SELECT 
  'Tickets avec QR code généré' as metric,
  COUNT(*)::text as value
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND t.qr_code IS NOT NULL

UNION ALL

SELECT 
  'Tickets avec QR code utilisé' as metric,
  COUNT(*)::text as value
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND t.used = true

UNION ALL

SELECT 
  'Tickets payés sans QR code' as metric,
  COUNT(*)::text as value
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND t.payment_status = 'paid'
  AND t.qr_code IS NULL;

-- ============================================================================
-- 9. RÉSUMÉ PAR DATE (DERNIERS 30 JOURS)
-- ============================================================================

SELECT 
  DATE(created_at) as date,
  COUNT(*) as tickets_created,
  COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as tickets_paid,
  SUM(CASE WHEN payment_status = 'paid' THEN total_price ELSE 0 END) as revenue_fcfa
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
  AND t.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================================================
-- 10. VÉRIFICATION DE L'ORGANISATION
-- ============================================================================

SELECT 
  id,
  name,
  slug,
  created_at
FROM organizations
WHERE slug = 'foire-dakar-2025';

-- ============================================================================
-- 11. VÉRIFICATION DE L'ÉVÉNEMENT
-- ============================================================================

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
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025');

-- ============================================================================
-- 12. CHECKLIST PRODUCTION
-- ============================================================================

SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM events 
      WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
    ) THEN '✅ Événement créé'
    ELSE '❌ Événement manquant'
  END as check_item

UNION ALL

SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM exhibitors e
      INNER JOIN events ev ON e.event_id = ev.id
      WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
    ) THEN '✅ Exposants créés'
    ELSE '❌ Aucun exposant'
  END

UNION ALL

SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'tickets'
    ) THEN '✅ Table tickets créée'
    ELSE '❌ Table tickets manquante'
  END

UNION ALL

SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'exhibitors' AND column_name = 'approval_status'
    ) THEN '✅ Colonne approval_status créée'
    ELSE '❌ Colonne approval_status manquante'
  END

UNION ALL

SELECT 
  CASE 
    WHEN (
      SELECT COUNT(*) FROM tickets t
      INNER JOIN events ev ON t.event_id = ev.id
      WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')
        AND t.payment_status = 'paid'
        AND t.qr_code IS NULL
    ) = 0 THEN '✅ Tous les tickets payés ont un QR code'
    ELSE '⚠️ Certains tickets payés n''ont pas de QR code'
  END;

