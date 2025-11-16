'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database, HardDrive, Clock, AlertTriangle } from 'lucide-react'

export function StorageMonitor() {
  const [storageInfo, setStorageInfo] = useState({
    mainSize: 0,
    backupSize: 0,
    totalSize: 0,
    lastUpdate: null as string | null,
    productCount: 0,
    version: '',
    quotaUsed: 0,
    quotaAvailable: 0
  })

  const updateStorageInfo = () => {
    try {
      // Taille des données principales
      const mainData = localStorage.getItem('xarala-products-v2')
      const mainSize = mainData ? new Blob([mainData]).size : 0
      
      // Taille du backup
      const backupData = localStorage.getItem('xarala-products-backup-v2')
      const backupSize = backupData ? new Blob([backupData]).size : 0
      
      // Parse des données pour extraire les infos
      let productCount = 0
      let version = ''
      let lastUpdate = null
      
      if (mainData) {
        try {
          const parsed = JSON.parse(mainData)
          productCount = parsed.products?.length || 0
          version = parsed.version || 'N/A'
          lastUpdate = parsed.timestamp || null
        } catch (e) {
          console.error('Erreur parsing données principales:', e)
        }
      }
      
      // Estimation du quota localStorage
      let quotaUsed = 0
      let quotaAvailable = 0
      
      try {
        // Test de stockage pour estimer le quota
        let testData = ''
        for (let i = 0; i < 1000; i++) {
          testData += 'x'
        }
        
        localStorage.setItem('quota-test', testData)
        quotaUsed = localStorage.getItem('quota-test')?.length || 0
        localStorage.removeItem('quota-test')
        
        // Estimation approximative (5-10MB selon le navigateur)
        quotaAvailable = 5 * 1024 * 1024 // 5MB par défaut
      } catch (e) {
        quotaAvailable = 0
      }
      
      setStorageInfo({
        mainSize,
        backupSize,
        totalSize: mainSize + backupSize,
        lastUpdate,
        productCount,
        version,
        quotaUsed: mainSize + backupSize,
        quotaAvailable
      })
      
    } catch (error) {
      console.error('Erreur mise à jour info storage:', error)
    }
  }

  useEffect(() => {
    updateStorageInfo()
    
    // Mise à jour toutes les 2 secondes
    const interval = setInterval(updateStorageInfo, 2000)
    
    // Écouter les événements de mise à jour
    const handleUpdate = () => {
      setTimeout(updateStorageInfo, 100) // Petit délai pour laisser le temps à la sauvegarde
    }
    
    window.addEventListener('xarala-products-updated', handleUpdate)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('xarala-products-updated', handleUpdate)
    }
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('fr-FR')
    } catch {
      return 'Format invalide'
    }
  }

  const quotaPercentage = storageInfo.quotaAvailable > 0 
    ? (storageInfo.quotaUsed / storageInfo.quotaAvailable) * 100 
    : 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="w-5 h-5" />
          Monitoring du Stockage
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations générales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {storageInfo.productCount}
            </div>
            <div className="text-sm text-blue-800">Produits</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatBytes(storageInfo.mainSize)}
            </div>
            <div className="text-sm text-green-800">Données principales</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {formatBytes(storageInfo.backupSize)}
            </div>
            <div className="text-sm text-orange-800">Backup</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              v{storageInfo.version}
            </div>
            <div className="text-sm text-purple-800">Version</div>
          </div>
        </div>

        {/* Barre de progression du quota */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Utilisation du localStorage</span>
            <span className="text-gray-600">
              {formatBytes(storageInfo.quotaUsed)} / {formatBytes(storageInfo.quotaAvailable)}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                quotaPercentage > 80 ? 'bg-red-500' :
                quotaPercentage > 60 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
            />
          </div>
          
          {quotaPercentage > 80 && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>Attention : Quota localStorage presque atteint</span>
            </div>
          )}
        </div>

        {/* Dernière mise à jour */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Dernière mise à jour : {formatDate(storageInfo.lastUpdate)}</span>
        </div>

        {/* Status badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant={storageInfo.mainSize > 0 ? "default" : "secondary"}>
            <Database className="w-3 h-3 mr-1" />
            Données principales
          </Badge>
          
          <Badge variant={storageInfo.backupSize > 0 ? "default" : "secondary"}>
            <HardDrive className="w-3 h-3 mr-1" />
            Backup actif
          </Badge>
          
          <Badge variant={quotaPercentage < 50 ? "default" : quotaPercentage < 80 ? "secondary" : "destructive"}>
            {quotaPercentage < 50 ? "✅ Quota OK" : 
             quotaPercentage < 80 ? "⚠️ Quota moyen" : "❌ Quota critique"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
