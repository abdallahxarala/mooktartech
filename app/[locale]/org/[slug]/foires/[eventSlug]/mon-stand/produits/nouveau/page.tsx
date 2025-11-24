'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, X, Save, Star, Plus } from 'lucide-react'

export default function NouveauProduitPage({
  params,
}: {
  params: { locale: string; slug: string; eventSlug: string }
}) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exhibitor, setExhibitor] = useState<any>(null)
  const [orgSlug, setOrgSlug] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    currency: 'FCFA',
    priceOnRequest: false,
    stockQuantity: '',
    unlimitedStock: true,
    isAvailable: true,
    isFeatured: false,
    specifications: {} as Record<string, string>,
    tags: [] as string[],
  })

  const [images, setImages] = useState<Array<{ file: File | null; preview: string }>>([])
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0)
  const [currentTag, setCurrentTag] = useState('')
  const [specKey, setSpecKey] = useState('')
  const [specValue, setSpecValue] = useState('')

  const categories = [
    'Agriculture & Alimentation',
    'Artisanat & Mode',
    'Technologie & Innovation',
    'Services & Finance',
    'Construction & BTP',
    'Santé & Bien-être',
    'Éducation & Formation',
    'Tourisme & Hôtellerie',
    'Commerce & Distribution',
    'Industrie & Manufacturing',
    'Autre',
  ]

  useEffect(() => {
    loadExhibitor()
  }, [])

  async function loadExhibitor() {
    setLoading(true)
    try {
      const { data: eventData } = await supabase
        .from('events')
        .select('id, organization_id, organizations(slug)')
        .eq('slug', params.eventSlug)
        .single()

      if (!eventData) return

      // Extraire le slug de l'organisation
      const orgSlugValue = (eventData as any).organizations?.slug || params.slug
      setOrgSlug(orgSlugValue)

      const { data: exhibitorData } = await supabase
        .from('exhibitors')
        .select('*')
        .eq('event_id', (eventData as any).id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      setExhibitor(exhibitorData)
    } catch (error) {
      console.error('Error loading exhibitor:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    
    const newImages = files.slice(0, 5 - images.length).map((file) => {
      const preview = URL.createObjectURL(file)
      return { file, preview }
    })

    setImages([...images, ...newImages])
  }

  function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
    
    if (featuredImageIndex >= updated.length && updated.length > 0) {
      setFeaturedImageIndex(updated.length - 1)
    } else if (updated.length === 0) {
      setFeaturedImageIndex(0)
    }
  }

  function setFeaturedImage(index: number) {
    setFeaturedImageIndex(index)
  }

  function addTag() {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      })
      setCurrentTag('')
    }
  }

  function removeTag(tag: string) {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  function addSpecification() {
    if (specKey.trim() && specValue.trim()) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specKey.trim()]: specValue.trim(),
        },
      })
      setSpecKey('')
      setSpecValue('')
    }
  }

  function removeSpecification(key: string) {
    const newSpecs = { ...formData.specifications }
    delete newSpecs[key]
    setFormData({
      ...formData,
      specifications: newSpecs,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      if (!exhibitor) {
        alert('Exposant non trouvé')
        return
      }

      // Validation
      if (!formData.name.trim()) {
        alert('Le nom du produit est requis')
        setSaving(false)
        return
      }

      if (!formData.category) {
        alert('La catégorie est requise')
        setSaving(false)
        return
      }

      // Upload des images (TODO: implémenter Supabase Storage)
      const imageUrls: string[] = []
      // Pour l'instant, on stocke juste les previews
      // Dans un vrai projet, il faudrait uploader vers Supabase Storage
      images.forEach((img) => {
        if (img.preview) {
          imageUrls.push(img.preview)
        }
      })

      // Préparer les données
      const productData: any = {
        exhibitor_id: exhibitor.id,
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        price: formData.priceOnRequest ? null : parseFloat(formData.price) || 0,
        currency: formData.currency,
        price_on_request: formData.priceOnRequest,
        stock_quantity: formData.unlimitedStock ? null : parseInt(formData.stockQuantity) || null,
        unlimited_stock: formData.unlimitedStock,
        is_available: formData.isAvailable,
        is_featured: formData.isFeatured,
        featured_image: imageUrls[featuredImageIndex] || null,
        images: imageUrls.length > 0 ? imageUrls : null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        specifications: Object.keys(formData.specifications).length > 0 
          ? formData.specifications 
          : null,
        display_order: 0,
      }

      // Insérer dans Supabase
      const { data, error } = await supabase
        .from('exhibitor_products')
        .insert([productData])
        .select()
        .single()

      if (error) {
        console.error('Error creating product:', error)
        alert('Erreur lors de la création du produit: ' + error.message)
        setSaving(false)
        return
      }

      // Succès : rediriger vers la liste
      router.push(`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/produits`)
    } catch (error) {
      console.error('Error:', error)
      alert('Une erreur est survenue')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!orgSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link
            href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/produits`}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux produits
          </Link>
          <h1 className="text-3xl font-bold">Nouveau Produit</h1>
          <p className="text-lg opacity-90 mt-2">{exhibitor?.company_name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* COLONNE GAUCHE - Images */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold mb-4">Images du produit</h2>
              
              {/* Zone d'upload */}
              {images.length < 5 && (
                <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition mb-4">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <span className="text-gray-600">Cliquez pour ajouter des images</span>
                  <span className="text-sm text-gray-500 block mt-2">
                    Maximum 5 images (JPG, PNG)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}

              {/* Prévisualisation des images */}
              {images.length > 0 && (
                <div className="space-y-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        {index === featuredImageIndex && (
                          <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Vedette
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {index !== featuredImageIndex && (
                        <button
                          type="button"
                          onClick={() => setFeaturedImage(index)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-semibold rounded-lg"
                        >
                          Définir comme image vedette
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* COLONNE DROITE - Formulaire */}
            <div className="lg:col-span-2 space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nom du produit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Ordinateur portable Dell XPS 15"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Décrivez votre produit en détail..."
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Prix</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      disabled={formData.priceOnRequest}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      disabled={formData.priceOnRequest}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    >
                      <option value="FCFA">FCFA</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.priceOnRequest}
                      onChange={(e) => setFormData({ ...formData, priceOnRequest: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-sm">Prix sur demande</span>
                  </label>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold mb-2">Stock</label>
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.unlimitedStock}
                      onChange={(e) => setFormData({ ...formData, unlimitedStock: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span>Stock illimité</span>
                  </label>
                </div>
                {!formData.unlimitedStock && (
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Quantité en stock"
                    min="0"
                  />
                )}
              </div>

              {/* Statut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>Produit disponible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-orange-500" />
                    Mettre en vedette
                  </span>
                </label>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Ajouter un tag (Entrée)"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Spécifications */}
              <div>
                <label className="block text-sm font-semibold mb-2">Spécifications techniques</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: Processeur"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Ex: Intel Core i7"
                    />
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {Object.keys(formData.specifications).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(formData.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
                      >
                        <span className="font-semibold">{key}:</span>
                        <span className="flex-1 text-right mr-4">{value}</span>
                        <button
                          type="button"
                          onClick={() => removeSpecification(key)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Boutons */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {saving ? 'Enregistrement...' : 'Enregistrer le produit'}
                </button>
                <Link
                  href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/produits`}
                  className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Annuler
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

