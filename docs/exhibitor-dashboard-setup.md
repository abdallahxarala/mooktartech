# Dashboard Boutique Exposant - Guide d'installation

## 📋 Vue d'ensemble

Le dashboard boutique exposant permet aux exposants de gérer leurs produits et commandes pour les foires. Il inclut :

- ✅ Gestion de produits avec upload multi-images
- ✅ Génération automatique de descriptions avec OpenAI GPT-4 Vision
- ✅ Statistiques en temps réel
- ✅ Gestion des commandes
- ✅ Interface mobile-first

## 🚀 Installation

### 1. Installer OpenAI SDK

```bash
npm install openai
```

### 2. Configurer les variables d'environnement

Ajoutez dans `.env.local` :

```env
# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. Vérifier Cloudinary

Assurez-vous que Cloudinary est configuré dans `.env.local` :

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📁 Structure des fichiers

```
lib/
├── types/
│   └── exhibitor-product.ts          # Types produits exposants
├── store/
│   └── foire-store.ts                # Store Zustand pour foires
├── services/
│   └── exhibitor-product.service.ts  # Service produits
└── hooks/
    ├── use-products.ts               # Hook gestion produits
    └── use-product-ai.ts             # Hook OpenAI

components/
└── exhibitor-dashboard/
    ├── product-form.tsx              # Formulaire produit avec IA
    ├── product-list.tsx              # Liste produits
    ├── stats-cards.tsx               # Cartes statistiques
    └── orders-list.tsx               # Liste commandes

app/
└── org/[slug]/foires/mon-stand/
    ├── page.tsx                      # Page serveur
    └── dashboard-client.tsx          # Composant client

app/api/
└── ai/
    └── generate-product-description/
        └── route.ts                  # API OpenAI
```

## 🎯 Fonctionnalités

### 1. Stats KPI

- **Produits en ligne** : Nombre de produits visibles
- **Vues totales** : Statistiques de vues (à implémenter avec `exhibitor_interactions`)
- **Commandes reçues** : Nombre de commandes
- **Chiffre d'affaires** : Total des ventes

### 2. Gestion Produits

- ✅ Créer/éditer/supprimer des produits
- ✅ Upload multi-images (Cloudinary)
- ✅ Génération description avec IA (GPT-4 Vision)
- ✅ Toggle visibilité
- ✅ Gestion stock
- ✅ Prix sur demande
- ✅ Produits en vedette

### 3. Commandes

- ✅ Liste chronologique
- ✅ Badges statut colorés
- ✅ Actions : Accepter, Préparer, Marquer prête
- ⏭️ À implémenter : Table `exhibitor_orders`

## 🔧 Utilisation

### Accéder au dashboard

```
/org/[slug]/foires/mon-stand
```

### Créer un produit

1. Cliquer sur "Ajouter un produit"
2. Remplir les informations
3. Uploader des images
4. (Optionnel) Cliquer sur "Générer avec IA" pour la description
5. Enregistrer

### Gérer les commandes

1. Aller dans l'onglet "Commandes"
2. Voir les commandes en attente
3. Accepter → Préparer → Marquer prête

## 📊 Intégrations

### OpenAI GPT-4 Vision

Le hook `useProductAI` utilise GPT-4 Vision pour générer des descriptions à partir :
- Du nom du produit
- Des images uploadées
- De la catégorie

**API Route** : `/api/ai/generate-product-description`

### Cloudinary

Upload d'images via le composant `ImageUpload` existant :
- Bucket : `assets`
- Feature : `product`
- Format : Carré recommandé
- Taille max : 800x800px

### Supabase Realtime

À implémenter pour les notifications de nouvelles commandes :

```typescript
// Exemple
supabase
  .channel('exhibitor-orders')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'exhibitor_orders',
    filter: `exhibitor_id=eq.${exhibitorId}`
  }, (payload) => {
    // Nouvelle commande reçue
  })
  .subscribe()
```

## 🐛 Dépannage

### OpenAI ne fonctionne pas

1. Vérifier que `OPENAI_API_KEY` est configurée
2. Vérifier que vous avez des crédits OpenAI
3. Vérifier les logs dans la console

### Images ne s'uploadent pas

1. Vérifier la configuration Cloudinary
2. Vérifier les permissions du bucket Supabase Storage
3. Vérifier la taille des images (< 10MB)

### Produits ne s'affichent pas

1. Vérifier que l'exposant existe dans la table `exhibitors`
2. Vérifier que `exhibitor_id` correspond
3. Vérifier les RLS policies Supabase

## 📝 Notes

- Les commandes nécessitent une table `exhibitor_orders` à créer
- Les stats de vues nécessitent `exhibitor_interactions`
- Le modèle OpenAI utilisé est `gpt-4-vision-preview` (peut nécessiter mise à jour)

