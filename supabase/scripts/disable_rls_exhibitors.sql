-- ============================================================================
-- Script SQL pour désactiver temporairement RLS sur la table exhibitors
-- ⚠️ TEMPORAIRE POUR TEST UNIQUEMENT
-- À exécuter dans Supabase SQL Editor
-- ============================================================================

-- Désactiver RLS sur exhibitors (TEMPORAIRE POUR TEST)
ALTER TABLE exhibitors DISABLE ROW LEVEL SECURITY;

-- Vérification
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'exhibitors';

-- Doit afficher : rowsecurity = false

-- ⚠️ RAPPEL : Réactiver RLS après les tests avec :
-- ALTER TABLE exhibitors ENABLE ROW LEVEL SECURITY;

