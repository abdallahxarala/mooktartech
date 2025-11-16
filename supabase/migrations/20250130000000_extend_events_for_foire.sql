-- ============================================================================
-- Migration: Extend events table for foire support
-- Date: 2025-01-30
-- Description: Add event_type and foire_config columns to support foire events
-- ============================================================================

-- Ajouter colonnes spécifiques foire
ALTER TABLE events 
  ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS foire_config JSONB DEFAULT '{}'::jsonb;

-- Ajouter contrainte CHECK pour event_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'events_event_type_check'
  ) THEN
    ALTER TABLE events 
      ADD CONSTRAINT events_event_type_check 
      CHECK (event_type IN ('standard', 'foire', 'conference', 'exhibition', 'seminar', 'workshop'));
  END IF;
END $$;

-- Index pour recherche rapide par type d'événement
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_type_org ON events(organization_id, event_type);

-- Commentaires pour documentation
COMMENT ON COLUMN events.event_type IS 'Type d''événement: standard, foire, conference, exhibition, etc.';
COMMENT ON COLUMN events.foire_config IS 'Configuration spécifique pour les foires (lieu, zones, pavillons, etc.)';

-- Mettre à jour les événements existants sans type pour les marquer comme 'standard'
UPDATE events 
SET event_type = 'standard' 
WHERE event_type IS NULL;
