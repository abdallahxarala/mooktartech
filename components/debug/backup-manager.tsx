'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Upload, 
  Trash2, 
  RotateCcw, 
  Clock, 
  HardDrive,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { 
  createBackup, 
  getBackups, 
  restoreBackup, 
  deleteBackup, 
  exportBackup, 
  importBackup 
} from '@/lib/utils/backup-manager'
import { useAppStore } from '@/lib/store/app-store'
import toast from 'react-hot-toast'

interface BackupData {
  id: string
  timestamp: string
  products: any[]
  version: string
  size: number
}

export function BackupManager() {
  const [backups, setBackups] = useState<BackupData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const products = useAppStore(state => state.products)
  const setProducts = useAppStore(state => state.setProducts)

  const loadBackups = () => {
    const backupList = getBackups()
    setBackups(backupList)
  }

  useEffect(() => {
    loadBackups()
  }, [])

  const handleCreateBackup = async () => {
    setIsLoading(true)
    const toastId = toast.loading('💾 Création du backup...')
    
    try {
      const backupId = createBackup(products)
      
      if (backupId) {
        loadBackups()
        toast.success('✅ Backup créé avec succès !', { id: toastId })
      } else {
        throw new Error('Échec de la création')
      }
    } catch (error) {
      console.error('Erreur création backup:', error)
      toast.error('❌ Erreur lors de la création du backup', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestoreBackup = async (backupId: string) => {
    setIsLoading(true)
    const toastId = toast.loading('🔄 Restauration du backup...')
    
    try {
      const restoredProducts = restoreBackup(backupId)
      
      if (restoredProducts) {
        setProducts(restoredProducts)
        toast.success('✅ Backup restauré avec succès !', { id: toastId })
      } else {
        throw new Error('Échec de la restauration')
      }
    } catch (error) {
      console.error('Erreur restauration backup:', error)
      toast.error('❌ Erreur lors de la restauration', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBackup = async (backupId: string) => {
    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer ce backup ?')
    if (!confirmed) return
    
    const success = deleteBackup(backupId)
    
    if (success) {
      loadBackups()
      toast.success('✅ Backup supprimé')
    } else {
      toast.error('❌ Erreur lors de la suppression')
    }
  }

  const handleExportBackup = (backupId: string) => {
    const jsonData = exportBackup(backupId)
    
    if (jsonData) {
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `xarala-backup-${backupId}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('✅ Backup exporté')
    } else {
      toast.error('❌ Erreur lors de l\'export')
    }
  }

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string
        const backupId = importBackup(jsonData)
        
        if (backupId) {
          loadBackups()
          toast.success('✅ Backup importé avec succès !')
        } else {
          throw new Error('Échec de l\'import')
        }
      } catch (error) {
        console.error('Erreur import backup:', error)
        toast.error('❌ Erreur lors de l\'import du backup')
      }
    }
    reader.readAsText(file)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('fr-FR')
    } catch {
      return 'Date invalide'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="w-5 h-5" />
          Gestion des Backups
        </CardTitle>
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {backups.length} backup{backups.length > 1 ? 's' : ''} disponible{backups.length > 1 ? 's' : ''}
          </Badge>
          <Badge variant="outline">
            {products.length} produits actuels
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Actions principales */}
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={handleCreateBackup}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <HardDrive className="w-4 h-4" />
            Créer un backup
          </Button>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            Importer un backup
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
          
          <Button 
            onClick={loadBackups}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Actualiser
          </Button>
        </div>

        {/* Liste des backups */}
        {backups.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Backups disponibles :</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {backups.map((backup) => (
                <div 
                  key={backup.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {backup.id}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(backup.timestamp)}
                        </span>
                        <span>{backup.products.length} produits</span>
                        <span>{formatBytes(backup.size)}</span>
                        <Badge variant="outline" className="text-xs">
                          v{backup.version}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestoreBackup(backup.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restaurer
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportBackup(backup.id)}
                      className="flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Exporter
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteBackup(backup.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <HardDrive className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium">Aucun backup disponible</p>
            <p className="text-sm">Créez votre premier backup pour sécuriser vos données</p>
          </div>
        )}

        {/* Informations */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4" />
            <strong>Informations importantes :</strong>
          </div>
          <ul className="space-y-1">
            <li>• Les backups sont stockés localement dans votre navigateur</li>
            <li>• Seuls les 5 derniers backups sont conservés automatiquement</li>
            <li>• Exportez vos backups pour les sauvegarder ailleurs</li>
            <li>• La restauration remplace complètement les données actuelles</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
