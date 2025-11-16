'use client'

import React from 'react'
import Link from 'next/link'
import { useAppStore } from '@/lib/store/app-store'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Download,
  ExternalLink,
  BarChart3,
  Clock
} from 'lucide-react'
import { useHydration } from '@/hooks/use-hydration'

export default function AdminDashboard() {
  const isHydrated = useHydration()
  const products = useAppStore(state => state.products)

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  // Statistiques
  const stats = {
    totalProducts: products.length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    featuredProducts: products.filter(p => p.featured).length,
    newProducts: products.filter(p => p.new).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-black text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue dans votre espace d'administration
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Produits */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Produits</h3>
              <Package className="w-8 h-8 opacity-50" />
            </div>
            <div className="text-5xl font-black mb-2">
              {stats.totalProducts}
            </div>
            <p className="text-blue-100">
              Total dans le catalogue
            </p>
          </div>

          {/* Stock Total */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Stock</h3>
              <TrendingUp className="w-8 h-8 opacity-50" />
            </div>
            <div className="text-5xl font-black mb-2">
              {stats.totalStock}
            </div>
            <p className="text-green-100">
              Unités disponibles
            </p>
          </div>

          {/* Produits Phares */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Phares</h3>
              <BarChart3 className="w-8 h-8 opacity-50" />
            </div>
            <div className="text-5xl font-black mb-2">
              {stats.featuredProducts}
            </div>
            <p className="text-orange-100">
              Produits mis en avant
            </p>
          </div>

          {/* Nouveautés */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Nouveautés</h3>
              <Clock className="w-8 h-8 opacity-50" />
            </div>
            <div className="text-5xl font-black mb-2">
              {stats.newProducts}
            </div>
            <p className="text-purple-100">
              Produits récents
            </p>
          </div>
        </div>

        {/* Valeur totale du stock */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Valeur totale du stock</h3>
              <div className="text-5xl font-black">
                {stats.totalValue.toLocaleString()} FCFA
              </div>
            </div>
            <TrendingUp className="w-16 h-16 opacity-30" />
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Gérer les produits */}
          <Link
            href="/fr/admin/products"
            className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-orange-500 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <Package className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Gérer les produits
            </h3>
            <p className="text-gray-600 mb-4">
              Ajouter, modifier ou supprimer des produits
            </p>
            <div className="flex items-center gap-2 text-orange-500 font-semibold">
              <span>Accéder</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </Link>

          {/* Produits extraits */}
          <Link
            href="/fr/admin/products/extracted"
            className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-purple-500 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <Download className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Produits extraits
            </h3>
            <p className="text-gray-600 mb-4">
              6 produits prêts à importer depuis les PDFs
            </p>
            <div className="flex items-center gap-2 text-purple-500 font-semibold">
              <span>Voir</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </Link>

          {/* Voir le site */}
          <Link
            href="/fr"
            target="_blank"
            className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <ExternalLink className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Voir le site
            </h3>
            <p className="text-gray-600 mb-4">
              Prévisualiser le site public
            </p>
            <div className="flex items-center gap-2 text-blue-500 font-semibold">
              <span>Ouvrir</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </Link>

          {/* Gérer le contenu */}
          <Link
            href="/fr/admin/content"
            className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-purple-500 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <ExternalLink className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Contenu
            </h3>
            <p className="text-gray-600 mb-4">
              À propos, équipe, valeurs, contact, etc.
            </p>
            <div className="flex items-center gap-2 text-purple-500 font-semibold">
              <span>Gérer</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Produits récents */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Produits récents
          </h2>
          
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Produit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Catégorie
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Prix
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {product.mainImage ? (
                            <img 
                              src={product.mainImage} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.brand}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {product.price.toLocaleString()} {product.priceUnit}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 5 
                          ? 'bg-green-100 text-green-700'
                          : product.stock > 0
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock} unités
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.featured && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                            Phare
                          </span>
                        )}
                        {product.new && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                            Nouveau
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}