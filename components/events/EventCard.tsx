'use client'

import Link from 'next/link'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { EventWithStats } from '@/types/event'
import { formatDate, formatTime } from '@/lib/utils/date'

interface EventCardProps {
  event: EventWithStats
}

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)
  const now = new Date()
  const isToday = now.toDateString() === startDate.toDateString()
  const isPast = endDate < now
  const isSoon =
    !isPast &&
    !isToday &&
    startDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000

  const totalAttendees = event.total_attendees ?? 0

  return (
    <Card className="group flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {isToday && (
            <Badge variant="default" className="bg-red-500">
              Aujourd&apos;hui
            </Badge>
          )}
          {isSoon && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              Bientôt
            </Badge>
          )}
          {isPast && (
            <Badge variant="outline" className="opacity-60">
              Terminé
            </Badge>
          )}
          {event.max_attendees &&
            totalAttendees >= event.max_attendees && (
              <Badge variant="destructive">Complet</Badge>
            )}
        </div>

        <h3 className="line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary">
          {event.name}
        </h3>

        {event.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {event.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3 text-sm text-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium" suppressHydrationWarning>
            {formatDate(event.start_date)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span suppressHydrationWarning>
            {formatTime(event.start_date)} - {formatTime(event.end_date)}
          </span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>
            {totalAttendees} participant{totalAttendees > 1 ? 's' : ''}
            {event.max_attendees ? ` / ${event.max_attendees}` : ''}
          </span>
        </div>
        {event.organization && (
          <div className="border-t pt-3 text-xs text-muted-foreground">
            Organisé par{' '}
            <span className="font-medium text-foreground">
              {event.organization.name}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        <Button
          asChild
          className="w-full"
          variant={isPast ? 'outline' : 'default'}
        >
          <Link href={`/events/${event.slug}`}>
            {isPast ? 'Voir les détails' : "S'inscrire"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

