-- ============================================================================
-- Migration: Désactiver temporairement RLS sur exhibitors et exhibitor_staff
-- Date: 2025-02-01
-- Description: Désactive RLS pour faciliter les tests (TEMPORAIRE)
-- ⚠️ À réactiver après les tests !
-- ============================================================================

-- Désactiver RLS sur exhibitors
ALTER TABLE exhibitors DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS sur exhibitor_staff
ALTER TABLE exhibitor_staff DISABLE ROW LEVEL SECURITY;

-- ⚠️ RAPPEL IMPORTANT :
-- Réactiver RLS après les tests avec :
-- ALTER TABLE exhibitors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE exhibitor_staff ENABLE ROW LEVEL SECURITY;

