'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { UserPlus, Shield, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getPlanLimits, OrganizationPlan } from '@/lib/org-permissions'

export interface MemberRecord {
  id: string
  email: string
  fullName?: string | null
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
}

interface MembersListProps {
  organizationId: string
  plan: OrganizationPlan
  canManage: boolean
  members: MemberRecord[]
  onInvalidate?: () => void
}

export function MembersList({
  organizationId,
  plan,
  canManage,
  members,
  onInvalidate
}: MembersListProps) {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member')
  const [pending, setPending] = useState(false)

  const planLimits = getPlanLimits(plan)
  const overLimit =
    typeof planLimits.maxUsers === 'number' &&
    members.length >= planLimits.maxUsers

  const handleInvite = async () => {
    if (!inviteEmail) return
    setPending(true)
    try {
      const response = await fetch('/api/org/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          email: inviteEmail,
          role: inviteRole
        })
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body?.message ?? 'Invitation impossible')
      }
      toast.success('Invitation envoyée')
      setInviteEmail('')
      setInviteOpen(false)
      onInvalidate?.()
    } catch (error: any) {
      toast.error(error.message ?? 'Erreur lors de l’invitation')
    } finally {
      setPending(false)
    }
  }

  const handleRemove = async (memberId: string) => {
    if (!confirm('Confirmer la suppression de ce membre ?')) return
    try {
      const response = await fetch(`/api/org/members/${memberId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body?.message ?? 'Suppression impossible')
      }
      toast.success('Membre supprimé')
      onInvalidate?.()
    } catch (error: any) {
      toast.error(error.message ?? 'Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Membres</h3>
          <p className="text-xs text-slate-500">
            {members.length} / {planLimits.maxUsers ?? '∞'} utilisateurs
          </p>
        </div>

        {canManage && (
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={overLimit}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-sm text-white shadow-lg hover:from-orange-600 hover:to-pink-600"
              >
                <UserPlus className="h-4 w-4" />
                Inviter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inviter un membre</DialogTitle>
                <DialogDescription>
                  Envoyez une invitation par email pour rejoindre l’organisation.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="email@entreprise.com"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  type="email"
                />
                <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="member">Membre</SelectItem>
                  </SelectContent>
                </Select>
                {overLimit && (
                  <p className="text-sm text-amber-600">
                    Limite atteinte pour le plan {planLimits.name}. Passez au plan supérieur pour ajouter plus d’utilisateurs.
                  </p>
                )}
                <Button
                  onClick={handleInvite}
                  disabled={pending || overLimit || !inviteEmail}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                >
                  {pending ? 'Envoi...' : 'Envoyer invitation'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <ul className="space-y-4">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {member.fullName ?? member.email}
              </p>
              <p className="text-xs text-slate-500">{member.email}</p>
              <p className="text-xs text-slate-400">
                Rejoint le {new Date(member.joinedAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full border-amber-200 text-amber-600">
                <Shield className="mr-1 h-3 w-3" />
                {member.role.toUpperCase()}
              </Badge>
              {canManage && member.role !== 'owner' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(member.id)}
                  className="text-rose-500 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

