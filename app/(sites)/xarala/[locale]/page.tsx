'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useProductsSync } from '@/hooks/use-products-sync'
import { ProductImage } from '@/components/product-image'
import { HeroCarousel } from '@/components/hero-carousel'
import { 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Shield, 
  Award,
  Sparkles,
  TrendingUp,
  Package,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Star,
  ThumbsUp,
  MessageCircle,
  Truck,
  HeadphonesIcon,
  BadgeCheck,
  AlertCircle,
  ShoppingCart
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import toast from 'react-hot-toast'

export default function HomePage() {
  const { products, isHydrated } = useProductsSync()
  // Ordre spécifique pour l'affichage des produits phares
  const allFeaturedProducts = products.filter((p: any) => p.featured)
  const baseOrder = [
    'evolis-primacy-2',
    'sigma-ds1',
    'hiti-cs200e'
  ]
  const featuredProducts = [
    allFeaturedProducts.find((p: any) => p.id === 'evolis-primacy-2'),
    allFeaturedProducts.find((p: any) => p.id === 'sigma-ds1'),
    allFeaturedProducts.find((p: any) => p.id === 'hiti-cs200e')
  ].filter(Boolean) as any[]
  if (featuredProducts.length < 3) {
    const remaining = allFeaturedProducts.filter((p: any) => !baseOrder.includes(p.id))
    featuredProducts.push(...remaining.slice(0, 3 - featuredProducts.length))
  }
  const addToCart = useCartStore((state) => state.addItem)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const renderKey = Date.now()

  // Auto-rotation témoignages
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

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

  const testimonials = [
    {
      name: "Abdoulaye Diop",
      role: "DRH, Sonatel",
      text: "Service impeccable ! Nos badges d'entreprise sont désormais professionnels et sécurisés. Livraison rapide et formation complète.",
      rating: 5
    },
    {
      name: "Mariama Sarr",
      role: "Directrice, Lycée Blaise Diagne",
      text: "Excellente solution pour nos cartes étudiants. L'équipe Xarala est très réactive et professionnelle.",
      rating: 5
    },
    {
      name: "Moussa Kane",
      role: "Responsable IT, Ministère de la Santé",
      text: "Matériel de qualité et support technique au top. Nous recommandons vivement Xarala Solutions.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* ============================================ */}
      {/* HERO CAROUSEL - Fullwidth Modern */}
      {/* ============================================ */}
      <HeroCarousel />

      {/* ============================================ */}
      {/* RESTE DES SECTIONS (Logos, Services, etc.) */}
      {/* ============================================ */}
      
      {/* HERO SECTION - Legacy (hidden, kept for reference) */}
      <section className="hidden relative overflow-hidden bg-white">
        {/* Fond décoratif subtil */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-50/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-50/50 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Colonne Gauche - Proposition de Valeur */}
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-md border-2 border-orange-100">
                <BadgeCheck className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-bold text-gray-900">
                  +500 clients satisfaits au Sénégal
                </span>
              </div>

              {/* Titre Principal - Bénéfice clair */}
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                Créez vos badges professionnels
                <span className="block text-orange-500 mt-2">
                  en 24 heures
                </span>
              </h1>

              {/* Sous-titre - Point de douleur + Solution */}
              <p className="text-xl text-gray-600 leading-relaxed">
                Fini les badges artisanaux et les délais interminables. 
                <span className="font-semibold text-gray-900"> Imprimantes professionnelles</span>, 
                <span className="font-semibold text-gray-900"> formation incluse</span> et 
                <span className="font-semibold text-gray-900"> support local</span> à Dakar.
              </p>

              {/* Bénéfices clés avec icônes */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Livraison 24-48h</div>
                    <div className="text-sm text-gray-600">À Dakar et environs</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <HeadphonesIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Formation gratuite</div>
                    <div className="text-sm text-gray-600">Et support francophone</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Garantie étendue</div>
                    <div className="text-sm text-gray-600">Jusqu'à 36 mois</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Marques leaders</div>
                    <div className="text-sm text-gray-600">Entrust, Datacard, HiTi</div>
                  </div>
                </div>
              </div>

              {/* CTAs Hiérarchisés */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:+221775398139"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-orange-500 text-white text-lg font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
                >
                  <Phone className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs opacity-90 font-normal">Appelez maintenant</div>
                    <div>+221 77 539 81 39</div>
                  </div>
                </a>

                <Link
                  href="/fr/products"
                  className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-white text-gray-900 text-lg font-bold rounded-2xl border-2 border-gray-200 hover:border-orange-500 hover:text-orange-500 transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Voir les produits</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Preuve sociale en temps réel */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center text-white font-bold text-sm"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-bold text-gray-900">+500 clients</div>
                  <div className="text-gray-600">nous font confiance</div>
                </div>
              </div>
            </div>

            {/* Colonne Droite - Visuel Hero */}
            <div className="relative lg:block hidden">
              <div className="relative">
                {/* Image produit phare ou mockup */}
                <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8">
                  {featuredProducts[0] && (
                    <ProductImage
                      src={featuredProducts[0].mainImage}
                      alt={featuredProducts[0].name}
                      productId={featuredProducts[0].id}
                      productName={featuredProducts[0].name}
                      brand={featuredProducts[0].brand}
                      className="w-full aspect-square rounded-2xl"
                    />
                  )}
                  
                  {/* Badge promo flottant */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-br from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-xl rotate-3">
                    <div className="text-xs font-semibold">OFFRE SPÉCIALE</div>
                    <div className="text-2xl font-black">-15%</div>
                  </div>
                </div>

                {/* Éléments flottants */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Star className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">4.9/5</div>
                      <div className="text-sm text-gray-600">+120 avis</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -left-6 bg-blue-500 text-white rounded-2xl shadow-xl p-4 animate-pulse">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <div className="text-sm font-bold">23 en ligne</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS CLIENTS - Preuve Sociale */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Ils nous font confiance
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {['Sonatel', 'Ministère Santé', 'UGB', 'UCAD', 'Air Sénégal', 'BRVM'].map((client) => (
              <div key={client} className="text-xl font-bold text-gray-400">
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION SERVICES - Nos Solutions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Nos services professionnels</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Au-delà des imprimantes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des solutions complètes pour tous vos besoins d'identification professionnelle
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {/* Service 1 : Cartes PVC */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-100 hover:border-blue-300 transition-all hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center border-2 border-blue-200 group-hover:scale-110 transition-transform">
                  <Package className="w-10 h-10 text-blue-600" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-4">
                Cartes PVC personnalisées
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Vente et impression de tous types de cartes vierges ou pré-imprimées. 
                Qualité professionnelle, livraison rapide.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Cartes vierges blanches standard</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Cartes pré-imprimées personnalisées</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Tous formats : CR80, CR79, badges</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Livraison 24-48h à Dakar</span>
                </li>
              </ul>

              <Link
                href="/fr/products?category=cartes-pvc"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
              >
                <span>Voir les cartes</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">À partir de</span>
                <div className="text-2xl font-black text-blue-600">50 FCFA/carte</div>
              </div>
            </div>

            {/* Service 2 : Cartes NFC - STAR */}
            <div className="group relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 border-2 border-orange-300 hover:border-orange-400 transition-all hover:-translate-y-2 hover:shadow-2xl lg:-mt-4 lg:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 blur-xl opacity-50" />
                  <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-xl border-2 border-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>100% GRATUIT</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="mb-6 mt-4">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center border-2 border-orange-300 group-hover:scale-110 transition-transform">
                  <Zap className="w-10 h-10 text-orange-600" />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold mb-4">
                <Sparkles className="w-3 h-3" />
                <span>NOUVEAU</span>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-4">
                Cartes NFC virtuelles & physiques
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                Créez votre carte de visite digitale NFC gratuitement ! 
                Partagez vos informations d'un simple tap.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Création gratuite en 2 minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Carte virtuelle + QR code inclus</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Option carte physique NFC disponible</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Partage illimité par tap ou scan</span>
                </li>
              </ul>

              <Link
                href="/fr/nfc-editor"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl text-lg"
              >
                <Sparkles className="w-5 h-5" />
                <span>Créer ma carte NFC gratuite</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-orange-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Carte physique NFC (optionnel)</div>
                  <div className="text-xl font-black text-orange-600">5 000 FCFA</div>
                  <div className="text-xs text-gray-500 mt-1">Livraison incluse</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center text-white font-bold text-xs"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-gray-600">
                  <span className="font-bold text-orange-600">+150</span> cartes créées
                </span>
              </div>
            </div>

            {/* Service 3 : Éditeur de Cartes */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-100 hover:border-purple-300 transition-all hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute -top-3 -right-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 blur-lg opacity-50" />
                  <div className="relative bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-xs font-black shadow-xl border-2 border-white">
                    <div className="text-center leading-tight">
                      <div>100%</div>
                      <div>GRATUIT</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center border-2 border-purple-200 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-4">
                Éditeur de cartes en série
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Outil professionnel gratuit pour concevoir et imprimer vos badges 
                en série. Importez vos données et automatisez !
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Interface drag & drop intuitive</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Import Excel/CSV pour impression série</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Templates professionnels inclus</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Export PDF haute qualité</span>
                </li>
              </ul>

              <div className="space-y-3">
                <Link
                  href="/fr/card-editor"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg"
                >
                  <span>Accéder à l'éditeur</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#demo-video"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-purple-300 text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  <span>Voir la démo</span>
                </a>
              </div>

              <div className="mt-4 text-center p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-purple-200">
                <div className="text-sm text-gray-600">Déjà utilisé par</div>
                <div className="text-xl font-black text-purple-600">+80 entreprises</div>
              </div>
            </div>
          </div>

          {/* CTA comparative */}
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-500/20 to-transparent" />
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-black mb-3">
                  Besoin d'une solution complète ?
                </h3>
                <p className="text-xl text-gray-300">
                  Imprimante + cartes + logiciel : pack tout-en-un avec formation incluse
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/fr/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-xl"
                >
                  <span>Demander un devis pack</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="tel:+221775398139"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  <span>+221 77 539 81 39</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUITS PHARES - Design Premium */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header avec urgence */}
          <div className="text-center mb-16">
            {/* Badge urgence animé */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 rounded-full text-sm font-bold mb-6 animate-pulse shadow-lg border-2 border-red-200">
              <Zap className="w-4 h-4" />
              <span>Stock limité • Livraison sous 24h à Dakar</span>
            </div>

            {/* Titre principal */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Nos imprimantes
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mt-2">
                les plus vendues
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choisies par +200 entreprises et administrations au Sénégal
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredProducts.map((product, index) => {
              const displayImage = product.mainImage ? `${product.mainImage.split('?')[0]}?v=${renderKey}` : undefined

              return (
                <div
                  key={product.id}
                  className={`group bg-white rounded-3xl overflow-hidden transition-all duration-500 ${
                    index === 1 
                      ? 'shadow-2xl shadow-orange-500/20 ring-4 ring-orange-500 ring-offset-4 lg:scale-105' 
                      : 'shadow-xl hover:shadow-2xl border-2 border-gray-100 hover:border-orange-500'
                  }`}
                >
                  {index === 1 && (
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                      <div className="relative">
                        <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-50" />
                        <div className="relative bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white px-8 py-3 rounded-b-2xl font-black text-sm shadow-2xl flex items-center gap-2 border-4 border-white">
                          <TrendingUp className="w-5 h-5" />
                          <span>⭐ PLUS POPULAIRE ⭐</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 pointer-events-none">
                    {product.featured && index !== 1 && (
                      <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>PHARE</span>
                      </div>
                    )}
                    {product.new && (
                      <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>NOUVEAU</span>
                      </div>
                    )}
                  </div>

                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <ProductImage
                      src={displayImage}
                      alt={product.name}
                      productId={product.id}
                      productName={product.name}
                      brand={product.brand}
                      className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />

                    {product.stock <= 3 && (
                      <div className="absolute top-6 left-6 z-10 pointer-events-none">
                        <div className="relative">
                          <div className="absolute inset-0 bg-red-500 blur-xl opacity-60" />
                          <div className="relative bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-black shadow-2xl border-2 border-white flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 animate-pulse" />
                            <span>Plus que {product.stock} !</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative z-20 p-8 bg-white">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-5 h-5 fill-orange-400" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-semibold">(47 avis)</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-orange-600 font-black text-sm">
                        {product.brand[0]}
                      </div>
                      <span className="text-sm font-bold text-orange-600">
                        {product.brand}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-medium">Formation gratuite incluse</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Truck className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-gray-700 font-medium">Installation sous 24h à Dakar</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <HeadphonesIcon className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-gray-700 font-medium">Support technique local</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border-2 border-green-200">
                      <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>Économisez 250 000 FCFA vs concurrent</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-4xl font-black text-gray-900">
                          {product.price.toLocaleString()}
                        </span>
                        <span className="text-lg text-gray-500 font-semibold">{product.priceUnit}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="line-through">
                          {(product.price * 1.15).toLocaleString()} FCFA
                        </span>
                        <span className="ml-2 text-green-600 font-bold">-15% 🎉</span>
                      </div>
                    </div>

                    <div className="relative z-30 space-y-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // @ts-ignore - types differ between homepage products and cart Product
                          addToCart(product)
                          toast.success(
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <div>
                                <div className="font-bold">Ajouté au panier !</div>
                                <div className="text-sm text-gray-600">{product.name}</div>
                              </div>
                            </div>,
                            { duration: 3000 }
                          )
                        }}
                        className="relative z-50 flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-black rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Ajouter au panier</span>
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href={`/fr/products/${product.slug}`}
                          className="relative z-50 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <span>Détails</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>

                        <a
                          href="tel:+221775398139"
                          className="relative z-50 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <Phone className="w-4 h-4" />
                          <span>Appeler</span>
                        </a>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                      {product.stock > 0 ? (
                        <>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-green-600 font-bold">
                            En stock ({product.stock} unités)
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          <span className="text-red-600 font-bold">Rupture de stock</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/3 group-hover:to-pink-500/3 transition-all duration-500 pointer-events-none" />
                </div>
              )
            })}
          </div>

          <div className="mt-12 max-w-3xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-green-200">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600" />
                <span className="font-bold text-gray-900">Garantie 36 mois</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-gray-900">Livraison offerte</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-6 h-6 text-orange-600" />
                <span className="font-bold text-gray-900">Satisfait ou remboursé 30j</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES - Preuve Sociale Forte */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600">
              +500 entreprises nous font confiance
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-8 h-8 fill-orange-400 text-orange-400" />
                ))}
              </div>

              <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
                "{testimonials[activeTestimonial].text}"
              </blockquote>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[activeTestimonial].role}
                  </div>
                </div>

                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === activeTestimonial
                          ? 'bg-orange-500 w-8'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESSUS - Réduction Friction */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Simple, rapide et sans risque
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '1',
                icon: Phone,
                title: 'Contactez-nous',
                desc: 'Par téléphone ou formulaire, décrivez vos besoins',
                color: 'orange'
              },
              {
                step: '2',
                icon: MessageCircle,
                title: 'Devis gratuit',
                desc: 'Recevez votre devis personnalisé en 2h',
                color: 'blue'
              },
              {
                step: '3',
                icon: Truck,
                title: 'Livraison 24h',
                desc: 'Installation et formation sur site à Dakar',
                color: 'green'
              },
              {
                step: '4',
                icon: HeadphonesIcon,
                title: 'Support illimité',
                desc: 'Assistance technique locale en français',
                color: 'purple'
              }
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200 z-0" />
                )}

                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-${item.color}-100 border-4 border-white shadow-lg mb-4`}>
                    <item.icon className={`w-10 h-10 text-${item.color}-600`} />
                  </div>

                  <div className={`inline-block px-3 py-1 bg-${item.color}-500 text-white text-sm font-bold rounded-full mb-3`}>
                    Étape {item.step}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL - Urgence + Réduction Risque */}
      <section className="py-20 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mb-8 animate-pulse">
              <Clock className="w-5 h-5" />
              <span>Offre limitée • 15% de réduction ce mois-ci</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Prêt à professionnaliser<br />vos badges ?
            </h2>

            <p className="text-xl md:text-2xl mb-12 opacity-95">
              Rejoignez les +500 entreprises qui nous font confiance.<br />
              <span className="font-bold">Devis gratuit en 2h</span> • <span className="font-bold">Livraison 24h</span> • <span className="font-bold">Formation incluse</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="tel:+221775398139"
                className="group inline-flex items-center justify-center gap-3 px-10 py-6 bg-white text-orange-500 text-xl font-black rounded-2xl hover:bg-gray-50 transition-all shadow-2xl hover:scale-105"
              >
                <Phone className="w-7 h-7" />
                <div className="text-left">
                  <div className="text-xs font-normal opacity-70">Appelez maintenant</div>
                  <div>+221 77 539 81 39</div>
                </div>
              </a>

              <Link
                href="/fr/contact"
                className="inline-flex items-center justify-center gap-3 px-10 py-6 bg-orange-700 text-white text-xl font-black rounded-2xl hover:bg-orange-800 transition-all shadow-xl border-2 border-white/20"
              >
                <Mail className="w-6 h-6" />
                <span>Devis par email</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Garantie 36 mois</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Réduction Objections */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce que vous devez savoir
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Quelle est la durée de la garantie ?",
                a: "Toutes nos imprimantes bénéficient d'une garantie constructeur de 24 à 36 mois selon les modèles, avec support technique local à Dakar."
              },
              {
                q: "La formation est-elle vraiment incluse ?",
                a: "Oui, absolument ! Nous formons gratuitement vos équipes à l'utilisation de l'imprimante, sur site à Dakar ou en visioconférence pour les régions."
              },
              {
                q: "Combien de temps pour recevoir ma commande ?",
                a: "24 à 48h pour Dakar et environs, 3 à 5 jours ouvrés pour les autres régions du Sénégal. Les produits en stock sont livrés immédiatement."
              },
              {
                q: "Proposez-vous un service après-vente ?",
                a: "Oui, notre équipe technique est basée à Dakar et intervient rapidement. Support par téléphone, email et intervention sur site si nécessaire."
              },
              {
                q: "Puis-je avoir un devis personnalisé ?",
                a: "Bien sûr ! Contactez-nous par téléphone (+221 77 539 81 39) ou formulaire et vous recevrez votre devis gratuit sous 2h."
              }
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-gray-900 text-lg">
                  <span>{faq.q}</span>
                  <ArrowRight className="w-5 h-5 text-orange-500 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Vous avez d'autres questions ?</p>
            <Link
              href="/fr/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contactez-nous</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}