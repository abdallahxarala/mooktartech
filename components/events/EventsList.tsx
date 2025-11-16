'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { EventCard } from '@/components/events/EventCard'
import {
  EventFilters,
  type EventFilters as EventFiltersType
} from '@/components/events/EventFilters'
import { Button } from '@/components/ui/button'
import { getPublicEvents } from '@/lib/supabase/queries/events'
import type { EventWithStats } from '@/types/event'

const EVENTS_PER_PAGE = 12

export function EventsList() {
  const [events, setEvents] = useState<EventWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [filters, setFilters] = useState<EventFiltersType>({})

  const loadEvents = async (
    newOffset: number = 0,
    nextFilters: EventFiltersType = filters
  ) => {
    const isLoadMore = newOffset > 0

    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    const { events: fetchedEvents, total: fetchedTotal } =
      await getPublicEvents({
        ...nextFilters,
        limit: EVENTS_PER_PAGE,
        offset: newOffset
      })

    if (isLoadMore) {
      setEvents((prev) => [...prev, ...fetchedEvents])
      setLoadingMore(false)
    } else {
      setEvents(fetchedEvents)
      setLoading(false)
    }

    setTotal(fetchedTotal)
    setOffset(newOffset)
  }

  useEffect(() => {
    loadEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterChange = (updatedFilters: EventFiltersType) => {
    setFilters(updatedFilters)
    loadEvents(0, updatedFilters)
  }

  const handleLoadMore = () => {
    loadEvents(offset + EVENTS_PER_PAGE, filters)
  }

  const hasMore = events.length < total

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <EventFilters
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      <div>
        <p className="mb-6 text-sm text-muted-foreground">
          {total} événement{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
        </p>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-12 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Aucun événement trouvé
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Essayez d&apos;ajuster vos filtres pour explorer plus d&apos;événements.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  variant="outline"
                  size="lg"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    'Charger plus'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

