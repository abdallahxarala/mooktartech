import { Suspense } from 'react'
import { Calendar } from 'lucide-react'
import { EventsList } from '@/components/events/EventsList'
import { EventsListSkeleton } from '@/components/events/EventsListSkeleton'

export const metadata = {
  title: 'Événements | Xarala Solutions',
  description: 'Découvrez tous les événements professionnels à venir'
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container py-12 md:py-20">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-2">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Événements Professionnels
            </h1>
            <p className="text-lg text-muted-foreground">
              Découvrez et participez aux événements organisés par les
              entreprises leaders au Sénégal.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <Suspense fallback={<EventsListSkeleton />}>
          <EventsList />
        </Suspense>
      </section>
    </div>
  )
}

