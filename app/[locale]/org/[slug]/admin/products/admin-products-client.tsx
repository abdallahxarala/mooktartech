'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Filter,
  Download,
  Image as ImageIcon
} from 'lucide-react'
import toast from 'react-hot-toast'
import { ProductForm } from '@/components/admin/product-form'
import { createClient } from '@/lib/supabase/client'

interface AdminProductsClientProps {
  products: any[]
  organizationId: string
  organizationSlug: string
  locale: string
  totalProducts: number
}

export function AdminProductsClient({
  products: initialProducts,
  organizationId,
  organizationSlug,
  locale,
  totalProducts
}: AdminProductsClientProps) {
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, categoryFilter])

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('organization_id', organizationId) // Sécurité supplémentaire

      if (error) throw error

      setProducts(products.filter(p => p.id !== id))
      toast.success('Produit supprimé avec succès')
    } catch (error: any) {
      console.error('Error deleting product:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleRefresh = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setProducts(data || [])
      toast.success('Produits actualisés')
    } catch (error: any) {
      console.error('Error refreshing products:', error)
      toast.error('Erreur lors de l\'actualisation')
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    // Rafraîchir la liste après modification
    handleRefresh()
  }

  const basePath = `/${locale}/org/${organizationSlug}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-gray-900">Gestion des Produits</h1>
              <p className="text-gray-600 mt-2">
                {totalProducts} produits dans le catalogue
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Actualiser</span>
              </button>

              <Link
                href={`${basePath}/admin/products/import-cartes`}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-all shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span>Import Cartes</span>
              </Link>

              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
              >
                <Plus className="w-5 h-5" />
                <span>Nouveau Produit</span>
              </button>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            >
              <option value="all">Toutes les catégories</option>
              <option value="Imprimantes PVC">Imprimantes PVC</option>
              <option value="Cartes PVC">Cartes PVC</option>
              <option value="Accessoires">Accessoires</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-6 py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Aucun produit
            </h3>
            <p className="text-gray-600 mb-8">
              Commencez par ajouter votre premier produit
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter un produit</span>
            </button>
          </div>
        ) : (
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img 
                              src={`${product.image_url}?t=${Date.now()}`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 truncate">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {product.brand || 'Sans marque'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full capitalize">
                        {product.category || 'Non catégorisé'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {new Intl.NumberFormat('fr-FR').format(product.price)} FCFA
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        (product.stock || 0) > 5 
                          ? 'bg-green-100 text-green-700'
                          : (product.stock || 0) > 0
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock || 0} unités
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.featured && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                            Phare
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                        
                        <Link
                          href={`${basePath}/shop/${product.id}`}
                          target="_blank"
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Formulaire */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
          organizationId={organizationId}
        />
      )}
    </div>
  )
}

