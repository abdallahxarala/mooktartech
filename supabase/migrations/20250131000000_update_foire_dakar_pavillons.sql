-- ============================================================================
-- Migration: Update Foire Dakar 2025 Pavillons Configuration
-- Date: 2025-01-31
-- Description: Mise à jour de la configuration des pavillons avec la nouvelle structure
-- ============================================================================

-- Mettre à jour les pavillons dans foire_config
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

-- Ajouter aussi la superficie totale et autres infos
UPDATE events
SET foire_config = foire_config || '{
  "superficie_totale": 25100,
  "unite": "m²",
  "lieu": "CICES - Centre International du Commerce Extérieur du Sénégal",
  "adresse": "Route de l''Aéroport, VDN, Dakar, Sénégal",
  "zones": [
    "SENEGAL",
    "TERTIAIRE",
    "BRUN",
    "ORANGE",
    "VERT",
    "MAROC",
    "ESP_SENEGAL",
    "ESP_TERTIAIRE",
    "ESP_BRUN",
    "ESP_ORANGE",
    "ESP_VERT",
    "ESP_MAROC",
    "CORNICHE"
  ],
  "horaires": {
    "ouverture": "09:00",
    "fermeture": "19:00",
    "jours": [
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
      "dimanche"
    ]
  },
  "contact": {
    "email": "contact@foire-dakar.sn",
    "telephone": "+221 33 123 45 67",
    "whatsapp": "+221 77 123 45 67",
    "site_web": "https://foire-dakar.sn"
  }
}'::jsonb
WHERE slug = 'foire-dakar-2025';

-- Vérification
DO $$
DECLARE
  pavillons_count INTEGER;
  superficie_totale INTEGER;
BEGIN
  -- Compter les pavillons
  SELECT COUNT(*) INTO pavillons_count
  FROM jsonb_object_keys(
    (SELECT foire_config->'pavillons' FROM events WHERE slug = 'foire-dakar-2025')
  );

  -- Récupérer la superficie totale
  SELECT (foire_config->>'superficie_totale')::INTEGER INTO superficie_totale
  FROM events
  WHERE slug = 'foire-dakar-2025';

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '✅ Mise à jour des pavillons terminée avec succès !';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Statistiques :';
  RAISE NOTICE '   - Nombre de pavillons/esplanades : %', pavillons_count;
  RAISE NOTICE '   - Superficie totale : % m²', superficie_totale;
  RAISE NOTICE '';
  RAISE NOTICE '✅ Configuration prête pour la Foire Dakar 2025';
  RAISE NOTICE '';
END $$;

