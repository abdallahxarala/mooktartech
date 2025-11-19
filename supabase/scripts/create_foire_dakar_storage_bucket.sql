-- Script pour créer le bucket Supabase Storage pour les documents Foire Dakar 2025
-- À exécuter dans Supabase Dashboard > Storage

-- 1. Créer le bucket (si n'existe pas déjà)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'foire-dakar-documents',
  'foire-dakar-documents',
  true, -- Public pour permettre le téléchargement des factures
  5242880, -- 5MB en bytes
  ARRAY['application/pdf'] -- Seulement PDF
)
ON CONFLICT (id) DO NOTHING;

-- 2. Politique RLS : Permettre la lecture publique des factures
CREATE POLICY IF NOT EXISTS "Public can read invoices"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'foire-dakar-documents' 
  AND (storage.foldername(name))[1] = 'invoices'
);

-- 3. Politique RLS : Permettre l'upload aux admins et exposants
CREATE POLICY IF NOT EXISTS "Admins can upload invoices"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'foire-dakar-documents'
  AND auth.role() = 'service_role' -- Service role pour uploads automatiques
);

-- 4. Politique RLS : Permettre la mise à jour aux admins
CREATE POLICY IF NOT EXISTS "Admins can update invoices"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'foire-dakar-documents'
  AND auth.role() = 'service_role'
);

-- 5. Politique RLS : Permettre la suppression aux admins
CREATE POLICY IF NOT EXISTS "Admins can delete invoices"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'foire-dakar-documents'
  AND auth.role() = 'service_role'
);

-- 6. Vérifier que le bucket est créé
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id = 'foire-dakar-documents';

-- Résultat attendu :
-- id                      | name                    | public | file_size_limit | allowed_mime_types | created_at
-- ------------------------+-------------------------+--------+-----------------+---------------------+------------
-- foire-dakar-documents   | foire-dakar-documents   | true   | 5242880         | {application/pdf}   | 2025-02-...
