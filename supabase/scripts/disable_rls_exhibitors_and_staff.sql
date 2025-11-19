-- ============================================================================
-- Script SQL pour désactiver RLS sur exhibitors et exhibitor_staff
-- ⚠️ TEMPORAIRE POUR TEST UNIQUEMENT
-- À exécuter dans Supabase SQL Editor
-- ============================================================================

-- 1. Désactiver RLS sur exhibitors
ALTER TABLE exhibitors DISABLE ROW LEVEL SECURITY;

-- 2. Désactiver RLS sur exhibitor_staff
ALTER TABLE exhibitor_staff DISABLE ROW LEVEL SECURITY;

-- 3. Vérification
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename IN ('exhibitors', 'exhibitor_staff');

-- Les deux doivent afficher : rowsecurity = false

-- 4. Tester une insertion manuelle
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
  (SELECT id FROM events LIMIT 1),
  (SELECT organization_id FROM events LIMIT 1),
  'Test Company',
  'test-company-123',
  'John Doe',
  'test@test.com',
  '+221771234567',
  'pending',
  'unpaid',
  500000,
  'FCFA'
) RETURNING id, company_name;

-- Si ça fonctionne, l'insertion manuelle est OK
-- Puis supprime le test :
DELETE FROM exhibitors WHERE slug = 'test-company-123';

-- ⚠️ RAPPEL : Réactiver RLS après les tests avec :
-- ALTER TABLE exhibitors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE exhibitor_staff ENABLE ROW LEVEL SECURITY;

