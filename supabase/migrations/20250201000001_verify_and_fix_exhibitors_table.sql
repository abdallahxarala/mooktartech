-- ============================================================================
-- Migration: Vérifier et compléter la table exhibitors
-- Date: 2025-02-01
-- Description: Ajoute les colonnes manquantes à la table exhibitors selon les types TypeScript
-- ============================================================================

-- Ajouter toutes les colonnes manquantes si elles n'existent pas
DO $$ 
BEGIN
  -- Ajouter metadata si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exhibitors' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE exhibitors ADD COLUMN metadata JSONB;
    COMMENT ON COLUMN exhibitors.metadata IS 'Additional data like stand configuration, furniture options, pricing details';
  END IF;

  -- Ajouter currency si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exhibitors' AND column_name = 'currency'
  ) THEN
    ALTER TABLE exhibitors ADD COLUMN currency TEXT DEFAULT 'XOF';
    COMMENT ON COLUMN exhibitors.currency IS 'Currency code (XOF, EUR, USD, etc.)';
  END IF;

  -- Ajouter contact_phone si elle n'existe pas (peut être NULL)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exhibitors' AND column_name = 'contact_phone'
  ) THEN
    ALTER TABLE exhibitors ADD COLUMN contact_phone TEXT;
  END IF;

  -- Ajouter contact_name si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exhibitors' AND column_name = 'contact_name'
  ) THEN
    ALTER TABLE exhibitors ADD COLUMN contact_name TEXT;
  END IF;

  -- S'assurer que created_at existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exhibitors' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE exhibitors ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  -- S'assurer que updated_at existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exhibitors' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE exhibitors ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

