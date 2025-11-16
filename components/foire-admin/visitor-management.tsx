/**
 * Composant de gestion des visiteurs
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Download, Users, TrendingUp } from 'lucide-react'
import { useFoireAdmin } from '@/lib/hooks/use-foire-admin'
import { Loader2 } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface VisitorManagementProps {
  eventId: string
}

export function VisitorManagement({ eventId }: VisitorManagementProps) {
  const {
    visitors,
    isLoadingVisitors,
    fetchVisitors,
    exportVisitorsCSV,
  } = useFoireAdmin({ eventId })

  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchVisitors()
  }, [fetchVisitors])

  useEffect(() => {
    if (searchQuery) {
      const timeout = setTimeout(() => {
        fetchVisitors(searchQuery)
      }, 300)
      return () => clearTimeout(timeout)
    } else {
      fetchVisitors()
    }
  }, [searchQuery, fetchVisitors])

  // Préparer les données pour le graphique d'affluence
  const attendanceData = visitors.reduce((acc: any[], visitor) => {
    const date = new Date(visitor.created_at).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    })
    const existing = acc.find((item) => item.date === date)
    if (existing) {
      existing.count++
      if (visitor.checked_in) existing.checkedIn++
    } else {
      acc.push({
        date,
        count: 1,
        checkedIn: visitor.checked_in ? 1 : 0,
      })
    }
    return acc
  }, [])

  const filteredVisitors = visitors.filter((visitor) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      visitor.first_name.toLowerCase().includes(query) ||
      visitor.last_name.toLowerCase().includes(query) ||
      visitor.email.toLowerCase().includes(query) ||
      visitor.badge_id.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-6">
      {/* Graphique affluence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Affluence des visiteurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Inscrits"
                />
                <Line
                  type="monotone"
                  dataKey="checkedIn"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Présents"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucune donnée disponible
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste visiteurs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Liste des visiteurs ({filteredVisitors.length})
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button onClick={exportVisitorsCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingVisitors ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : filteredVisitors.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun visiteur trouvé
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Badge ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date inscription</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell>
                        <Badge variant="outline">{visitor.badge_id}</Badge>
                      </TableCell>
                      <TableCell>
                        {visitor.first_name} {visitor.last_name}
                      </TableCell>
                      <TableCell>{visitor.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            visitor.access_level === 'vip' ? 'default' : 'secondary'
                          }
                        >
                          {visitor.access_level?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {visitor.checked_in ? (
                          <Badge className="bg-green-100 text-green-800">
                            Présent
                          </Badge>
                        ) : (
                          <Badge variant="outline">Non présent</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(visitor.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

