-- ============================================================================
-- MIGRATIONS FOIRE DAKAR 2025 - VERSION FINALE CORRIGÉE
-- Compatible avec votre schéma exact (sans contraintes uniques)
-- ============================================================================

-- ============================================================================
-- MIGRATION 1: Extend events table for foire support
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


-- ============================================================================
-- MIGRATION 2: Seed Foire Internationale de Dakar 2025
-- VERSION FINALE - Avec vérifications conditionnelles
-- ============================================================================

-- Créer l'organisation "Foire Internationale de Dakar 2025" si elle n'existe pas
DO $$
DECLARE
  org_exists BOOLEAN;
  org_id UUID;
BEGIN
  -- Vérifier si l'organisation existe déjà
  SELECT EXISTS(
    SELECT 1 FROM organizations WHERE slug = 'foire-dakar-2025'
  ) INTO org_exists;

  IF NOT org_exists THEN
    -- Créer l'organisation
    INSERT INTO organizations (
      name,
      slug,
      plan,
      max_users,
      created_at
    )
    VALUES (
      'Foire Internationale de Dakar 2025',
      'foire-dakar-2025',
      'pro',
      50,
      NOW()
    )
    RETURNING id INTO org_id;
    
    RAISE NOTICE '✅ Organisation "Foire Dakar 2025" créée avec ID: %', org_id;
  ELSE
    -- Récupérer l'ID de l'organisation existante
    SELECT id INTO org_id FROM organizations WHERE slug = 'foire-dakar-2025';
    RAISE NOTICE '✅ Organisation "Foire Dakar 2025" existe déjà avec ID: %', org_id;
  END IF;
END $$;

-- Créer l'événement foire s'il n'existe pas
DO $$
DECLARE
  event_exists BOOLEAN;
  event_id UUID;
  org_id UUID;
BEGIN
  -- Récupérer l'ID de l'organisation
  SELECT id INTO org_id FROM organizations WHERE slug = 'foire-dakar-2025';
  
  IF org_id IS NULL THEN
    RAISE EXCEPTION '❌ Organisation "foire-dakar-2025" introuvable';
  END IF;

  -- Vérifier si l'événement existe déjà
  SELECT EXISTS(
    SELECT 1 FROM events 
    WHERE organization_id = org_id AND slug = 'foire-dakar-2025'
  ) INTO event_exists;

  IF NOT event_exists THEN
    -- Créer l'événement
    INSERT INTO events (
      organization_id,
      name,
      slug,
      event_type,
      description,
      start_date,
      end_date,
      status,
      foire_config,
      created_at
    )
    VALUES (
      org_id,
      'Foire Internationale de Dakar 2025',
      'foire-dakar-2025',
      'foire',
      'La plus grande foire internationale du Sénégal. Découvrez des centaines d''exposants, des produits locaux et internationaux, et participez à des événements exceptionnels.',
      '2025-12-01T08:00:00+00:00'::timestamptz,
      '2025-12-15T18:00:00+00:00'::timestamptz,
      'published',
      jsonb_build_object(
        'lieu', 'CICES Dakar',
        'adresse', 'Route de l''Aéroport, Dakar, Sénégal',
        'capacite_totale', 500,
        'horaires', jsonb_build_object(
          'lundi_vendredi', '09:00 - 19:00',
          'samedi_dimanche', '10:00 - 20:00'
        ),
        'pavillons', jsonb_build_array(
          jsonb_build_object(
            'nom', 'Pavillon A - Agriculture & Alimentation',
            'zone', 'A',
            'capacite_stands', 100,
            'categories', jsonb_build_array(
              'Alimentation',
              'Agriculture',
              'Agroalimentaire',
              'Produits Bio'
            ),
            'description', 'Découvrez les richesses agricoles et alimentaires du Sénégal et de la région'
          ),
          jsonb_build_object(
            'nom', 'Pavillon B - Artisanat & Mode',
            'zone', 'B',
            'capacite_stands', 80,
            'categories', jsonb_build_array(
              'Artisanat',
              'Mode & Textile',
              'Cosmétiques',
              'Bijoux'
            ),
            'description', 'L''excellence de l''artisanat sénégalais et de la mode africaine'
          ),
          jsonb_build_object(
            'nom', 'Pavillon C - Technologie & Innovation',
            'zone', 'C',
            'capacite_stands', 60,
            'categories', jsonb_build_array(
              'Électronique',
              'Technologie',
              'Services',
              'Innovation'
            ),
            'description', 'Les dernières innovations technologiques et services digitaux'
          )
        ),
        'services', jsonb_build_array(
          'Restauration sur place',
          'Wifi gratuit',
          'Parking sécurisé',
          'Garde d''enfants',
          'Espace VIP',
          'Service de livraison'
        ),
        'contact', jsonb_build_object(
          'email', 'contact@foire-dakar.sn',
          'telephone', '+221 33 123 45 67',
          'whatsapp', '+221 77 123 45 67',
          'site_web', 'https://foire-dakar.sn'
        )
      ),
      NOW()
    )
    RETURNING id INTO event_id;
    
    RAISE NOTICE '✅ Événement "Foire Dakar 2025" créé avec ID: %', event_id;
  ELSE
    -- Mettre à jour l'événement existant
    UPDATE events 
    SET 
      name = 'Foire Internationale de Dakar 2025',
      event_type = 'foire',
      description = 'La plus grande foire internationale du Sénégal. Découvrez des centaines d''exposants, des produits locaux et internationaux, et participez à des événements exceptionnels.',
      start_date = '2025-12-01T08:00:00+00:00'::timestamptz,
      end_date = '2025-12-15T18:00:00+00:00'::timestamptz,
      status = 'published',
      foire_config = jsonb_build_object(
        'lieu', 'CICES Dakar',
        'adresse', 'Route de l''Aéroport, Dakar, Sénégal',
        'capacite_totale', 500,
        'horaires', jsonb_build_object(
          'lundi_vendredi', '09:00 - 19:00',
          'samedi_dimanche', '10:00 - 20:00'
        ),
        'pavillons', jsonb_build_array(
          jsonb_build_object(
            'nom', 'Pavillon A - Agriculture & Alimentation',
            'zone', 'A',
            'capacite_stands', 100,
            'categories', jsonb_build_array(
              'Alimentation',
              'Agriculture',
              'Agroalimentaire',
              'Produits Bio'
            ),
            'description', 'Découvrez les richesses agricoles et alimentaires du Sénégal et de la région'
          ),
          jsonb_build_object(
            'nom', 'Pavillon B - Artisanat & Mode',
            'zone', 'B',
            'capacite_stands', 80,
            'categories', jsonb_build_array(
              'Artisanat',
              'Mode & Textile',
              'Cosmétiques',
              'Bijoux'
            ),
            'description', 'L''excellence de l''artisanat sénégalais et de la mode africaine'
          ),
          jsonb_build_object(
            'nom', 'Pavillon C - Technologie & Innovation',
            'zone', 'C',
            'capacite_stands', 60,
            'categories', jsonb_build_array(
              'Électronique',
              'Technologie',
              'Services',
              'Innovation'
            ),
            'description', 'Les dernières innovations technologiques et services digitaux'
          )
        ),
        'services', jsonb_build_array(
          'Restauration sur place',
          'Wifi gratuit',
          'Parking sécurisé',
          'Garde d''enfants',
          'Espace VIP',
          'Service de livraison'
        ),
        'contact', jsonb_build_object(
          'email', 'contact@foire-dakar.sn',
          'telephone', '+221 33 123 45 67',
          'whatsapp', '+221 77 123 45 67',
          'site_web', 'https://foire-dakar.sn'
        )
      )
    WHERE organization_id = org_id AND slug = 'foire-dakar-2025'
    RETURNING id INTO event_id;
    
    RAISE NOTICE '✅ Événement "Foire Dakar 2025" mis à jour avec ID: %', event_id;
  END IF;
END $$;


-- ============================================================================
-- VÉRIFICATIONS POST-MIGRATION
-- ============================================================================

-- Vérifier que les colonnes sont bien ajoutées
DO $$
DECLARE
  col_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns 
  WHERE table_name = 'events' 
    AND column_name IN ('event_type', 'foire_config');
  
  IF col_count = 2 THEN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Migration 1 réussie: Colonnes event_type et foire_config ajoutées';
  ELSE
    RAISE WARNING '⚠️ Migration 1: Seulement % colonne(s) ajoutée(s)', col_count;
  END IF;
END $$;

-- Afficher un résumé de la configuration
DO $$
DECLARE
  org_id UUID;
  org_name TEXT;
  event_id UUID;
  event_name TEXT;
  start_date DATE;
  end_date DATE;
  lieu TEXT;
  nb_pavillons INTEGER;
BEGIN
  -- Récupérer les infos
  SELECT o.id, o.name INTO org_id, org_name
  FROM organizations o
  WHERE o.slug = 'foire-dakar-2025';
  
  SELECT 
    e.id, 
    e.name, 
    e.start_date::date, 
    e.end_date::date, 
    e.foire_config->>'lieu',
    jsonb_array_length(e.foire_config->'pavillons')
  INTO event_id, event_name, start_date, end_date, lieu, nb_pavillons
  FROM events e
  WHERE e.slug = 'foire-dakar-2025';
  
  -- Afficher le résumé
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '🎉 CONFIGURATION TERMINÉE AVEC SUCCÈS !';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Organisation';
  RAISE NOTICE '   ID   : %', org_id;
  RAISE NOTICE '   Nom  : %', org_name;
  RAISE NOTICE '';
  RAISE NOTICE '🎪 Événement Foire';
  RAISE NOTICE '   ID         : %', event_id;
  RAISE NOTICE '   Nom        : %', event_name;
  RAISE NOTICE '   Type       : foire';
  RAISE NOTICE '   Dates      : % → %', start_date, end_date;
  RAISE NOTICE '   Lieu       : %', lieu;
  RAISE NOTICE '   Pavillons  : %', nb_pavillons;
  RAISE NOTICE '';
  RAISE NOTICE '✅ Prochaines étapes:';
  RAISE NOTICE '   1. Exécutez: npm install openai';
  RAISE NOTICE '   2. Exécutez: npm run db:generate';
  RAISE NOTICE '   3. Exécutez: npm run seed:foire';
  RAISE NOTICE '   4. Démarrez: npm run dev';
  RAISE NOTICE '   5. Visitez: http://localhost:3000/org/foire-dakar-2025/foires';
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
END $$;
