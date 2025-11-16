# Xarala Solutions

Plateforme e-commerce B2B sénégalaise pour les solutions d'identification professionnelles.

## 🚀 Technologies

- **Next.js 14.2.0** avec App Router
- **TypeScript 5.3.3** (mode strict)
- **Tailwind CSS 3.4.1** avec design system personnalisé
- **Supabase** (authentification + base de données)
- **next-intl** pour l'internationalisation (fr, en, wo)
- **Zustand** pour la gestion d'état
- **React Hook Form + Zod** pour les formulaires
- **Framer Motion** pour les animations
- **shadcn/ui** pour les composants UI
- **Lucide React** pour les icônes

## 🌍 Langues supportées

- 🇫🇷 **Français** (langue par défaut)
- 🇬🇧 **English**
- 🇸🇳 **Wolof**

## 🛠️ Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/xarala-solutions/project.git
   cd project
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp env.example .env.local
   ```
   
   Remplir les variables dans `.env.local` :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 📁 Structure du projet

```
xarala-solutions/
├── app/                    # App Router Next.js
│   ├── [locale]/          # Routes internationalisées
│   │   ├── layout.tsx     # Layout principal
│   │   ├── page.tsx       # Page d'accueil
│   │   ├── products/      # Pages produits
│   │   ├── cart/          # Pages panier
│   │   ├── checkout/      # Pages commande
│   │   ├── auth/          # Pages authentification
│   │   └── dashboard/     # Pages tableau de bord
│   ├── api/               # API Routes
│   └── globals.css        # Styles globaux
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   ├── layout/           # Composants de layout
│   ├── products/         # Composants produits
│   ├── cart/             # Composants panier
│   └── card-editor/      # Composants éditeur de cartes
├── lib/                  # Utilitaires et configuration
│   ├── supabase/         # Configuration Supabase
│   ├── store/            # Stores Zustand
│   ├── hooks/            # Hooks personnalisés
│   ├── utils/            # Fonctions utilitaires
│   ├── types/            # Types TypeScript
│   └── config/           # Configuration
├── messages/             # Fichiers de traduction
│   ├── fr.json          # Traductions françaises
│   ├── en.json          # Traductions anglaises
│   └── wo.json          # Traductions wolof
├── public/               # Assets statiques
├── supabase/             # Migrations et configuration Supabase
└── config files          # Fichiers de configuration
```

## 🎨 Design System

### Couleurs principales
- **Primary**: `#2563eb` (Bleu Xarala)
- **Secondary**: `#10b981` (Vert)
- **Accent**: `#f59e0b` (Orange)
- **Sénégal**: `#00853f`, `#fcd116`, `#ce1126`

### Typographie
- **Police principale**: Inter
- **Police mono**: JetBrains Mono

### Classes utilitaires personnalisées
- `.text-gradient` - Texte avec dégradé
- `.bg-gradient-xarala` - Arrière-plan avec dégradé Xarala
- `.shadow-xarala` - Ombre personnalisée Xarala

## 🌐 Internationalisation

Le projet supporte 3 langues avec des routes localisées :

- `/fr` - Français (défaut)
- `/en` - English
- `/wo` - Wolof

### Ajouter une nouvelle traduction

1. Ajouter la clé dans `messages/fr.json`
2. Traduire dans `messages/en.json` et `messages/wo.json`
3. Utiliser dans les composants avec `useTranslations()`

## 🗄️ Base de données

### Tables principales
- `users` - Utilisateurs
- `products` - Produits
- `categories` - Catégories
- `cart_items` - Articles du panier
- `orders` - Commandes
- `virtual_cards` - Cartes virtuelles
- `qr_codes` - Codes QR
- `addresses` - Adresses

### Migrations
```bash
# Générer les types TypeScript
npm run db:generate

# Appliquer les migrations
npm run db:push

# Réinitialiser la base de données
npm run db:reset
```

## 🚀 Déploiement

### Vercel (recommandé)
1. Connecter le repository à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Autres plateformes
```bash
# Build de production
npm run build

# Démarrer en production
npm start
```

## 📱 Fonctionnalités

### E-commerce
- ✅ Catalogue de produits
- ✅ Panier et commande
- ✅ Paiements (Stripe, Mobile Money)
- ✅ Gestion des adresses
- ✅ Suivi des commandes

### Cartes virtuelles
- ✅ Éditeur de cartes
- ✅ Templates personnalisés
- ✅ Export PNG/SVG
- ✅ Partage et téléchargement

### Codes QR
- ✅ Générateur de codes QR
- ✅ Types multiples (URL, texte, contact, WiFi)
- ✅ Personnalisation des couleurs
- ✅ Export en différents formats

### Technologie NFC
- ✅ Gestion des tags NFC
- ✅ Lecture et écriture
- ✅ Support des formats standards

### Analytics
- ✅ Tableau de bord utilisateur
- ✅ Statistiques de vues
- ✅ Rapports de performance

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests en mode watch
npm run test:watch

# Couverture de tests
npm run test:coverage
```

## 📝 Scripts disponibles

```bash
npm run dev          # Développement
npm run build        # Build de production
npm run start        # Démarrer en production
npm run lint         # Linter
npm run lint:fix     # Corriger les erreurs de lint
npm run type-check   # Vérification TypeScript
npm run test         # Tests
npm run analyze      # Analyser les fichiers
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Email**: contact@xarala.sn
- **Téléphone**: +221 XX XXX XX XX
- **Site web**: https://xarala.sn

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [shadcn/ui](https://ui.shadcn.com/) - Composants UI
- [Zustand](https://zustand-demo.pmnd.rs/) - Gestion d'état
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalisation

---

**Xarala Solutions** - Solutions d'identification professionnelles pour le Sénégal 🇸🇳
