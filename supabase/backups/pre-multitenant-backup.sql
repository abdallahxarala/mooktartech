-- ============================================================================
-- Script SQL: Backup Pre-Multitenant - Export des données
-- Date: 2025-02-02
-- Description: Scripts pour exporter les données importantes avant migration
-- ============================================================================

-- ⚠️ IMPORTANT: Ces commandes COPY nécessitent des privilèges superuser
-- Pour Supabase Cloud, utiliser plutôt l'interface Dashboard → Export

-- ============================================================================
-- OPTION 1: Export via Supabase Dashboard (RECOMMANDÉ)
-- ============================================================================
-- 
-- 1. Aller dans Supabase Dashboard → Table Editor
-- 2. Sélectionner chaque table
-- 3. Cliquer sur "Export" → CSV
-- 
-- Tables à exporter :
-- - organizations
-- - products
-- - events
-- - exhibitors
-- - exhibitor_staff
-- - exhibitor_products
-- - tickets
-- - event_attendees
-- - orders (si données importantes)
--
-- ============================================================================

-- ============================================================================
-- OPTION 2: Export SQL (nécessite privilèges superuser)
-- ============================================================================

-- Export des organizations
-- COPY (
--   SELECT * FROM organizations
-- ) TO '/tmp/organizations_backup.csv' WITH CSV HEADER;

-- Export des products
-- COPY (
--   SELECT * FROM products
-- ) TO '/tmp/products_backup.csv' WITH CSV HEADER;

-- Export des events
-- COPY (
--   SELECT * FROM events
-- ) TO '/tmp/events_backup.csv' WITH CSV HEADER;

-- Export des exhibitors
-- COPY (
--   SELECT * FROM exhibitors
-- ) TO '/tmp/exhibitors_backup.csv' WITH CSV HEADER;

-- Export des exhibitor_staff
-- COPY (
--   SELECT * FROM exhibitor_staff
-- ) TO '/tmp/exhibitor_staff_backup.csv' WITH CSV HEADER;

-- Export des exhibitor_products
-- COPY (
--   SELECT * FROM exhibitor_products
-- ) TO '/tmp/exhibitor_products_backup.csv' WITH CSV HEADER;

-- Export des tickets
-- COPY (
--   SELECT * FROM tickets
-- ) TO '/tmp/tickets_backup.csv' WITH CSV HEADER;

-- ============================================================================
-- OPTION 3: Vérification des données (peut être exécuté)
-- ============================================================================

-- Compter les enregistrements par table
SELECT 'organizations' as table_name, COUNT(*) as count FROM organizations
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'exhibitors', COUNT(*) FROM exhibitors
UNION ALL
SELECT 'exhibitor_staff', COUNT(*) FROM exhibitor_staff
UNION ALL
SELECT 'exhibitor_products', COUNT(*) FROM exhibitor_products
UNION ALL
SELECT 'tickets', COUNT(*) FROM tickets
UNION ALL
SELECT 'event_attendees', COUNT(*) FROM event_attendees
ORDER BY table_name;

-- Vérifier les organizations
SELECT id, name, slug, created_at
FROM organizations
ORDER BY created_at;

-- Vérifier les produits par organization
SELECT 
  o.name as organization,
  COUNT(p.id) as products_count
FROM organizations o
LEFT JOIN products p ON p.organization_id = o.id
GROUP BY o.id, o.name
ORDER BY o.name;

-- Vérifier les événements par organization
SELECT 
  o.name as organization,
  COUNT(e.id) as events_count
FROM organizations o
LEFT JOIN events e ON e.organization_id = o.id
GROUP BY o.id, o.name
ORDER BY o.name;

-- Vérifier les exposants par événement
SELECT 
  ev.name as event,
  o.name as organization,
  COUNT(ex.id) as exhibitors_count
FROM events ev
JOIN organizations o ON o.id = ev.organization_id
LEFT JOIN exhibitors ex ON ex.event_id = ev.id
GROUP BY ev.id, ev.name, o.name
ORDER BY o.name, ev.name;

-- ============================================================================
-- OPTION 4: Backup complet du schéma (structure uniquement)
-- ============================================================================

-- Pour exporter le schéma complet (sans données) :
-- pg_dump -h [HOST] -U [USER] -d [DATABASE] --schema-only > schema_backup.sql

-- Pour exporter les données uniquement :
-- pg_dump -h [HOST] -U [USER] -d [DATABASE] --data-only > data_backup.sql

-- Pour exporter tout (schéma + données) :
-- pg_dump -h [HOST] -U [USER] -d [DATABASE] > full_backup.sql

-- ============================================================================
-- NOTES
-- ============================================================================
--
-- Pour Supabase Cloud :
-- 1. Utiliser l'interface Dashboard → Database → Backups
-- 2. Ou utiliser Supabase CLI : supabase db dump
--
-- Pour Supabase Local :
-- supabase db dump -f backup.sql
--
-- ============================================================================

