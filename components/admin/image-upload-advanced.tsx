'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, AlertCircle } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import toast from 'react-hot-toast'

interface ImageUploadAdvancedProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  maxSizeMB?: number
}

export function ImageUploadAdvanced({ 
  images, 
  onImagesChange,
  maxImages = 10,
  maxSizeMB = 5
}: ImageUploadAdvancedProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  // Compression d'image
  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }

    try {
      const compressedFile = await imageCompression(file, options)
      console.log(`✅ Image compressée: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
      return compressedFile
    } catch (error) {
      console.error('❌ Erreur compression:', error)
      return file
    }
  }

  // Upload DIRECT vers Cloudinary (sans passer par l'API)
  const uploadToCloudinary = async (file: File, fileName: string): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = 'xarala_products' // À créer dans Cloudinary

    if (!cloudName) {
      throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME manquant')
    }

    setUploadProgress(prev => ({ ...prev, [fileName]: 0 }))

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'xarala-products')

    try {
      console.log('📤 Upload vers Cloudinary:', fileName)
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        const error = await response.json()
        console.error('❌ Erreur Cloudinary:', error)
        throw new Error(error.error?.message || 'Upload failed')
      }

      const data = await response.json()
      console.log('✅ Upload réussi:', data.secure_url)
      
      setUploadProgress(prev => ({ ...prev, [fileName]: 100 }))
      
      return data.secure_url
    } catch (error: any) {
      console.error('❌ Erreur upload:', error)
      throw error
    }
  }

  // Gérer le drop de fichiers
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      toast.error(`⚠️ Maximum ${maxImages} images autorisées`)
      return
    }

    setUploading(true)
    const toastId = toast.loading(`📤 Upload de ${acceptedFiles.length} image(s)...`)

    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        // 1. Compression
        const compressedFile = await compressImage(file)
        
        // 2. Upload vers Cloudinary
        const url = await uploadToCloudinary(compressedFile, file.name)
        
        return url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      
      onImagesChange([...images, ...uploadedUrls])
      
      toast.success(`✅ ${acceptedFiles.length} image(s) uploadée(s) !`, { id: toastId })
    } catch (error) {
      console.error('❌ Erreur upload:', error)
      toast.error('❌ Erreur lors de l\'upload', { id: toastId })
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }, [images, maxImages, onImagesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    maxFiles: maxImages - images.length,
    disabled: uploading || images.length >= maxImages,
  })

  const handleRemoveImage = (index: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-semibold text-gray-900 mb-1">Supprimer cette image ?</p>
          <p className="text-sm text-gray-600">Cette action est irréversible</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const newImages = images.filter((_, i) => i !== index)
              onImagesChange(newImages)
              toast.success('✅ Image supprimée', { id: t.id })
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Supprimer
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            Annuler
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
    })
  }

  const handleSetMainImage = (index: number) => {
    const newImages = [...images]
    const [mainImage] = newImages.splice(index, 1)
    newImages.unshift(mainImage)
    onImagesChange(newImages)
    toast.success('✅ Image principale définie')
  }

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-orange-500 bg-orange-50 scale-105' : 'border-gray-300 hover:border-orange-400'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
          ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-orange-500 mx-auto animate-spin" />
            <div>
              <p className="text-lg font-semibold text-gray-900">Upload en cours...</p>
              <p className="text-sm text-gray-500 mt-1">Compression et envoi des images</p>
            </div>
            {/* Progress bars */}
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="max-w-md mx-auto">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span className="truncate max-w-[200px]">{fileName}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : images.length >= maxImages ? (
          <div className="space-y-4">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                Limite atteinte
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Maximum {maxImages} images. Supprimez-en pour en ajouter.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-semibold text-gray-900 mb-1">
                {isDragActive ? 'Déposez les images ici' : 'Glissez des images ou cliquez'}
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, WEBP jusqu'à {maxSizeMB}MB • {images.length}/{maxImages} images
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Galerie d'images */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              Images du produit ({images.length})
            </h3>
            <p className="text-sm text-gray-500">
              La première image est l'image principale
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className={`
                  relative aspect-square rounded-xl overflow-hidden border-4 transition-all cursor-pointer group
                  ${index === 0 ? 'border-orange-500 ring-4 ring-orange-100' : 'border-gray-200 hover:border-orange-300'}
                `}
                onClick={() => index !== 0 && handleSetMainImage(index)}
              >
                <img
                  src={img}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Badge principale */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                    Principale
                  </div>
                )}

                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {index === 0 ? (
                    <span className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-full">
                      Image principale
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-white text-gray-900 text-sm font-bold rounded-full">
                      Définir comme principale
                    </span>
                  )}
                </div>

                {/* Bouton suppression */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveImage(index)
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Numéro */}
                <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

