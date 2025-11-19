-- ============================================================================
-- Script SQL pour réactiver RLS sur exhibitors et exhibitor_staff
-- À utiliser APRÈS les tests
-- ============================================================================

-- Réactiver RLS sur exhibitors
ALTER TABLE exhibitors ENABLE ROW LEVEL SECURITY;

-- Réactiver RLS sur exhibitor_staff
ALTER TABLE exhibitor_staff ENABLE ROW LEVEL SECURITY;

-- Vérification
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename IN ('exhibitors', 'exhibitor_staff');

-- Les deux doivent afficher : rowsecurity = true

