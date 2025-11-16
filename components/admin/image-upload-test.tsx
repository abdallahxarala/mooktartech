'use client'

import React from 'react'
import toast from 'react-hot-toast'

interface ImageUploadTestProps {
  images: string[]
  onImagesChange: (images: string[]) => void
}

export function ImageUploadTest({ images, onImagesChange }: ImageUploadTestProps) {
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    console.log('📁 Fichiers sélectionnés:', files.length)
    toast.loading('Conversion...')

    try {
      const file = files[0]
      console.log('📁 Fichier:', file.name, file.type, file.size)

      const reader = new FileReader()
      
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        console.log('✅ Base64 obtenu, longueur:', base64.length)
        
        const newImages = [...images, base64]
        console.log('📝 Nouvelles images:', newImages.length)
        
        onImagesChange(newImages)
        toast.success('✅ Image ajoutée !')
      }

      reader.onerror = (error) => {
        console.error('❌ Erreur reader:', error)
        toast.error('❌ Erreur')
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error('❌ Erreur:', error)
      toast.error('❌ Erreur')
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload-test"
        />
        <label
          htmlFor="file-upload-test"
          className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
        >
          📤 Sélectionner une image
        </label>
        <p className="text-sm text-gray-500 mt-4">
          Version de test ultra-simple • {images.length} images
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square">
              <img src={img} className="w-full h-full object-cover rounded-xl" alt={`Image ${i + 1}`} />
              <button
                onClick={() => {
                  const newImages = images.filter((_, index) => index !== i)
                  onImagesChange(newImages)
                  toast.success('Supprimée')
                }}
                className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
