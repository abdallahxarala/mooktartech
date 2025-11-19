-- ============================================================================
-- Script d'audit pour Foire Dakar 2025 - VERSION 2
-- Date: 2025-02-02
-- Après ajout de approval_status
-- ============================================================================

-- 1. Vérifier l'organization
SELECT 
  id,
  name,
  slug,
  created_at
FROM organizations
WHERE slug = 'foire-dakar-2025';

-- 2. Vérifier l'événement
SELECT 
  id,
  name,
  slug,
  start_date,
  end_date,
  location,
  organization_id
FROM events
WHERE organization_id = (
  SELECT id FROM organizations WHERE slug = 'foire-dakar-2025'
);

-- 3. Vérifier les exposants AVEC approval_status
SELECT 
  e.id,
  e.company_name,
  e.contact_email,
  e.payment_status,
  e.payment_method,
  e.approval_status, -- ✅ Maintenant disponible
  e.status, -- Ancienne colonne (si existe)
  ev.name as event_name
FROM exhibitors e
INNER JOIN events ev ON e.event_id = ev.id
WHERE ev.organization_id = (
  SELECT id FROM organizations WHERE slug = 'foire-dakar-2025'
);

-- 4. Statistiques par statut
SELECT 
  payment_status,
  approval_status,
  COUNT(*) as count
FROM exhibitors e
INNER JOIN events ev ON e.event_id = ev.id
WHERE ev.organization_id = (
  SELECT id FROM organizations WHERE slug = 'foire-dakar-2025'
)
GROUP BY payment_status, approval_status
ORDER BY payment_status, approval_status;

-- 5. Vérifier les tickets (avec gestion du cas où la table n'existe pas ou est vide)
DO $$
DECLARE
  ticket_count INTEGER;
BEGIN
  -- Vérifier si la table existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tickets') THEN
    SELECT COUNT(*) INTO ticket_count
    FROM tickets t
    INNER JOIN events ev ON t.event_id = ev.id
    WHERE ev.organization_id = (
      SELECT id FROM organizations WHERE slug = 'foire-dakar-2025'
    );
    
    IF ticket_count > 0 THEN
      -- Afficher les statistiques si des tickets existent
      RAISE NOTICE 'Tickets trouvés: %', ticket_count;
      
      PERFORM 1 FROM tickets t
      INNER JOIN events ev ON t.event_id = ev.id
      WHERE ev.organization_id = (
        SELECT id FROM organizations WHERE slug = 'foire-dakar-2025'
      )
      LIMIT 1;
    ELSE
      RAISE NOTICE 'Aucun ticket trouvé pour Foire Dakar 2025';
    END IF;
  ELSE
    RAISE NOTICE 'Table tickets n''existe pas encore';
  END IF;
END $$;

-- 5b. Statistiques détaillées des tickets (si table existe et contient des données)
SELECT 
  COUNT(*) as total_tickets,
  ticket_type,
  payment_status,
  SUM(total_price) as revenue
FROM tickets t
INNER JOIN events ev ON t.event_id = ev.id
WHERE ev.organization_id = (
  SELECT id FROM organizations WHERE slug = 'foire-dakar-2025'
)
GROUP BY ticket_type, payment_status
ORDER BY ticket_type, payment_status;

-- 6. Vérifier l'isolation multitenant (doit retourner 0)
SELECT 
  COUNT(*) as leak_count,
  'Exposants d''autres tenants' as description
FROM exhibitors e
INNER JOIN events ev ON e.event_id = ev.id
WHERE ev.organization_id != (
  SELECT id FROM organizations WHERE slug = 'foire-dakar-2025'
)
AND e.id IN (
  SELECT id FROM exhibitors e2
  INNER JOIN events ev2 ON e2.event_id = ev2.id
  WHERE ev2.organization_id = (
    SELECT id FROM organizations WHERE slug = 'foire-dakar-2025'
  )
);

-- 7. Vérifier les colonnes critiques
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'exhibitors'
  AND column_name IN ('approval_status', 'payment_status', 'payment_method', 'payment_reference')
ORDER BY column_name;

-- 8. Vérifier les contraintes CHECK
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'exhibitors'::regclass
  AND contype = 'c'
  AND (conname LIKE '%approval%' OR conname LIKE '%payment%')
ORDER BY conname;

-- 9. Résumé global (avec gestion du cas où tickets n'existe pas)
SELECT 
  (SELECT COUNT(*) FROM events WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')) as total_events,
  (SELECT COUNT(*) FROM exhibitors e INNER JOIN events ev ON e.event_id = ev.id WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025')) as total_exhibitors,
  (
    CASE 
      WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tickets') 
      THEN (SELECT COUNT(*) FROM tickets t INNER JOIN events ev ON t.event_id = ev.id WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025'))
      ELSE 0
    END
  ) as total_tickets,
  (
    CASE 
      WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tickets') 
      THEN (SELECT COALESCE(SUM(total_price), 0) FROM tickets t INNER JOIN events ev ON t.event_id = ev.id WHERE ev.organization_id = (SELECT id FROM organizations WHERE slug = 'foire-dakar-2025'))
      ELSE 0
    END
  ) as total_revenue_fcfa;

-- 10. Vérifier que la table tickets existe
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'tickets'
ORDER BY ordinal_position
LIMIT 20;

