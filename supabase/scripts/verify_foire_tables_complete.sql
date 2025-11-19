-- ============================================================================
-- Script SQL pour vérifier que toutes les tables de la foire existent et sont prêtes
-- À exécuter dans Supabase SQL Editor
-- ============================================================================

-- ============================================
-- VÉRIFICATION COMPLÈTE DES TABLES
-- ============================================

-- 1. Lister toutes les tables avec leur statut
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name) as columns,
  (SELECT rowsecurity FROM pg_tables WHERE tablename = t.table_name) as rls_enabled,
  CASE 
    WHEN table_name = 'organizations' THEN '⚪ (existe déjà)'
    WHEN table_name = 'events' THEN '✅ REQUIS'
    WHEN table_name = 'exhibitors' THEN '✅ REQUIS'
    WHEN table_name = 'exhibitor_staff' THEN '✅ REQUIS'
    WHEN table_name = 'exhibitor_products' THEN '✅ REQUIS'
    WHEN table_name = 'event_attendees' THEN '✅ REQUIS'
    ELSE '⚪'
  END as status
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND table_name IN ('organizations', 'events', 'exhibitors', 'exhibitor_staff', 'exhibitor_products', 'event_attendees')
ORDER BY 
  CASE table_name
    WHEN 'organizations' THEN 1
    WHEN 'events' THEN 2
    WHEN 'exhibitors' THEN 3
    WHEN 'exhibitor_staff' THEN 4
    WHEN 'exhibitor_products' THEN 5
    WHEN 'event_attendees' THEN 6
  END;

-- 2. Vérifier les relations (foreign keys)
SELECT
  tc.table_name as "Table",
  kcu.column_name as "Colonne",
  ccu.table_name as "Référence",
  ccu.column_name as "Colonne Référence"
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('exhibitors', 'exhibitor_staff', 'exhibitor_products', 'event_attendees')
ORDER BY tc.table_name;

-- 3. Compter les données existantes
SELECT 
  'events' as table_name, 
  COUNT(*) as count,
  CASE WHEN COUNT(*) > 0 THEN '✅' ELSE '⚠️ Vide' END as status
FROM events
UNION ALL
SELECT 
  'exhibitors' as table_name, 
  COUNT(*) as count,
  CASE WHEN COUNT(*) > 0 THEN '✅' ELSE '⚠️ Vide' END as status
FROM exhibitors
UNION ALL
SELECT 
  'exhibitor_staff' as table_name, 
  COUNT(*) as count,
  CASE WHEN COUNT(*) > 0 THEN '✅ Données' ELSE 'ℹ️ Vide (normal)' END as status
FROM exhibitor_staff
UNION ALL
SELECT 
  'exhibitor_products' as table_name, 
  COUNT(*) as count,
  CASE WHEN COUNT(*) > 0 THEN '✅ Données' ELSE 'ℹ️ Vide (normal)' END as status
FROM exhibitor_products
UNION ALL
SELECT 
  'event_attendees' as table_name, 
  COUNT(*) as count,
  CASE WHEN COUNT(*) > 0 THEN '✅ Données' ELSE 'ℹ️ Vide (normal)' END as status
FROM event_attendees;

