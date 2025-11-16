-- ============================================================================
-- Migration: Seed data for Foire Dakar 2025
-- Date: 2025-01-30
-- Description: Create organization and event for Foire Internationale de Dakar 2025
-- ============================================================================

-- Créer l'organisation "Foire Internationale de Dakar 2025"
INSERT INTO public.organizations (
  name,
  slug,
  plan,
  max_users
) VALUES (
  'Foire Internationale de Dakar 2025',
  'foire-dakar-2025',
  'pro',
  50
) ON CONFLICT (slug) DO UPDATE
SET 
  name = EXCLUDED.name,
  plan = EXCLUDED.plan,
  max_users = EXCLUDED.max_users;

-- Créer l'événement foire associé
DO $$
DECLARE
  org_id UUID;
  event_id UUID;
BEGIN
  -- Récupérer l'ID de l'organisation
  SELECT id INTO org_id 
  FROM public.organizations 
  WHERE slug = 'foire-dakar-2025' 
  LIMIT 1;

  IF org_id IS NULL THEN
    RAISE EXCEPTION 'Organization foire-dakar-2025 not found';
  END IF;

  -- Insérer l'événement foire
  INSERT INTO public.events (
    organization_id,
    name,
    slug,
    event_type,
    description,
    start_date,
    end_date,
    location,
    location_address,
    status,
    foire_config
  ) VALUES (
    org_id,
    'Foire Internationale de Dakar 2025',
    'foire-dakar-2025',
    'foire',
    'La plus grande foire internationale du Sénégal. Rassemblement de centaines d''exposants locaux et internationaux dans les secteurs de l''agriculture, de l''industrie, des services et de l''innovation.',
    '2025-12-01T08:00:00+00:00'::timestamptz,
    '2025-12-15T18:00:00+00:00'::timestamptz,
    'CICES Dakar',
    'Boulevard du Général de Gaulle, Dakar, Sénégal',
    'published',
    '{
      "lieu": "CICES Dakar",
      "adresse": "Boulevard du Général de Gaulle, Dakar",
      "zones": ["A", "B", "C"],
      "pavillons": {
        "A": {
          "nom": "Pavillon International",
          "capacite": 200,
          "superficie": 5000,
          "description": "Pavillon dédié aux exposants internationaux"
        },
        "B": {
          "nom": "Pavillon Local",
          "capacite": 150,
          "superficie": 4000,
          "description": "Pavillon pour les entreprises sénégalaises"
        },
        "C": {
          "nom": "Pavillon Innovation",
          "capacite": 100,
          "superficie": 3000,
          "description": "Espace dédié aux startups et innovations"
        }
      },
      "superficie_totale": 15000,
      "unite": "m²",
      "horaires": {
        "ouverture": "08:00",
        "fermeture": "18:00",
        "jours": ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
      },
      "contact": {
        "email": "contact@foire-dakar-2025.sn",
        "telephone": "+221 XX XXX XX XX"
      }
    }'::jsonb
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    event_type = EXCLUDED.event_type,
    description = EXCLUDED.description,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    location = EXCLUDED.location,
    location_address = EXCLUDED.location_address,
    status = EXCLUDED.status,
    foire_config = EXCLUDED.foire_config,
    updated_at = NOW()
  RETURNING id INTO event_id;

  RAISE NOTICE 'Foire Dakar 2025 créée avec succès. Event ID: %', event_id;
END $$;

