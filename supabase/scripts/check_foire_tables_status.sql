-- ============================================================================
-- Script SQL pour vérifier l'état complet de toutes les tables de la foire
-- À exécuter dans Supabase SQL Editor
-- ============================================================================

-- Status de toutes les tables
SELECT 
  t.table_name,
  COUNT(c.column_name) as columns,
  COALESCE(pt.rowsecurity, false) as rls_enabled,
  CASE 
    WHEN t.table_name = 'events' THEN '✅'
    WHEN t.table_name = 'exhibitors' THEN '✅'
    WHEN t.table_name = 'exhibitor_staff' THEN '✅'
    WHEN t.table_name = 'exhibitor_products' THEN '✅'
    WHEN t.table_name = 'event_attendees' THEN '✅'
    ELSE '⚪'
  END as needed
FROM information_schema.tables t
LEFT JOIN information_schema.columns c 
  ON t.table_name = c.table_name 
  AND t.table_schema = c.table_schema
LEFT JOIN pg_tables pt 
  ON t.table_name = pt.tablename
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
  AND t.table_name IN ('events', 'exhibitors', 'exhibitor_staff', 'exhibitor_products', 'event_attendees', 'organizations')
GROUP BY t.table_name, pt.rowsecurity
ORDER BY 
  CASE t.table_name
    WHEN 'organizations' THEN 1
    WHEN 'events' THEN 2
    WHEN 'exhibitors' THEN 3
    WHEN 'exhibitor_staff' THEN 4
    WHEN 'exhibitor_products' THEN 5
    WHEN 'event_attendees' THEN 6
  END;

-- Résultat attendu :
-- organizations      | columns | rls_enabled | needed
-- events            | ~15     | false       | ✅
-- exhibitors        | ~20     | false       | ✅
-- exhibitor_staff   | ~15     | false       | ✅
-- exhibitor_products| ~18     | false       | ✅
-- event_attendees   | ~15     | false       | ✅

-- ============================================================================
-- Détails supplémentaires : Colonnes de chaque table
-- ============================================================================

-- Colonnes de events
SELECT 
  'events' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;

-- Colonnes de exhibitors
SELECT 
  'exhibitors' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'exhibitors'
ORDER BY ordinal_position;

-- Colonnes de exhibitor_staff
SELECT 
  'exhibitor_staff' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'exhibitor_staff'
ORDER BY ordinal_position;

-- Colonnes de exhibitor_products
SELECT 
  'exhibitor_products' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'exhibitor_products'
ORDER BY ordinal_position;

-- Colonnes de event_attendees
SELECT 
  'event_attendees' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'event_attendees'
ORDER BY ordinal_position;

