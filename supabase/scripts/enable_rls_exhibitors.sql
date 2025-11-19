-- ============================================================================
-- Script SQL pour réactiver RLS sur la table exhibitors
-- À utiliser APRÈS les tests
-- ============================================================================

-- Réactiver RLS sur exhibitors
ALTER TABLE exhibitors ENABLE ROW LEVEL SECURITY;

-- Vérification
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'exhibitors';

-- Doit afficher : rowsecurity = true

