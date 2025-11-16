'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Upload, X, Camera, Image as ImageIcon, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useAvatarUpload, useCardImageUpload } from '@/hooks/use-image-upload'
import Image from 'next/image'

interface ImageUploadProps {
  label: string
  value?: string
  onChange: (imageUrl: string) => void
  aspectRatio?: 'square' | 'wide' | 'circle'
  maxSize?: number // en MB
  helpText?: string
  feature?: 'avatar' | 'background' | 'logo' | 'photo'
}

export function ImageUpload({
  label,
  value,
  onChange,
  aspectRatio = 'square',
  maxSize = 5,
  helpText,
  feature = 'photo'
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | undefined>(value)

  // Sync preview with external value changes
  useEffect(() => {
    setPreview(value)
  }, [value])

  // Use appropriate hook based on feature
  const avatarUpload = useAvatarUpload({
    onSuccess: (result) => {
      if (result && result.url) {
        onChange(result.url)
        setPreview(result.url)
        toast.success('Image téléchargée avec succès')
      }
    },
    onError: (error) => {
      // Reset preview on error
      setPreview(value || undefined)
      console.error('Avatar upload error:', error)
    }
  })

  const cardImageUpload = useCardImageUpload(
    feature === 'background' ? 'background' : feature === 'logo' ? 'logo' : 'photo',
    {
      onSuccess: (result) => {
        if (result && result.url) {
          onChange(result.url)
          setPreview(result.url)
          toast.success('Image téléchargée avec succès')
        }
      },
      onError: (error) => {
        setPreview(value || undefined)
        console.error('Card image upload error:', error)
      }
    }
  )

  // Select the appropriate upload hook
  const uploadHook = feature === 'avatar' ? avatarUpload : cardImageUpload
  const { upload, isUploading, remove } = uploadHook

  const aspectClasses = {
    square: 'aspect-square',
    wide: 'aspect-[16/9]',
    circle: 'aspect-square rounded-full'
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation taille
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`L'image ne doit pas dépasser ${maxSize}MB`)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // Validation type
    if (!file.type.startsWith('image/')) {
      toast.error('Le fichier doit être une image')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // Show preview immediately for better UX
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)

    try {
      // Upload to Supabase Storage
      const result = await upload(file)

      if (!result || !result.url) {
        // Reset preview on error
        URL.revokeObjectURL(previewUrl)
        setPreview(value || undefined)
        toast.error('Échec du téléchargement de l\'image')
      } else {
        // Clean up preview URL and update with actual uploaded URL
        URL.revokeObjectURL(previewUrl)
        setPreview(result.url)
        // onChange is called by the hook's onSuccess callback, but we ensure it's set here too
        if (result.url !== value) {
          onChange(result.url)
        }
      }
    } catch (error) {
      // Fallback error handling
      URL.revokeObjectURL(previewUrl)
      setPreview(value || undefined)
      console.error('Upload error:', error)
    } finally {
      // Reset file input to allow re-selecting the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    if (value) {
      // Extract path from URL if it's a Supabase URL
      try {
        const url = new URL(value)
        const pathParts = url.pathname.split('/')
        const bucketIndex = pathParts.findIndex((part) => ['assets', 'cards', 'avatars'].includes(part))
        
        if (bucketIndex !== -1) {
          const bucket = pathParts[bucketIndex] as 'assets' | 'cards' | 'avatars'
          const path = pathParts.slice(bucketIndex + 1).join('/')
          await remove(path, bucket)
        }
      } catch {
        // If not a valid URL or not Supabase URL, just clear
      }
    }
    
    setPreview(undefined)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        {preview ? (
          // Preview avec image
          <div className={`relative w-full ${aspectClasses[aspectRatio]} bg-gray-100 overflow-hidden rounded-2xl border-2 border-gray-200 group`}>
            <Image
              src={preview}
              alt={label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => {
                // Fallback if image fails to load
                setPreview(undefined)
              }}
            />
            
            {/* Overlay avec actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-3 bg-white rounded-xl text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <Camera className="w-5 h-5" />
              </button>
              <button
                onClick={handleRemove}
                disabled={isUploading}
                className="p-3 bg-red-500 rounded-xl text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Loading overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            )}
          </div>
        ) : (
          // Zone d'upload vide
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`relative w-full ${aspectClasses[aspectRatio]} bg-gray-50 border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-2xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                )}
              </div>
              <div className="text-sm font-bold text-gray-700 group-hover:text-orange-600 transition-colors mb-1">
                {isUploading ? 'Téléchargement...' : 'Cliquez pour choisir'}
              </div>
              <div className="text-xs text-gray-500">
                Max {maxSize}MB • JPG, PNG, GIF, WEBP
              </div>
            </div>
          </button>
        )}

        {/* Input caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {/* Help text */}
      {helpText && (
        <div className="mt-2 text-xs text-gray-500">
          {helpText}
        </div>
      )}
    </div>
  )
}
