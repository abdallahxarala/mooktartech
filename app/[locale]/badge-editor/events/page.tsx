'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Plus, Search, Calendar, MapPin, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type EventRecord = {
  id: string
  name: string
  slug: string
  start_date: string
  end_date: string
  location: string | null
  status: string
  max_attendees: number | null
  settings: {
    city?: string | null
    country?: string | null
  } | null
}

export default function EventsPage() {
  console.log('🔍 === PAGE ÉVÉNEMENTS - CHARGEMENT ===')
  const { locale } = useParams()
  const [search, setSearch] = useState('')
  const [events, setEvents] = useState<EventRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      const supabase = createSupabaseBrowserClient()
      console.log('✅ Supabase client créé')

      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('📊 Événements récupérés:', eventsData)
      console.log('📈 Nombre:', eventsData?.length || 0)
      console.log('❌ Erreur:', error)

      if (error) {
        console.error('Erreur lors de la récupération des événements:', error)
        setEvents([])
      } else {
        setEvents((eventsData as EventRecord[]) ?? [])
      }

      setIsLoading(false)
    }

    fetchEvents()
  }, [])

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [events, search])

  console.log(
    '🎨 Rendu:',
    filteredEvents?.length === 0 ? 'Empty state' : `${filteredEvents.length} événements`
  )

  const displayEvents = filteredEvents ?? []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Mes Événements</h1>
            <p className="text-gray-600">Gérez vos événements et leurs badges</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-orange-500 to-pink-600">
            <Link href={`/${locale}/badge-editor/events/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Créer un événement
            </Link>
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Rechercher un événement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        {isLoading ? (
          <Card className="p-12 text-center">
            <div className="text-lg text-gray-500">Chargement des événements...</div>
          </Card>
        ) : (!displayEvents || displayEvents.length === 0) ? (
          <Card className="p-12 text-center">
            <div className="mb-4 text-lg text-gray-500">
              Aucun événement créé. Commencez par créer votre premier événement.
            </div>
            <Button asChild className="bg-gradient-to-r from-orange-500 to-pink-600">
              <Link href={`/${locale}/badge-editor/events/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Créer mon premier événement
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayEvents.map((event) => (
              <Link key={event.id} href={`/${locale}/badge-editor/events/${event.id}`}>
                <Card className="bg-white p-6 transition-shadow hover:shadow-lg">
                  <h3 className="mb-2 text-xl font-bold">{event.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {event.start_date
                        ? new Date(event.start_date).toLocaleDateString()
                        : 'Date à confirmer'}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.settings?.city ?? event.location ?? 'Lieu à confirmer'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {event.max_attendees ?? 'Capacité illimitée'}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`px-2 py-1 text-xs font-semibold ${
                        event.status === 'published'
                          ? 'rounded bg-green-100 text-green-800'
                          : event.status === 'draft'
                          ? 'rounded bg-gray-100 text-gray-800'
                          : 'rounded bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

