'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Search, Filter, MapPin, ExternalLink, Building2, Package } from 'lucide-react'

interface Exhibitor {
  id: string
  company_name: string
  slug: string
  description: string | null
  logo_url: string | null
  banner_url: string | null
  category: string | null
  tags: string[]
  booth_number: string | null
  booth_location: string | null
  website: string | null
  contact_email: string
  contact_phone: string | null
  products_count?: number
  total_interactions?: number
}

export default function CataloguePage({
  params,
}: {
  params: { locale: string; slug: string; eventSlug: string }
}) {
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [filteredExhibitors, setFilteredExhibitors] = useState<Exhibitor[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])

  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    loadExhibitors()
  }, [params.eventSlug])

  useEffect(() => {
    filterExhibitors()
  }, [searchQuery, selectedCategory, exhibitors])

  async function loadExhibitors() {
    setLoading(true)

    try {
      // 1. Récupérer l'organization_id depuis le slug
      const { data: organization } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', params.slug)
        .single()

      if (!organization) {
        console.error('Organization not found:', params.slug)
        setLoading(false)
        return
      }

      // 2. Récupérer l'événement avec vérification organization_id
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('id')
        .eq('slug', params.eventSlug)
        .eq('organization_id', (organization as any).id) // ✅ Isolation multitenant
        .single()

      if (eventError || !event) {
        console.error('Error loading event:', eventError)
        setLoading(false)
        return
      }

      // 2. Récupérer les exposants avec leurs produits
      const { data: exhibitorsData, error: exhibitorsError } = await supabase
        .from('exhibitors')
        .select(`
          id,
          company_name,
          slug,
          description,
          logo_url,
          banner_url,
          category,
          tags,
          booth_number,
          booth_location,
          website,
          contact_email,
          contact_phone,
          status
        `)
        .eq('event_id', (event as any).id)
        .or('approval_status.eq.approved,status.eq.approved') // Utiliser approval_status si disponible, sinon status
        .order('company_name')

      if (exhibitorsError) {
        console.error('Error loading exhibitors:', exhibitorsError)
        setLoading(false)
        return
      }

      if (exhibitorsData) {
        // Pour chaque exposant, compter les produits
        const exhibitorsWithStats = await Promise.all(
          exhibitorsData.map(async (exhibitor) => {
            const { count } = await supabase
              .from('exhibitor_products')
              .select('*', { count: 'exact', head: true })
              .eq('exhibitor_id', exhibitor.id)

            return {
              ...exhibitor,
              products_count: count || 0,
            }
          })
        )

        setExhibitors(exhibitorsWithStats as Exhibitor[])

        // Extraire les catégories uniques
        const uniqueCategories = [
          ...new Set(
            exhibitorsData
              .map((e) => e.category)
              .filter(Boolean)
          ),
        ] as string[]
        setCategories(uniqueCategories.sort())
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterExhibitors() {
    let filtered = [...exhibitors]

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.company_name.toLowerCase().includes(query) ||
          e.description?.toLowerCase().includes(query) ||
          e.category?.toLowerCase().includes(query) ||
          e.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          e.booth_number?.toLowerCase().includes(query)
      )
    }

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter((e) => e.category === selectedCategory)
    }

    setFilteredExhibitors(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du catalogue...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Catalogue des Exposants</h1>
          <p className="text-xl">
            {exhibitors.length} exposant{exhibitors.length > 1 ? 's' : ''} présent{exhibitors.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* RECHERCHE & FILTRES */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un exposant, produit, catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filtre catégorie */}
            <div className="md:w-64">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Résultats */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredExhibitors.length} exposant{filteredExhibitors.length > 1 ? 's' : ''} trouvé{filteredExhibitors.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* GRILLE EXPOSANTS */}
        {filteredExhibitors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun exposant trouvé</p>
            {searchQuery || selectedCategory ? (
              <p className="text-gray-400 text-sm mt-2">
                Essayez de modifier vos critères de recherche
              </p>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExhibitors.map((exhibitor) => (
              <Link
                key={exhibitor.id}
                href={`/${params.locale}/org/${params.slug}/foires/${params.eventSlug}/catalogue/${exhibitor.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                {/* Bannière ou placeholder */}
                <div className="h-32 bg-gradient-to-r from-purple-400 to-blue-400 relative overflow-hidden">
                  {exhibitor.banner_url ? (
                    <img
                      src={exhibitor.banner_url}
                      alt={exhibitor.company_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-4xl opacity-50">
                      🏢
                    </div>
                  )}
                </div>

                {/* Logo */}
                <div className="relative -mt-12 px-4">
                  <div className="w-20 h-20 bg-white rounded-lg shadow-lg p-2 flex items-center justify-center">
                    {exhibitor.logo_url ? (
                      <img
                        src={exhibitor.logo_url}
                        alt={exhibitor.company_name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-4 pt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition">
                    {exhibitor.company_name}
                  </h3>

                  {/* Catégorie */}
                  {exhibitor.category && (
                    <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded mb-3">
                      {exhibitor.category}
                    </span>
                  )}

                  {/* Description */}
                  {exhibitor.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {exhibitor.description}
                    </p>
                  )}

                  {/* Tags */}
                  {exhibitor.tags && exhibitor.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {exhibitor.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {exhibitor.tags.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{exhibitor.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Infos supplémentaires */}
                  <div className="space-y-2 text-sm text-gray-600 border-t pt-3">
                    {exhibitor.booth_number && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Stand {exhibitor.booth_number}</span>
                        {exhibitor.booth_location && (
                          <span className="text-gray-400">• {exhibitor.booth_location}</span>
                        )}
                      </div>
                    )}

                    {exhibitor.products_count !== undefined && (
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>
                          {exhibitor.products_count} produit{exhibitor.products_count > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    {exhibitor.website && (
                      <div className="flex items-center gap-2 text-purple-600">
                        <ExternalLink className="w-4 h-4" />
                        <span className="truncate">Site web</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

