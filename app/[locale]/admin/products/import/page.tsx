'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, CheckCircle, AlertCircle, Package } from 'lucide-react'
import { useAppStore } from '@/lib/store/app-store'
import { SEO_OPTIMIZED_PRODUCTS, PRODUCTS_METADATA } from '@/lib/data/seo-products'
import toast from 'react-hot-toast'

export default function ImportProductsPage() {
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState<string[]>([])
  const products = useAppStore(state => state.products)
  const addProduct = useAppStore(state => state.addProduct)

  const handleImportAll = async () => {
    setImporting(true)
    const toastId = toast.loading('Importation en cours...')

    try {
      let count = 0
      const importedIds: string[] = []

      for (const product of SEO_OPTIMIZED_PRODUCTS) {
        // Vérifier si le produit existe déjà
        const exists = products.find(p => p.id === product.id)
        
        if (!exists) {
          await addProduct(product as any)
          count++
          importedIds.push(product.id)
        }
      }

      setImported(importedIds)
      
      if (count > 0) {
        toast.success(`✅ ${count} produit(s) importé(s) !`, { id: toastId })
      } else {
        toast.success('✅ Tous les produits sont déjà importés', { id: toastId })
      }
    } catch (error) {
      console.error('Erreur import:', error)
      toast.error('❌ Erreur lors de l\'importation', { id: toastId })
    } finally {
      setImporting(false)
    }
  }

  const handleImportOne = async (product: any) => {
    const toastId = toast.loading('Importation...')

    try {
      const exists = products.find(p => p.id === product.id)
      
      if (exists) {
        toast.error('Produit déjà importé', { id: toastId })
        return
      }

      await addProduct(product)
      setImported([...imported, product.id])
      toast.success('✅ Produit importé !', { id: toastId })
    } catch (error) {
      toast.error('❌ Erreur', { id: toastId })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/fr/admin/products"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Importer Produits SEO
                </h1>
                <p className="text-gray-600 mt-1">
                  {SEO_OPTIMIZED_PRODUCTS.length} produits optimisés disponibles
                </p>
              </div>
            </div>

            <button
              onClick={handleImportAll}
              disabled={importing}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>Importer Tout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">📊 Statistiques Collection</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-black">{PRODUCTS_METADATA.totalProducts}</div>
              <div className="text-blue-100">Produits</div>
            </div>
            <div>
              <div className="text-3xl font-black">{PRODUCTS_METADATA.brands.length}</div>
              <div className="text-blue-100">Marques</div>
            </div>
            <div>
              <div className="text-2xl font-black">
                {PRODUCTS_METADATA.priceRange.min.toLocaleString()}
              </div>
              <div className="text-blue-100">Prix Min (FCFA)</div>
            </div>
            <div>
              <div className="text-2xl font-black">
                {PRODUCTS_METADATA.priceRange.max.toLocaleString()}
              </div>
              <div className="text-blue-100">Prix Max (FCFA)</div>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEO_OPTIMIZED_PRODUCTS.map((product) => {
            const isImported = products.find(p => p.id === product.id) || imported.includes(product.id)

            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${
                  isImported 
                    ? 'border-green-500' 
                    : 'border-gray-200 hover:border-orange-500'
                }`}
              >
                {/* Badge statut */}
                {isImported && (
                  <div className="bg-green-500 text-white px-4 py-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-semibold">Déjà importé</span>
                  </div>
                )}

                <div className="p-6">
                  {/* Image placeholder */}
                  <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>

                  {/* Info produit */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {product.shortDescription}
                    </p>

                    {/* Prix */}
                    <div className="text-2xl font-black text-orange-500">
                      {product.price.toLocaleString()} FCFA
                    </div>

                    {/* Stock */}
                    <div className="mt-2">
                      <span className="text-xs font-medium text-green-600">
                        ✓ Stock: {product.stock} unités
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4 space-y-1">
                    {product.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-orange-500">•</span>
                        <span className="line-clamp-1">{feature}</span>
                      </div>
                    ))}
                    {product.features.length > 3 && (
                      <div className="text-xs text-gray-400">
                        +{product.features.length - 3} autres...
                      </div>
                    )}
                  </div>

                  {/* SEO Info */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs font-semibold text-blue-900 mb-1">
                      🎯 SEO Optimisé
                    </div>
                    <div className="text-xs text-blue-700 line-clamp-2">
                      {product.seo.metaDescription}
                    </div>
                  </div>

                  {/* Bouton import */}
                  {!isImported && (
                    <button
                      onClick={() => handleImportOne(product)}
                      className="w-full px-4 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Importer</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
