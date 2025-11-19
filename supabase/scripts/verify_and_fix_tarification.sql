-- ============================================================================
-- Script: Vérifier et corriger la configuration tarifaire Foire Dakar 2025
-- Date: 2025-01-31
-- Description: Vérifie l'existence de la tarification et la crée/mettre à jour si nécessaire
-- Usage: Exécuter dans Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- ÉTAPE 1: Vérifier l'état actuel de la configuration
-- ============================================================================
SELECT 
  name,
  foire_config->'tarification' as tarification,
  CASE 
    WHEN foire_config->'tarification' IS NULL THEN '❌ Tarification manquante'
    WHEN (foire_config->'tarification')::text = 'null' THEN '❌ Tarification NULL'
    WHEN jsonb_typeof(foire_config->'tarification') = 'object' THEN '✅ Tarification présente'
    ELSE '⚠️ Format inattendu'
  END as statut
FROM events 
WHERE slug = 'foire-dakar-2025';

-- ============================================================================
-- ÉTAPE 2: Créer/Mettre à jour la configuration tarifaire
-- ============================================================================
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
  }'::jsonb,
  true  -- Créer la clé si elle n'existe pas
)
WHERE slug = 'foire-dakar-2025';

-- ============================================================================
-- ÉTAPE 3: Vérifier le résultat après mise à jour
-- ============================================================================
SELECT 
  name,
  foire_config->'tarification'->'prix_m2' as prix_m2,
  foire_config->'tarification'->'tva_pourcent' as tva_pourcent,
  foire_config->'tarification'->'devise' as devise,
  foire_config->'tarification'->'tailles_disponibles' as tailles_disponibles,
  jsonb_object_keys(foire_config->'tarification'->'options_meubles') as meubles_disponibles
FROM events 
WHERE slug = 'foire-dakar-2025';

-- ============================================================================
-- ÉTAPE 4: Afficher les détails complets de la tarification
-- ============================================================================
SELECT 
  name,
  jsonb_pretty(foire_config->'tarification') as tarification_complete
FROM events 
WHERE slug = 'foire-dakar-2025';

