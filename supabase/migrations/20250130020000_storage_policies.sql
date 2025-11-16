-- =============================================================================
-- Migration: Storage bucket policies for image uploads
-- Description: Creates storage buckets and policies for image uploads
-- =============================================================================

-- Create storage buckets (if they don't exist)
-- Note: Buckets must be created manually in Supabase Dashboard first
-- This migration only creates policies

-- Policy: Public read access for all buckets
CREATE POLICY IF NOT EXISTS "Public Read Access"
ON storage.objects FOR SELECT
USING (
  bucket_id IN ('avatars', 'cards', 'badges', 'assets')
);

-- Policy: Authenticated users can upload
CREATE POLICY IF NOT EXISTS "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id IN ('avatars', 'cards', 'badges', 'assets')
);

-- Policy: Users can update their own files
CREATE POLICY IF NOT EXISTS "User Update Own Files"
ON storage.objects FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  (
    -- Files in user's folder: <org_id>/<user_id>/...
    (storage.foldername(name))[2] = auth.uid()::text
    OR
    -- Files directly in user folder: <user_id>/...
    (storage.foldername(name))[1] = auth.uid()::text
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND
  (
    (storage.foldername(name))[2] = auth.uid()::text
    OR
    (storage.foldername(name))[1] = auth.uid()::text
  )
);

-- Policy: Users can delete their own files
CREATE POLICY IF NOT EXISTS "User Delete Own Files"
ON storage.objects FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  (
    -- Files in user's folder: <org_id>/<user_id>/...
    (storage.foldername(name))[2] = auth.uid()::text
    OR
    -- Files directly in user folder: <user_id>/...
    (storage.foldername(name))[1] = auth.uid()::text
  )
);

-- Policy: Service role can manage all files (for migrations/cleanup)
CREATE POLICY IF NOT EXISTS "Service Role Full Access"
ON storage.objects FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

comment on policy "Public Read Access" on storage.objects is 'Allows public read access to avatars, cards, badges, and assets buckets';
comment on policy "Authenticated Upload" on storage.objects is 'Allows authenticated users to upload images';
comment on policy "User Update Own Files" on storage.objects is 'Allows users to update their own uploaded files';
comment on policy "User Delete Own Files" on storage.objects is 'Allows users to delete their own uploaded files';
comment on policy "Service Role Full Access" on storage.objects is 'Allows service role to manage all files for migrations and cleanup';

