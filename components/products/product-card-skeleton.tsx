'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Composant de skeleton pour la carte produit
 * Affiche un placeholder pendant le chargement
 */
export default function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden border-0 shadow-md">
      <CardContent className="p-0">
        {/* Image skeleton */}
        <div className="aspect-square bg-gray-200">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Contenu skeleton */}
        <div className="p-4 space-y-3">
          {/* Badges */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>

          {/* Nom du produit */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Spécifications */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>

          {/* Prix et stock */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* Bouton */}
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
