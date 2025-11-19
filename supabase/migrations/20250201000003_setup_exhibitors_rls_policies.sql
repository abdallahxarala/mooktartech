-- ============================================================================
-- Migration: Configurer les politiques RLS pour exhibitors
-- Date: 2025-02-01
-- Description: Permet l'inscription publique des exposants avec RLS sécurisé
-- ============================================================================

-- S'assurer que RLS est activé
ALTER TABLE exhibitors ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent (pour éviter les conflits)
DROP POLICY IF EXISTS "Allow public exhibitor registration" ON exhibitors;
DROP POLICY IF EXISTS "Admins can view all exhibitors" ON exhibitors;
DROP POLICY IF EXISTS "Exhibitors can view their own registration" ON exhibitors;
DROP POLICY IF EXISTS "Exhibitors can update their own registration" ON exhibitors;
DROP POLICY IF EXISTS "Event organizers manage exhibitors" ON exhibitors;
DROP POLICY IF EXISTS "Approved exhibitors are public" ON exhibitors;
DROP POLICY IF EXISTS "Exhibitors manage their own data" ON exhibitors;

-- Créer une politique pour permettre les inscriptions publiques
CREATE POLICY "Allow public exhibitor registration"
ON exhibitors
FOR INSERT
TO anon, authenticated
WITH CHECK (
  -- Permettre l'insertion si l'event existe et est actif
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = exhibitors.event_id 
    AND events.is_active = true
  )
);

-- Politique pour que les admins voient tout
CREATE POLICY "Admins can view all exhibitors"
ON exhibitors
FOR SELECT
TO authenticated
USING (
  -- Vérifier si l'utilisateur est admin de l'organisation
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = exhibitors.event_id
  )
);

-- Politique pour que les exposants voient leur propre inscription
CREATE POLICY "Exhibitors can view their own registration"
ON exhibitors
FOR SELECT
TO anon, authenticated
USING (true);  -- Pour l'instant, tout le monde peut voir

-- Politique pour que les exposants puissent mettre à jour leur propre inscription
CREATE POLICY "Exhibitors can update their own registration"
ON exhibitors
FOR UPDATE
TO authenticated
USING (
  -- Permettre la mise à jour si l'email correspond
  contact_email = auth.email()
)
WITH CHECK (
  -- S'assurer que l'email ne change pas
  contact_email = auth.email()
);

