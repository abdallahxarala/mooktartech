# 📚 Guide Complet - Phase 1 : Factures PDF + Emails

**Date** : Février 2025  
**Statut** : ✅ **Implémenté**

---

## 🎯 Vue d'Ensemble

Le système de factures PDF et d'emails transactionnels est maintenant **100% opérationnel** pour la Foire Dakar 2025.

### Fonctionnalités Implémentées

- ✅ Génération automatique de factures PDF après paiement
- ✅ Upload automatique vers Supabase Storage
- ✅ Email de confirmation avec lien facture
- ✅ Service d'automatisation pour factures manquantes
- ✅ Endpoint API pour rappels de paiement
- ✅ Endpoint API pour générer factures manquantes

---

## 📁 Structure des Fichiers

### Services

```
lib/services/
├── pdf/
│   └── invoice-generator.ts          ✅ Générateur PDF
├── email/
│   ├── resend-client.ts              ✅ Client Resend
│   └── templates.ts                  ✅ Templates emails
├── payments/
│   └── wave.ts                       ✅ Intégration Wave (avec génération facture)
└── invoice-automation.service.ts    ✅ Service d'automatisation
```

### API Routes

```
app/api/foires/[eventSlug]/
├── invoices/
│   ├── [exhibitorId]/route.ts       ✅ Téléchargement facture
│   └── generate-missing/route.ts    ✅ Génération factures manquantes
└── reminders/route.ts                ✅ Rappels de paiement
```

---

## 🔄 Flux Automatique

### 1. Après Inscription Exposant

```
Inscription → Création exhibitor → Email confirmation (avec lien facture)
```

**Fichier** : `app/[locale]/org/[slug]/foires/[eventSlug]/inscription/page.tsx`

**Action** : Email envoyé avec lien vers l'endpoint API de facture

---

### 2. Après Paiement Wave Réussi

```
Paiement Wave → Webhook → handleWavePaymentSuccess()
  ├─ Mise à jour statut paiement
  ├─ Génération facture PDF
  ├─ Upload vers Supabase Storage
  ├─ Mise à jour metadata exhibitor
  └─ Email confirmation avec facture
```

**Fichier** : `lib/services/payments/wave.ts`

**Fonction** : `handleWavePaymentSuccess()`

---

### 3. Génération Factures Manquantes

```
POST /api/foires/[eventSlug]/invoices/generate-missing
  → Trouve exposants avec paiement confirmé mais sans facture
  → Génère factures PDF pour chacun
  → Upload vers Storage
  → Retourne statistiques
```

**Fichier** : `app/api/foires/[eventSlug]/invoices/generate-missing/route.ts`

---

## 📧 Emails Transactionnels

### 1. Confirmation d'Inscription

**Template** : `sendExhibitorConfirmationEmail()`

**Déclencheur** :
- Après inscription exposant
- Après paiement confirmé

**Contenu** :
- Détails de l'inscription
- Informations stand/pavillon
- Lien vers facture PDF
- Prochaines étapes

---

### 2. Rappel de Paiement

**Template** : `sendPaymentReminderEmail()`

**Déclencheur** :
- Manuellement via API
- Automatiquement (à implémenter avec cron)

**Contenu** :
- Montant dû
- Date limite
- Lien vers paiement
- Modes de paiement acceptés

---

### 3. Billets avec QR Codes

**Template** : `sendTicketsEmail()`

**Déclencheur** :
- Après achat de billets

**Contenu** :
- QR codes pour chaque billet
- Informations événement
- Instructions d'utilisation

---

## 🔌 Endpoints API

### 1. Télécharger une Facture

```
GET /api/foires/[eventSlug]/invoices/[exhibitorId]
```

**Réponse** : PDF téléchargeable

**Exemple** :
```bash
curl https://foire-dakar-2025.com/api/foires/foire-dakar-2025/invoices/abc123
```

---

### 2. Générer Factures Manquantes

```
POST /api/foires/[eventSlug]/invoices/generate-missing
```

**Réponse** :
```json
{
  "success": true,
  "generated": 5,
  "errors": 0,
  "message": "5 factures générées, 0 erreurs"
}
```

---

### 3. Rappels de Paiement

**Liste des exposants avec paiement en attente** :
```
GET /api/foires/[eventSlug]/reminders
```

**Envoyer un rappel** :
```
POST /api/foires/[eventSlug]/reminders
Body: { "exhibitorId": "abc123" }
```

**Envoyer en masse** :
```
POST /api/foires/[eventSlug]/reminders?bulk=true
```

---

## 🛠️ Utilisation

### Générer une Facture Manuellement

```typescript
import { generateInvoiceForExhibitor } from '@/lib/services/invoice-automation.service'

// Générer facture avec email
const { invoiceUrl, invoiceNumber } = await generateInvoiceForExhibitor(
  'exhibitor-id',
  { sendEmail: true }
)

// Régénérer facture (forcer)
const { invoiceUrl } = await generateInvoiceForExhibitor(
  'exhibitor-id',
  { forceRegenerate: true }
)
```

### Générer Toutes les Factures Manquantes

```typescript
import { generateMissingInvoices } from '@/lib/services/invoice-automation.service'

// Pour un événement spécifique
const { generated, errors } = await generateMissingInvoices('event-id')

// Pour tous les événements
const { generated, errors } = await generateMissingInvoices()
```

---

## ⚙️ Configuration

### Variables d'Environnement Requises

```env
# Resend (emails)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Site URL (pour les liens dans les emails)
NEXT_PUBLIC_SITE_URL=https://foire-dakar-2025.com
```

### Bucket Supabase Storage

**Nom** : `foire-dakar-documents`

**Structure** :
```
foire-dakar-documents/
└── invoices/
    └── [exhibitorId]/
        └── FD2025-0001.pdf
```

---

## 🧪 Tests

### Test Génération Facture

1. Créer un exposant avec paiement confirmé
2. Appeler `generateInvoiceForExhibitor()`
3. Vérifier que le PDF est généré
4. Vérifier que l'URL est dans metadata
5. Télécharger via endpoint API

### Test Email

1. Créer un exposant
2. Appeler `sendExhibitorConfirmationEmail()`
3. Vérifier réception email
4. Vérifier que le lien facture fonctionne

### Test Rappels

1. Créer exposants avec paiement en attente
2. Appeler `GET /api/foires/[eventSlug]/reminders`
3. Vérifier liste retournée
4. Envoyer rappel via `POST`
5. Vérifier réception email

---

## 📊 Métriques

### Factures Générées

- ✅ Automatique après paiement Wave
- ✅ Sur demande via API
- ✅ En masse pour factures manquantes

### Emails Envoyés

- ✅ Confirmation inscription
- ✅ Confirmation paiement
- ✅ Rappels paiement
- ✅ Billets avec QR codes

---

## 🚀 Prochaines Étapes (Phase 2)

- ⏳ Automatisation rappels (cron job)
- ⏳ Dashboard admin pour gestion factures
- ⏳ Statistiques factures/emails
- ⏳ Export CSV des factures
- ⏳ Intégration Orange Money

---

## 📝 Notes Importantes

1. **Génération Non-Bloquante** : La génération de facture et l'envoi d'email sont non-bloquants. Si une erreur survient, elle est loggée mais n'empêche pas le processus principal.

2. **URL Facture** : Les URLs de facture pointent vers l'endpoint API `/api/foires/[eventSlug]/invoices/[exhibitorId]` qui génère le PDF à la volée.

3. **Storage** : Les factures sont stockées dans Supabase Storage pour archivage, mais peuvent être régénérées à tout moment.

4. **Metadata** : Les informations de facture (URL, numéro, date) sont stockées dans `exhibitor.metadata` pour accès rapide.

---

**Statut** : ✅ **Phase 1 Complète** - Prêt pour production

