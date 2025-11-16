# Layout Principal avec i18n - Xarala Solutions

## Vue d'ensemble

Le layout principal de Xarala Solutions est configuré avec l'internationalisation complète, supportant 3 langues (français, anglais, wolof) avec détection automatique et redirections intelligentes.

## Structure des fichiers

```
app/
├── [locale]/
│   ├── layout.tsx          # Layout principal avec i18n
│   └── page.tsx            # Page d'accueil exemple
├── globals.css             # Styles globaux
└── layout.tsx              # Layout racine (optionnel)

components/
├── layout/
│   ├── header.tsx          # Header avec traductions
│   ├── footer.tsx          # Footer avec traductions
│   └── main-layout.tsx     # Layout complet
└── theme-provider.tsx      # Provider de thème

middleware.ts               # Gestion des locales et auth
i18n.config.ts             # Configuration next-intl
messages/
├── fr.json                # Traductions françaises
├── en.json                # Traductions anglaises
└── wo.json                # Traductions wolof
```

## Configuration i18n

### 1. Configuration next-intl (`i18n.config.ts`)

```typescript
export const locales = ['fr', 'en', 'wo'] as const
export const defaultLocale = 'fr' as const

export const pathnames = {
  '/': '/',
  '/products': {
    fr: '/produits',
    en: '/products', 
    wo: '/jumtukaay'
  },
  // ... autres routes
}
```

### 2. Middleware (`middleware.ts`)

- **Redirection racine** : `/` → `/fr`
- **Détection automatique** : Basée sur `Accept-Language`
- **Routes protégées** : Authentification requise
- **Sécurité** : Headers de sécurité sur toutes les réponses

### 3. Layout principal (`app/[locale]/layout.tsx`)

#### Fonctionnalités :
- **Structure HTML** : `<html>`, `<head>`, `<body>`
- **Providers** : next-intl, ThemeProvider, Toaster
- **Fonts** : Google Fonts (Inter) avec optimisations
- **Metadata SEO** : Complètes et localisées
- **PWA** : Manifest, icônes, meta tags

#### Providers intégrés :
```tsx
<NextIntlClientProvider messages={messages}>
  <ThemeProvider attribute="class" defaultTheme="light">
    <MainLayout>
      {children}
    </MainLayout>
    <Toaster />
  </ThemeProvider>
</NextIntlClientProvider>
```

## Traductions

### Structure organisée

```json
{
  "header": {
    "home": "Accueil",
    "products": "Produits",
    "cardEditor": "Éditeur de cartes",
    "about": "À propos",
    "login": "Connexion",
    "signup": "Inscription",
    "cart": "Panier"
  },
  "footer": {
    "about": "À propos de nous",
    "quickLinks": "Liens rapides",
    "contact": "Contact",
    "rights": "Tous droits réservés"
  }
}
```

### Utilisation dans les composants

```tsx
import { useTranslations } from 'next-intl'

export default function MyComponent() {
  const t = useTranslations('header')
  
  return (
    <div>
      <h1>{t('home')}</h1>
      <p>{t('products')}</p>
    </div>
  )
}
```

### Metadata localisées

```tsx
export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'hero' })
  
  return {
    title: t('title'),
    description: t('description'),
  }
}
```

## Fonctionnalités avancées

### 1. Détection automatique de langue

Le middleware détecte automatiquement la langue préférée de l'utilisateur :

```typescript
// Accept-Language: fr-FR,fr;q=0.9,en;q=0.8
// → Redirige vers /fr

// Accept-Language: en-US,en;q=0.9
// → Redirige vers /en
```

### 2. Redirections intelligentes

- **Racine** : `/` → `/fr`
- **Routes non localisées** : `/products` → `/fr/produits`
- **Routes protégées** : Authentification requise
- **Admin** : Vérification des permissions

### 3. SEO et Performance

#### Metadata complètes :
- **Open Graph** : Images, descriptions, locale
- **Twitter Cards** : Support complet
- **Robots** : Configuration pour indexation
- **Canonical** : URLs canoniques
- **Alternates** : Liens vers autres langues

#### Optimisations :
- **Google Fonts** : Preconnect, display: swap
- **Images** : Optimisation Next.js
- **Cache** : Headers pour assets statiques
- **Analytics** : Google Analytics intégré

### 4. Sécurité

#### Headers de sécurité :
```typescript
response.headers.set('X-Frame-Options', 'DENY')
response.headers.set('X-Content-Type-Options', 'nosniff')
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
```

#### Authentification :
- **Routes protégées** : Vérification session
- **API routes** : Authentification requise
- **Admin routes** : Vérification rôle admin

## Utilisation

### 1. Créer une nouvelle page

```tsx
// app/[locale]/ma-page/page.tsx
import { useTranslations } from 'next-intl'

export default function MaPage() {
  const t = useTranslations('maPage')
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

### 2. Ajouter des traductions

```json
// messages/fr.json
{
  "maPage": {
    "title": "Ma Page",
    "description": "Description de ma page"
  }
}
```

### 3. Utiliser le layout

```tsx
// Le layout est automatiquement appliqué
// Header et Footer sont inclus
// Traductions sont chargées
```

## Déploiement

### Variables d'environnement requises

```env
NEXT_PUBLIC_APP_URL=https://xarala.sn
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_GOOGLE_VERIFICATION=VERIFICATION_CODE
```

### Build et export

```bash
# Build avec support i18n
npm run build

# Vérifier les routes générées
npm run start
```

## Dépannage

### Problèmes courants

1. **Traductions manquantes**
   ```tsx
   // Vérifier la structure des messages
   const t = useTranslations('header')
   console.log(t('home')) // Devrait afficher "Accueil"
   ```

2. **Redirections incorrectes**
   ```typescript
   // Vérifier la configuration du middleware
   const locales = ['fr', 'en', 'wo']
   const defaultLocale = 'fr'
   ```

3. **Metadata non localisées**
   ```tsx
   // Utiliser getTranslations pour les metadata
   const t = await getTranslations({ locale, namespace: 'hero' })
   ```

### Debug

```typescript
// Activer les logs de debug
console.log('Locale actuelle:', locale)
console.log('Messages chargés:', Object.keys(messages))
console.log('Route actuelle:', pathname)
```

## Performance

### Métriques attendues

- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1
- **First Input Delay** : < 100ms

### Optimisations

- **Code splitting** : Par locale
- **Lazy loading** : Composants non critiques
- **Image optimization** : Next.js Image
- **Font optimization** : Google Fonts avec preconnect

## Support

Pour toute question ou problème :

1. Vérifier la documentation next-intl
2. Consulter les logs du middleware
3. Tester avec les exemples fournis
4. Créer une issue avec les détails du problème
