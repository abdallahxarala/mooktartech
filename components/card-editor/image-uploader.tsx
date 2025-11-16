'use client'

import React, { useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Upload, X, Crop } from 'lucide-react'

interface ImageUploaderProps {
  currentImage: string | null
  onUpload: (file: File) => void
  onRemove: () => void
  type: 'photo' | 'logo'
}

export function ImageUploader({ 
  currentImage, 
  onUpload, 
  onRemove, 
  type 
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0])
      }
    }
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  if (currentImage) {
    return (
      <div className="space-y-3">
        <div className="relative">
          <img
            src={currentImage}
            alt={type === 'photo' ? 'Photo de profil' : 'Logo entreprise'}
            className={`rounded-lg object-cover ${
              type === 'photo' ? 'w-24 h-24' : 'w-16 h-16'
            }`}
          />
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Remplacer</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Crop className="w-4 h-4" />
            <span>Recadrer</span>
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-orange-500 bg-orange-50' 
            : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-1">
          {isDragActive 
            ? 'Déposez l\'image ici...' 
            : `Glissez-déposez votre ${type === 'photo' ? 'photo' : 'logo'} ici`
          }
        </p>
        <p className="text-xs text-gray-500">
          ou cliquez pour sélectionner
        </p>
      </div>
      
      <div className="text-xs text-gray-500">
        <p>Formats acceptés : JPG, PNG, GIF, WebP</p>
        <p>Taille max : 5MB</p>
        {type === 'photo' && <p>Recommandé : 400x400px</p>}
        {type === 'logo' && <p>Recommandé : 200x200px</p>}
      </div>
    </div>
  )
}
