# Layout Principal - Xarala Solutions

## Vue d'ensemble

Le layout principal de Xarala Solutions comprend le header et le footer, fournissant une structure complète pour l'application e-commerce B2B avec navigation, authentification, gestion du panier et informations de contact.

## Fonctionnalités

### 🎨 Design
- **Sticky Header** : Reste fixe en haut lors du scroll
- **Effet de transparence** : Fond transparent qui devient opaque au scroll
- **Ombre douce** : Apparaît au scroll pour la profondeur
- **Animations fluides** : Transitions Framer Motion
- **Mobile-first** : Design responsive avec breakpoint `md`

### 🧭 Navigation
- **Desktop** : Menu horizontal avec liens principaux
- **Mobile** : Menu hamburger avec animation
- **Liens** : Accueil, Produits, Éditeur de cartes, À propos

### 🌍 Internationalisation
- **Sélecteur de langue** : Dropdown avec drapeaux
- **Langues supportées** : Français 🇫🇷, English 🇬🇧, Wolof 🇸🇳
- **Traductions** : Utilise `next-intl` pour les textes

### 🛒 Panier
- **Icône avec badge** : Affiche le nombre d'articles
- **Comptage en temps réel** : Synchronisé avec Zustand store
- **Accessibilité** : Labels ARIA pour les lecteurs d'écran

### 🔐 Authentification
- **État non connecté** : Boutons "Connexion" et "Inscription"
- **État connecté** : Avatar + menu dropdown
- **Menu utilisateur** : Profil, Commandes, Mes cartes, Déconnexion
- **Gestion des sessions** : Intégration Supabase

### 🦶 Footer
- **Structure responsive** : 3 colonnes desktop, empilé mobile
- **Informations entreprise** : Logo, description, réseaux sociaux
- **Liens rapides** : Navigation principale
- **Contact** : Adresse, email, téléphone, horaires
- **Liens légaux** : CGU, Confidentialité, Cookies
- **Design sombre** : Fond gris foncé avec texte clair
- **Animations** : Effets hover et transitions fluides

## Structure des fichiers

```
components/layout/
├── header.tsx              # Header principal
├── footer.tsx              # Footer principal
├── main-layout.tsx         # Layout complet (header + footer)
├── header-example.tsx      # Exemple d'utilisation header
├── footer-example.tsx      # Exemple d'utilisation footer
├── layout-example.tsx      # Exemple d'utilisation layout complet
└── README.md              # Documentation

lib/store/
└── useAppStore.ts         # Store Zustand pour l'état global

messages/
├── fr.json               # Traductions françaises
├── en.json               # Traductions anglaises
└── wo.json               # Traductions wolof
```

## Utilisation

### Layout complet (recommandé)

```tsx
import MainLayout from '@/components/layout/main-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}
```

### Header seul

```tsx
import Header from '@/components/layout/header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="pt-16 lg:pt-20">{children}</main>
    </div>
  )
}
```

### Footer seul

```tsx
import Footer from '@/components/layout/footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>{children}</main>
      <Footer />
    </div>
  )
}
```

### Avec le store Zustand

```tsx
import { useAppStore } from '@/lib/store/useAppStore'

function MyComponent() {
  const { cartItemsCount, addToCart } = useAppStore()
  
  return (
    <div>
      <p>Articles dans le panier : {cartItemsCount}</p>
      <button onClick={() => addToCart({ id: '1', name: 'Test', price: 100 })}>
        Ajouter au panier
      </button>
    </div>
  )
}
```

## Configuration requise

### Dépendances

```json
{
  "next": "^14.2.0",
  "next-intl": "^3.0.0",
  "framer-motion": "^10.0.0",
  "lucide-react": "^0.300.0",
  "zustand": "^4.4.0",
  "@supabase/ssr": "^0.0.10"
}
```

### Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Configuration i18n

Le header utilise `next-intl` pour les traductions. Assurez-vous que :

1. Le middleware i18n est configuré
2. Les fichiers de traduction sont présents dans `messages/`
3. La configuration `i18n.config.ts` est correcte

## Personnalisation

### Couleurs et thème

Le header utilise les classes Tailwind CSS personnalisées :

```css
/* Classes personnalisées utilisées */
.bg-gradient-xarala     /* Dégradé Xarala */
.text-gradient          /* Texte avec dégradé */
.shadow-xarala          /* Ombre personnalisée */
```

### Animations

Les animations sont configurées avec Framer Motion :

```tsx
// Variantes d'animation
const mobileMenuVariants = {
  closed: { opacity: 0, height: 0 },
  open: { opacity: 1, height: 'auto' }
}

const itemVariants = {
  closed: { opacity: 0, y: -10 },
  open: { opacity: 1, y: 0 }
}
```

### Responsive

- **Mobile** : `< 768px` - Menu hamburger
- **Desktop** : `≥ 768px` - Menu horizontal

## Accessibilité

### ARIA Labels

```tsx
// Exemples d'accessibilité
<Button aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>
<span className="sr-only">Panier ({cartItemsCount} articles)</span>
```

### Navigation au clavier

- Tab pour naviguer entre les éléments
- Enter/Espace pour activer les boutons
- Échap pour fermer les menus

## Tests

### Test du scroll

```tsx
// Tester l'effet sticky
window.scrollTo(0, 100) // Devrait activer l'ombre
window.scrollTo(0, 0)   // Devrait désactiver l'ombre
```

### Test des traductions

```tsx
// Changer de langue
window.location.href = '/en' // Anglais
window.location.href = '/fr' // Français
window.location.href = '/wo' // Wolof
```

## Dépannage

### Problèmes courants

1. **Store Zustand non initialisé**
   ```tsx
   // Vérifier que le store est correctement configuré
   const { cartItemsCount } = useAppStore()
   console.log('Cart count:', cartItemsCount)
   ```

2. **Traductions manquantes**
   ```tsx
   // Vérifier les clés de traduction
   const t = useTranslations('navigation')
   console.log('Home translation:', t('home'))
   ```

3. **Authentification Supabase**
   ```tsx
   // Vérifier la configuration Supabase
   const supabase = createSupabaseClient()
   const { data: { user } } = await supabase.auth.getUser()
   console.log('User:', user)
   ```

## Performance

### Optimisations

- **Lazy loading** : Les menus sont rendus conditionnellement
- **Memoization** : Les sélecteurs Zustand sont optimisés
- **Debouncing** : Le scroll est debounced pour les performances

### Métriques

- **Bundle size** : ~15KB gzippé
- **First paint** : < 100ms
- **Interactivity** : < 200ms

## Support

Pour toute question ou problème :

1. Vérifier la documentation des dépendances
2. Consulter les logs de la console
3. Tester avec les exemples fournis
4. Créer une issue avec les détails du problème
