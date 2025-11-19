/**
 * Supabase Storage utilities
 * 
 * Handles image uploads to Supabase Storage with compression and optimization
 */

import { createSupabaseBrowserClient } from './client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

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

/**
 * Compress and optimize image using browser APIs
 */
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

/**
 * Generate storage path
 * Format: <organization_id>/<user_id>/<feature>/<timestamp>-<filename>
 */
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

/**
 * Upload image to Supabase Storage (client-side)
 */
export async function uploadImage(
  options: UploadImageOptions
): Promise<UploadImageResult> {
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

  // Get current user
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Get organization if not provided
  let orgId = organizationId
  if (!orgId) {
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .single()

    orgId = membership?.organization_id
  }

  const finalUserId = userId || user.id

  // Compress image
  const compressedBlob = await compressImage(file, {
    maxWidth,
    maxHeight,
    quality,
    convertToWebP
  })

  // Generate path
  const path = generateStoragePath(bucket, feature, file.name, orgId, finalUserId, convertToWebP)

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage.from(bucket).upload(path, compressedBlob, {
    cacheControl: '3600',
    upsert: false
  })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  // Get public URL
  const {
    data: { publicUrl }
  } = supabase.storage.from(bucket).getPublicUrl(path)

  // Get image dimensions if needed
  const img = new Image()
  img.src = URL.createObjectURL(compressedBlob)
  await new Promise((resolve) => {
    img.onload = resolve
  })

  return {
    url: publicUrl,
    path: data.path,
    size: compressedBlob.size,
    width: img.width,
    height: img.height,
    format: convertToWebP ? 'webp' : file.type.split('/')[1] || 'jpeg'
  }
}

/**
 * Delete image from Supabase Storage (client-side)
 */
export async function deleteImage(bucket: StorageBucket, path: string): Promise<void> {
  const supabase = createSupabaseBrowserClient()

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

/**
 * Get signed URL for private bucket (server-side)
 * 
 * NOTE: This function requires server-side execution.
 * Import createSupabaseServerClient in your API route or server component.
 */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresIn: number = 3600,
  supabaseClient?: SupabaseClient<Database>
): Promise<string> {
  if (!supabaseClient) {
    // Dynamic import to avoid bundling server code in client
    const { createSupabaseServerClient } = await import('./server')
    supabaseClient = await createSupabaseServerClient()
  }

  const { data, error } = await supabaseClient.storage.from(bucket).createSignedUrl(path, expiresIn)

  if (error || !data) {
    throw new Error(`Failed to create signed URL: ${error?.message}`)
  }

  return data.signedUrl
}

/**
 * Upload image (server-side) - for API routes
 * 
 * NOTE: This function requires server-side execution.
 * Import createSupabaseServerClient in your API route or server component.
 */
export async function uploadImageServer(
  options: {
    file: Buffer | Blob
    bucket: StorageBucket
    path: string
    contentType: string
  },
  supabaseClient?: SupabaseClient<Database>
): Promise<{ path: string; url: string }> {
  if (!supabaseClient) {
    // Dynamic import to avoid bundling server code in client
    const { createSupabaseServerClient } = await import('./server')
    supabaseClient = await createSupabaseServerClient()
  }

  const { data, error } = await supabaseClient.storage.from(options.bucket).upload(options.path, options.file, {
    contentType: options.contentType,
    cacheControl: '3600',
    upsert: false
  })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const {
    data: { publicUrl }
  } = supabaseClient.storage.from(options.bucket).getPublicUrl(data.path)

  return {
    path: data.path,
    url: publicUrl
  }
}

