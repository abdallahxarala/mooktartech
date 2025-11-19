-- ============================================================================
-- Migration: Update Foire Dakar 2025 Pavillons Configuration (Version Corrigée)
-- Date: 2025-01-31
-- Description: Mise à jour séparée de chaque champ avec ajout des tarifs stands
-- ============================================================================

-- ÉTAPE 1 : Mettre à jour les pavillons
UPDATE events
SET foire_config = jsonb_set(
  COALESCE(foire_config, '{}'::jsonb),
  '{pavillons}',
  '{
    "senegal": {
      "nom": "Pavillon Sénégal",
      "code": "SENEGAL",
      "description": "Vitrine des entreprises et produits sénégalais",
      "capacite": 150,
      "superficie": 4000,
      "type": "pavillon_principal"
    },
    "tertiaire": {
      "nom": "Pavillon Tertiaire",
      "code": "TERTIAIRE",
      "description": "Services, banques, assurances, télécoms et secteur tertiaire",
      "capacite": 120,
      "superficie": 3500,
      "type": "pavillon_principal"
    },
    "brun": {
      "nom": "Pavillon Brun",
      "code": "BRUN",
      "description": "Artisanat, décoration et produits traditionnels",
      "capacite": 100,
      "superficie": 3000,
      "type": "pavillon_principal"
    },
    "orange": {
      "nom": "Pavillon Orange",
      "code": "ORANGE",
      "description": "Technologie, innovation et digital",
      "capacite": 80,
      "superficie": 2500,
      "type": "pavillon_principal"
    },
    "vert": {
      "nom": "Pavillon Vert",
      "code": "VERT",
      "description": "Agriculture, environnement et développement durable",
      "capacite": 100,
      "superficie": 3000,
      "type": "pavillon_principal"
    },
    "maroc": {
      "nom": "Pavillon Maroc",
      "code": "MAROC",
      "description": "Pavillon international - Produits et entreprises marocaines",
      "capacite": 80,
      "superficie": 2500,
      "type": "pavillon_international"
    },
    "esplanade_senegal": {
      "nom": "Esplanade Pavillon Sénégal",
      "code": "ESP_SENEGAL",
      "description": "Espace extérieur adjacent au Pavillon Sénégal",
      "capacite": 30,
      "superficie": 1000,
      "type": "esplanade"
    },
    "esplanade_tertiaire": {
      "nom": "Esplanade Pavillon Tertiaire",
      "code": "ESP_TERTIAIRE",
      "description": "Espace extérieur adjacent au Pavillon Tertiaire",
      "capacite": 25,
      "superficie": 800,
      "type": "esplanade"
    },
    "esplanade_brun": {
      "nom": "Esplanade Pavillon Brun",
      "code": "ESP_BRUN",
      "description": "Espace extérieur adjacent au Pavillon Brun",
      "capacite": 25,
      "superficie": 800,
      "type": "esplanade"
    },
    "esplanade_orange": {
      "nom": "Esplanade Pavillon Orange",
      "code": "ESP_ORANGE",
      "description": "Espace extérieur adjacent au Pavillon Orange",
      "capacite": 20,
      "superficie": 600,
      "type": "esplanade"
    },
    "esplanade_vert": {
      "nom": "Esplanade Pavillon Vert",
      "code": "ESP_VERT",
      "description": "Espace extérieur adjacent au Pavillon Vert",
      "capacite": 25,
      "superficie": 800,
      "type": "esplanade"
    },
    "esplanade_maroc": {
      "nom": "Esplanade Pavillon Maroc",
      "code": "ESP_MAROC",
      "description": "Espace extérieur adjacent au Pavillon Maroc",
      "capacite": 20,
      "superficie": 600,
      "type": "esplanade"
    },
    "corniche": {
      "nom": "La Corniche - Espace Restauration",
      "code": "CORNICHE",
      "description": "Zone de restauration et détente avec vue panoramique",
      "capacite": 50,
      "superficie": 2000,
      "type": "espace_restauration"
    }
  }'::jsonb
)
WHERE slug = 'foire-dakar-2025';

-- ÉTAPE 2 : Ajouter les autres infos (superficie, horaires, etc.)
UPDATE events
SET foire_config = jsonb_set(
  foire_config,
  '{superficie_totale}',
  '25100'
)
WHERE slug = 'foire-dakar-2025';

UPDATE events
SET foire_config = jsonb_set(
  foire_config,
  '{unite}',
  '"m²"'
)
WHERE slug = 'foire-dakar-2025';

UPDATE events
SET foire_config = jsonb_set(
  foire_config,
  '{lieu}',
  '"CICES - Centre International du Commerce Extérieur du Sénégal"'
)
WHERE slug = 'foire-dakar-2025';

UPDATE events
SET foire_config = jsonb_set(
  foire_config,
  '{adresse}',
  '"Route de l''Aéroport, VDN, Dakar, Sénégal"'
)
WHERE slug = 'foire-dakar-2025';

UPDATE events
SET foire_config = jsonb_set(
  foire_config,
  '{zones}',
  '["SENEGAL", "TERTIAIRE", "BRUN", "ORANGE", "VERT", "MAROC", "ESPLANADES", "CORNICHE"]'::jsonb
)
WHERE slug = 'foire-dakar-2025';

UPDATE events
SET foire_config = jsonb_set(
  foire_config,
  '{horaires}',
  '{
    "ouverture": "09:00",
    "fermeture": "19:00",
    "jours": ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
  }'::jsonb
)
WHERE slug = 'foire-dakar-2025';

UPDATE events
SET foire_config = jsonb_set(
  foire_config,
  '{contact}',
  '{
    "email": "contact@foire-dakar.com",
    "telephone": "+221 77 539 81 39",
    "whatsapp": "+221 77 539 81 39"
  }'::jsonb
)
WHERE slug = 'foire-dakar-2025';

UPDATE events
SET foire_config = jsonb_set(
  foire_config,
  '{tarifs_stands}',
  '{
    "pavillon_principal": {
      "standard_6m2": 250000,
      "standard_9m2": 350000,
      "premium_12m2": 500000
    },
    "esplanade": {
      "standard_6m2": 150000,
      "standard_9m2": 200000
    },
    "corniche": {
      "emplacement_restauration": 300000
    }
  }'::jsonb
)
WHERE slug = 'foire-dakar-2025';

-- ÉTAPE 3 : Vérifier le résultat
SELECT 
  name,
  slug,
  foire_config->'pavillons' as pavillons,
  foire_config->'superficie_totale' as superficie_totale,
  foire_config->'lieu' as lieu,
  foire_config->'horaires' as horaires,
  foire_config->'tarifs_stands' as tarifs_stands
FROM events 
WHERE slug = 'foire-dakar-2025';

