'use client'

/**
 * Optimise une image en la redimensionnant et compressant
 * @param file Fichier image original
 * @param maxWidth Largeur maximale (défaut: 800px)
 * @param maxHeight Hauteur maximale (défaut: 800px)
 * @param quality Qualité de compression 0-1 (défaut: 0.8)
 * @returns Promise<string> Image optimisée en base64
 */
export async function optimizeImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log('🖼️ [OPTIMIZER] Début optimisation:', file.name)
    console.log('   └─ Taille originale:', (file.size / 1024).toFixed(2), 'KB')
    
    const reader = new FileReader()
    
    reader.onerror = () => reject(new Error('Erreur lecture fichier'))
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onerror = () => reject(new Error('Erreur chargement image'))
      
      img.onload = () => {
        console.log('   └─ Dimensions originales:', img.width, 'x', img.height)
        
        // Calculer les nouvelles dimensions en gardant le ratio
        let width = img.width
        let height = img.height
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
        
        console.log('   └─ Nouvelles dimensions:', Math.round(width), 'x', Math.round(height))
        
        // Créer un canvas pour le redimensionnement
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Impossible de créer le contexte canvas'))
          return
        }
        
        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convertir en WebP ou JPEG selon le support
        let mimeType = 'image/webp'
        let base64 = canvas.toDataURL(mimeType, quality)
        
        // Si WebP n'est pas supporté, utiliser JPEG
        if (!base64.startsWith('data:image/webp')) {
          console.log('   └─ WebP non supporté, utilisation JPEG')
          mimeType = 'image/jpeg'
          base64 = canvas.toDataURL(mimeType, quality)
        }
        
        const optimizedSizeKB = (base64.length / 1024).toFixed(2)
        const originalSizeKB = (file.size / 1024).toFixed(2)
        const reduction = (((file.size - base64.length) / file.size) * 100).toFixed(1)
        
        console.log('✅ [OPTIMIZER] Image optimisée')
        console.log('   └─ Format:', mimeType)
        console.log('   └─ Taille finale:', optimizedSizeKB, 'KB')
        console.log('   └─ Réduction:', reduction, '%')
        
        resolve(base64)
      }
      
      img.src = e.target?.result as string
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Optimise plusieurs images en parallèle
 */
export async function optimizeImages(
  files: File[],
  maxWidth?: number,
  maxHeight?: number,
  quality?: number
): Promise<string[]> {
  console.log('🖼️ [OPTIMIZER] Optimisation de', files.length, 'images')
  
  const promises = files.map(file => optimizeImage(file, maxWidth, maxHeight, quality))
  const results = await Promise.all(promises)
  
  const totalOriginal = files.reduce((sum, f) => sum + f.size, 0)
  const totalOptimized = results.reduce((sum, b64) => sum + b64.length, 0)
  const totalReduction = (((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1)
  
  console.log('✅ [OPTIMIZER] Toutes les images optimisées')
  console.log('   └─ Réduction totale:', totalReduction, '%')
  
  return results
}

/**
 * Valide qu'un fichier est une image
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  return validTypes.includes(file.type)
}

/**
 * Valide la taille d'un fichier
 */
export function isValidFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}
