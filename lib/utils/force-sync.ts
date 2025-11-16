'use client'

/**
 * Force la synchronisation BRUTALE avec invalidation cache complète
 */
export function forceSyncNow() {
  console.log('💥 [FORCE-SYNC] === SYNCHRONISATION BRUTALE ===')
  
  if (typeof window === 'undefined') {
    console.warn('⚠️ [FORCE-SYNC] Côté serveur - skip')
    return
  }
  
  const timestamp = Date.now()
  
  // 1. Dispatcher l'événement plusieurs fois
  console.log('📢 [FORCE-SYNC] Dispatch événements...')
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('xarala-products-updated', {
        detail: { 
          timestamp,
          forced: true,
          attempt: i + 1,
          brutal: true
        }
      }))
      console.log(`   └─ Événement ${i + 1}/5 dispatché`)
    }, i * 100)
  }
  
  // 2. Invalider TOUTES les images du DOM
  setTimeout(() => {
    console.log('🖼️ [FORCE-SYNC] Invalidation cache images...')
    
    const images = document.querySelectorAll('img')
    console.log(`   └─ ${images.length} images trouvées`)
    
    images.forEach((img, index) => {
      const originalSrc = img.src
      
      // Si c'est une image base64 OU une URL
      if (originalSrc) {
        // Retirer les anciens timestamps
        const cleanSrc = originalSrc.split('?')[0]
        
        // Ajouter nouveau timestamp
        const newSrc = `${cleanSrc}?cache=${timestamp}-${index}`
        
        // Forcer rechargement
        img.src = ''
        setTimeout(() => {
          img.src = newSrc
        }, 10)
        
        if (index < 5) {
          console.log(`   └─ Image ${index + 1} invalidée:`, cleanSrc.substring(0, 50))
        }
      }
    })
  }, 300)
  
  // 3. Forcer re-render global
  setTimeout(() => {
    console.log('🔄 [FORCE-SYNC] Force re-render global...')
    document.body.style.opacity = '0.99'
    setTimeout(() => {
      document.body.style.opacity = '1'
      console.log('   └─ Re-render effectué')
    }, 10)
  }, 500)
  
  // 4. Event final
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('xarala-products-updated', {
      detail: { 
        timestamp,
        forced: true,
        final: true
      }
    }))
    console.log('✅ [FORCE-SYNC] === SYNCHRONISATION TERMINÉE ===')
  }, 1000)
}

/**
 * Version soft pour updates fréquentes
 */
export function softSync() {
  if (typeof window === 'undefined') return
  
  window.dispatchEvent(new CustomEvent('xarala-products-updated', {
    detail: { 
      timestamp: Date.now(),
      soft: true
    }
  }))
}