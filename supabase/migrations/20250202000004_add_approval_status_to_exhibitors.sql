-- ============================================================================
-- Migration: Ajouter colonne approval_status à la table exhibitors
-- Date: 2025-02-02
-- Description: Ajoute la colonne approval_status pour gérer l'approbation des exposants
-- ============================================================================

-- 1. Ajouter la colonne approval_status si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exhibitors' 
    AND column_name = 'approval_status'
  ) THEN
    ALTER TABLE exhibitors 
    ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (approval_status IN ('pending', 'approved', 'rejected'));
    
    RAISE NOTICE 'Colonne approval_status ajoutée avec succès';
  ELSE
    RAISE NOTICE 'Colonne approval_status existe déjà';
  END IF;
END $$;

-- 2. Ajouter un index pour les recherches par statut
CREATE INDEX IF NOT EXISTS idx_exhibitors_approval_status 
ON exhibitors(approval_status);

-- 3. Mettre à jour les exposants existants (si nécessaire)
-- Par défaut, tous sont 'pending'
UPDATE exhibitors
SET approval_status = 'pending'
WHERE approval_status IS NULL;

-- 4. Si la colonne 'status' existe et contient des valeurs d'approbation, migrer vers approval_status
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exhibitors' 
    AND column_name = 'status'
  ) THEN
    -- Migrer les valeurs de status vers approval_status si elles correspondent
    UPDATE exhibitors
    SET approval_status = CASE 
      WHEN status = 'approved' THEN 'approved'
      WHEN status = 'rejected' THEN 'rejected'
      WHEN status = 'pending' THEN 'pending'
      ELSE 'pending'
    END
    WHERE approval_status = 'pending' 
      AND status IN ('approved', 'rejected', 'pending');
    
    RAISE NOTICE 'Migration des valeurs de status vers approval_status effectuée';
  END IF;
END $$;

-- 5. Commentaires
COMMENT ON COLUMN exhibitors.approval_status IS 
'Statut d''approbation de l''exposant : pending (en attente), approved (approuvé), rejected (rejeté)';

-- 6. Vérification
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  (SELECT check_clause FROM information_schema.check_constraints 
   WHERE constraint_name LIKE '%approval_status%' LIMIT 1) as check_constraint
FROM information_schema.columns
WHERE table_name = 'exhibitors'
  AND column_name = 'approval_status';

