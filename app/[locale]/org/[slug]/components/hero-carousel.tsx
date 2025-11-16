'use client'

import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
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
  formatPrice: (price: number) => string
}

export function HeroCarousel({ products, locale, slug, formatPrice }: HeroCarouselProps) {
  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={true}
        pagination={{ clickable: true }}
        loop={products.length > 1}
        className="h-full"
      >
        {products.length > 0 ? (
          products.map((product) => (
            <SwiperSlide key={product.id}>
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
          ))
        ) : (
          <SwiperSlide>
            <div className="h-full w-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-5xl font-bold mb-4">Bienvenue chez MOOKTAR</h2>
                <p className="text-2xl mb-8">Découvrez nos produits innovants</p>
                <Link
                  href={`/${locale}/org/${slug}/shop`}
                  className="px-8 py-4 bg-white text-orange-500 font-bold rounded-full hover:bg-gray-100 transition-all"
                >
                  Voir la boutique
                </Link>
              </div>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </section>
  )
}
