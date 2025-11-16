'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ImageUploaderProps {
  label: string
  value: string | null
  onChange: (url: string | null) => void
  aspectRatio?: 'square' | 'rect'
  maxSize?: number // en MB
}

export function ImageUploader({
  label,
  value,
  onChange,
  aspectRatio = 'square',
  maxSize = 5
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null)
    
    const file = acceptedFiles[0]
    if (!file) return

    // Vérifier la taille
    if (file.size > maxSize * 1024 * 1024) {
      setError(`L'image ne doit pas dépasser ${maxSize}MB`)
      return
    }

    // Créer preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
      onChange(result)
    }
    reader.readAsDataURL(file)
  }, [maxSize, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    multiple: false
  })

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    setError(null)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      {preview ? (
        // Preview avec image
        <div className="relative group">
          <div className={`relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50 ${
            aspectRatio === 'square' ? 'aspect-square' : 'aspect-video'
          }`}>
            <Image
              src={preview}
              alt={label}
              fill
              className="object-cover"
            />
          </div>
          
          {/* Bouton supprimer */}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        // Zone de drop
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${isDragActive 
              ? 'border-orange-500 bg-orange-50' 
              : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
            }
            ${aspectRatio === 'square' ? 'aspect-square' : 'aspect-video'}
            flex flex-col items-center justify-center
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-2">
            {isDragActive ? (
              <>
                <Upload className="w-12 h-12 text-orange-500" />
                <p className="text-sm text-orange-600 font-medium">
                  Déposez l&apos;image ici
                </p>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Glissez une image ou <span className="text-orange-500 font-medium">parcourez</span>
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, WEBP (max {maxSize}MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
