'use client'

import { Product } from '@/lib/data/products'

// ═══════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════

const BACKUP_PREFIX = 'xarala-backup-'
const MAX_BACKUPS = 5 // Garder les 5 derniers backups

// ═══════════════════════════════════════
// TYPES
// ═══════════════════════════════════════

interface BackupData {
  id: string
  timestamp: string
  products: Product[]
  version: string
  size: number
}

// ═══════════════════════════════════════
// FONCTIONS DE BACKUP
// ═══════════════════════════════════════

export function createBackup(products: Product[]): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    const backupId = `backup-${Date.now()}`
    const timestamp = new Date().toISOString()
    
    const backupData: BackupData = {
      id: backupId,
      timestamp,
      products,
      version: '2.0',
      size: JSON.stringify(products).length
    }
    
    const key = `${BACKUP_PREFIX}${backupId}`
    localStorage.setItem(key, JSON.stringify(backupData))
    
    console.log('💾 [BACKUP] Créé:', backupId)
    console.log('   └─ Produits:', products.length)
    console.log('   └─ Taille:', (backupData.size / 1024).toFixed(2), 'KB')
    
    // Nettoyer les anciens backups
    cleanupOldBackups()
    
    return backupId
  } catch (error) {
    console.error('❌ [BACKUP] Erreur création:', error)
    return null
  }
}

export function getBackups(): BackupData[] {
  if (typeof window === 'undefined') return []
  
  try {
    const backups: BackupData[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(BACKUP_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}')
          if (data.id && data.timestamp && data.products) {
            backups.push(data)
          }
        } catch (e) {
          console.warn('⚠️ [BACKUP] Données corrompues:', key)
        }
      }
    }
    
    // Trier par timestamp (plus récent en premier)
    return backups.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  } catch (error) {
    console.error('❌ [BACKUP] Erreur récupération:', error)
    return []
  }
}

export function restoreBackup(backupId: string): Product[] | null {
  if (typeof window === 'undefined') return null
  
  try {
    const key = `${BACKUP_PREFIX}${backupId}`
    const stored = localStorage.getItem(key)
    
    if (!stored) {
      console.error('❌ [BACKUP] Backup non trouvé:', backupId)
      return null
    }
    
    const backupData: BackupData = JSON.parse(stored)
    
    if (!backupData.products || !Array.isArray(backupData.products)) {
      console.error('❌ [BACKUP] Données invalides:', backupId)
      return null
    }
    
    console.log('🔄 [BACKUP] Restauration:', backupId)
    console.log('   └─ Produits:', backupData.products.length)
    console.log('   └─ Date:', backupData.timestamp)
    
    return backupData.products
  } catch (error) {
    console.error('❌ [BACKUP] Erreur restauration:', error)
    return null
  }
}

export function deleteBackup(backupId: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const key = `${BACKUP_PREFIX}${backupId}`
    localStorage.removeItem(key)
    
    console.log('🗑️ [BACKUP] Supprimé:', backupId)
    return true
  } catch (error) {
    console.error('❌ [BACKUP] Erreur suppression:', error)
    return false
  }
}

export function cleanupOldBackups(): void {
  if (typeof window === 'undefined') return
  
  try {
    const backups = getBackups()
    
    if (backups.length <= MAX_BACKUPS) {
      console.log('🧹 [BACKUP] Pas de nettoyage nécessaire')
      return
    }
    
    // Supprimer les backups les plus anciens
    const toDelete = backups.slice(MAX_BACKUPS)
    
    for (const backup of toDelete) {
      deleteBackup(backup.id)
    }
    
    console.log('🧹 [BACKUP] Nettoyage terminé:', toDelete.length, 'backups supprimés')
  } catch (error) {
    console.error('❌ [BACKUP] Erreur nettoyage:', error)
  }
}

export function exportBackup(backupId: string): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    const key = `${BACKUP_PREFIX}${backupId}`
    const stored = localStorage.getItem(key)
    
    if (!stored) return null
    
    const backupData: BackupData = JSON.parse(stored)
    
    // Créer un fichier JSON téléchargeable
    const exportData = {
      ...backupData,
      exportedAt: new Date().toISOString(),
      exportedBy: 'Xarala Solutions Admin'
    }
    
    return JSON.stringify(exportData, null, 2)
  } catch (error) {
    console.error('❌ [BACKUP] Erreur export:', error)
    return null
  }
}

export function importBackup(jsonData: string): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    const data = JSON.parse(jsonData)
    
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Format de backup invalide')
    }
    
    const backupId = `imported-${Date.now()}`
    const timestamp = new Date().toISOString()
    
    const backupData: BackupData = {
      id: backupId,
      timestamp,
      products: data.products,
      version: data.version || '2.0',
      size: JSON.stringify(data.products).length
    }
    
    const key = `${BACKUP_PREFIX}${backupId}`
    localStorage.setItem(key, JSON.stringify(backupData))
    
    console.log('📥 [BACKUP] Importé:', backupId)
    console.log('   └─ Produits:', data.products.length)
    
    return backupId
  } catch (error) {
    console.error('❌ [BACKUP] Erreur import:', error)
    return null
  }
}
