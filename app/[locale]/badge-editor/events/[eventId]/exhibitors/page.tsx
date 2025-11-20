'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Search,
  Plus,
  Building2,
  Package,
  Eye,
  QrCode,
  Users,
  MapPin,
  Mail
} from 'lucide-react'

import type { ExhibitorWithStats } from '@/types/exhibitor'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Approuvé' },
  { value: 'active', label: 'Actif' },
  { value: 'rejected', label: 'Rejeté' },
  { value: 'cancelled', label: 'Annulé' }
]

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'tech', label: 'Technologie' },
  { value: 'finance', label: 'Finance' },
  { value: 'retail', label: 'Commerce' },
  { value: 'food', label: 'Alimentation' },
  { value: 'fashion', label: 'Mode' },
  { value: 'health', label: 'Santé' },
  { value: 'education', label: 'Éducation' },
  { value: 'services', label: 'Services' },
  { value: 'other', label: 'Autre' }
]

const STATUS_BADGE_VARIANTS: Record<
  string,
  { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
> = {
  pending: { variant: 'secondary', label: 'En attente' },
  approved: { variant: 'default', label: 'Approuvé' },
  active: { variant: 'default', label: 'Actif' },
  rejected: { variant: 'destructive', label: 'Rejeté' },
  cancelled: { variant: 'outline', label: 'Annulé' }
}

const CATEGORY_LABELS: Record<string, string> = CATEGORY_OPTIONS.reduce(
  (acc, option) => {
    if (option.value !== 'all') {
      acc[option.value] = option.label
    }
    return acc
  },
  {} as Record<string, string>
)

export default function ExhibitorsPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string

  const [exhibitors, setExhibitors] = useState<ExhibitorWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [eventName, setEventName] = useState('')

  useEffect(() => {
    if (!eventId) return
    loadEventInfo()
    loadExhibitors()
  }, [eventId])

  const loadEventInfo = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('events')
      .select('name')
      .eq('id', eventId)
      .maybeSingle()

    if (error) {
      console.error('Error loading event info:', error)
      return
    }

    if (data) {
      setEventName(data.name)
    }
  }

  const loadExhibitors = async () => {
    setLoading(true)

    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('exhibitors_with_stats')
        .select('*')
        .eq('event_id', eventId)
        .order('company_name')

      if (error) {
        console.error('Error loading exhibitors:', error)
        toast.error('Erreur lors du chargement des exposants')
        return
      }

      setExhibitors(data ?? [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const filteredExhibitors = useMemo(() => {
    let result = [...exhibitors]

    if (searchQuery) {
      const normalizedSearch = searchQuery.toLowerCase()
      result = result.filter(
        (exhibitor) =>
          exhibitor.company_name.toLowerCase().includes(normalizedSearch) ||
          exhibitor.contact_name?.toLowerCase().includes(normalizedSearch)
      )
    }

    if (categoryFilter !== 'all') {
      result = result.filter((exhibitor) => exhibitor.category === categoryFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter((exhibitor) => exhibitor.status === statusFilter)
    }

    return result
  }, [exhibitors, searchQuery, categoryFilter, statusFilter])

  const getStatusBadge = (status: string | null) => {
    const config = (status && STATUS_BADGE_VARIANTS[status]) || STATUS_BADGE_VARIANTS.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getCategoryLabel = (category?: string | null) => {
    if (!category) return 'Non défini'
    return CATEGORY_LABELS[category] ?? category
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exposants</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            {eventName ? `${eventName} • ` : ''}
            {filteredExhibitors.length} exposant{filteredExhibitors.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => router.push(`/fr/badge-editor/events/${eventId}/exhibitors/new`)}
          className="bg-gradient-to-r from-orange-500 to-pink-600 w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un exposant
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Rechercher un exposant..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredExhibitors.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun exposant</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Aucun exposant ne correspond à vos critères.'
                : 'Commencez par ajouter votre premier exposant.'}
            </p>
            {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
              <Button
                onClick={() => router.push(`/fr/badge-editor/events/${eventId}/exhibitors/new`)}
                className="bg-gradient-to-r from-orange-500 to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un exposant
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExhibitors.map((exhibitor) => (
            <Card
              key={exhibitor.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/fr/badge-editor/events/${eventId}/exhibitors/${exhibitor.id}`)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{exhibitor.company_name}</h3>
                    <p className="text-sm text-gray-600">{getCategoryLabel(exhibitor.category)}</p>
                  </div>
                  {getStatusBadge(exhibitor.status)}
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  {exhibitor.contact_name && (
                    <div className="flex items-center text-gray-600 break-words">
                      <Users className="w-4 h-4 mr-2 shrink-0" />
                      {exhibitor.contact_name}
                    </div>
                  )}
                  {exhibitor.contact_email && (
                    <div className="flex items-center text-gray-600 break-words">
                      <Mail className="w-4 h-4 mr-2 shrink-0" />
                      {exhibitor.contact_email}
                    </div>
                  )}
                  {exhibitor.booth_number && (
                    <div className="flex items-center text-gray-600 break-words">
                      <MapPin className="w-4 h-4 mr-2 shrink-0" />
                      Stand {exhibitor.booth_number}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Package className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-lg font-semibold">{exhibitor.products_count}</div>
                    <div className="text-xs text-gray-500">Produits</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Eye className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-lg font-semibold">{exhibitor.page_views}</div>
                    <div className="text-xs text-gray-500">Vues</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <QrCode className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-lg font-semibold">{exhibitor.qr_scans}</div>
                    <div className="text-xs text-gray-500">Scans</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="text-lg font-semibold">{exhibitor.unique_visitors}</div>
                    <div className="text-xs text-gray-500">Visiteurs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

