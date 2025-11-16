// Pas de 'use server' ici, fichier client-side

export function buildCloudinaryUrl(publicId: string, transformations?: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  
  if (!cloudName) return ''
  
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`
  
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`
  }
  
  return `${baseUrl}/${publicId}`
}

export const IMAGE_TRANSFORMATIONS = {
  thumbnail: 'w_300,h_300,c_fill,g_center',
  medium: 'w_800,h_800,c_fit',
  large: 'w_1200,h_1200,c_fit',
  productCard: 'w_400,h_400,c_fill,g_center,f_auto,q_auto',
  productDetail: 'w_1000,h_1000,c_fit,f_auto,q_auto',
}

// Helper pour obtenir une image transformée
export function getProductImageUrl(
  publicId: string, 
  size: keyof typeof IMAGE_TRANSFORMATIONS = 'medium'
) {
  return buildCloudinaryUrl(publicId, IMAGE_TRANSFORMATIONS[size])
}
