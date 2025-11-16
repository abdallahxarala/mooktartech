/**
 * Reusable image upload component
 */

'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useImageUpload, type StorageBucket, type ImageFeature } from '@/hooks/use-image-upload'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  bucket?: StorageBucket
  feature?: ImageFeature
  maxWidth?: number
  maxHeight?: number
  quality?: number
  accept?: string
  className?: string
  disabled?: boolean
  showPreview?: boolean
  aspectRatio?: 'square' | 'video' | 'auto'
}

export function ImageUpload({
  value,
  onChange,
  bucket = 'assets',
  feature = 'photo',
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.85,
  accept = 'image/*',
  className,
  disabled = false,
  showPreview = true,
  aspectRatio = 'auto'
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(value || null)
  const { upload, isUploading, remove } = useImageUpload({
    bucket,
    feature,
    maxWidth,
    maxHeight,
    quality
  })

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file) return

      // Show preview immediately
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Upload to Supabase
      const result = await upload(file)

      if (result) {
        onChange(result.url)
        // Clean up preview URL
        URL.revokeObjectURL(previewUrl)
        setPreview(result.url)
      } else {
        // Reset preview on error
        URL.revokeObjectURL(previewUrl)
        setPreview(value || null)
      }
    },
    [upload, onChange, value]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect]
  )

  const handleRemove = useCallback(async () => {
    if (value) {
      // Extract path from URL if needed
      const urlParts = value.split('/')
      const pathIndex = urlParts.findIndex((part) => part === bucket)
      if (pathIndex !== -1) {
        const path = urlParts.slice(pathIndex + 1).join('/')
        await remove(path, bucket)
      }
    }
    onChange(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [value, onChange, remove, bucket])

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }, [disabled, isUploading])

  const aspectRatioClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'video'
      ? 'aspect-video'
      : ''

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {showPreview && preview ? (
        <div className="relative group">
          <div className={cn('relative overflow-hidden rounded-lg border-2 border-gray-200', aspectRatioClass)}>
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          className={cn(
            'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 transition-colors',
            aspectRatioClass,
            (disabled || isUploading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-sm text-gray-600">Téléchargement...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                Cliquez pour télécharger une image
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP jusqu'à 10MB</p>
            </div>
          )}
        </div>
      )}

      {!showPreview && (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Téléchargement...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {value ? 'Remplacer l'image' : 'Télécharger une image'}
            </>
          )}
        </Button>
      )}
    </div>
  )
}

