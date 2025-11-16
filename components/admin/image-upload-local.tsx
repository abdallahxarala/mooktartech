'use client'

import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { processImages } from '@/lib/utils/simple-image-handler'

interface Props {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUploadLocal({ images, onImagesChange, maxImages = 5 }: Props) {
  const onDrop = useCallback(async (files: File[]) => {
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images`)
      return
    }

    const toastId = toast.loading('Optimisation...')

    try {
      const compressed = await processImages(files)
      onImagesChange([...images, ...compressed])
      toast.success(`${files.length} image(s) ajoutée(s)`, { id: toastId })
    } catch (error) {
      toast.error('Erreur optimisation', { id: toastId })
    }
  }, [images, maxImages, onImagesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: maxImages - images.length,
  })

  const handleRemove = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="font-semibold text-gray-900">
          {isDragActive ? 'Déposez ici' : 'Cliquez ou glissez'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {images.length}/{maxImages} • Max 10MB
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square group">
              <img 
                src={img}
                alt={`Image ${i + 1}`}
                className="w-full h-full object-cover rounded-lg" 
              />
              <button
                onClick={() => handleRemove(i)}
                type="button"
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}