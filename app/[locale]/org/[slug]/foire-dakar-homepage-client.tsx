'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  ArrowRight,
  CheckCircle,
  Star,
  Building2,
  Phone,
  Mail
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

interface FoireDakarHomePageClientProps {
  locale: string
  slug: string
}

export function FoireDakarHomePageClient({ locale, slug }: FoireDakarHomePageClientProps) {
  const [event, setEvent] = useState<any>(null)
  const [exhibitors, setExhibitors] = useState<any[]>([])
  const [stats, setStats] = useState({
    exhibitorsCount: 0,
    visitorsExpected: 0,
    days: 0
  })
  const [isLoading, setIsLoading] = useState(true)

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

        // Récupérer l'événement principal
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .eq('organization_id', (org as any).id)
          .order('start_date', { ascending: false })
          .limit(1)
          .single()

        if (eventsData) {
          setEvent(eventsData)
          
          // Calculer le nombre de jours
          if ((eventsData as any).start_date && (eventsData as any).end_date) {
            const start = new Date((eventsData as any).start_date)
            const end = new Date((eventsData as any).end_date)
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
            setStats(prev => ({ ...prev, days }))
          }
        }

        // Récupérer les exposants
        const { data: exhibitorsData } = await supabase
          .from('exhibitors')
          .select('*, events!inner(*)')
          .eq('events.organization_id', (org as any).id)
          .limit(12)

        if (exhibitorsData) {
          setExhibitors(exhibitorsData)
          setStats(prev => ({ ...prev, exhibitorsCount: (exhibitorsData as any).length }))
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [slug])

  const eventInfo = [
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Dates',
      value: event?.start_date && event?.end_date 
        ? `${new Date(event.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} - ${new Date(event.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
        : 'À venir'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Lieu',
      value: event?.location || 'Dakar, Sénégal'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Horaires',
      value: event?.opening_hours || '9h - 18h'
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Exposants',
      value: `${stats.exhibitorsCount}+ entreprises`
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full text-sm font-semibold mb-4">
                Événement Professionnel
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black mb-6"
            >
              {event?.name || 'Foire Dakar 2025'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 mb-8"
            >
              {event?.description || 'Le plus grand événement professionnel du Sénégal'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                href={`/${locale}/org/${slug}/foires/${event?.slug || 'foire-dakar-2025'}/inscription`}
                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                S'inscrire comme exposant
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={`/${locale}/org/${slug}/foires/${event?.slug || 'foire-dakar-2025'}/tickets`}
                className="px-8 py-4 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition-all border-2 border-white/20 flex items-center gap-2"
              >
                <Ticket className="w-5 h-5" />
                Acheter un billet
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Info Cards */}
      <section className="py-12 -mt-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {eventInfo.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:border-purple-200 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{info.label}</p>
                    <p className="font-bold text-gray-900">{info.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Event */}
      {event && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-black text-gray-900 mb-6 text-center">À propos de l'événement</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {event.description || 'Rejoignez-nous pour cet événement exceptionnel qui rassemble les professionnels de tous les secteurs.'}
                </p>
                {event.objectives && (
                  <div className="bg-white rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Objectifs</h3>
                    <ul className="space-y-2">
                      {event.objectives.split('\n').map((obj: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Exhibitors */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Nos exposants</h2>
              <p className="text-gray-600">Découvrez les entreprises participantes</p>
            </div>
            <Link
              href={`/${locale}/org/${slug}/foires/${event?.slug || 'foire-dakar-2025'}/catalogue`}
              className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-2"
            >
              Voir tout
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-48" />
              ))}
            </div>
          ) : exhibitors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {exhibitors.map((exhibitor, idx) => (
                <motion.div
                  key={exhibitor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-200"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {exhibitor.company_name?.charAt(0) || 'E'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{exhibitor.company_name}</h3>
                      {exhibitor.sector && (
                        <p className="text-sm text-gray-500">{exhibitor.sector}</p>
                      )}
                    </div>
                  </div>
                  {exhibitor.contact_name && (
                    <p className="text-sm text-gray-600 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      {exhibitor.contact_name}
                    </p>
                  )}
                  {exhibitor.contact_email && (
                    <p className="text-sm text-gray-600">
                      <Mail className="w-4 h-4 inline mr-1" />
                      {exhibitor.contact_email}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Aucun exposant inscrit pour le moment</p>
              <Link
                href={`/${locale}/org/${slug}/foires/${event?.slug || 'foire-dakar-2025'}/inscription`}
                className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Devenir exposant
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-5xl font-black mb-2">{stats.exhibitorsCount}+</div>
              <div className="text-xl text-white/90">Exposants</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-5xl font-black mb-2">{stats.days}</div>
              <div className="text-xl text-white/90">Jours d'événement</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-5xl font-black mb-2">10K+</div>
              <div className="text-xl text-white/90">Visiteurs attendus</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Rejoignez-nous !</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Que vous soyez exposant ou visiteur, participez à cet événement exceptionnel qui rassemble les professionnels du Sénégal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/org/${slug}/foires/${event?.slug || 'foire-dakar-2025'}/inscription`}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            >
              S'inscrire comme exposant
            </Link>
            <Link
              href={`/${locale}/org/${slug}/foires/${event?.slug || 'foire-dakar-2025'}/tickets`}
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all border-2 border-purple-600"
            >
              Acheter un billet
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

