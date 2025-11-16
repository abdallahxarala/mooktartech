-- ============================================================================
-- Script SQL pour ajouter l'organisation mooktartech.com
-- Version simplifiée avec valeurs fixes
-- ============================================================================

-- Insérer l'organisation mooktartech.com
INSERT INTO organizations (
  name,
  slug,
  plan,
  max_users,
  created_at
)
VALUES (
  'Mooktar Tech',
  'mooktartech-com',
  'pro',
  50,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Vérifier que c'est créé
SELECT id, name, slug, plan, max_users, created_at
FROM organizations 
WHERE slug = 'mooktartech-com';

