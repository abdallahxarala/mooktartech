'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Mail, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { getExhibitorsList } from '@/lib/services/admin/stats.service'
import Link from 'next/link'

interface Exhibitor {
  id: string
  company_name: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  booth_location: string | null
  payment_amount: number | null
  payment_status: string | null
  status: string | null
  created_at: string
  metadata: any
}

export default function AdminExhibitorsPage() {
  const params = useParams<{ locale: string; slug: string; eventSlug: string }>()
  const router = useRouter()
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(20)

  // Filtres
  const [search, setSearch] = useState('')
  const [pavillonFilter, setPavillonFilter] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState<'created_at' | 'company_name' | 'payment_amount'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    loadExhibitors()
  }, [page, pavillonFilter, paymentStatusFilter, statusFilter, search, sortBy, sortOrder])

  async function loadExhibitors() {
    try {
      setLoading(true)

      // Récupérer l'ID de l'événement
      const eventResponse = await fetch(`/api/foires/${params.eventSlug}/info`)
      const eventData = await eventResponse.json()

      if (!eventResponse.ok) {
        throw new Error(eventData.error || 'Failed to load event')
      }

      // Récupérer les exposants
      const response = await fetch(
        `/api/admin/exhibitors?eventId=${eventData.id}&page=${page}&limit=${limit}&pavillon=${pavillonFilter}&payment_status=${paymentStatusFilter}&status=${statusFilter}&search=${encodeURIComponent(search)}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load exhibitors')
      }

      setExhibitors(data.exhibitors || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Error loading exhibitors:', error)
      alert(`Erreur: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(exhibitorId: string) {
    if (!confirm('Approuver cette inscription ?')) return

    try {
      const response = await fetch(`/api/admin/exhibitors/${exhibitorId}/approve`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve')
      }

      alert('Inscription approuvée avec succès')
      loadExhibitors()
    } catch (error) {
      console.error('Error approving exhibitor:', error)
      alert(`Erreur: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async function handleReject(exhibitorId: string) {
    const reason = prompt('Raison du rejet (optionnel):')
    if (reason === null) return // User cancelled

    if (!confirm('Rejeter cette inscription ?')) return

    try {
      const response = await fetch(`/api/admin/exhibitors/${exhibitorId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject')
      }

      alert('Inscription rejetée')
      loadExhibitors()
    } catch (error) {
      console.error('Error rejecting exhibitor:', error)
      alert(`Erreur: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  function formatPrice(price: number | null): string {
    if (!price) return '-'
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price) + ' FCFA'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestion des Exposants</h1>
          <p className="text-gray-600">Liste et gestion de tous les exposants inscrits</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Pavillon Filter */}
            <select
              value={pavillonFilter}
              onChange={(e) => {
                setPavillonFilter(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Tous les pavillons</option>
              <option value="A">Pavillon A</option>
              <option value="B">Pavillon B</option>
              <option value="C">Pavillon C</option>
              <option value="D">Pavillon D</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Tous les statuts paiement</option>
              <option value="pending">En attente</option>
              <option value="completed">Payé</option>
              <option value="paid">Payé</option>
              <option value="failed">Échoué</option>
              <option value="unpaid">Non payé</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>
          </div>

          {/* Sort */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-gray-600">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="created_at">Date d'inscription</option>
              <option value="company_name">Nom entreprise</option>
              <option value="payment_amount">Prix</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑ Croissant' : '↓ Décroissant'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Entreprise</th>
                      <th className="text-left py-3 px-4 font-semibold">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold">Pavillon</th>
                      <th className="text-right py-3 px-4 font-semibold">Prix</th>
                      <th className="text-center py-3 px-4 font-semibold">Statut</th>
                      <th className="text-center py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exhibitors.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-500">
                          Aucun exposant trouvé
                        </td>
                      </tr>
                    ) : (
                      exhibitors.map((exhibitor) => (
                        <tr key={exhibitor.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-semibold">{exhibitor.company_name}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(exhibitor.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">{exhibitor.contact_name}</div>
                            <div className="text-xs text-gray-500">{exhibitor.contact_email}</div>
                            {exhibitor.contact_phone && (
                              <div className="text-xs text-gray-500">{exhibitor.contact_phone}</div>
                            )}
                          </td>
                          <td className="py-3 px-4">{exhibitor.booth_location || 'Non assigné'}</td>
                          <td className="py-3 px-4 text-right">
                            {formatPrice(exhibitor.payment_amount)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                exhibitor.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : exhibitor.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {exhibitor.status || 'pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                href={`/${params.locale}/org/${params.slug}/foires/${params.eventSlug}/catalogue/${exhibitor.id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                title="Voir détails"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              {exhibitor.status !== 'approved' && (
                                <button
                                  onClick={() => handleApprove(exhibitor.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                                  title="Approuver"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                              )}
                              {exhibitor.status !== 'rejected' && (
                                <button
                                  onClick={() => handleReject(exhibitor.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                                  title="Rejeter"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              )}
                              <a
                                href={`/api/foires/${params.eventSlug}/invoices/${exhibitor.id}`}
                                target="_blank"
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                                title="Télécharger facture"
                              >
                                <FileText className="h-4 w-4" />
                              </a>
                              <a
                                href={`mailto:${exhibitor.contact_email}`}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                                title="Contacter"
                              >
                                <Mail className="h-4 w-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-gray-600">
                    Page {page} sur {totalPages} ({total} exposants)
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

