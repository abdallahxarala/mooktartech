'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Search, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import toast from 'react-hot-toast'
import { ProductImage } from '@/components/product-image'
import { useProducts } from '@/hooks/use-products'

export default function ProductsPage() {
  const { products, isLoading } = useProducts()
  const addToCart = useCartStore((state) => state.addItem)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Extract unique categories and brands from products
  const categories = useMemo(() => {
    const cats = new Set<string>()
    products.forEach((p) => {
      if (p.category?.slug) {
        cats.add(p.category.slug)
      }
    })
    return ['all', ...Array.from(cats).sort()]
  }, [products])

  const brands = useMemo(() => {
    const brs = new Set<string>()
    products.forEach((p) => {
      if (p.brand) {
        brs.add(p.brand)
      }
    })
    return ['all', ...Array.from(brs).sort()]
  }, [products])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.short_description && p.short_description.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory =
        categoryFilter === 'all' ||
        (categoryFilter === p.category?.slug) ||
        (categoryFilter === p.category?.name?.toLowerCase())

      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, categoryFilter])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement des produits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Notre Catalogue
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre gamme complète de solutions d'identification professionnelle
          </p>
        </div>

        {/* Filtres */}
        <div className="flex gap-4 mb-12">
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
            {categories
              .filter((c) => c !== 'all')
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </div>

        {/* Compteur */}
        <div className="mb-8">
          <p className="text-gray-600">
            <span className="font-bold text-orange-500">{filteredProducts.length}</span> produits
            trouvés
          </p>
        </div>

        {/* Grille de produits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const displayImage = product.image_url || product.gallery?.[0]

            return (
              <Link
                key={product.id}
                href={`/fr/products/${product.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-orange-500 transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-100">
                  <ProductImage
                    src={displayImage}
                    alt={product.name}
                    productId={product.id}
                    productName={product.name}
                    brand={product.brand || ''}
                    className="w-full h-full"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none z-10">
                    {product.is_featured && (
                      <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                        ⭐ Phare
                      </span>
                    )}
                    {product.is_new && (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                        ✨ Nouveau
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-20 p-6 bg-white">
                  <div className="text-xs text-gray-500 mb-2">{product.brand}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.short_description || product.description?.substring(0, 80)}
                  </p>

                  {/* Prix */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-orange-500">
                        {product.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">{product.price_unit || 'XOF'}</div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="relative z-50 mt-4 flex gap-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // Convert to cart format
                        const cartProduct = {
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: displayImage,
                          slug: product.slug
                        }
                        addToCart(cartProduct)
                        toast.success(`${product.name} ajouté au panier !`)
                      }}
                      className="flex items-center justify-center gap-2 flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="hidden sm:inline">Panier</span>
                    </button>

                    <Link
                      href={`/fr/products/${product.slug}`}
                      className="flex items-center justify-center gap-2 flex-1 px-4 py-3 border-2 border-orange-500 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <span>Voir</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>

                  {/* Stock */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span
                      className={`text-xs font-medium ${
                        product.stock > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {product.stock > 0
                        ? `✓ En stock (${product.stock})`
                        : '✕ Rupture de stock'}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Aucun résultat */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}
