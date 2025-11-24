'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRight, 
  CheckCircle, 
  ShoppingCart,
  Package,
  Star,
  TrendingUp,
  Shield,
  Truck,
  HeadphonesIcon,
  Zap
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

interface MooktarHomePageClientProps {
  locale: string
  slug: string
}

export function MooktarHomePageClient({ locale, slug }: MooktarHomePageClientProps) {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const addToCart = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient()
        
        // Récupérer l'organization_id
        const { data: org } = await supabase
          .from('organizations')
          .select('id')
          .eq('slug', slug)
          .single()

        if (!org) return

        // Récupérer les produits
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('organization_id', (org as any).id)
          .order('created_at', { ascending: false })
          .limit(12)

        if (productsData) {
          setProducts(productsData)
          
          // Extraire les catégories uniques
          const uniqueCategories = [...new Set(productsData.map((p: any) => p.category).filter(Boolean))]
          setCategories(uniqueCategories.slice(0, 6))
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [slug])

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1
    })
    toast.success(`${product.name} ajouté au panier`)
  }

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Garantie 2 ans',
      description: 'Tous nos produits sont garantis'
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Livraison rapide',
      description: '24-48h partout au Sénégal'
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6" />,
      title: 'Support 24/7',
      description: 'Assistance technique disponible'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Paiement sécurisé',
      description: 'Transactions sécurisées'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-black mb-6"
            >
              Technologie de pointe
              <br />
              <span className="text-blue-200">pour votre entreprise</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-blue-100 mb-8"
            >
              Découvrez notre sélection de produits high-tech : ordinateurs, smartphones, imprimantes et accessoires.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href={`/${locale}/org/${slug}/shop`}
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Voir tous les produits
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={`/${locale}/org/${slug}/contact`}
                className="px-8 py-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-all border-2 border-white/20"
              >
                Nous contacter
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      {categories.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nos catégories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category: any, idx: number) => (
                <Link
                  key={category}
                  href={`/${locale}/org/${slug}/shop?category=${encodeURIComponent(category)}`}
                  className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500"
                >
                  <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold text-gray-900">{category}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Produits phares */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Produits phares</h2>
              <p className="text-gray-600">Découvrez nos meilleures ventes</p>
            </div>
            <Link
              href={`/${locale}/org/${slug}/shop`}
              className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2"
            >
              Voir tout
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_: any, i: number) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any, idx: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all group"
                >
                  {product.image_url && (
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.featured && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          Populaire
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    {product.brand && (
                      <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {product.price?.toLocaleString()} FCFA
                        </p>
                        {product.stock !== undefined && (
                          <p className="text-xs text-gray-500">
                            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Ajouter au panier
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Aucun produit disponible pour le moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Pourquoi choisir Mooktar Tech ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-4">Prêt à passer commande ?</h2>
          <p className="text-xl text-blue-100 mb-8">Découvrez notre catalogue complet de produits high-tech</p>
          <Link
            href={`/${locale}/org/${slug}/shop`}
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
          >
            Voir le catalogue
          </Link>
        </div>
      </section>
    </div>
  )
}

