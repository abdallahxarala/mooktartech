-- ============================================================================
-- Script simple: Vérifier et corriger la configuration tarifaire
-- Foire Dakar 2025
-- ============================================================================
-- Usage: Copier-coller dans Supabase SQL Editor et exécuter
-- ============================================================================

-- 1. Vérifier si la config existe
SELECT 
  name,
  foire_config->'tarification' as tarification
FROM events 
WHERE slug = 'foire-dakar-2025';

-- 2. Si NULL ou vide, créer la config
UPDATE events
SET foire_config = jsonb_set(
  COALESCE(foire_config, '{}'::jsonb),
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
        "nom": "Comptoir d accueil",
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

-- 3. Vérifier le résultat
SELECT 
  name,
  foire_config->'tarification'->'prix_m2' as prix_m2,
  foire_config->'tarification'->'tva_pourcent' as tva,
  foire_config->'tarification'->'tailles_disponibles' as tailles
FROM events 
WHERE slug = 'foire-dakar-2025';

