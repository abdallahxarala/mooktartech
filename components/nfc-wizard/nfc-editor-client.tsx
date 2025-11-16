'use client'

import React, { useState } from 'react'
import { NFCWizard } from './wizard'
import { useNFCEditorStore } from '@/lib/store/nfc-editor-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, BarChart3, Users, Download, Share2 } from 'lucide-react'

export function NFCEditorClient() {
  const { profiles, createProfile, currentProfile } = useNFCEditorStore()
  const [view, setView] = useState<'wizard' | 'dashboard'>('wizard')

  if (view === 'dashboard' && !currentProfile) {
    return <DashboardView profiles={profiles} onCreate={createProfile} onEdit={(id) => useNFCEditorStore.getState().setCurrentProfile(id)} />
  }

  if (currentProfile) {
    return <NFCWizard />
  }

  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-black text-gray-900 mb-4">
        Créer votre première carte NFC
      </h2>
      <p className="text-gray-600 mb-8">
        En moins de 5 minutes, créez une carte professionnelle interactive
      </p>
      <Button
        onClick={() => createProfile('personal')}
        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white"
      >
        <Plus className="w-5 h-5 mr-2" />
        Commencer
      </Button>
    </div>
  )
}

function DashboardView({ profiles, onCreate, onEdit }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-900">Mes Cartes NFC</h2>
        <Button onClick={() => onCreate('personal')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle carte
        </Button>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">Aucune carte pour le moment</p>
            <Button onClick={() => onCreate('personal')}>
              Créer ma première carte
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {profiles.map((profile: any) => (
            <Card key={profile.id}>
              <CardContent className="p-6">
                <div className="font-bold text-lg mb-2">
                  {profile.firstName} {profile.lastName}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {profile.title} @ {profile.company}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(profile.id)}
                  >
                    Éditer
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

