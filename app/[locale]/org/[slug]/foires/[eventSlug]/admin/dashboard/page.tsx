'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Users, Square, DollarSign, Ticket, TrendingUp, TrendingDown, Download } from 'lucide-react'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getEventStats } from '@/lib/services/admin/stats.service'
import type { EventStats } from '@/lib/services/admin/stats.service'
// import { downloadExcel } from '@/lib/services/exports/reports' // Temporarily disabled - requires server component
import Link from 'next/link'

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe']

export default function AdminDashboardPage() {
  const params = useParams<{ locale: string; slug: string; eventSlug: string }>()
  const [stats, setStats] = useState<EventStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [eventId, setEventId] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [params.eventSlug])

  async function loadStats() {
    try {
      setLoading(true)
      setError(null)

      // Récupérer l'ID de l'événement
      const eventInfoResponse = await fetch(`/api/foires/${params.eventSlug}/info`)
      const eventInfo = await eventInfoResponse.json()
      if (eventInfoResponse.ok) {
        setEventId(eventInfo.id)
      }

      // Récupérer les statistiques
      const response = await fetch(`/api/foires/${params.eventSlug}/stats`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load stats')
      }

      setStats(data)
    } catch (err) {
      console.error('Error loading stats:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  async function handleExportExcel() {
    if (!eventId) {
      alert('ID événement non disponible')
      return
    }

    try {
      setExporting(true)
      
      // Appeler l'API route pour générer l'Excel
      const response = await fetch(`/api/admin/exhibitors/export?eventId=${eventId}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to export')
      }

      // Télécharger le fichier
      const blob = await response.blob()
      const filename = `exposants-foire-dakar-2025-${new Date().toISOString().split('T')[0]}.xlsx`
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting Excel:', error)
      alert(`Erreur lors de l'export: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setExporting(false)
    }
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price) + ' FCFA'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-800 mb-2">Erreur</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadStats}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
            <p className="text-gray-600">Vue d'ensemble de l'événement</p>
          </div>
          <button
            onClick={handleExportExcel}
            disabled={exporting || !eventId}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <Download className="h-5 w-5" />
            {exporting ? 'Export...' : 'Export Excel'}
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Exposants Inscrits"
            value={stats.exhibitors_count}
            icon={<Users className="h-6 w-6" />}
            trend={null}
          />
          <KPICard
            title="Surface Louée"
            value={`${stats.total_surface} m²`}
            subtitle={`${stats.occupancy_rate}% d'occupation`}
            icon={<Square className="h-6 w-6" />}
            trend={null}
          />
          <KPICard
            title="Revenus"
            value={formatPrice(stats.total_revenue)}
            icon={<DollarSign className="h-6 w-6" />}
            trend={null}
          />
          <KPICard
            title="Billets Vendus"
            value={stats.tickets_sold}
            icon={<Ticket className="h-6 w-6" />}
            trend={null}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart - Inscriptions par jour */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Inscriptions par jour (30 derniers jours)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.daily_registrations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#667eea" 
                  strokeWidth={2}
                  name="Inscriptions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Répartition par pavillon */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Répartition par pavillon</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.pavilions_distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ pavillon, count }) => `${pavillon}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.pavilions_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Statut des paiements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.payment_status_breakdown.unpaid}</div>
              <div className="text-sm text-gray-600">Non payé</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.payment_status_breakdown.completed}</div>
              <div className="text-sm text-gray-600">Payés</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.payment_status_breakdown.failed}</div>
              <div className="text-sm text-gray-600">Échoués</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.payment_status_breakdown.unpaid}</div>
              <div className="text-sm text-gray-600">Non payés</div>
            </div>
          </div>
        </div>

        {/* Recent Exhibitors Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Exposants récents</h2>
            <Link
              href={`/${params.locale}/org/${params.slug}/foires/${params.eventSlug}/admin/exhibitors`}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Voir tout →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Entreprise</th>
                  <th className="text-left py-3 px-4 font-semibold">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold">Pavillon</th>
                  <th className="text-right py-3 px-4 font-semibold">Prix</th>
                  <th className="text-center py-3 px-4 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_exhibitors.map((exhibitor: any) => (
                  <tr key={exhibitor.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{exhibitor.company_name}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">{exhibitor.contact_name}</div>
                      <div className="text-xs text-gray-500">{exhibitor.contact_email}</div>
                    </td>
                    <td className="py-3 px-4">{exhibitor.booth_location || 'Non assigné'}</td>
                    <td className="py-3 px-4 text-right">
                      {exhibitor.payment_amount ? formatPrice(exhibitor.payment_amount) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          exhibitor.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : exhibitor.payment_status === 'unpaid'
                            ? 'bg-yellow-100 text-yellow-800'
                            : exhibitor.payment_status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800' // refunded ou autre
                        }`}
                      >
                        {exhibitor.payment_status || 'Non payé'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; isPositive: boolean } | null
}

function KPICard({ title, value, subtitle, icon, trend }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-600 text-sm font-semibold">{title}</div>
        <div className="text-purple-600">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
      {trend && (
        <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  )
}

