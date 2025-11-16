'use client'

import React, { useState } from 'react'
import { useCardEditorStore } from '@/lib/store/card-editor-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Palette, 
  Share2, 
  QrCode, 
  Download,
  Plus,
  Trash2
} from 'lucide-react'

// Import tab components
import { InfoTab } from './tabs/info-tab'
import { DesignTab } from './tabs/design-tab'
import { SocialTab } from './tabs/social-tab'
import { QRTab } from './tabs/qr-tab'
import { ExportTab } from './tabs/export-tab'

export function CardEditorSidebar() {
  const [activeTab, setActiveTab] = useState('info')

  const tabs = [
    { id: 'info', label: 'Informations', icon: User },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'social', label: 'Réseaux', icon: Share2 },
    { id: 'qr', label: 'QR Code', icon: QrCode },
    { id: 'export', label: 'Export', icon: Download }
  ]

  return (
    <div className="h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        {/* Tab Navigation */}
        <div className="p-4 border-b border-gray-200">
          <TabsList className="grid w-full grid-cols-5">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex flex-col items-center space-y-1 h-auto py-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="info" className="h-full m-0">
            <InfoTab />
          </TabsContent>
          
          <TabsContent value="design" className="h-full m-0">
            <DesignTab />
          </TabsContent>
          
          <TabsContent value="social" className="h-full m-0">
            <SocialTab />
          </TabsContent>
          
          <TabsContent value="qr" className="h-full m-0">
            <QRTab />
          </TabsContent>
          
          <TabsContent value="export" className="h-full m-0">
            <ExportTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
