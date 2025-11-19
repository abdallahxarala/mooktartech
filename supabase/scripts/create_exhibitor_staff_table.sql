-- ============================================================================
-- Script SQL pour créer la table exhibitor_staff (SAFE VERSION)
-- ⚠️ Ignore les erreurs si la table existe déjà
-- À exécuter dans Supabase SQL Editor
-- ============================================================================

-- ============================================
-- TABLE : exhibitor_staff (SAFE VERSION)
-- ============================================

-- 1. Créer la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS exhibitor_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exhibitor_id UUID NOT NULL REFERENCES exhibitors(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  function TEXT,
  email TEXT,
  phone TEXT,
  badge_photo_url TEXT,
  badge_id TEXT UNIQUE NOT NULL,
  badge_printed BOOLEAN DEFAULT false,
  badge_printed_at TIMESTAMPTZ,
  access_level TEXT DEFAULT 'exhibitor',
  is_primary_contact BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Créer les index s'ils n'existent pas
CREATE INDEX IF NOT EXISTS idx_exhibitor_staff_exhibitor 
ON exhibitor_staff(exhibitor_id);

CREATE INDEX IF NOT EXISTS idx_exhibitor_staff_badge 
ON exhibitor_staff(badge_id);

CREATE INDEX IF NOT EXISTS idx_exhibitor_staff_email 
ON exhibitor_staff(email);

-- 3. Créer la fonction updated_at si elle n'existe pas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Supprimer puis recréer le trigger (pour être sûr)
DROP TRIGGER IF EXISTS update_exhibitor_staff_updated_at ON exhibitor_staff;

CREATE TRIGGER update_exhibitor_staff_updated_at
  BEFORE UPDATE ON exhibitor_staff
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Désactiver RLS
ALTER TABLE exhibitor_staff DISABLE ROW LEVEL SECURITY;

-- 6. Vérification finale
SELECT 
  'exhibitor_staff' as table_name,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name = 'exhibitor_staff';

-- Doit afficher : column_count = 17 (ou proche)

-- 7. Vérifier que RLS est désactivé
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'exhibitor_staff';

-- Doit afficher : rowsecurity = false

