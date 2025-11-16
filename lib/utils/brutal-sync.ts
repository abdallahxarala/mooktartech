'use client'

/**
 * Synchronisation brutale avec invalidation complète du cache
 */
export function brutalSync() {
  console.log('💥 [BRUTAL-SYNC] === SYNCHRONISATION BRUTALE ===')
  
  if (typeof window === 'undefined') {
    console.warn('⚠️ [BRUTAL-SYNC] Côté serveur - skip')
    return
  }
  
  // 1. Dispatcher l'événement multiple fois
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('xarala-products-updated', {
        detail: { 
          timestamp: new Date().toISOString(),
          brutal: true,
          attempt: i + 1,
          cacheBuster: Math.random()
        }
      }))
      console.log(`   └─ Événement brutal ${i + 1}/5 dispatché`)
    }, i * 50)
  }
  
  // 2. Forcer le rechargement de toutes les images
  setTimeout(() => {
    const images = document.querySelectorAll('img[src^="data:image"]')
    console.log(`   └─ ${images.length} images trouvées pour rechargement brutal`)
    
    images.forEach((img, index) => {
      const htmlImg = img as HTMLImageElement
      const originalSrc = htmlImg.src
      
      // Ajouter un cache buster unique
      const cacheBuster = `?cb=${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newSrc = originalSrc + cacheBuster
      
      // Forcer le rechargement
      htmlImg.src = ''
      setTimeout(() => {
        htmlImg.src = newSrc
        console.log(`   └─ Image ${index + 1} rechargée avec cache buster`)
      }, 10)
    })
  }, 300)
  
  // 3. Invalider le cache navigateur
  setTimeout(() => {
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        console.log(`   └─ ${cacheNames.length} caches trouvés`)
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log(`   └─ Suppression cache: ${cacheName}`)
            return caches.delete(cacheName)
          })
        )
      }).then(() => {
        console.log('   └─ Tous les caches supprimés')
      }).catch(error => {
        console.warn('   └─ Erreur suppression cache:', error)
      })
    }
  }, 500)
  
  // 4. Forcer le re-render des composants React
  setTimeout(() => {
    // Déclencher un événement de resize pour forcer les re-renders
    window.dispatchEvent(new Event('resize'))
    
    // Déclencher un événement de focus pour forcer les updates
    window.dispatchEvent(new Event('focus'))
    
    console.log('   └─ Événements de re-render déclenchés')
  }, 700)
  
  console.log('✅ [BRUTAL-SYNC] === SYNCHRONISATION BRUTALE TERMINÉE ===')
}

/**
 * Génère une clé unique pour forcer le re-render
 */
export function generateUniqueKey(prefix: string = 'sync'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Force le re-render d'un composant avec une clé unique
 */
export function forceRerender(component: string): string {
  const key = generateUniqueKey(component)
  console.log(`🔄 [RERENDER] ${component} forcé avec clé: ${key}`)
  return key
}
