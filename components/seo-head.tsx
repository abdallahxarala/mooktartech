'use client'

import { useEffect } from 'react'

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
}

export function SEOHead({
  title,
  description,
  keywords = [],
  ogTitle,
  ogDescription,
  ogImage,
  canonicalUrl
}: SEOHeadProps) {
  useEffect(() => {
    // Mettre à jour le titre de la page
    if (title) {
      document.title = title
    }

    // Mettre à jour la meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = description
      document.head.appendChild(meta)
    }

    // Mettre à jour les keywords
    if (keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords.join(', '))
      } else {
        const meta = document.createElement('meta')
        meta.name = 'keywords'
        meta.content = keywords.join(', ')
        document.head.appendChild(meta)
      }
    }

    // Open Graph
    const updateOGMeta = (property: string, content: string) => {
      if (!content) return
      
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (meta) {
        meta.setAttribute('content', content)
      } else {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        meta.setAttribute('content', content)
        document.head.appendChild(meta)
      }
    }

    updateOGMeta('og:title', ogTitle || title)
    updateOGMeta('og:description', ogDescription || description)
    updateOGMeta('og:type', 'product')
    updateOGMeta('og:locale', 'fr_SN')
    updateOGMeta('og:site_name', 'Xarala Solutions')
    if (ogImage) {
      updateOGMeta('og:image', ogImage)
    }

    // Twitter Card
    const updateTwitterMeta = (name: string, content: string) => {
      if (!content) return
      
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (meta) {
        meta.setAttribute('content', content)
      } else {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        meta.setAttribute('content', content)
        document.head.appendChild(meta)
      }
    }

    updateTwitterMeta('twitter:card', 'summary_large_image')
    updateTwitterMeta('twitter:title', ogTitle || title)
    updateTwitterMeta('twitter:description', ogDescription || description)
    if (ogImage) {
      updateTwitterMeta('twitter:image', ogImage)
    }

    // Canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) {
        canonical.setAttribute('href', canonicalUrl)
      } else {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        canonical.setAttribute('href', canonicalUrl)
        document.head.appendChild(canonical)
      }
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl])

  return null
}
