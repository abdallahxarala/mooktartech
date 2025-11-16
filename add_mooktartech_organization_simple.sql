-- ============================================================================
-- Script SQL pour ajouter l'organisation mooktartech.com
-- À exécuter dans Supabase Dashboard > SQL Editor
-- ============================================================================

DO $$
DECLARE
  xarala_plan TEXT;
  xarala_max_users INT;
  xarala_logo_url TEXT;
  org_id UUID;
BEGIN
  -- Récupérer les paramètres de xarala-solutions
  SELECT plan, max_users, logo_url
  INTO xarala_plan, xarala_max_users, xarala_logo_url
  FROM public.organizations
  WHERE slug = 'xarala-solutions'
  LIMIT 1;
  
  -- Si xarala-solutions n'existe pas, utiliser des valeurs par défaut
  IF xarala_plan IS NULL THEN
    xarala_plan := 'pro';
    xarala_max_users := 50;
  END IF;
  
  -- Insérer l'organisation mooktartech.com
  INSERT INTO public.organizations (
    name,
    slug,
    logo_url,
    plan,
    max_users,
    created_at
  )
  VALUES (
    'Mooktar Tech',
    'mooktartech-com',
    xarala_logo_url,
    xarala_plan,
    xarala_max_users,
    NOW()
  )
  ON CONFLICT (slug) DO UPDATE
  SET 
    name = EXCLUDED.name,
    plan = EXCLUDED.plan,
    max_users = EXCLUDED.max_users,
    logo_url = COALESCE(EXCLUDED.logo_url, organizations.logo_url)
  RETURNING id INTO org_id;
  
  -- Message de confirmation
  RAISE NOTICE '✅ Organisation "Mooktar Tech" créée avec succès!';
  RAISE NOTICE '   - ID: %', org_id;
  RAISE NOTICE '   - Slug: mooktartech-com';
  RAISE NOTICE '   - Plan: %', xarala_plan;
  RAISE NOTICE '   - Max users: %', xarala_max_users;
END $$;

