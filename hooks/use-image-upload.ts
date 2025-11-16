/**
 * React hook for image upload to Supabase Storage
 */

'use client'

import { useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

// Types (copied from storage.ts to avoid importing the whole module)
export type StorageBucket = 'assets' | 'cards' | 'avatars' | 'badges'
export type ImageFeature = 'avatar' | 'logo' | 'background' | 'cover' | 'photo' | 'badge'

export interface UploadImageOptions {
  file: File
  bucket: StorageBucket
  feature: ImageFeature
  organizationId?: string
  userId?: string
  maxWidth?: number
  maxHeight?: number
  quality?: number
  convertToWebP?: boolean
  onProgress?: (progress: number) => void
}

export interface UploadImageResult {
  url: string
  path: string
  size: number
  width?: number
  height?: number
  format: string
}

// Helper functions (copied from storage.ts to avoid importing the whole module)
async function compressImage(
  file: File,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    convertToWebP?: boolean
  }
): Promise<Blob> {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.85, convertToWebP = true } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = width * ratio
        height = height * ratio
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)

      const mimeType = convertToWebP ? 'image/webp' : file.type || 'image/jpeg'
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'))
            return
          }
          resolve(blob)
        },
        mimeType,
        quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

function generateStoragePath(
  bucket: StorageBucket,
  feature: ImageFeature,
  filename: string,
  organizationId?: string,
  userId?: string,
  convertToWebP: boolean = true
): string {
  const parts: string[] = []

  if (organizationId) {
    parts.push(organizationId)
  }

  if (userId) {
    parts.push(userId)
  }

  parts.push(feature)

  // Sanitize filename
  const sanitizedFilename = filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  // Add timestamp for uniqueness
  const timestamp = Date.now()
  const ext = convertToWebP ? '.webp' : (sanitizedFilename.split('.').pop() || '.jpg')
  const finalFilename = `${timestamp}-${sanitizedFilename.replace(/\.[^.]+$/, '')}${ext}`

  parts.push(finalFilename)

  return parts.join('/')
}

// Client-side upload function (copied from storage.ts to avoid importing the whole module)
async function uploadImage(options: UploadImageOptions): Promise<UploadImageResult> {
  const {
    file,
    bucket,
    feature,
    organizationId,
    userId,
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    convertToWebP = true,
    onProgress
  } = options

  const supabase = createSupabaseBrowserClient()

  // Get current user (optional for public uploads, but required for user-scoped paths)
  let finalUserId: string | undefined = userId
  let orgId: string | undefined = organizationId

  try {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (!userError && user) {
      finalUserId = userId || user.id

      // Get organization if not provided (optional - can be null for personal uploads)
      if (!orgId) {
        const { data: membership } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', user.id)
          .single()

        orgId = membership?.organization_id || undefined
      }
    }
  } catch (error) {
    // If auth fails, continue with anonymous upload (if bucket allows it)
    console.warn('Auth check failed, proceeding with anonymous upload:', error)
  }

  // For NFC editor, use a simpler path structure: nfc/{userId or 'anonymous'}/{feature}/{timestamp}-{filename}
  // This ensures uploads work even without auth
  const pathPrefix = finalUserId ? `nfc/${finalUserId}` : 'nfc/anonymous'
  const sanitizedFilename = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  const timestamp = Date.now()
  const ext = convertToWebP ? '.webp' : (sanitizedFilename.split('.').pop() || '.jpg')
  const finalFilename = `${timestamp}-${sanitizedFilename.replace(/\.[^.]+$/, '')}${ext}`
  const path = `${pathPrefix}/${feature}/${finalFilename}`

  // Compress image
  const compressedBlob = await compressImage(file, {
    maxWidth,
    maxHeight,
    quality,
    convertToWebP
  })

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage.from(bucket).upload(path, compressedBlob, {
    cacheControl: '3600',
    upsert: false,
    contentType: convertToWebP ? 'image/webp' : file.type || 'image/jpeg'
  })

  if (error) {
    console.error('Supabase Storage upload error:', error)
    throw new Error(`Upload failed: ${error.message}`)
  }

  if (!data) {
    throw new Error('Upload failed: No data returned')
  }

  // Get public URL
  const {
    data: { publicUrl }
  } = supabase.storage.from(bucket).getPublicUrl(path)

  if (!publicUrl) {
    throw new Error('Failed to get public URL')
  }

  // Get image dimensions
  const img = new Image()
  img.src = URL.createObjectURL(compressedBlob)
  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    // Timeout after 5 seconds
    setTimeout(() => reject(new Error('Image load timeout')), 5000)
  })

  // Clean up object URL
  URL.revokeObjectURL(img.src)

  return {
    url: publicUrl,
    path: data.path,
    size: compressedBlob.size,
    width: img.width,
    height: img.height,
    format: convertToWebP ? 'webp' : file.type.split('/')[1] || 'jpeg'
  }
}

// Client-side delete function (copied from storage.ts to avoid importing the whole module)
async function deleteImage(bucket: StorageBucket, path: string): Promise<void> {
  const supabase = createSupabaseBrowserClient()

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

interface UseImageUploadOptions {
  bucket?: StorageBucket
  feature?: ImageFeature
  maxWidth?: number
  maxHeight?: number
  quality?: number
  convertToWebP?: boolean
  onSuccess?: (result: UploadImageResult) => void
  onError?: (error: Error) => void
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    bucket = 'assets',
    feature = 'photo',
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    convertToWebP = true,
    onSuccess,
    onError
  } = options

  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const upload = useCallback(
    async (
      file: File,
      overrides?: Partial<UploadImageOptions>
    ): Promise<UploadImageResult | null> => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        const error = new Error('File must be an image')
        toast.error('Le fichier doit être une image')
        onError?.(error)
        return null
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        const error = new Error('File size exceeds 10MB limit')
        toast.error('La taille du fichier ne doit pas dépasser 10MB')
        onError?.(error)
        return null
      }

      setIsUploading(true)
      setProgress(0)

      try {
        const result = await uploadImage({
          file,
          bucket: overrides?.bucket || bucket,
          feature: overrides?.feature || feature,
          organizationId: overrides?.organizationId,
          userId: overrides?.userId,
          maxWidth: overrides?.maxWidth || maxWidth,
          maxHeight: overrides?.maxHeight || maxHeight,
          quality: overrides?.quality || quality,
          convertToWebP: overrides?.convertToWebP ?? convertToWebP,
          onProgress: (p) => setProgress(p)
        })

        setUploadedUrl(result.url)
        toast.success('Image téléchargée avec succès')
        onSuccess?.(result)
        return result
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Upload failed')
        console.error('Image upload error:', err)
        
        // More specific error messages
        let errorMessage = 'Erreur lors du téléchargement'
        if (err.message.includes('not authenticated')) {
          errorMessage = 'Vous devez être connecté pour télécharger une image'
        } else if (err.message.includes('Bucket not found')) {
          errorMessage = 'Le bucket de stockage n\'existe pas. Contactez le support.'
        } else if (err.message.includes('new row violates row-level security')) {
          errorMessage = 'Permissions insuffisantes. Vérifiez vos droits d\'accès.'
        } else if (err.message) {
          errorMessage = `Erreur: ${err.message}`
        }
        
        toast.error(errorMessage)
        onError?.(err)
        return null
      } finally {
        setIsUploading(false)
        setProgress(0)
      }
    },
    [bucket, feature, maxWidth, maxHeight, quality, convertToWebP, onSuccess, onError]
  )

  const remove = useCallback(
    async (path: string, bucketOverride?: StorageBucket) => {
      try {
        await deleteImage(bucketOverride || bucket, path)
        if (uploadedUrl) {
          setUploadedUrl(null)
        }
        toast.success('Image supprimée')
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Delete failed')
        console.error('Image delete error:', err)
        toast.error(`Erreur lors de la suppression: ${err.message}`)
      }
    },
    [bucket, uploadedUrl]
  )

  const reset = useCallback(() => {
    setUploadedUrl(null)
    setProgress(0)
  }, [])

  return {
    upload,
    remove,
    reset,
    isUploading,
    progress,
    uploadedUrl
  }
}

/**
 * Hook for avatar upload specifically
 */
export function useAvatarUpload(options?: Omit<UseImageUploadOptions, 'feature' | 'bucket'>) {
  return useImageUpload({
    ...options,
    feature: 'avatar',
    bucket: 'avatars',
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.9
  })
}

/**
 * Hook for card image upload (logo, background, photo)
 */
export function useCardImageUpload(
  feature: 'logo' | 'background' | 'photo',
  options?: Omit<UseImageUploadOptions, 'feature' | 'bucket'>
) {
  return useImageUpload({
    ...options,
    feature,
    bucket: 'cards',
    maxWidth: 1920,
    maxHeight: 1920
  })
}

