-- ============================================================================
-- Script de vérification : Table tickets
-- Date : 2025-02-02
-- Description: Vérifie que la table tickets est correctement créée
-- ============================================================================

-- 1. Voir la structure complète
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'tickets'
ORDER BY ordinal_position;

-- 2. Vérifier les contraintes CHECK
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'tickets'::regclass
  AND contype = 'c'
ORDER BY conname;

-- 3. Vérifier les indexes
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'tickets'
ORDER BY indexname;

-- 4. Vérifier les RLS Policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'tickets'
ORDER BY policyname;

-- 5. Vérifier les triggers
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'tickets'
ORDER BY trigger_name;

-- 6. Vérifier les foreign keys
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'tickets';

-- 7. Test d'insertion (optionnel, commenté pour éviter les données de test)
/*
INSERT INTO tickets (
  event_id,
  ticket_type,
  quantity,
  unit_price,
  total_price,
  buyer_name,
  buyer_email,
  payment_status
) VALUES (
  (SELECT id FROM events LIMIT 1),
  'standard',
  1,
  2000,
  2000,
  'Test User',
  'test@example.com',
  'unpaid'
);

-- Vérifier l'insertion
SELECT * FROM tickets WHERE buyer_email = 'test@example.com';

-- Nettoyer (optionnel)
-- DELETE FROM tickets WHERE buyer_email = 'test@example.com';
*/

