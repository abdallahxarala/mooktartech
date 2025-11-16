# Image Storage Migration Guide

## Overview

This guide documents the migration from base64/localStorage image handling to Supabase Storage for all editors (NFC editor, card designer, badge editor).

## Architecture

### Before
```
File → FileReader → base64 → localStorage/State → Database (as text)
```

### After
```
File → Compression → Supabase Storage → URL → Database (as URL)
```

## Storage Structure

Images are stored in Supabase Storage buckets with the following structure:

```
<bucket>/
  <organization_id>/
    <user_id>/
      <feature>/
        <timestamp>-<sanitized-filename>.webp
```

### Buckets

- **`avatars`** - User profile pictures (400x400px max)
- **`cards`** - Card images (logos, backgrounds, photos) (1920x1920px max)
- **`badges`** - Badge images (logos, covers) (1920x1920px max)
- **`assets`** - General assets (default)

### Features

- `avatar` - Profile pictures
- `logo` - Company/product logos
- `background` - Background images
- `cover` - Cover images
- `photo` - General photos
- `badge` - Badge-specific images

## Implementation

### 1. Storage Utilities

**File:** `lib/supabase/storage.ts`

Provides:
- `uploadImage()` - Client-side upload with compression
- `deleteImage()` - Client-side deletion
- `getSignedUrl()` - Server-side signed URLs for private buckets
- `uploadImageServer()` - Server-side upload

### 2. React Hooks

**File:** `hooks/use-image-upload.ts`

Provides:
- `useImageUpload()` - Generic image upload hook
- `useAvatarUpload()` - Avatar-specific hook (400x400px, 90% quality)
- `useCardImageUpload()` - Card image hook (1920x1920px)

### 3. UI Components

**File:** `components/ui/image-upload.tsx`

Reusable `ImageUpload` component with:
- Drag & drop support
- Preview
- Progress indicator
- Error handling
- Next.js Image optimization

## Usage Examples

### Basic Upload

```typescript
import { useImageUpload } from '@/hooks/use-image-upload'

function MyComponent() {
  const { upload, isUploading, uploadedUrl } = useImageUpload({
    bucket: 'cards',
    feature: 'logo',
    maxWidth: 1920,
    maxHeight: 1920
  })

  const handleFileSelect = async (file: File) => {
    const result = await upload(file)
    if (result) {
      console.log('Uploaded:', result.url)
    }
  }

  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleFileSelect(e.target.files?.[0]!)}
    />
  )
}
```

### Using ImageUpload Component

```typescript
import { ImageUpload } from '@/components/ui/image-upload'

function MyForm() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  return (
    <ImageUpload
      value={avatarUrl}
      onChange={setAvatarUrl}
      bucket="avatars"
      feature="avatar"
      aspectRatio="square"
      showPreview={true}
    />
  )
}
```

### NFC Editor (Refactored)

The NFC editor now uses Supabase Storage:

```typescript
// components/nfc-wizard/image-upload.tsx
<ImageUpload
  label="Photo de profil"
  value={profile.avatar}
  onChange={(url) => update({ avatar: url })}
  feature="avatar"  // Uses avatars bucket
  aspectRatio="circle"
/>
```

## Image Optimization

### Compression

All images are automatically:
- Resized to max dimensions (maintains aspect ratio)
- Converted to WebP format (if supported)
- Compressed with configurable quality (default: 85%)

### Quality Settings

- **Avatars**: 90% quality, 400x400px max
- **Card images**: 85% quality, 1920x1920px max
- **Badge images**: 85% quality, 1920x1920px max

### Browser Support

- WebP conversion uses browser Canvas API
- Falls back to original format if WebP not supported
- Progressive enhancement

## Database Schema

### virtual_cards table

```sql
avatar_url TEXT,      -- Now stores Supabase Storage URL
logo_url TEXT,        -- Now stores Supabase Storage URL
background_image TEXT  -- Now stores Supabase Storage URL
```

### Before Migration

```typescript
// Stored as base64
avatar: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
```

### After Migration

```typescript
// Stored as URL
avatar: "https://<project>.supabase.co/storage/v1/object/public/avatars/org/user/avatar/1234567890-photo.webp"
```

## Migration Steps

### 1. Create Storage Buckets

In Supabase Dashboard:
1. Go to Storage
2. Create buckets: `avatars`, `cards`, `badges`, `assets`
3. Set public access policies:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('avatars', 'cards', 'badges', 'assets'));

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id IN ('avatars', 'cards', 'badges', 'assets')
);

-- Allow users to delete their own files
CREATE POLICY "User Delete Own Files"
ON storage.objects FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 2. Update Components

Replace base64 handling with Supabase Storage:

**Before:**
```typescript
const reader = new FileReader()
reader.readAsDataURL(file)
reader.onload = (e) => {
  setImage(e.target.result as string) // base64
}
```

**After:**
```typescript
const { upload } = useImageUpload({ feature: 'avatar' })
const result = await upload(file)
if (result) {
  setImage(result.url) // Supabase Storage URL
}
```

### 3. Migrate Existing Data

For existing base64 images in database:

```typescript
// Migration script (one-time)
async function migrateBase64ToStorage(base64: string) {
  // Convert base64 to blob
  const blob = await fetch(base64).then(r => r.blob())
  const file = new File([blob], 'migrated.jpg', { type: blob.type })
  
  // Upload to Supabase
  const { upload } = useImageUpload({ feature: 'avatar' })
  const result = await upload(file)
  
  return result?.url
}
```

## Extending to Other Editors

### Card Designer

**File:** `components/card-editor/editor.tsx`

**Current:**
```typescript
const handleImageUpload = async (type: "photo" | "logo", file: File) => {
  const reader = new FileReader()
  reader.readAsDataURL(file) // base64
  setCardData(prev => ({ ...prev, [type]: reader.result }))
}
```

**Refactored:**
```typescript
import { useCardImageUpload } from '@/hooks/use-image-upload'

const logoUpload = useCardImageUpload('logo')
const photoUpload = useCardImageUpload('photo')

const handleImageUpload = async (type: "photo" | "logo", file: File) => {
  const uploadHook = type === 'logo' ? logoUpload : photoUpload
  const result = await uploadHook.upload(file)
  if (result) {
    setCardData(prev => ({ ...prev, [type]: result.url }))
  }
}
```

### Badge Editor

**File:** `components/badge-editor/design/...`

Similar pattern:
1. Replace base64 with Supabase Storage URLs
2. Use `useCardImageUpload('badge')` or `useImageUpload({ feature: 'badge', bucket: 'badges' })`
3. Update database schema to store URLs instead of base64

## Performance Benefits

### Before (base64)
- **Storage**: ~33% larger than original (base64 encoding overhead)
- **Database**: Large text fields, slower queries
- **Bandwidth**: Full image sent on every page load
- **Cache**: No browser caching

### After (Supabase Storage)
- **Storage**: Optimized WebP, ~70% smaller
- **Database**: Small URL strings, fast queries
- **Bandwidth**: CDN caching, optimized delivery
- **Cache**: Browser + CDN caching

## Cost Optimization

1. **Compression**: Reduces storage costs by ~70%
2. **WebP**: Better compression than JPEG/PNG
3. **CDN**: Supabase Storage includes CDN
4. **Cleanup**: Delete unused images periodically

## Security

### Public Buckets
- Images are publicly accessible via URL
- Use signed URLs for private images if needed

### Private Buckets (Future)
- Use `getSignedUrl()` for temporary access
- Set expiration times
- Implement access control policies

## Troubleshooting

### Upload Fails

1. Check bucket exists and is public
2. Verify user is authenticated
3. Check file size limits (10MB default)
4. Review browser console for errors

### Images Not Loading

1. Verify URL format
2. Check bucket public access policy
3. Verify file exists in Storage dashboard
4. Check CORS settings

### Performance Issues

1. Enable image compression
2. Use appropriate max dimensions
3. Consider lazy loading
4. Use Next.js Image component

## Next Steps

1. ✅ NFC Editor avatar upload (completed)
2. ⏳ Card Designer logo/photo upload
3. ⏳ Badge Editor image upload
4. ⏳ User profile avatar upload
5. ⏳ Migrate existing base64 images
6. ⏳ Add image cleanup job
7. ⏳ Implement signed URLs for private images

## References

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [WebP Browser Support](https://caniuse.com/webp)

