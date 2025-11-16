'use client'

import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { useAppStore } from '@/lib/store/app-store'
import toast from 'react-hot-toast'
import { ImageUploadLocal } from './image-upload-local'

interface ProductFormProps {
  product?: any
  onClose: () => void
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const addProduct = useAppStore(state => state.addProduct)
  const updateProduct = useAppStore(state => state.updateProduct)

  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    brand: product?.brand || '',
    category: product?.category || 'imprimantes',
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
    price: product?.price || 0,
    priceUnit: product?.priceUnit || 'FCFA',
    stock: product?.stock || 0,
    featured: product?.featured || false,
    new: product?.new || false,
    mainImage: product?.mainImage || '',
    images: product?.images || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const toastId = toast.loading(product ? 'Mise à jour...' : 'Création...')

    try {
      if (product) {
        await updateProduct(product.id, formData)
        toast.success('✅ Produit mis à jour !', { id: toastId })
      } else {
        await addProduct({
          id: Date.now().toString(),
          ...formData,
        })
        toast.success('✅ Produit créé !', { id: toastId })
      }
      onClose()
    } catch (error) {
      toast.error('❌ Erreur', { id: toastId })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Modifier' : 'Nouveau'} Produit
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Marque *
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              >
                <option value="imprimantes">Imprimantes</option>
                <option value="cartes-pvc">Cartes PVC</option>
                <option value="accessoires">Accessoires</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prix *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-gray-700">Produit phare</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  checked={formData.new}
                  onChange={(e) => setFormData({ ...formData, new: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-gray-700">Nouveau produit</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description courte *
            </label>
            <textarea
              required
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description complète *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Images
            </label>
            <ImageUploadLocal
              images={formData.images}
              onImagesChange={(images) => setFormData({ 
                ...formData, 
                images,
                mainImage: images[0] || ''
              })}
              maxImages={5}
            />
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>{product ? 'Mettre à jour' : 'Créer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
