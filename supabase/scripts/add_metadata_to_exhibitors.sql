-- ============================================================================
-- Script SQL pour ajouter la colonne metadata à la table exhibitors
-- À exécuter dans Supabase SQL Editor
-- ============================================================================

-- Ajouter la colonne metadata si elle n'existe pas
ALTER TABLE exhibitors 
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Vérification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'exhibitors' 
  AND column_name = 'metadata';

-- Tester l'insertion
SELECT 
  id,
  company_name,
  metadata
FROM exhibitors
LIMIT 1;

