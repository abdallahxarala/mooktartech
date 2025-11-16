/**
 * Composant de gestion des exposants
 */

'use client'

import { useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CheckCircle2, XCircle, Edit, MoreVertical, QrCode, Package, Search, Clock } from 'lucide-react'
import { useFoireAdmin } from '@/lib/hooks/use-foire-admin'
import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import Image from 'next/image'

interface ExhibitorManagementProps {
  eventId: string
}

export function ExhibitorManagement({ eventId }: ExhibitorManagementProps) {
  const {
    exhibitors,
    isLoadingExhibitors,
    fetchExhibitors,
    updateExhibitorStatus,
    generateBadge,
  } = useFoireAdmin({ eventId })

  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExhibitor, setSelectedExhibitor] = useState<any>(null)
  const [showProducts, setShowProducts] = useState(false)

  useEffect(() => {
    fetchExhibitors()
  }, [fetchExhibitors])

  const filteredExhibitors = exhibitors.filter((exhibitor) => {
    const matchesStatus = statusFilter === 'all' || exhibitor.status === statusFilter
    const matchesSearch =
      !searchQuery ||
      exhibitor.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exhibitor.contact_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exhibitor.contact_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleStatusChange = async (exhibitorId: string, status: 'approved' | 'rejected') => {
    await updateExhibitorStatus(exhibitorId, status)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approuvé
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeté
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        )
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestion des exposants</CardTitle>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvés</SelectItem>
                  <SelectItem value="rejected">Rejetés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingExhibitors ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : filteredExhibitors.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun exposant trouvé
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Stand</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExhibitors.map((exhibitor) => (
                    <TableRow key={exhibitor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {exhibitor.logo_url && (
                            <Image
                              src={exhibitor.logo_url}
                              alt={exhibitor.company_name}
                              width={40}
                              height={40}
                              className="rounded-lg"
                            />
                          )}
                          <div>
                            <div className="font-semibold">{exhibitor.company_name}</div>
                            {exhibitor.category && (
                              <div className="text-sm text-gray-500">{exhibitor.category}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{exhibitor.contact_name}</div>
                          <div className="text-gray-500">{exhibitor.contact_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {exhibitor.booth_number ? (
                          <Badge variant="outline">Stand {exhibitor.booth_number}</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(exhibitor.status || 'pending')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {exhibitor.status !== 'approved' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(exhibitor.id, 'approved')}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Valider
                              </DropdownMenuItem>
                            )}
                            {exhibitor.status !== 'rejected' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(exhibitor.id, 'rejected')}
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Rejeter
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => generateBadge(exhibitor.id)}
                            >
                              <QrCode className="w-4 h-4 mr-2" />
                              Générer badge
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedExhibitor(exhibitor)
                                setShowProducts(true)
                              }}
                            >
                              <Package className="w-4 h-4 mr-2" />
                              Voir produits
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal produits exposant */}
      <Dialog open={showProducts} onOpenChange={setShowProducts}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Produits de {selectedExhibitor?.company_name}</DialogTitle>
            <DialogDescription>
              Liste des produits de cet exposant
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {/* TODO: Afficher les produits de l'exposant */}
            <p className="text-gray-500">Fonctionnalité à implémenter</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

