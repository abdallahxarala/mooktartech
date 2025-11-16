# Formulaire de Connexion - Xarala Solutions

## Vue d'ensemble

Le formulaire de connexion de Xarala Solutions est un composant moderne et sécurisé qui permet aux utilisateurs de se connecter à leur compte. Il utilise React Hook Form + Zod pour la validation, Supabase pour l'authentification, et Framer Motion pour les animations.

## Fonctionnalités

### 🔐 Authentification sécurisée
- **Supabase Auth** : Intégration complète avec `signInWithPassword()`
- **Gestion des erreurs** : Messages d'erreur traduits et spécifiques
- **Loading states** : Indicateurs de chargement pendant la connexion
- **Redirection** : Redirection automatique vers `/dashboard` après succès

### 📝 Validation robuste
- **React Hook Form** : Gestion d'état optimisée
- **Zod** : Validation de schéma TypeScript
- **Validation temps réel** : Validation au `onBlur`
- **Messages d'erreur** : Affichage sous chaque champ

### 🎨 Design moderne
- **Card centrée** : Design focalisé avec `max-w-md`
- **Pattern de fond** : Motif subtil SVG
- **Logo animé** : Logo Xarala avec animation
- **Responsive** : Adaptation mobile et desktop

### 🎭 Animations fluides
- **Fade-in** : Apparition progressive des éléments
- **Stagger** : Animation échelonnée des champs
- **Micro-interactions** : Hover effects et transitions
- **Loading spinner** : Animation pendant la connexion

## Structure des fichiers

```
components/auth/
├── login-form.tsx              # Composant principal
└── ...

app/[locale]/auth/login/
└── page.tsx                    # Page de connexion

messages/
├── fr.json                     # Traductions françaises
├── en.json                     # Traductions anglaises
└── wo.json                     # Traductions wolof
```

## Utilisation

### Import et utilisation basique

```tsx
import LoginForm from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <LoginForm />
    </div>
  )
}
```

### Avec page complète

```tsx
import { Metadata } from 'next'
import LoginForm from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Connexion - Xarala Solutions',
  description: 'Connectez-vous à votre compte Xarala Solutions'
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="flex items-center justify-center min-h-screen">
        <LoginForm />
      </div>
    </div>
  )
}
```

## Configuration des traductions

### Structure JSON

```json
{
  "auth": {
    "login": {
      "title": "Connexion",
      "subtitle": "Accédez à votre espace Xarala Solutions",
      "emailLabel": "Adresse email",
      "passwordLabel": "Mot de passe",
      "rememberMe": "Se souvenir de moi",
      "forgotPassword": "Mot de passe oublié ?",
      "signInButton": "Se connecter",
      "signingIn": "Connexion en cours...",
      "noAccount": "Pas encore de compte ?",
      "signUpLink": "Inscrivez-vous",
      "errors": {
        "invalidCredentials": "Email ou mot de passe incorrect",
        "emailNotConfirmed": "Veuillez confirmer votre email",
        "tooManyRequests": "Trop de tentatives de connexion",
        "userNotFound": "Aucun compte trouvé",
        "invalidEmail": "Format d'email invalide",
        "networkError": "Erreur de connexion",
        "genericError": "Une erreur est survenue"
      }
    }
  }
}
```

### Clés de traduction

| Clé | Description | Exemple |
|-----|-------------|---------|
| `title` | Titre principal | "Connexion" |
| `subtitle` | Sous-titre | "Accédez à votre espace Xarala Solutions" |
| `emailLabel` | Label email | "Adresse email" |
| `emailPlaceholder` | Placeholder email | "votre@email.com" |
| `passwordLabel` | Label mot de passe | "Mot de passe" |
| `passwordPlaceholder` | Placeholder mot de passe | "Votre mot de passe" |
| `rememberMe` | Checkbox se souvenir | "Se souvenir de moi" |
| `forgotPassword` | Lien mot de passe oublié | "Mot de passe oublié ?" |
| `signInButton` | Bouton connexion | "Se connecter" |
| `signingIn` | Texte pendant chargement | "Connexion en cours..." |
| `noAccount` | Texte pas de compte | "Pas encore de compte ?" |
| `signUpLink` | Lien inscription | "Inscrivez-vous" |

## Schéma de validation Zod

### Configuration

```typescript
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères'),
  rememberMe: z.boolean().optional()
})
```

### Règles de validation

- **Email** : Format valide requis
- **Mot de passe** : Minimum 8 caractères, maximum 100
- **Se souvenir de moi** : Optionnel (boolean)

## Gestion des erreurs Supabase

### Types d'erreurs gérées

```typescript
const errorMessages = {
  'Invalid login credentials': 'Email ou mot de passe incorrect',
  'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter',
  'Too many requests': 'Trop de tentatives de connexion. Veuillez réessayer plus tard',
  'User not found': 'Aucun compte trouvé avec cet email',
  'Invalid email': 'Format d\'email invalide'
}
```

### Gestion des erreurs réseau

```typescript
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  })
} catch (error) {
  // Gestion des erreurs réseau
  const errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.'
}
```

## Interface utilisateur

### Champs du formulaire

#### Email
- **Type** : `email`
- **Validation** : Format email valide
- **Icône** : Mail (lucide-react)
- **Placeholder** : "votre@email.com"

#### Mot de passe
- **Type** : `password` / `text` (toggle)
- **Validation** : 8-100 caractères
- **Icône** : Lock (lucide-react)
- **Toggle** : Eye/EyeOff pour afficher/masquer

#### Se souvenir de moi
- **Type** : `checkbox`
- **Valeur** : Boolean optionnel
- **Position** : À gauche des options

### Boutons et liens

#### Bouton principal
- **Texte** : "Se connecter"
- **État** : Loading avec spinner
- **Style** : Dégradé primary
- **Icône** : ArrowRight

#### Lien mot de passe oublié
- **Destination** : `/auth/forgot-password`
- **Style** : Texte primary
- **Position** : À droite des options

#### Lien inscription
- **Destination** : `/auth/signup`
- **Style** : Texte primary
- **Position** : En bas du formulaire

## Animations Framer Motion

### Séquence d'animation

```typescript
// Conteneur principal
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: 'easeOut' }}

// Logo
initial={{ scale: 0.8, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ duration: 0.5, delay: 0.2 }}

// Champs (stagger)
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
```

### Effets visuels

- **Fade-in** : Apparition progressive
- **Slide** : Mouvement horizontal
- **Scale** : Zoom du logo
- **Stagger** : Délai échelonné des champs

## Design System

### Couleurs utilisées

```css
/* Fond principal */
bg-gradient-to-br from-gray-50 via-white to-gray-100

/* Card */
bg-white/95 backdrop-blur-sm

/* Bouton principal */
bg-gradient-to-r from-primary-600 to-primary-700

/* Erreurs */
text-red-600 border-red-500
```

### Typographie

```css
/* Titre */
text-2xl font-bold text-gray-900

/* Sous-titre */
text-gray-600

/* Labels */
text-sm font-medium text-gray-700

/* Placeholders */
text-gray-400
```

### Espacement

```css
/* Card */
max-w-md mx-auto

/* Champs */
space-y-6

/* Boutons */
h-12 px-8 py-4

/* Marges */
py-12 px-4
```

## Responsive Design

### Breakpoints

```css
/* Mobile (par défaut) */
w-full max-w-md

/* Desktop */
sm:px-6 lg:px-8
```

### Adaptations

- **Mobile** : Formulaire centré, largeur maximale
- **Desktop** : Padding augmenté, espacement optimisé
- **Champs** : Hauteur fixe `h-12` pour tous les écrans

## Accessibilité

### ARIA Labels

```tsx
// Bouton toggle mot de passe
<button
  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
>
  {showPassword ? <EyeOff /> : <Eye />}
</button>
```

### Navigation clavier

- **Tab** : Navigation entre les champs
- **Enter** : Soumission du formulaire
- **Escape** : Fermeture des modales
- **Focus visible** : Indicateurs de focus

### Contraste

- **Texte** : Contraste élevé sur fond blanc
- **Boutons** : Couleurs contrastées
- **Erreurs** : Rouge vif pour la visibilité

## Performance

### Optimisations

- **Lazy loading** : Animations déclenchées au mount
- **Debouncing** : Validation optimisée
- **Memoization** : Composants mémorisés
- **Bundle splitting** : Code splitting automatique

### Métriques attendues

- **First Contentful Paint** : < 1.0s
- **Largest Contentful Paint** : < 1.5s
- **Cumulative Layout Shift** : < 0.05
- **First Input Delay** : < 50ms

## Sécurité

### Validation côté client

- **Zod** : Validation de schéma stricte
- **Sanitization** : Nettoyage des entrées
- **Type safety** : TypeScript strict

### Validation côté serveur

- **Supabase** : Validation serveur
- **Rate limiting** : Protection contre les attaques
- **CSRF** : Protection CSRF intégrée

## Tests

### Tests unitaires

```typescript
// Test de validation
test('should validate email format', () => {
  const result = loginSchema.safeParse({
    email: 'invalid-email',
    password: 'password123'
  })
  expect(result.success).toBe(false)
})

// Test de connexion
test('should handle successful login', async () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { user: { id: '123' } },
        error: null
      })
    }
  }
})
```

### Tests d'intégration

- **Flux complet** : Connexion → Redirection
- **Gestion d'erreurs** : Affichage des messages
- **Responsive** : Adaptation mobile/desktop

## Dépannage

### Problèmes courants

1. **Erreur Supabase**
   ```typescript
   // Vérifier la configuration
   const supabase = createClient()
   console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
   ```

2. **Traductions manquantes**
   ```typescript
   // Vérifier la structure des messages
   const t = useTranslations('auth.login')
   console.log('Title:', t('title'))
   ```

3. **Validation qui ne fonctionne pas**
   ```typescript
   // Vérifier le schéma Zod
   const result = loginSchema.safeParse(formData)
   console.log('Validation result:', result)
   ```

### Debug des animations

```typescript
// Activer les logs de debug
console.log('Animation triggered:', { opacity: 1, y: 0 })
```

## Support

Pour toute question ou problème :

1. Vérifier la documentation Supabase
2. Consulter les logs de la console
3. Tester avec les exemples fournis
4. Créer une issue avec les détails du problème
