-- ============================================================================
-- Script SQL pour désactiver RLS sur toutes les tables de la foire
-- Supprime TOUTES les politiques RLS existantes
-- À exécuter dans Supabase SQL Editor
-- ============================================================================

-- ============================================
-- SUPPRIMER TOUTES LES POLITIQUES RLS
-- ============================================

-- 1. EVENTS
DROP POLICY IF EXISTS "Members can view events in their organization" ON events;
DROP POLICY IF EXISTS "Members can create events in their organization" ON events;
DROP POLICY IF EXISTS "Members can update events in their organization" ON events;
DROP POLICY IF EXISTS "Members can delete events in their organization" ON events;

-- 2. EVENT_ATTENDEES
DROP POLICY IF EXISTS "Event org members can manage attendees" ON event_attendees;

-- 3. EXHIBITORS
DROP POLICY IF EXISTS "Event organizers manage exhibitors" ON exhibitors;
DROP POLICY IF EXISTS "Approved exhibitors are public" ON exhibitors;
DROP POLICY IF EXISTS "Exhibitors manage their own data" ON exhibitors;
DROP POLICY IF EXISTS "Allow public exhibitor registration" ON exhibitors;
DROP POLICY IF EXISTS "Admins can view all exhibitors" ON exhibitors;
DROP POLICY IF EXISTS "Exhibitors can view their own registration" ON exhibitors;
DROP POLICY IF EXISTS "Enable read access for all users" ON exhibitors;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON exhibitors;

-- 4. EXHIBITOR_PRODUCTS
DROP POLICY IF EXISTS "Exhibitors manage their products" ON exhibitor_products;
DROP POLICY IF EXISTS "Products of approved exhibitors are public" ON exhibitor_products;

-- 5. EXHIBITOR_STAFF (au cas où)
DROP POLICY IF EXISTS "Exhibitors can view their own staff" ON exhibitor_staff;
DROP POLICY IF EXISTS "Exhibitors can insert their own staff" ON exhibitor_staff;
DROP POLICY IF EXISTS "Exhibitors can update their own staff" ON exhibitor_staff;
DROP POLICY IF EXISTS "Exhibitors can delete their own staff" ON exhibitor_staff;
DROP POLICY IF EXISTS "Admins can view all staff" ON exhibitor_staff;

-- ============================================
-- DÉSACTIVER COMPLÈTEMENT RLS
-- ============================================

ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitor_staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitor_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees DISABLE ROW LEVEL SECURITY;

-- ============================================
-- VÉRIFICATION 1 : Plus aucune politique
-- ============================================

SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('events', 'exhibitors', 'exhibitor_staff', 'exhibitor_products', 'event_attendees')
GROUP BY tablename;

-- Doit retourner 0 rows (aucune politique)

-- ============================================
-- VÉRIFICATION 2 : RLS désactivé partout
-- ============================================

SELECT 
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity = false THEN '✅ OK'
    ELSE '❌ ENCORE ACTIVÉ'
  END as status
FROM pg_tables
WHERE tablename IN ('events', 'exhibitors', 'exhibitor_staff', 'exhibitor_products', 'event_attendees')
ORDER BY tablename;

-- TOUTES les tables doivent afficher : rowsecurity = false

-- ============================================
-- TEST D'INSERTION
-- ============================================

DO $$

DECLARE
  test_event_id UUID;
  test_org_id TEXT;
  test_exhibitor_id UUID;
BEGIN
  -- Récupérer event
  SELECT id, organization_id INTO test_event_id, test_org_id
  FROM events
  WHERE slug = 'foire-dakar-2025'
  LIMIT 1;

  IF test_event_id IS NULL THEN
    RAISE EXCEPTION 'Event foire-dakar-2025 not found';
  END IF;

  RAISE NOTICE '📍 Event ID: %', test_event_id;
  RAISE NOTICE '📍 Org ID: %', test_org_id;

  -- Insérer exhibitor test
  INSERT INTO exhibitors (
    event_id,
    organization_id,
    company_name,
    slug,
    contact_name,
    contact_email,
    contact_phone,
    status,
    payment_status,
    payment_amount,
    currency
  ) VALUES (
    test_event_id,
    test_org_id,
    'TEST DELETE ME',
    'test-delete-me-' || floor(random() * 100000),
    'Test',
    'test@test.com',
    '+221770000000',
    'pending',
    'unpaid',
    500000,
    'FCFA'
  ) RETURNING id INTO test_exhibitor_id;

  RAISE NOTICE '✅ SUCCESS! Exhibitor created: %', test_exhibitor_id;

  -- Nettoyer
  DELETE FROM exhibitors WHERE id = test_exhibitor_id;
  RAISE NOTICE '🧹 Test cleaned up';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ ERROR: %', SQLERRM;
END $$;
