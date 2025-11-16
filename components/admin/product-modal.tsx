'use client'

import React, { useState, useEffect } from 'react'
import { X, Upload, Wand2, Plus, Trash2, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Product } from '@/lib/data/products'
import { ImageUploader } from './image-uploader'
import { generateProductImage } from '@/lib/services/image-generator'
import { uploadImageToCloudinary } from '@/lib/services/cloudinary'
import toast from 'react-hot-toast'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void
  product?: Product | null
}

const CATEGORIES = [
  { value: 'imprimantes', label: 'Imprimantes' },
  { value: 'cartes-pvc', label: 'Cartes PVC' },
  { value: 'cartes-magnetiques', label: 'Cartes Magnétiques' },
  { value: 'cartes-puce', label: 'Cartes à Puce' },
  { value: 'cartes-rfid', label: 'Cartes RFID' },
  { value: 'cartes-nfc', label: 'Cartes NFC' },
  { value: 'accessoires', label: 'Accessoires' },
]

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '',
    category: 'cartes-pvc',
    shortDescription: '',
    description: '',
    price: 0,
    priceUnit: 'XOF',
    stock: 0,
    featured: false,
    new: false,
    images: [],
    mainImage: '',
    specifications: {},
    features: [],
  })

  const [newSpec, setNewSpec] = useState({ key: '', value: '' })
  const [newFeature, setNewFeature] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'specs' | 'features'>('info')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'uploading' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (product) {
      setFormData(product)
    }
  }, [product])

  if (!isOpen) return null

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddSpec = () => {
    if (newSpec.key && newSpec.value) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpec.key]: newSpec.value,
        },
      }))
      setNewSpec({ key: '', value: '' })
    }
  }

  const handleRemoveSpec = (key: string) => {
    const specs = { ...formData.specifications }
    delete specs[key]
    setFormData(prev => ({ ...prev, specifications: specs }))
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleGenerateImage = async () => {
    if (!formData.name || !formData.brand) {
      toast.error('⚠️ Veuillez renseigner le nom et la marque')
      return
    }

    setGenerationStatus('generating')
    const toastId = toast.loading('🎨 Génération de l\'image avec l\'IA...')
    
    try {
      const prompt = `${formData.name} ${formData.brand} professional product photography, studio lighting, white background, high resolution, commercial photography`
      
      // Étape 1 : Génération IA
      const imageUrl = await generateProductImage({ prompt })
      toast.loading('☁️ Upload vers Cloudinary...', { id: toastId })
      
      setGenerationStatus('uploading')
      
      // Étape 2 : Upload Cloudinary
      const uploaded = await uploadImageToCloudinary(
        imageUrl,
        `${formData.id || 'new'}-${Date.now()}`,
        'products'
      )

      setFormData(prev => ({
        ...prev,
        images: [uploaded.url, ...(prev.images || [])],
        mainImage: prev.mainImage || uploaded.url,
      }))

      setGenerationStatus('success')
      toast.success('✅ Image générée et sauvegardée !', { id: toastId })
      
      // Reset status après 2s
      setTimeout(() => setGenerationStatus('idle'), 2000)
    } catch (error) {
      console.error(error)
      setGenerationStatus('error')
      toast.error('❌ Erreur lors de la génération', { id: toastId })
      setTimeout(() => setGenerationStatus('idle'), 2000)
    }
  }

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [url, ...(prev.images || [])],
      mainImage: prev.mainImage || url,
    }))
    
    toast.success('✅ Image ajoutée avec succès !')
  }

  const handleRemoveImage = (index: number) => {
    const imageUrl = formData.images?.[index]
    
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-semibold text-gray-900 mb-1">Supprimer l'image ?</p>
          <p className="text-sm text-gray-600">Cette action est irréversible</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFormData(prev => {
                const newImages = prev.images?.filter((_, i) => i !== index) || []
                return {
                  ...prev,
                  images: newImages,
                  mainImage: prev.mainImage === prev.images?.[index] 
                    ? (newImages[0] || '') 
                    : prev.mainImage,
                }
              })
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

  const handleSetMainImage = (url: string) => {
    setFormData(prev => ({ ...prev, mainImage: url }))
  }

  const handleSave = async () => {
    // Validation
    if (!formData.name || !formData.brand || !formData.description) {
      toast.error('⚠️ Veuillez remplir tous les champs obligatoires')
      return
    }

    setIsSaving(true)
    const toastId = toast.loading('💾 Enregistrement en cours...')
    
    try {
      const productData: Product = {
        id: formData.id || `product-${Date.now()}`,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name!,
        brand: formData.brand!,
        category: formData.category as any,
        shortDescription: formData.shortDescription!,
        description: formData.description!,
        price: formData.price!,
        priceUnit: formData.priceUnit as any,
        images: formData.images || [],
        mainImage: formData.mainImage || '',
        stock: formData.stock || 0,
        featured: formData.featured || false,
        new: formData.new || false,
        specifications: formData.specifications || {},
        features: formData.features || [],
      }

      await onSave(productData)
      
      toast.success(
        product ? '✅ Produit mis à jour avec succès !' : '✅ Produit ajouté avec succès !',
        { id: toastId }
      )
      
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('❌ Erreur lors de la sauvegarde', { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
          <div>
            <h2 className="text-3xl font-black text-gray-900">
              {product ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <p className="text-gray-600 mt-1">
              {product ? 'Mettez à jour les informations du produit' : 'Ajoutez un nouveau produit au catalogue'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-8 pt-6 border-b border-gray-200">
          {[
            { id: 'info', label: 'Informations', icon: '📝' },
            { id: 'images', label: 'Images', icon: '🖼️' },
            { id: 'specs', label: 'Spécifications', icon: '⚙️' },
            { id: 'features', label: 'Caractéristiques', icon: '✨' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-6 py-3 rounded-t-xl font-semibold transition-all
                ${activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Nom et Marque */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="Ex: Entrust Datacard SD260"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Marque *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="Ex: Entrust Datacard"
                  />
                </div>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description courte */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description courte *
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Une ligne descriptive"
                />
              </div>

              {/* Description complète */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description complète *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors resize-none"
                  placeholder="Description détaillée du produit..."
                />
              </div>

              {/* Prix et Stock */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Prix *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Unité
                  </label>
                  <select
                    value={formData.priceUnit}
                    onChange={(e) => handleInputChange('priceUnit', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  >
                    <option value="XOF">XOF</option>
                    <option value="unit">par unité</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Produit phare
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.new}
                    onChange={(e) => handleInputChange('new', e.target.checked)}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Nouveau produit
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              {/* Génération IA avec status */}
              <div className={`
                rounded-2xl p-6 border-2 transition-all
                ${generationStatus === 'success' ? 'bg-green-50 border-green-200' :
                  generationStatus === 'error' ? 'bg-red-50 border-red-200' :
                  'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'}
              `}>
                <div className="flex items-start gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                    ${generationStatus === 'success' ? 'bg-green-500' :
                      generationStatus === 'error' ? 'bg-red-500' :
                      'bg-purple-500'}
                  `}>
                    {generationStatus === 'success' ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : generationStatus === 'error' ? (
                      <AlertCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Wand2 className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {generationStatus === 'success' ? 'Image générée avec succès !' :
                       generationStatus === 'error' ? 'Erreur de génération' :
                       'Générer une image avec l\'IA'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {generationStatus === 'generating' ? 'Création de l\'image en cours...' :
                       generationStatus === 'uploading' ? 'Upload vers le cloud...' :
                       generationStatus === 'success' ? 'L\'image a été ajoutée à la galerie' :
                       generationStatus === 'error' ? 'Une erreur est survenue, veuillez réessayer' :
                       'Créez une image professionnelle en quelques secondes'}
                    </p>
                    <button
                      onClick={handleGenerateImage}
                      disabled={generationStatus === 'generating' || generationStatus === 'uploading'}
                      className={`
                        flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all disabled:opacity-50
                        ${generationStatus === 'success' ? 'bg-green-500 hover:bg-green-600' :
                          generationStatus === 'error' ? 'bg-red-500 hover:bg-red-600' :
                          'bg-purple-500 hover:bg-purple-600'} text-white
                      `}
                    >
                      {generationStatus === 'generating' || generationStatus === 'uploading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>
                            {generationStatus === 'generating' ? 'Génération...' : 'Upload...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5" />
                          <span>
                            {generationStatus === 'success' ? 'Générer une autre' :
                             generationStatus === 'error' ? 'Réessayer' :
                             'Générer l\'image'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload manuel */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Ou uploader vos propres images
                </h3>
                <ImageUploader
                  onImageUploaded={handleImageUploaded}
                  currentImage={formData.mainImage}
                />
              </div>

              {/* Galerie d'images */}
              {formData.images && formData.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Images du produit ({formData.images.length})
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        className={`
                          relative aspect-square rounded-xl overflow-hidden border-4 transition-all cursor-pointer group
                          ${formData.mainImage === img ? 'border-orange-500 ring-4 ring-orange-100' : 'border-gray-200 hover:border-orange-300'}
                        `}
                        onClick={() => handleSetMainImage(img)}
                      >
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {formData.mainImage === img ? (
                            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                              Principale
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-white text-gray-900 text-xs font-bold rounded-full">
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
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-6">
              {/* Ajout spécification */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Ajouter une spécification
                </h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newSpec.key}
                    onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
                    placeholder="Nom (ex: Résolution)"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newSpec.value}
                    onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                    placeholder="Valeur (ex: 300 dpi)"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    onClick={handleAddSpec}
                    className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Liste spécifications */}
              {Object.keys(formData.specifications || {}).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Spécifications techniques
                  </h3>
                  {Object.entries(formData.specifications || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl group hover:border-orange-300 transition-all"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Nom</div>
                          <div className="font-semibold text-gray-900">{key}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Valeur</div>
                          <div className="font-semibold text-gray-900">{value}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSpec(key)}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              {/* Ajout caractéristique */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Ajouter une caractéristique
                </h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                    placeholder="Ex: Compatible tous smartphones NFC"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    onClick={handleAddFeature}
                    className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Liste caractéristiques */}
              {formData.features && formData.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Caractéristiques du produit
                  </h3>
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl group hover:border-orange-300 transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-green-500 text-xl">✓</span>
                        <span className="text-gray-900">{feature}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-200 rounded-xl transition-all"
          >
            Annuler
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-lg disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Enregistrer le produit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
