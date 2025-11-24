'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useCartStore } from '@/lib/store/cart-store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, Plus, Minus, ShoppingCart, ArrowLeft, ChevronRight, Share2, Facebook, Twitter } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProductDetailPageProps {
  params: {
    locale: string
    slug: string
    productId: string
  }
}

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
  brand: string | null
  stock: number | null
  featured: boolean | null
  organization_id: string
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(price) + ' FCFA'
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug, productId } = params
  const router = useRouter()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)

  const addToCart = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const supabase = createSupabaseBrowserClient()

        // Produit principal
        const { data: prod, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (error || !prod) {
          setProduct(null)
          setLoading(false)
          return
        }

        const prodData = prod as any
        setProduct(prodData as Product)

        // Produits similaires (même catégorie, même organisation)
        if (prodData.category && prodData.organization_id) {
          const { data: similar } = await supabase
            .from('products')
            .select('*')
            .eq('organization_id', prodData.organization_id)
            .eq('category', prodData.category)
            .neq('id', productId)
            .limit(4)

          setSimilarProducts((similar || []) as Product[])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return

    const stockAvailable = product.stock || 0
    if (stockAvailable <= 0) {
      toast.error('Produit en rupture de stock')
      return
    }

    if (quantity > stockAvailable) {
      toast.error(`Quantité maximale disponible : ${stockAvailable}`)
      return
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image_url || undefined,
      brand: product.brand || undefined,
      stock: stockAvailable,
      shortDescription: product.description || undefined
    })

    toast.success('Produit ajouté au panier !')
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push(`/${locale}/org/${slug}/checkout`)
  }

  const incrementQuantity = () => {
    if (product && quantity < (product.stock || 10)) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // Partage réseaux sociaux
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = product ? `${product.name} - ${formatPrice(product.price)}` : ''

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
    window.open(url, '_blank')
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Lien copié dans le presse-papiers !')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Chargement...</div>
      </div>
    )
  }

  // 404 state
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Produit non trouvé</h1>
          <Link href={`/${locale}/org/${slug}/shop`}>
            <button className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
              Retour à la boutique
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const stockAvailable = product.stock || 0
  const isOutOfStock = stockAvailable <= 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb complet */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link
                href={`/${locale}/org/${slug}`}
                className="hover:text-[#FF6B35] transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4" />
            </li>
            <li>
              <Link
                href={`/${locale}/org/${slug}/shop`}
                className="hover:text-[#FF6B35] transition-colors"
              >
                Boutique
              </Link>
            </li>
            {product.category && (
              <>
                <li>
                  <ChevronRight className="w-4 h-4" />
                </li>
                <li>
                  <Link
                    href={`/${locale}/org/${slug}/shop`}
                    className="hover:text-[#FF6B35] transition-colors"
                  >
                    {product.category}
                  </Link>
                </li>
              </>
            )}
            <li>
              <ChevronRight className="w-4 h-4" />
            </li>
            <li className="text-gray-900 font-medium" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Bouton retour */}
        <div className="mb-6">
          <Link
            href={`/${locale}/org/${slug}/shop`}
            className="inline-flex items-center text-[#FF6B35] hover:text-orange-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la boutique
          </Link>
        </div>

        {/* SECTION PRINCIPALE - Grid 2 colonnes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* COLONNE GAUCHE - IMAGE */}
            <div className="lg:w-full">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Package className="w-24 h-24" />
                  </div>
                )}
                
                {/* Badge "Nouveau" sur l'image */}
                {product.featured && (
                  <span className="absolute top-4 left-4 bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    Nouveau
                  </span>
                )}
              </div>
            </div>

            {/* COLONNE DROITE - INFORMATIONS */}
            <div className="lg:w-full flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {product.category && (
                        <span className="inline-block bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded mb-4">
                          {product.category}
                        </span>
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {product.name}
                        </h1>
                        {/* Badge "Nouveau" dans le header */}
                        {product.featured && (
                          <span className="bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Nouveau
                          </span>
                        )}
                      </div>
                      {product.brand && (
                        <p className="text-gray-600 text-lg">
                          {product.brand}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Partage réseaux sociaux */}
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600 mr-2">Partager :</span>
                    <button
                      onClick={handleShareFacebook}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Partager sur Facebook"
                      title="Partager sur Facebook"
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={handleShareTwitter}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Partager sur Twitter"
                      title="Partager sur Twitter"
                    >
                      <Twitter className="w-5 h-5 text-blue-400" />
                    </button>
                    <button
                      onClick={handleShareWhatsApp}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Partager sur WhatsApp"
                      title="Partager sur WhatsApp"
                    >
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Copier le lien"
                      title="Copier le lien"
                    >
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Prix et Stock */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-[#FF6B35] mb-4">
                    {formatPrice(product.price)}
                  </div>
                  <div>
                    {isOutOfStock ? (
                      <span className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded">
                        Rupture de stock
                      </span>
                    ) : (
                      <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded">
                        En stock ({stockAvailable} disponible{stockAvailable > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Description
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Selector Quantité */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantité
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= stockAvailable || isOutOfStock}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    {!isOutOfStock && (
                      <span className="text-sm text-gray-600">
                        ({stockAvailable} disponible{stockAvailable > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Boutons Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full bg-[#FF6B35] hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ajouter au panier
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition-colors"
                >
                  Acheter maintenant
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION PRODUITS SIMILAIRES */}
        {similarProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Produits Similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <Link
                  key={similarProduct.id}
                  href={`/${locale}/org/${slug}/shop/${similarProduct.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {similarProduct.image_url ? (
                      <img
                        src={similarProduct.image_url}
                        alt={similarProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <Package className="w-12 h-12" />
                      </div>
                    )}

                    {/* Badge Featured */}
                    {similarProduct.featured && (
                      <span className="absolute top-2 left-2 bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Nouveau
                      </span>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-4">
                    {/* Catégorie */}
                    {similarProduct.category && (
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded mb-2 inline-block">
                        {similarProduct.category}
                      </span>
                    )}

                    {/* Nom */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {similarProduct.name}
                    </h3>

                    {/* Prix */}
                    <div className="mb-2">
                      <span className="text-xl font-bold text-[#FF6B35]">
                        {formatPrice(similarProduct.price)}
                      </span>
                    </div>

                    {/* Stock */}
                    <div className="text-xs">
                      {(similarProduct.stock || 0) > 0 ? (
                        <span className="text-green-600">En stock</span>
                      ) : (
                        <span className="text-red-600">Rupture</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
