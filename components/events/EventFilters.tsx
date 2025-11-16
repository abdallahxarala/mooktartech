'use client'

import { useState } from 'react'
import { Calendar, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'

export interface EventFilters {
  search?: string
  location?: string
  startDate?: string
  endDate?: string
}

interface EventFiltersProps {
  onFilterChange: (filters: EventFilters) => void
  initialFilters?: EventFilters
}

export function EventFilters({
  onFilterChange,
  initialFilters = {}
}: EventFiltersProps) {
  const [filters, setFilters] = useState<EventFilters>(initialFilters)

  const handleFilterChange = (key: keyof EventFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    setFilters({})
    onFilterChange({})
  }

  const activeFilters = Object.values(filters).filter(Boolean).length
  const hasActiveFilters = activeFilters > 0

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un événement..."
          value={filters.search ?? ''}
          onChange={(event) => handleFilterChange('search', event.target.value)}
          className="pl-10"
          aria-label="Rechercher un événement"
        />
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="event-location">Localisation</Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="event-location"
              placeholder="Dakar, Sénégal..."
              value={filters.location ?? ''}
              onChange={(event) =>
                handleFilterChange('location', event.target.value)
              }
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-start-date">Date de début</Label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="event-start-date"
              type="date"
              value={filters.startDate ?? ''}
              onChange={(event) =>
                handleFilterChange('startDate', event.target.value)
              }
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-end-date">Date de fin</Label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="event-end-date"
              type="date"
              value={filters.endDate ?? ''}
              onChange={(event) =>
                handleFilterChange('endDate', event.target.value)
              }
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filtres
              {hasActiveFilters && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {activeFilters}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtrer les événements</SheetTitle>
              <SheetDescription>
                Affinez votre recherche d&apos;événements
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event-location-mobile">Localisation</Label>
                <Input
                  id="event-location-mobile"
                  placeholder="Dakar, Sénégal..."
                  value={filters.location ?? ''}
                  onChange={(event) =>
                    handleFilterChange('location', event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-start-date-mobile">Date de début</Label>
                <Input
                  id="event-start-date-mobile"
                  type="date"
                  value={filters.startDate ?? ''}
                  onChange={(event) =>
                    handleFilterChange('startDate', event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-end-date-mobile">Date de fin</Label>
                <Input
                  id="event-end-date-mobile"
                  type="date"
                  value={filters.endDate ?? ''}
                  onChange={(event) =>
                    handleFilterChange('endDate', event.target.value)
                  }
                />
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleReset}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {hasActiveFilters && (
        <div className="hidden md:block">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  )
}

