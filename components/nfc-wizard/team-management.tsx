'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users, UserPlus, Settings, 
  Mail, Crown, Shield, User, 
  Trash2, Edit2, Plus
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer'
export type TeamMember = {
  id: string
  email: string
  name: string
  role: TeamRole
  avatar?: string
  invitedAt: string
}

const roleConfig = {
  owner: { icon: Crown, label: 'Propriétaire', color: 'yellow', canEdit: false },
  admin: { icon: Shield, label: 'Admin', color: 'blue', canEdit: true },
  editor: { icon: Edit2, label: 'Éditeur', color: 'green', canEdit: true },
  viewer: { icon: User, label: 'Lecteur', color: 'gray', canEdit: true },
}

export function TeamManagement() {
  const [members] = useState<TeamMember[]>([
    {
      id: '1',
      email: 'you@example.com',
      name: 'Vous',
      role: 'owner',
      invitedAt: '2024-01-15'
    },
    {
      id: '2',
      email: 'colleague@company.com',
      name: 'Marie Dupont',
      role: 'editor',
      invitedAt: '2024-01-20'
    }
  ])
  const [showInvite, setShowInvite] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-gray-900 mb-1">Équipe</h3>
          <p className="text-gray-600">Gérez les accès à vos cartes</p>
        </div>
        <Button onClick={() => setShowInvite(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Inviter
        </Button>
      </div>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Membres ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <InviteMemberModal
            onClose={() => setShowInvite(false)}
            onSubmit={(email, role) => {
              console.log('Invite:', { email, role })
              setShowInvite(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatTile label="Total membres" value={members.length} icon={Users} color="blue" />
        <StatTile label="Cartes partagées" value={12} icon={Settings} color="purple" />
        <StatTile label="Activité (7j)" value="24k" icon={Mail} color="green" />
      </div>
    </div>
  )
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  const config = roleConfig[member.role]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold">
          {member.name[0]}
        </div>
        <div>
          <div className="font-bold text-gray-900">{member.name}</div>
          <div className="text-sm text-gray-600">{member.email}</div>
          <div className="text-xs text-gray-500">
            Membre depuis {new Date(member.invitedAt).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge className={`bg-${config.color}-100 text-${config.color}-700 border-0 flex items-center gap-1`}>
          <Icon className="w-3 h-3" />
          {config.label}
        </Badge>
        {config.canEdit && (
          <Button variant="ghost" size="sm">
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
        {member.role !== 'owner' && (
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}

function InviteMemberModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (email: string, role: TeamRole) => void }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<TeamRole>('viewer')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      onSubmit(email, role)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
      >
        <h3 className="text-2xl font-black text-gray-900 mb-6">Inviter un membre</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rôle
            </label>
            <div className="space-y-2">
              {(['admin', 'editor', 'viewer'] as TeamRole[]).map((r) => {
                const config = roleConfig[r]
                const Icon = config.icon
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                      role === r
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium text-gray-900">{config.label}</div>
                        <div className="text-xs text-gray-500">
                          {r === 'admin' && 'Accès complet'}
                          {r === 'editor' && 'Peut modifier les cartes'}
                          {r === 'viewer' && 'Lecture seule'}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500">
              Envoyer invitation
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function StatTile({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
        </div>
        <div className="text-2xl font-black text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </CardContent>
    </Card>
  )
}

