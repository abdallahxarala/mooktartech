'use client'

import { useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
}

interface HeroCarouselProps {
  products: Product[]
  locale: string
  slug: string
}

// FONCTION LOCALE - pas passée en props
function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(price) + ' FCFA'
}

export function HeroCarousel({ products, locale, slug }: HeroCarouselProps) {
  // Stabiliser les produits avec useMemo pour éviter les re-renders inutiles
  const stableProducts = useMemo(() => {
    if (!products || products.length === 0) return []
    // Filtrer les produits valides et limiter à 5
    return products
      .filter(p => p && p.id && p.name)
      .slice(0, 5)
  }, [products])

  // Générer une clé unique basée sur les IDs des produits pour forcer le re-render complet de Swiper
  const swiperKey = useMemo(() => {
    return stableProducts.map(p => p.id).join('-')
  }, [stableProducts])

  if (stableProducts.length === 0) {
    return null
  }

  const hasMultipleProducts = stableProducts.length > 1

  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      <Swiper
        key={swiperKey}
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={hasMultipleProducts ? { delay: 5000, disableOnInteraction: false } : false}
        navigation={hasMultipleProducts}
        pagination={hasMultipleProducts ? { clickable: true } : false}
        loop={hasMultipleProducts}
        className="h-full"
      >
        {stableProducts.map((product) => (
          <SwiperSlide key={`${product.id}-${swiperKey}`}>
            <div 
              className="relative h-full w-full bg-cover bg-center"
              style={{
                backgroundImage: product.image_url 
                  ? `url(${product.image_url})` 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              {/* Overlay noir semi-transparent */}
              <div className="absolute inset-0 bg-black/50" />
              
              {/* Contenu centré */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-5xl font-bold text-white mb-4">
                  {product.name}
                </h2>
                <p className="text-4xl font-bold text-orange-400 mb-8">
                  {formatPrice(product.price)}
                </p>
                <Link
                  href={`/${locale}/org/${slug}/shop/${product.id}`}
                  className="bg-orange-500 px-8 py-4 rounded-full text-white font-semibold hover:bg-orange-600 transition-all"
                >
                  Découvrir
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
