# Hero Section - Xarala Solutions

## Vue d'ensemble

La hero section de Xarala Solutions est une section d'accueil moderne et engageante qui présente l'entreprise et ses services d'identification professionnelle. Elle utilise des animations fluides, un design responsive et des éléments visuels attrayants.

## Fonctionnalités

### 🎨 Design moderne
- **Dégradé de fond** : Bleu vers vert (primary-600 → secondary-500)
- **Motif géométrique** : Grille subtile en arrière-plan
- **Formes flottantes** : Cercles animés avec effet de flou
- **Layout responsive** : Grid 2 colonnes (desktop) → empilé (mobile)

### 🎭 Animations Framer Motion
- **Titre** : Fade-in + slide-up avec délai
- **Sous-titre** : Fade-in avec délai progressif
- **Boutons CTA** : Fade-in + scale au hover
- **Visuel** : Fade-in + parallax au scroll
- **Cartes mockup** : Rotation et scale avec délais échelonnés

### 📱 Responsive Design
- **Mobile** : Contenu empilé verticalement
- **Tablet** : Layout adaptatif
- **Desktop** : Grid 2 colonnes avec visuel à droite

### 🌍 Internationalisation
- **Traductions** : Support français, anglais, wolof
- **Clés de traduction** : `hero.title`, `hero.subtitle`, `hero.ctaPrimary`, `hero.ctaSecondary`

## Structure des fichiers

```
components/sections/
├── hero-section.tsx          # Composant principal
└── products-preview.tsx      # Section de prévisualisation

app/[locale]/
└── page.tsx                  # Page d'accueil utilisant les composants

messages/
├── fr.json                   # Traductions françaises
├── en.json                   # Traductions anglaises
└── wo.json                   # Traductions wolof
```

## Utilisation

### Import et utilisation basique

```tsx
import HeroSection from '@/components/sections/hero-section'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      {/* Autres sections */}
    </div>
  )
}
```

### Avec traductions

```tsx
import { useTranslations } from 'next-intl'
import HeroSection from '@/components/sections/hero-section'

export default function HomePage() {
  const t = useTranslations('hero')
  
  return (
    <div>
      <HeroSection />
      <h2>{t('title')}</h2>
    </div>
  )
}
```

## Configuration des traductions

### Structure JSON

```json
{
  "hero": {
    "title": "Votre partenaire en solutions d'identification professionnelle",
    "subtitle": "Cartes PVC, imprimantes professionnelles et cartes virtuelles NFC pour votre entreprise au Sénégal",
    "ctaPrimary": "Découvrir nos produits",
    "ctaSecondary": "Créer ma carte virtuelle"
  }
}
```

### Clés de traduction

| Clé | Description | Exemple |
|-----|-------------|---------|
| `title` | Titre principal | "Votre partenaire en solutions d'identification professionnelle" |
| `subtitle` | Sous-titre descriptif | "Cartes PVC, imprimantes professionnelles..." |
| `ctaPrimary` | Bouton principal | "Découvrir nos produits" |
| `ctaSecondary` | Bouton secondaire | "Créer ma carte virtuelle" |

## Animations détaillées

### Séquence d'animation

1. **0.0s** : Conteneur principal (fade-in + slide-left)
2. **0.2s** : Titre principal (fade-in + slide-up)
3. **0.4s** : Sous-titre (fade-in + slide-up)
4. **0.6s** : Boutons CTA (fade-in + slide-up)
5. **0.8s** : Badges statistiques (fade-in + slide-up)
6. **1.0s** : Visuel principal (fade-in + slide-right)
7. **1.2s** : Carte principale (rotation + scale)
8. **1.4s** : Carte NFC (rotation + scale)
9. **1.6s** : QR Code (rotation + scale)
10. **2.0s** : Scroll indicator (fade-in)

### Effets parallax

```tsx
// Animation parallax au scroll
const { scrollY } = useScroll()
const y = useTransform(scrollY, [0, 500], [0, -50])

// Appliqué au visuel
<motion.div style={{ y }}>
```

### Effets hover

```tsx
// Bouton principal avec effet hover
<Button className="group">
  {t('ctaPrimary')}
  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
</Button>
```

## Design System

### Couleurs utilisées

```css
/* Dégradé principal */
bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500

/* Couleurs des badges */
bg-secondary-400

/* Couleurs des cartes */
from-primary-500 to-primary-600
from-secondary-400 to-secondary-500
```

### Typographie

```css
/* Titre principal */
text-4xl md:text-5xl lg:text-6xl font-bold

/* Sous-titre */
text-xl md:text-2xl text-white/90

/* Boutons */
text-lg px-8 py-4
```

### Espacement

```css
/* Conteneur principal */
space-y-8

/* Boutons CTA */
gap-4

/* Badges */
gap-6 pt-4
```

## Éléments visuels

### Mockup des cartes

1. **Carte principale** : Carte PVC avec design Xarala Solutions
2. **Carte NFC** : Petit badge avec icône smartphone
3. **QR Code** : Badge carré avec icône QR code

### Effets visuels

- **Motif géométrique** : SVG avec pattern de grille
- **Formes flottantes** : Cercles avec blur et animation pulse
- **Effet de brillance** : Dégradé animé sur les cartes
- **Scroll indicator** : Animation de scroll en bas

## Performance

### Optimisations

- **Lazy loading** : Animations déclenchées au viewport
- **Transform 3D** : Utilisation de `transform` pour les performances
- **Will-change** : Propriété CSS pour optimiser les animations
- **Debouncing** : Scroll events optimisés

### Métriques attendues

- **First Contentful Paint** : < 1.2s
- **Largest Contentful Paint** : < 2.0s
- **Cumulative Layout Shift** : < 0.05
- **First Input Delay** : < 50ms

## Accessibilité

### ARIA Labels

```tsx
// Boutons avec labels accessibles
<Button aria-label="Découvrir nos produits">
  {t('ctaPrimary')}
</Button>
```

### Navigation clavier

- **Tab** : Navigation entre les boutons
- **Enter/Space** : Activation des boutons
- **Focus visible** : Indicateurs de focus

### Contraste

- **Texte blanc** sur fond dégradé
- **Boutons** avec contraste suffisant
- **Badges** avec couleurs contrastées

## Personnalisation

### Modifier les couleurs

```tsx
// Changer le dégradé de fond
<div className="bg-gradient-to-br from-blue-600 via-blue-500 to-green-500">
```

### Modifier les animations

```tsx
// Changer la durée des animations
transition={{ duration: 1.2, delay: 0.3 }}
```

### Ajouter des éléments

```tsx
// Ajouter un badge personnalisé
<div className="flex items-center gap-2 text-white/80">
  <div className="w-2 h-2 bg-custom-color rounded-full" />
  <span className="text-sm font-medium">Nouveau badge</span>
</div>
```

## Dépannage

### Problèmes courants

1. **Animations qui ne se déclenchent pas**
   ```tsx
   // Vérifier que Framer Motion est installé
   import { motion } from 'framer-motion'
   ```

2. **Traductions manquantes**
   ```tsx
   // Vérifier la structure des messages
   const t = useTranslations('hero')
   console.log(t('title'))
   ```

3. **Problèmes de responsive**
   ```css
   /* Vérifier les breakpoints Tailwind */
   grid-cols-1 lg:grid-cols-2
   ```

### Debug des animations

```tsx
// Activer les logs de debug
console.log('Animation triggered:', { opacity: 1, y: 0 })
```

## Support

Pour toute question ou problème :

1. Vérifier la documentation Framer Motion
2. Consulter les logs de la console
3. Tester avec les exemples fournis
4. Créer une issue avec les détails du problème
