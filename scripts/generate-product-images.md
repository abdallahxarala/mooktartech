# GUIDE DE GÉNÉRATION D'IMAGES PRODUITS

## IMAGES PRINCIPALES (Photos produits)

### Sources
1. Extraire les images des PDFs
2. Utiliser les images des sites fabricants
3. Créer des visuels personnalisés

### Spécifications par plateforme

#### Site Web
- **Format:** JPG ou WebP
- **Résolution:** 800x800px (principale), 1200x1200px (zoom)
- **Poids:** <200KB après optimisation
- **Fond:** Blanc ou transparent

#### Instagram
- **Feed:** 1080x1080px (carré)
- **Stories:** 1080x1920px (vertical)
- **Reels:** 1080x1920px (vertical 9:16)

#### Facebook
- **Post:** 1200x630px
- **Stories:** 1080x1920px

#### LinkedIn
- **Post:** 1200x627px

#### Twitter/X
- **Post:** 1200x675px

### Éléments à inclure
✅ Photo produit HD
✅ Logo Xarala Solutions
✅ Prix visible
✅ Badge "En stock"
✅ Badge "Nouveau" si applicable
✅ Coordonnées (phone/WhatsApp)

## OUTILS RECOMMANDÉS

### Canva (Gratuit/Pro)
- Templates professionnels
- Redimensionnement automatique
- Export multi-formats

### Photopea (Gratuit)
- Alternative à Photoshop
- Édition en ligne
- Support PSD

### Remove.bg (Gratuit)
- Suppression fond automatique
- API disponible

### TinyPNG (Gratuit)
- Optimisation images
- Réduction poids sans perte qualité

## TEMPLATES À CRÉER

### Template 1: Post Produit Simple
```
- Fond blanc
- Photo produit centrée
- Nom produit (haut)
- Prix (bas gauche)
- Logo Xarala (bas droite)
- Badge stock (haut droite)
```

### Template 2: Carousel Instagram
```
Slide 1: Photo produit + Nom
Slide 2: 3-4 caractéristiques clés
Slide 3: Applications
Slide 4: Prix + CTA
```

### Template 3: Story Dynamique
```
- Animation texte
- Stickers interactifs
- Poll / Questions
- Swipe up link
```

## PRODUITS À TRAITER

### Entrust Sigma DSE
- Images: 3 photos (front, side, features)
- Couleur principale: Orange Xarala
- Badge: "Nouveau"

### Datacard CD800
- Images: 3 photos (front, duplex, LCD)
- Couleur principale: Bleu professionnel
- Badge: "Professionnel"

### Entrust Sigma DS1
- Images: 3 photos (mobile, LED, compact)
- Couleur principale: Vert tech
- Badge: "Mobile"

### HiTi CS-200e
- Images: 2 photos (compact, silencieux)
- Couleur principale: Gris moderne
- Badge: "Compact"

### Entrust Sigma DS2
- Images: 3 photos (duplex, performance, security)
- Couleur principale: Violet premium
- Badge: "Performance"

### Entrust Sigma DS3
- Images: 3 photos (premium, ultra-rapide, security)
- Couleur principale: Or premium
- Badge: "Premium"

## WORKFLOW DE CRÉATION

1. **Extraire images PDFs** → Dossier `raw-images/`
2. **Nettoyer fonds** → Remove.bg
3. **Redimensionner** → Canva/Photopea
4. **Ajouter éléments** → Logo, prix, badges
5. **Optimiser** → TinyPNG
6. **Exporter formats** → Web, Instagram, Facebook, etc.
7. **Organiser** → Dossier `public/products/`

## EXEMPLES DE TEXTE

### Call-to-Action
- "Découvrez maintenant"
- "Demandez un devis"
- "Contactez-nous"
- "En savoir plus"

### Badges
- "Nouveau"
- "En stock"
- "Professionnel"
- "Mobile"
- "Premium"
- "Compact"

### Prix
- Format: "1 850 000 FCFA"
- Couleur: Orange Xarala
- Taille: Lisible sur mobile
