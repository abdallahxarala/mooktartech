# Checklist de préparation - Module Foire

## ✅ Configuration Initiale

### 1. Créer comptes APIs

#### OpenAI
- [ ] Créer un compte sur [platform.openai.com](https://platform.openai.com)
- [ ] Générer une API key
- [ ] Vérifier les crédits disponibles
- [ ] Noter l'API key pour `.env.local`

#### Wave Payment
- [ ] Créer un compte Wave Business
- [ ] Obtenir les credentials API :
  - [ ] `WAVE_API_KEY`
  - [ ] `WAVE_SECRET_KEY`
  - [ ] `WAVE_BUSINESS_ID`
- [ ] Configurer les webhooks dans le dashboard Wave
- [ ] Noter les credentials pour `.env.local`

#### Cloudinary
- [ ] Créer un compte sur [cloudinary.com](https://cloudinary.com)
- [ ] Obtenir les credentials :
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
- [ ] Configurer les transformations par défaut
- [ ] Noter les credentials pour `.env.local`

#### Twilio SMS
- [ ] Créer un compte sur [twilio.com](https://twilio.com)
- [ ] Obtenir les credentials :
  - [ ] `TWILIO_ACCOUNT_SID`
  - [ ] `TWILIO_AUTH_TOKEN`
  - [ ] `TWILIO_PHONE_NUMBER`
- [ ] Vérifier le numéro de téléphone actif
- [ ] Noter les credentials pour `.env.local`

---

## 🔧 Variables d'Environnement

### Créer/Modifier `.env.local`

```bash
# ===========================================
# OPENAI
# ===========================================
OPENAI_API_KEY=sk-proj-xxxxx

# ===========================================
# WAVE PAYMENT
# ===========================================
WAVE_API_KEY=wave_sn_xxxxx
WAVE_SECRET_KEY=xxxxx
WAVE_BUSINESS_ID=xxxxx
WAVE_API_URL=https://api.wave.com/v1

# ===========================================
# CLOUDINARY
# ===========================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# ===========================================
# TWILIO SMS
# ===========================================
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+221xxxxx

# ===========================================
# APP URL (pour callbacks)
# ===========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📦 Installation Packages

### Packages requis

```bash
# OpenAI SDK (pour génération descriptions avec IA)
npm install openai

# QR Code generation (déjà installé: qrcode)
# npm install qrcode
# npm install @types/qrcode --save-dev

# Recharts (pour graphiques - déjà installé: recharts)
# npm install recharts

# React Intersection Observer (pour infinite scroll - déjà installé)
# npm install react-intersection-observer

# jsPDF (pour PDF tickets - déjà installé: jspdf)
# npm install jspdf
# npm install @types/jspdf --save-dev
```

**Note**: La plupart des packages sont déjà installés. Vérifier avec `npm list` et installer uniquement ceux manquants.

### Packages optionnels

```bash
# Google Cloud Translate (si traduction Wolof)
npm install @google-cloud/translate

# Autres utilitaires
npm install date-fns
npm install zod
```

---

## 🗄️ Migrations Supabase

### 1. Vérifier les migrations existantes

- [ ] Migration `20241112120000_exhibitors_module.sql` appliquée
- [ ] Migration `20251109140000_events_module.sql` appliquée
- [ ] Tables créées :
  - [ ] `events`
  - [ ] `exhibitors`
  - [ ] `exhibitor_products`
  - [ ] `event_attendees`
  - [ ] `exhibitor_interactions`

### 2. Vérifier RLS Policies

```sql
-- Vérifier que les policies sont actives
SELECT * FROM pg_policies WHERE tablename IN (
  'exhibitors',
  'exhibitor_products',
  'event_attendees'
);
```

- [ ] RLS activé sur toutes les tables
- [ ] Policies pour lecture publique (visiteurs)
- [ ] Policies pour écriture exposants
- [ ] Policies pour admin (organisation)

### 3. Vérifier les triggers

- [ ] Trigger `update_updated_at` sur toutes les tables
- [ ] Trigger pour génération QR codes (si applicable)
- [ ] Triggers pour notifications (si applicable)

### 4. Activer Supabase Realtime

- [ ] Aller dans Supabase Dashboard > Database > Replication
- [ ] Activer Realtime pour :
  - [ ] `exhibitors`
  - [ ] `event_attendees`
  - [ ] `exhibitor_products`
  - [ ] `exhibitor_interactions`

---

## 🧪 Tests de Configuration

### Test OpenAI

```bash
# Créer un script de test
node scripts/test-openai.js
```

```javascript
// scripts/test-openai.js
const { generateProductDescription } = require('./lib/integrations/openai');

(async () => {
  try {
    const description = await generateProductDescription({
      imageUrl: 'https://example.com/product.jpg',
      productName: 'Test Product'
    });
    console.log('✅ OpenAI OK:', description);
  } catch (error) {
    console.error('❌ OpenAI Error:', error.message);
  }
})();
```

- [ ] Test OpenAI réussi
- [ ] Génération description fonctionne
- [ ] Suggestion catégorie fonctionne

### Test Wave Payment

```bash
# Créer un script de test
node scripts/test-wave.js
```

```javascript
// scripts/test-wave.js
const { initiateWavePayment } = require('./lib/integrations/wave');

(async () => {
  try {
    const result = await initiateWavePayment({
      amount: 1000,
      currency: 'XOF',
      successUrl: 'http://localhost:3000/success',
      errorUrl: 'http://localhost:3000/error',
      description: 'Test payment'
    });
    console.log('✅ Wave OK:', result.checkoutUrl);
  } catch (error) {
    console.error('❌ Wave Error:', error.message);
  }
})();
```

- [ ] Test Wave réussi
- [ ] Initiation paiement fonctionne
- [ ] Webhook configuré dans Wave dashboard

### Test Cloudinary

```bash
# Tester upload image
node scripts/test-cloudinary.js
```

- [ ] Upload image fonctionne
- [ ] Transformations appliquées
- [ ] URLs générées correctement

### Test Twilio SMS

```bash
# Tester envoi SMS
node scripts/test-twilio.js
```

- [ ] Envoi SMS fonctionne
- [ ] Numéro de téléphone valide
- [ ] Format message correct

---

## 🔐 Sécurité

### Vérifications

- [ ] Toutes les API keys dans `.env.local` (pas dans le repo)
- [ ] `.env.local` dans `.gitignore`
- [ ] Variables d'environnement configurées en production
- [ ] Webhooks Wave avec signature vérifiée
- [ ] RLS Supabase activé et testé

---

## 📱 Routes à tester

### Exposants

- [ ] `/org/[slug]/foires/inscription` - Inscription exposant
- [ ] `/org/[slug]/foires/mon-stand` - Dashboard exposant
- [ ] `/org/[slug]/foires/admin` - Admin foire

### Visiteurs

- [ ] `/org/[slug]/foires/tickets` - Achat ticket
- [ ] `/org/[slug]/foires/tickets/success` - Confirmation ticket
- [ ] `/org/[slug]/foires/catalogue` - Catalogue produits

### Admin

- [ ] `/org/[slug]/foires/admin` - Dashboard admin
- [ ] Vérifier stats temps réel
- [ ] Vérifier gestion exposants
- [ ] Vérifier gestion visiteurs
- [ ] Vérifier gestion commandes

---

## 🚀 Déploiement

### Pré-production

- [ ] Toutes les variables d'environnement configurées
- [ ] Migrations Supabase appliquées
- [ ] Realtime activé
- [ ] Webhooks Wave configurés avec URL production
- [ ] Tests end-to-end réussis

### Production

- [ ] Variables d'environnement dans Vercel/plateforme
- [ ] Webhooks Wave pointent vers URL production
- [ ] Monitoring activé
- [ ] Logs configurés

---

## 📝 Notes importantes

### OpenAI
- Modèle utilisé : `gpt-4o` (supporte les images)
- Coût approximatif : ~$0.01-0.05 par description
- Rate limits : Vérifier dans le dashboard OpenAI

### Wave Payment
- Mode test disponible
- Webhook URL : `https://votre-domaine.com/api/webhooks/wave/tickets`
- Vérifier la documentation Wave pour les endpoints exacts

### Cloudinary
- Plan gratuit : 25GB storage, 25GB bandwidth
- Optimiser les images avant upload
- Utiliser les transformations Cloudinary

### Twilio SMS
- Coût par SMS : ~$0.01-0.05 selon pays
- Format numéro : +221 XX XXX XX XX (Sénégal)
- Vérifier les restrictions par pays

---

## ✅ Checklist finale

- [ ] Tous les comptes APIs créés
- [ ] Toutes les variables d'environnement configurées
- [ ] Tous les packages installés
- [ ] Migrations Supabase appliquées
- [ ] Realtime activé
- [ ] Tests de configuration réussis
- [ ] Routes testées
- [ ] Sécurité vérifiée
- [ ] Prêt pour déploiement

---

## 🆘 Dépannage

### OpenAI ne fonctionne pas
- Vérifier `OPENAI_API_KEY` dans `.env.local`
- Vérifier les crédits OpenAI
- Vérifier le modèle `gpt-4o` disponible

### Wave Payment ne fonctionne pas
- Vérifier les credentials Wave
- Vérifier `WAVE_BUSINESS_ID`
- Vérifier les endpoints API Wave
- Vérifier les webhooks configurés

### Cloudinary ne fonctionne pas
- Vérifier les credentials Cloudinary
- Vérifier les permissions bucket
- Vérifier les transformations configurées

### Twilio SMS ne fonctionne pas
- Vérifier les credentials Twilio
- Vérifier le numéro de téléphone actif
- Vérifier le format du numéro (+221...)

---

**Date de création** : 2025-01-XX
**Dernière mise à jour** : 2025-01-XX

