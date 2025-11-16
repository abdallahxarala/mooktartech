import { getFoireBySlug } from '@/lib/services/foire.service'
import { format } from 'date-fns'
import { fr, en } from 'date-fns/locale'
import Link from 'next/link'
import { Calendar, MapPin, Users, Building2, Ticket, BookOpen, Mail, Phone, Sparkles, TrendingUp, Globe, Award } from 'lucide-react'

const dateLocales = { fr, en, wo: fr }

interface FoiresPageProps {
  params: {
    locale: string
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function FoiresPage({ params }: FoiresPageProps) {
  const { foire, error } = await getFoireBySlug('foire-dakar-2025')
  const locale = params.locale as 'fr' | 'en' | 'wo'
  const dateLocale = dateLocales[locale] || dateLocales.fr

  if (error || !foire) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Erreur</h1>
          <p className="text-gray-600">{error || 'Foire introuvable'}</p>
        </div>
      </div>
    )
  }

  const foireConfig = foire.foire_config as any
  const pavillons = foireConfig?.pavillons || {}
  const pavillonsArray = Object.entries(pavillons).map(([key, value]: [string, any]) => ({
    id: key,
    ...value,
  }))

  const startDate = new Date(foire.start_date)
  const endDate = new Date(foire.end_date)
  const formattedStartDate = format(startDate, 'd MMMM yyyy', { locale: dateLocale })
  const formattedEndDate = format(endDate, 'd MMMM yyyy', { locale: dateLocale })

  const basePath = `/${params.locale}/org/${params.slug}/foires`

  // Catégories par pavillon (exemple)
  const categoriesByPavillon: Record<string, string[]> = {
    A: ['Technologie', 'Innovation', 'Startups', 'Digital'],
    B: ['Agriculture', 'Agroalimentaire', 'Artisanat', 'Textile'],
    C: ['Services', 'Finance', 'Éducation', 'Santé'],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Événement International</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              {foire.name}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {foire.description || 'La plus grande foire internationale du Sénégal'}
            </p>
            
            {/* Dates et Lieu */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">{formattedStartDate} - {formattedEndDate}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">{foireConfig?.lieu || foire.location}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`${basePath}/inscription`}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-yellow-50 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                S'inscrire comme Exposant
              </Link>
              <Link
                href={`${basePath}/tickets`}
                className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Acheter un Ticket
              </Link>
              <Link
                href={`${basePath}/catalogue`}
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-lg font-bold text-lg hover:bg-white/30 transition-all transform hover:scale-105"
              >
                Voir le Catalogue
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Exposants</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-shadow">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <div className="text-4xl font-bold text-purple-600 mb-2">{pavillonsArray.length}</div>
              <div className="text-gray-600 font-medium">Pavillons</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-lg transition-shadow">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <div className="text-4xl font-bold text-orange-600 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Visiteurs</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-shadow">
              <Globe className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <div className="text-4xl font-bold text-green-600 mb-2">30+</div>
              <div className="text-gray-600 font-medium">Pays</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pavillons Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos Pavillons
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos espaces d'exposition dédiés à différents secteurs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pavillonsArray.map((pavillon, index) => (
              <div
                key={pavillon.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
                  index === 0 ? 'from-blue-500 to-purple-500' :
                  index === 1 ? 'from-purple-500 to-pink-500' :
                  'from-orange-500 to-red-500'
                }`}></div>
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                      {pavillon.id}
                    </div>
                    <Award className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pavillon.nom}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 min-h-[60px]">
                    {pavillon.description || 'Espace d\'exposition moderne et équipé'}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Capacité</span>
                      <span className="font-bold text-gray-900">{pavillon.capacite} exposants</span>
                    </div>
                    {pavillon.superficie && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Superficie</span>
                        <span className="font-bold text-gray-900">{pavillon.superficie} m²</span>
                      </div>
                    )}
                  </div>

                  {/* Catégories */}
                  {categoriesByPavillon[pavillon.id] && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Catégories :</p>
                      <div className="flex flex-wrap gap-2">
                        {categoriesByPavillon[pavillon.id].map((cat) => (
                          <span
                            key={cat}
                            className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour une participation réussie
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Ticket className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Billetterie</h3>
              <p className="text-blue-100">
                Achetez vos billets en ligne ou sur place. Tarifs préférentiels pour les groupes.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Catalogue Digital</h3>
              <p className="text-blue-100">
                Explorez tous les exposants et leurs produits dans notre catalogue interactif.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Accompagnement</h3>
              <p className="text-blue-100">
                Équipe dédiée pour vous accompagner dans votre démarche d'inscription.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Contactez-nous
              </h2>
              <p className="text-xl text-gray-600">
                Une question ? Notre équipe est là pour vous aider
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="grid md:grid-cols-2 gap-8">
                {foireConfig?.contact?.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                      <a
                        href={`mailto:${foireConfig.contact.email}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {foireConfig.contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {foireConfig?.contact?.telephone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Téléphone</h3>
                      <a
                        href={`tel:${foireConfig.contact.telephone}`}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        {foireConfig.contact.telephone}
                      </a>
                    </div>
                  </div>
                )}

                {foireConfig?.adresse && (
                  <div className="flex items-start gap-4 md:col-span-2">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Adresse</h3>
                      <p className="text-gray-700">{foireConfig.adresse}</p>
                    </div>
                  </div>
                )}
              </div>

              {foireConfig?.horaires && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Horaires</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg">
                      <span className="text-gray-600">Ouverture : </span>
                      <span className="font-semibold text-gray-900">{foireConfig.horaires.ouverture}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg">
                      <span className="text-gray-600">Fermeture : </span>
                      <span className="font-semibold text-gray-900">{foireConfig.horaires.fermeture}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à participer ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d'exposants et des milliers de visiteurs pour cette édition exceptionnelle
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`${basePath}/inscription`}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-yellow-50 transition-all transform hover:scale-105 shadow-xl"
            >
              Inscription Exposant
            </Link>
            <Link
              href={`${basePath}/tickets`}
              className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl"
            >
              Acheter un Ticket
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}
