/**
 * SYSTÈME D'IMAGES SIMPLIFIÉ - VERSION FINALE
 */

export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Canvas not supported'))
          return
        }
        
        // Taille max 600x600 (optimisé localStorage)
        const MAX_SIZE = 600
        let width = img.width
        let height = img.height
        
        if (width > height && width > MAX_SIZE) {
          height = (height * MAX_SIZE) / width
          width = MAX_SIZE
        } else if (height > MAX_SIZE) {
          width = (width * MAX_SIZE) / height
          height = MAX_SIZE
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        // JPEG 70% qualité
        const compressed = canvas.toDataURL('image/jpeg', 0.7)
        resolve(compressed)
      }
      
      img.onerror = () => reject(new Error('Image load failed'))
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => reject(new Error('File read failed'))
    reader.readAsDataURL(file)
  })
}

export async function processImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map(file => compressImage(file)))
}

export function addTimestamp(url: string): string {
  if (!url) return ''
  return `${url.split('?')[0]}?t=${Date.now()}`
}
