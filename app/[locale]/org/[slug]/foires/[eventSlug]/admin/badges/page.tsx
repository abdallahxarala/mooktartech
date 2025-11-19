'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Download, Users, Printer, Check, X } from 'lucide-react'
import { exportEventBadges, getStaffBadgesForEvent } from '@/lib/services/exhibitor-staff.service'
import type { StaffBadgeExport } from '@/lib/types/exhibitor-staff'

export default function BadgesAdminPage({
  params,
}: {
  params: { locale: string; slug: string; eventSlug: string }
}) {
  const [event, setEvent] = useState<any>(null)
  const [badges, setBadges] = useState<StaffBadgeExport[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [filter, setFilter] = useState('')

  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    loadData()
  }, [params.eventSlug])

  async function loadData() {
    setLoading(true)

    // Récupérer l'événement
    const { data: eventData } = await supabase
      .from('events')
      .select('*')
      .eq('slug', params.eventSlug)
      .single()

    setEvent(eventData)

    if (eventData) {
      // Récupérer tous les badges
      const badgesData = await getStaffBadgesForEvent(eventData.id)
      setBadges(badgesData)
    }

    setLoading(false)
  }

  async function handleExport() {
    if (!event) return

    setExporting(true)
    try {
      const result = await exportEventBadges(event.id, event.name)
      alert(`✅ ${result.count} badges exportés avec succès !`)
    } catch (error) {
      console.error('Export error:', error)
      alert('❌ Erreur lors de l\'export')
    } finally {
      setExporting(false)
    }
  }

  const filteredBadges = badges.filter((badge) =>
    `${badge.first_name} ${badge.last_name} ${badge.company_name} ${badge.booth_number}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Gestion des Badges</h1>
          <p className="text-xl">{event?.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {badges.length}
                </div>
                <div className="text-gray-600">Badges totaux</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {badges.filter((b) => b.photo_url).length}
                </div>
                <div className="text-gray-600">Avec photo</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <X className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {badges.filter((b) => !b.photo_url).length}
                </div>
                <div className="text-gray-600">Sans photo</div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Export des badges</h2>
              <p className="text-gray-600">
                Exportez les données au format CSV pour l&apos;impression des badges
              </p>
            </div>
            
            <button
              onClick={handleExport}
              disabled={exporting || badges.length === 0}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-8 py-4 rounded-lg font-bold transition"
            >
              <Download className="h-5 w-5" />
              {exporting ? 'Export en cours...' : 'Exporter CSV'}
            </button>
          </div>
        </div>

        {/* FILTRE */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <input
            type="text"
            placeholder="Rechercher par nom, entreprise, stand..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* LISTE BADGES */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Badge ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Photo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fonction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Entreprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBadges.map((badge) => (
                  <tr key={badge.badge_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {badge.badge_id}
                    </td>
                    <td className="px-6 py-4">
                      {badge.photo_url ? (
                        <img
                          src={badge.photo_url}
                          alt={`${badge.first_name} ${badge.last_name}`}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                          <Users className="h-6 w-6" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {badge.first_name} {badge.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {badge.function || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {badge.company_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {badge.booth_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{badge.email || '-'}</div>
                      <div className="text-xs">{badge.phone || '-'}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBadges.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun badge trouvé</p>
            </div>
          )}
        </div>

        {/* INFO CSV */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">
            ℹ️ Format du fichier CSV
          </h3>
          <p className="text-blue-800 text-sm mb-3">
            Le fichier CSV contient toutes les informations nécessaires pour l&apos;impression des badges :
          </p>
          <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
            <li>Badge ID unique</li>
            <li>Nom, prénom et fonction</li>
            <li>Nom de l&apos;entreprise et numéro de stand</li>
            <li>URL de la photo (à télécharger pour impression)</li>
            <li>Coordonnées (email, téléphone)</li>
          </ul>
          <p className="text-blue-800 text-sm mt-3">
            💡 <strong>Astuce :</strong> Utilisez ce fichier avec un logiciel de publipostage (Word, InDesign) 
            pour générer automatiquement tous les badges.
          </p>
        </div>
      </div>
    </div>
  )
}

