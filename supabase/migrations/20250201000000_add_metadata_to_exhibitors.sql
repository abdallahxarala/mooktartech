-- Migration: Ajouter la colonne metadata à la table exhibitors
-- Date: 2025-02-01
-- Description: Ajoute une colonne JSONB metadata pour stocker des données supplémentaires des exposants

-- Ajouter la colonne metadata si elle n'existe pas
ALTER TABLE exhibitors 
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN exhibitors.metadata IS 'Données supplémentaires au format JSON pour les exposants (ex: réseaux sociaux, certifications, etc.)';

-- Vérification
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'exhibitors' 
  AND column_name = 'metadata';

-- Tester l'insertion (optionnel - décommentez pour tester)
-- SELECT 
--   id,
--   company_name,
--   metadata
-- FROM exhibitors
-- LIMIT 1;

