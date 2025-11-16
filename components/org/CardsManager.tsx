'use client'

import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Users, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getPlanLimits, OrganizationPlan } from '@/lib/org-permissions'

export interface OrgCardRecord {
  id: string
  title?: string | null
  assignedTo?: {
    id: string
    fullName?: string | null
    email?: string | null
  } | null
  createdAt: string
  isActive: boolean
  views?: number | null
}

interface CardsManagerProps {
  organizationId: string
  plan: OrganizationPlan
  cards: OrgCardRecord[]
  canManage: boolean
  onInvalidate?: () => void
}

export function CardsManager({
  organizationId,
  plan,
  cards,
  canManage,
  onInvalidate
}: CardsManagerProps) {
  const [search, setSearch] = useState('')
  const planLimits = getPlanLimits(plan)

  const filteredCards = useMemo(() => {
    if (!search) return cards
    return cards.filter((card) =>
      [card.title, card.assignedTo?.fullName, card.assignedTo?.email]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(search.toLowerCase()))
    )
  }, [cards, search])

  const overLimit =
    typeof planLimits.maxCards === 'number' &&
    cards.length >= planLimits.maxCards

  const handleToggle = async (cardId: string, enable: boolean) => {
    try {
      const response = await fetch(`/api/org/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: enable })
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body?.message ?? 'Mise à jour impossible')
      }
      toast.success('Carte mise à jour')
      onInvalidate?.()
    } catch (error: any) {
      toast.error(error.message ?? 'Erreur lors de la mise à jour')
    }
  }

  return (
    <div className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Cartes NFC</h3>
          <p className="text-xs text-slate-500">
            {cards.length} cartes · Plan {planLimits.name}
          </p>
        </div>
        {canManage && (
          <Button
            disabled={overLimit}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-sm text-white shadow-lg hover:from-orange-600 hover:to-pink-600"
            onClick={() => toast('Créer une carte: API à implémenter')}
          >
            <Plus className="h-4 w-4" />
            Nouvelle carte
          </Button>
        )}
      </div>

      {overLimit && (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-600">
          Limite de cartes atteinte pour le plan {planLimits.name}. Passez au plan supérieur pour continuer à créer des cartes.
        </p>
      )}

      <Input
        className="max-w-sm"
        placeholder="Rechercher une carte ou un membre..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <ul className="space-y-4">
        {filteredCards.map((card) => (
          <li
            key={card.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {card.title ?? `Carte ${card.id.slice(0, 6).toUpperCase()}`}
              </p>
              <p className="text-xs text-slate-500">
                Crée le {new Date(card.createdAt).toLocaleDateString('fr-FR')}
              </p>
              {card.assignedTo ? (
                <p className="text-xs text-slate-500">
                  Assignée à {card.assignedTo.fullName ?? card.assignedTo.email}
                </p>
              ) : (
                <p className="text-xs text-slate-400">Non assignée</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="rounded-full border-blue-200 text-blue-600">
                <Users className="mr-1 h-3 w-3" />
                {card.views ?? 0} vues
              </Badge>
              {canManage && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={card.isActive ? 'text-emerald-500 hover:text-emerald-600' : 'text-rose-500 hover:text-rose-600'}
                  onClick={() => handleToggle(card.id, !card.isActive)}
                >
                  {card.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

