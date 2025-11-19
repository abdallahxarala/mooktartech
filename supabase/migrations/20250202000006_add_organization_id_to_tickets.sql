-- ============================================================================
-- Migration : Ajouter organization_id à tickets
-- Date : 2025-02-02
-- Description: Ajoute la colonne organization_id pour isolation multitenant
-- ============================================================================

-- 1. Ajouter la colonne organization_id (nullable temporairement)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tickets' 
    AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE tickets 
    ADD COLUMN organization_id UUID;
    
    RAISE NOTICE 'Colonne organization_id ajoutée';
  ELSE
    RAISE NOTICE 'Colonne organization_id existe déjà';
  END IF;
END $$;

-- 2. Remplir organization_id pour les tickets existants
UPDATE tickets t
SET organization_id = e.organization_id
FROM events e
WHERE t.event_id = e.id
  AND t.organization_id IS NULL;

-- 3. Rendre la colonne NOT NULL (seulement si pas de valeurs NULL)
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count
  FROM tickets
  WHERE organization_id IS NULL;
  
  IF null_count = 0 THEN
    ALTER TABLE tickets 
    ALTER COLUMN organization_id SET NOT NULL;
    
    RAISE NOTICE 'Colonne organization_id rendue NOT NULL';
  ELSE
    RAISE NOTICE 'ATTENTION: % tickets ont organization_id NULL. Corriger avant de rendre NOT NULL.', null_count;
  END IF;
END $$;

-- 4. Ajouter la contrainte de clé étrangère (si elle n'existe pas)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'fk_tickets_organization'
  ) THEN
    ALTER TABLE tickets
    ADD CONSTRAINT fk_tickets_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    ON DELETE CASCADE;
    
    RAISE NOTICE 'Contrainte FK fk_tickets_organization créée';
  ELSE
    RAISE NOTICE 'Contrainte FK fk_tickets_organization existe déjà';
  END IF;
END $$;

-- 5. Créer l'index pour performance
CREATE INDEX IF NOT EXISTS idx_tickets_organization_id 
ON tickets(organization_id);

-- 6. Vérification
SELECT 
  'organization_id ajouté à tickets' as status,
  COUNT(*) as tickets_with_org_id,
  COUNT(CASE WHEN organization_id IS NULL THEN 1 END) as tickets_without_org_id
FROM tickets;

-- 7. Vérifier la structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'tickets'
  AND column_name = 'organization_id';

