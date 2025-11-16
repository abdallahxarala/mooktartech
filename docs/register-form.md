# Formulaire d'Inscription - Xarala Solutions

## Vue d'ensemble

Le formulaire d'inscription de Xarala Solutions est un composant moderne et sécurisé qui permet aux utilisateurs de créer un compte. Il utilise React Hook Form + Zod pour la validation, Supabase pour l'authentification, et inclut un indicateur de force du mot de passe avec animations fluides.

## Fonctionnalités

### 🔐 Authentification sécurisée
- **Supabase Auth** : Intégration complète avec `signUp()`
- **Création de profil** : Données utilisateur stockées dans la table `users`
- **Email de confirmation** : Envoi automatique d'email de vérification
- **Gestion des erreurs** : Messages d'erreur traduits et spécifiques
- **Loading states** : Indicateurs de chargement pendant l'inscription

### 📝 Validation robuste
- **React Hook Form** : Gestion d'état optimisée
- **Zod** : Validation de schéma TypeScript
- **Validation temps réel** : Validation au `onBlur`
- **Messages d'erreur** : Affichage sous chaque champ
- **Validation croisée** : Confirmation du mot de passe

### 🔒 Indicateur de force du mot de passe
- **Barre de progression** : Couleur dynamique selon la force
- **Critères visuels** : Checkmarks pour chaque critère
- **Calcul intelligent** : Score basé sur la diversité des caractères
- **Labels descriptifs** : Faible, Moyen, Fort, Très fort
- **Animation fluide** : Transitions smooth

### 🎨 Design moderne
- **Card centrée** : Design focalisé avec `max-w-lg`
- **Grid responsive** : 2 colonnes sur desktop, 1 sur mobile
- **Pattern de fond** : Motif subtil SVG
- **Logo animé** : Logo Xarala avec animation
- **Champs stylisés** : Icônes pour chaque type de champ

### 🎭 Animations fluides
- **Fade-in** : Apparition progressive des éléments
- **Stagger** : Animation échelonnée des champs
- **Micro-interactions** : Hover effects et transitions
- **Loading spinner** : Animation pendant l'inscription

## Structure des fichiers

```
components/auth/
├── register-form.tsx           # Composant principal
├── password-strength.tsx       # Indicateur de force
└── ...

app/[locale]/auth/register/
└── page.tsx                    # Page d'inscription

messages/
├── fr.json                     # Traductions françaises
├── en.json                     # Traductions anglaises
└── wo.json                     # Traductions wolof
```

## Utilisation

### Import et utilisation basique

```tsx
import RegisterForm from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <RegisterForm />
    </div>
  )
}
```

### Avec page complète

```tsx
import { Metadata } from 'next'
import RegisterForm from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: 'Inscription - Xarala Solutions',
  description: 'Créez votre compte Xarala Solutions'
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="flex items-center justify-center min-h-screen">
        <RegisterForm />
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
    "register": {
      "title": "Créer un compte",
      "subtitle": "Rejoignez Xarala Solutions et créez votre carte virtuelle",
      "fullNameLabel": "Nom complet",
      "emailLabel": "Adresse email",
      "phoneLabel": "Téléphone",
      "companyLabel": "Entreprise",
      "passwordLabel": "Mot de passe",
      "confirmPasswordLabel": "Confirmer le mot de passe",
      "acceptTerms": "J'accepte les",
      "termsLink": "conditions d'utilisation",
      "createAccountButton": "Créer mon compte",
      "creatingAccount": "Création du compte...",
      "hasAccount": "Déjà un compte ?",
      "loginLink": "Connectez-vous",
      "passwordStrength": {
        "label": "Force du mot de passe",
        "veryWeak": "Très faible",
        "weak": "Faible",
        "medium": "Moyen",
        "strong": "Fort",
        "veryStrong": "Très fort"
      }
    }
  }
}
```

### Clés de traduction

| Clé | Description | Exemple |
|-----|-------------|---------|
| `title` | Titre principal | "Créer un compte" |
| `subtitle` | Sous-titre | "Rejoignez Xarala Solutions" |
| `fullNameLabel` | Label nom complet | "Nom complet" |
| `emailLabel` | Label email | "Adresse email" |
| `phoneLabel` | Label téléphone | "Téléphone" |
| `companyLabel` | Label entreprise | "Entreprise" |
| `passwordLabel` | Label mot de passe | "Mot de passe" |
| `confirmPasswordLabel` | Label confirmation | "Confirmer le mot de passe" |
| `acceptTerms` | Texte CGU | "J'accepte les" |
| `termsLink` | Lien CGU | "conditions d'utilisation" |
| `createAccountButton` | Bouton inscription | "Créer mon compte" |
| `creatingAccount` | Texte pendant chargement | "Création du compte..." |

## Schéma de validation Zod

### Configuration

```typescript
const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne peut contenir que des lettres'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  phone: z
    .string()
    .min(1, 'Le téléphone est requis')
    .regex(/^\+221\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/, 'Format sénégalais invalide'),
  company: z
    .string()
    .max(100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères')
    .optional(),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, 
      'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial'),
  confirmPassword: z
    .string()
    .min(1, 'La confirmation du mot de passe est requise'),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'Vous devez accepter les conditions d\'utilisation')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
})
```

### Règles de validation

- **Nom complet** : 3-100 caractères, lettres uniquement
- **Email** : Format valide requis
- **Téléphone** : Format sénégalais (+221 XX XXX XX XX)
- **Entreprise** : Optionnel, max 100 caractères
- **Mot de passe** : 8-100 caractères, majuscule, chiffre, caractère spécial
- **Confirmation** : Doit correspondre au mot de passe
- **CGU** : Doit être coché

## Indicateur de force du mot de passe

### Calcul du score

```typescript
const strength = useMemo(() => {
  let score = 0
  const criteria = []

  // Longueur minimale (8 caractères)
  if (password.length >= 8) {
    score += 1
    criteria.push({ text: 'Au moins 8 caractères', valid: true })
  }

  // Majuscule
  if (/[A-Z]/.test(password)) {
    score += 1
    criteria.push({ text: 'Une majuscule', valid: true })
  }

  // Chiffre
  if (/\d/.test(password)) {
    score += 1
    criteria.push({ text: 'Un chiffre', valid: true })
  }

  // Caractère spécial
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1
    criteria.push({ text: 'Un caractère spécial', valid: true })
  }

  // Longueur supplémentaire (12+ caractères)
  if (password.length >= 12) {
    score += 1
    criteria.push({ text: '12+ caractères (bonus)', valid: true })
  }

  return { score, label, color, criteria }
}, [password])
```

### Niveaux de force

| Score | Label | Couleur | Description |
|-------|-------|---------|-------------|
| 0-1 | Très faible | Rouge | Mot de passe très faible |
| 2 | Faible | Orange | Mot de passe faible |
| 3 | Moyen | Jaune | Mot de passe moyen |
| 4 | Fort | Vert | Mot de passe fort |
| 5 | Très fort | Vert foncé | Mot de passe très fort |

## Gestion des erreurs Supabase

### Types d'erreurs gérées

```typescript
const errorMessages = {
  'User already registered': 'Un compte existe déjà avec cet email',
  'Invalid email': 'Format d\'email invalide',
  'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
  'Signup is disabled': 'L\'inscription est temporairement désactivée'
}
```

### Gestion des erreurs réseau

```typescript
try {
  const { data, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        phone: data.phone,
        company: data.company || null
      }
    }
  })
} catch (error) {
  // Gestion des erreurs réseau
  const errorMessage = 'Erreur d\'inscription. Vérifiez votre connexion internet.'
}
```

## Interface utilisateur

### Champs du formulaire

#### Nom complet
- **Type** : `text`
- **Validation** : 3-100 caractères, lettres uniquement
- **Icône** : User (lucide-react)
- **Placeholder** : "Votre nom complet"

#### Email
- **Type** : `email`
- **Validation** : Format email valide
- **Icône** : Mail (lucide-react)
- **Placeholder** : "votre@email.com"

#### Téléphone
- **Type** : `tel`
- **Validation** : Format sénégalais (+221 XX XXX XX XX)
- **Icône** : Phone (lucide-react)
- **Placeholder** : "+221 XX XXX XX XX"

#### Entreprise
- **Type** : `text`
- **Validation** : Optionnel, max 100 caractères
- **Icône** : Building (lucide-react)
- **Placeholder** : "Nom de votre entreprise"

#### Mot de passe
- **Type** : `password` / `text` (toggle)
- **Validation** : 8-100 caractères, critères de force
- **Icône** : Lock (lucide-react)
- **Placeholder** : "Votre mot de passe"
- **Indicateur** : Barre de force avec critères

#### Confirmation mot de passe
- **Type** : `password` / `text` (toggle)
- **Validation** : Doit correspondre au mot de passe
- **Icône** : Lock (lucide-react)
- **Placeholder** : "Confirmez votre mot de passe"

### Boutons et liens

#### Bouton principal
- **Texte** : "Créer mon compte"
- **État** : Loading avec spinner
- **Style** : Dégradé primary
- **Icône** : ArrowRight

#### Checkbox CGU
- **Texte** : "J'accepte les conditions d'utilisation"
- **Lien** : Vers `/terms`
- **Validation** : Obligatoire

#### Lien connexion
- **Destination** : `/auth/login`
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

/* Indicateur de force */
bg-red-500    /* Très faible */
bg-orange-500 /* Faible */
bg-yellow-500 /* Moyen */
bg-green-500  /* Fort */
bg-green-600  /* Très fort */
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
max-w-lg mx-auto

/* Champs */
space-y-6

/* Grid */
grid-cols-1 md:grid-cols-2 gap-4

/* Boutons */
h-12 px-8 py-4
```

## Responsive Design

### Breakpoints

```css
/* Mobile (par défaut) */
grid-cols-1

/* Desktop (md) */
md:grid-cols-2
```

### Adaptations

- **Mobile** : Champs empilés verticalement
- **Desktop** : Téléphone et entreprise côte à côte
- **Champs** : Hauteur fixe `h-12` pour tous les écrans

## Accessibilité

### ARIA Labels

```tsx
// Boutons toggle mot de passe
<button
  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
>
  {showPassword ? <Lock /> : <Lock />}
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
- **Indicateur** : Couleurs distinctes pour chaque niveau

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
  const result = registerSchema.safeParse({
    fullName: 'John Doe',
    email: 'invalid-email',
    phone: '+221 77 123 45 67',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    acceptTerms: true
  })
  expect(result.success).toBe(false)
})

// Test d'inscription
test('should handle successful registration', async () => {
  const mockSupabase = {
    auth: {
      signUp: jest.fn().mockResolvedValue({
        data: { user: { id: '123' } },
        error: null
      })
    }
  }
})
```

### Tests d'intégration

- **Flux complet** : Inscription → Email de confirmation
- **Gestion d'erreurs** : Affichage des messages
- **Responsive** : Adaptation mobile/desktop
- **Indicateur de force** : Calcul correct du score

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
   const t = useTranslations('auth.register')
   console.log('Title:', t('title'))
   ```

3. **Validation qui ne fonctionne pas**
   ```typescript
   // Vérifier le schéma Zod
   const result = registerSchema.safeParse(formData)
   console.log('Validation result:', result)
   ```

4. **Indicateur de force ne s'affiche pas**
   ```typescript
   // Vérifier que le mot de passe est watché
   const password = watch('password')
   console.log('Password:', password)
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
