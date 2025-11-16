/**
 * Composant de filtres pour le catalogue
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { ProductFilters } from '@/lib/hooks/use-catalog-products'

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  categories?: string[]
  exhibitors?: { id: string; name: string }[]
  priceRange?: { min: number; max: number }
}

export function ProductFilters({
  filters,
  onFiltersChange,
  categories = [],
  exhibitors = [],
  priceRange,
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value || undefined }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleReset = () => {
    const emptyFilters: ProductFilters = {}
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const hasActiveFilters =
    localFilters.category ||
    localFilters.exhibitor_id ||
    localFilters.minPrice ||
    localFilters.maxPrice ||
    localFilters.search

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <X className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recherche */}
        <div>
          <Label htmlFor="search">Recherche</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Rechercher un produit..."
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Catégorie */}
        {categories.length > 0 && (
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={localFilters.category || ''}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger id="category" className="mt-1">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Exposant */}
        {exhibitors.length > 0 && (
          <div>
            <Label htmlFor="exhibitor">Exposant</Label>
            <Select
              value={localFilters.exhibitor_id || ''}
              onValueChange={(value) => handleFilterChange('exhibitor_id', value)}
            >
              <SelectTrigger id="exhibitor" className="mt-1">
                <SelectValue placeholder="Tous les exposants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les exposants</SelectItem>
                {exhibitors.map((exhibitor) => (
                  <SelectItem key={exhibitor.id} value={exhibitor.id}>
                    {exhibitor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Prix */}
        {priceRange && (
          <div className="space-y-2">
            <Label>Prix</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minPrice || ''}
                  onChange={(e) =>
                    handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) =>
                    handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

