-- ============================================================================
-- Migration: Update Foire Dakar 2025 Tarification
-- Date: 2025-01-31
-- Description: Mise à jour de la tarification au m² avec options de mobilier
-- ============================================================================

-- Mise à jour de la tarification au m²
UPDATE events
SET foire_config = jsonb_set(
  foire_config,
  '{tarification}',
  '{
    "prix_m2": 50000,
    "tva_pourcent": 18,
    "devise": "FCFA",
    "tailles_disponibles": [6, 9, 12, 15, 18],
    "options_meubles": {
      "table_presentation": {
        "nom": "Table de présentation",
        "description": "Table 180x80cm avec nappe",
        "prix_unitaire": 15000,
        "quantite_max": 5
      },
      "vitrine_verre": {
        "nom": "Vitrine en verre",
        "description": "Vitrine sécurisée 100x50x180cm",
        "prix_unitaire": 75000,
        "quantite_max": 3
      },
      "chaise": {
        "nom": "Chaise",
        "description": "Chaise pliante",
        "prix_unitaire": 3000,
        "quantite_max": 10
      },
      "comptoir_accueil": {
        "nom": "Comptoir d''accueil",
        "description": "Comptoir avec rangements",
        "prix_unitaire": 50000,
        "quantite_max": 1
      },
      "spot_led": {
        "nom": "Spot LED",
        "description": "Éclairage LED orientable",
        "prix_unitaire": 8000,
        "quantite_max": 6
      },
      "presentoir_mural": {
        "nom": "Présentoir mural",
        "description": "Présentoir suspendu 2m",
        "prix_unitaire": 25000,
        "quantite_max": 4
      }
    }
  }'::jsonb
)
WHERE slug = 'foire-dakar-2025';

-- Supprimer l'ancienne tarification
UPDATE events
SET foire_config = foire_config - 'tarifs_stands'
WHERE slug = 'foire-dakar-2025';

-- Vérification
SELECT 
  name,
  foire_config->'tarification' as tarification
FROM events 
WHERE slug = 'foire-dakar-2025';

