-- ============================================================================
-- Script SQL pour vérifier et compléter la table exhibitors
-- À exécuter dans Supabase SQL Editor
-- ============================================================================

-- 1. Vérifier la structure actuelle
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'exhibitors'
ORDER BY ordinal_position;

-- 2. Ajouter toutes les colonnes manquantes si elles n'existent pas
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

-- 3. Vérifier que toutes les colonnes requises existent
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'id') THEN '✅'
    ELSE '❌'
  END as id,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'event_id') THEN '✅'
    ELSE '❌'
  END as event_id,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'organization_id') THEN '✅'
    ELSE '❌'
  END as organization_id,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'company_name') THEN '✅'
    ELSE '❌'
  END as company_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'slug') THEN '✅'
    ELSE '❌'
  END as slug,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'description') THEN '✅'
    ELSE '❌'
  END as description,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'logo_url') THEN '✅'
    ELSE '❌'
  END as logo_url,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'banner_url') THEN '✅'
    ELSE '❌'
  END as banner_url,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'contact_name') THEN '✅'
    ELSE '❌'
  END as contact_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'contact_email') THEN '✅'
    ELSE '❌'
  END as contact_email,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'contact_phone') THEN '✅'
    ELSE '❌'
  END as contact_phone,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'website') THEN '✅'
    ELSE '❌'
  END as website,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'booth_number') THEN '✅'
    ELSE '❌'
  END as booth_number,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'booth_location') THEN '✅'
    ELSE '❌'
  END as booth_location,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'category') THEN '✅'
    ELSE '❌'
  END as category,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'tags') THEN '✅'
    ELSE '❌'
  END as tags,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'status') THEN '✅'
    ELSE '❌'
  END as status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'payment_status') THEN '✅'
    ELSE '❌'
  END as payment_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'payment_amount') THEN '✅'
    ELSE '❌'
  END as payment_amount,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'currency') THEN '✅'
    ELSE '❌'
  END as currency,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'metadata') THEN '✅'
    ELSE '❌'
  END as metadata,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'created_at') THEN '✅'
    ELSE '❌'
  END as created_at,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exhibitors' AND column_name = 'updated_at') THEN '✅'
    ELSE '❌'
  END as updated_at;

-- 4. Afficher la structure finale complète
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'exhibitors'
ORDER BY ordinal_position;

-- Si vous voyez des ❌, la colonne n'existe pas et doit être créée manuellement

