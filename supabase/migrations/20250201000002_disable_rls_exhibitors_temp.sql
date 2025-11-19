-- ============================================================================
-- Migration: Désactiver temporairement RLS sur exhibitors
-- Date: 2025-02-01
-- Description: Désactive RLS pour faciliter les tests (TEMPORAIRE)
-- ⚠️ À réactiver après les tests !
-- ============================================================================

-- Désactiver RLS sur exhibitors (TEMPORAIRE POUR TEST)
ALTER TABLE exhibitors DISABLE ROW LEVEL SECURITY;

-- ⚠️ RAPPEL IMPORTANT :
-- Réactiver RLS après les tests avec :
-- ALTER TABLE exhibitors ENABLE ROW LEVEL SECURITY;

