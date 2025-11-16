# Éditeur de Cartes Virtuelles NFC - Xarala Solutions

Un éditeur de cartes virtuelles NFC ultra-moderne et complet, inspiré des meilleures interfaces (Figma, Canva, Linktree, Apple Wallet).

## 🚀 Fonctionnalités

### ✨ Interface Moderne
- **Layout responsive** : Desktop (sidebar + canvas + preview), Mobile (bottom sheet)
- **Design system Xarala** : Couleurs orange/gris cohérentes
- **Animations fluides** : Transitions 200-300ms, micro-interactions
- **Accessibilité** : Keyboard shortcuts, focus visible, ARIA labels

### 🎨 8 Thèmes Professionnels
1. **Minimaliste** - Design épuré et moderne
2. **Corporate** - Professionnel et élégant  
3. **Créatif** - Moderne et dynamique
4. **Élégant** - Luxe et sophistiqué
5. **Moderne** - Tech et contemporain
6. **Luxe** - Premium et haut de gamme
7. **Tech** - Cyberpunk et futuriste
8. **Naturel** - Organique et apaisant

### 📝 Édition Complète
- **Informations** : Photo, nom, fonction, entreprise, contact
- **Design** : Thèmes, couleurs personnalisées, typographie, disposition
- **Réseaux sociaux** : LinkedIn, Twitter, Instagram, WhatsApp, etc.
- **QR Code** : vCard, URL, WhatsApp, Email avec personnalisation
- **Export** : PNG, PDF, vCard, JSON

### 🔧 Fonctionnalités Avancées
- **Auto-save** : Sauvegarde automatique toutes les 3 secondes
- **Undo/Redo** : Historique complet avec Ctrl+Z/Ctrl+Y
- **Drag & Drop** : Upload d'images avec crop
- **Preview temps réel** : Aperçu instantané sur mobile/desktop
- **Partage** : URL publique, QR code, statistiques

## 🏗️ Architecture

### Structure des Fichiers
```
app/[locale]/card-editor/
├── page.tsx                    # Layout principal
└── cardEditorClient.tsx        # Client component

components/card-editor/
├── card-editor-header.tsx      # Header avec actions
├── card-editor-sidebar.tsx     # Sidebar avec onglets
├── card-canvas.tsx            # Zone d'édition centrale
├── card-canvas-content.tsx    # Contenu de la carte
├── card-preview.tsx           # Aperçu devices
├── image-uploader.tsx         # Upload d'images
├── preview-modal.tsx          # Modal aperçu plein écran
├── share-modal.tsx            # Modal partage
└── tabs/
    ├── info-tab.tsx           # Onglet informations
    ├── design-tab.tsx         # Onglet design
    ├── social-tab.tsx         # Onglet réseaux sociaux
    ├── qr-tab.tsx             # Onglet QR code
    └── export-tab.tsx         # Onglet export

lib/
├── store/card-editor-store.ts  # Store Zustand
├── utils/
│   ├── qr-generator.ts        # Génération QR codes
│   └── card-exporter.ts       # Export PNG/PDF/vCard
└── config/card-themes.ts      # 8 thèmes prédéfinis
```

### Technologies
- **Next.js 14** : App Router, Server Components
- **Zustand** : Gestion d'état globale
- **Tailwind CSS** : Styling et responsive
- **React Hook Form** : Gestion des formulaires
- **QRCode** : Génération de QR codes
- **html2canvas** : Export PNG
- **jsPDF** : Export PDF
- **react-color** : Color pickers
- **react-dropzone** : Upload de fichiers

## 🎯 Utilisation

### Démarrage Rapide
1. Accédez à `/card-editor`
2. Remplissez vos informations dans l'onglet "Informations"
3. Choisissez un thème dans l'onglet "Design"
4. Ajoutez vos réseaux sociaux
5. Configurez votre QR code
6. Exportez ou partagez votre carte

### Raccourcis Clavier
- `Ctrl+S` : Sauvegarder
- `Ctrl+Z` : Annuler
- `Ctrl+Y` : Rétablir
- `Ctrl+P` : Aperçu plein écran

### Formats d'Export
- **PNG** : Image haute qualité pour le web
- **PDF** : Document pour impression professionnelle
- **vCard** : Contact pour téléphones et logiciels
- **JSON** : Données brutes pour sauvegarde

## 🎨 Personnalisation

### Couleurs Xarala
- **Primary** : Orange #F97316
- **Secondary** : Gris #374151
- **Success** : Vert #10B981
- **Error** : Rouge #EF4444

### Thèmes Personnalisés
Les thèmes sont définis dans `lib/config/card-themes.ts` et peuvent être facilement étendus.

### Composants UI
Tous les composants utilisent le design system Xarala avec des variantes cohérentes.

## 📱 Responsive Design

### Desktop (≥1024px)
- Sidebar 30% + Canvas 45% + Preview 25%
- Layout complet avec toutes les fonctionnalités

### Tablet (768px-1023px)
- Sidebar 40% + Canvas 60%
- Preview cachée, accessible via modal

### Mobile (<768px)
- Bottom sheet pour les onglets
- Canvas en plein écran
- Preview via modal

## 🔧 Développement

### Installation
```bash
npm install
```

### Dépendances Principales
```bash
npm install qrcode @dnd-kit/core @dnd-kit/sortable react-color react-dropzone react-image-crop html2canvas jspdf file-saver vcf @types/qrcode
```

### Test
Accédez à `/test-editor` pour tester l'éditeur avec des données de test.

## 🚀 Déploiement

L'éditeur est prêt pour la production avec :
- Optimisations Next.js
- Code splitting automatique
- Images optimisées
- PWA ready (manifest.ts)

## 📈 Roadmap

### Fonctionnalités Futures
- [ ] Templates prédéfinis
- [ ] Collaboration en temps réel
- [ ] Analytics avancées
- [ ] Intégration CRM
- [ ] API publique
- [ ] Thèmes personnalisés par utilisateur

---

**Développé avec ❤️ par l'équipe Xarala Solutions**
