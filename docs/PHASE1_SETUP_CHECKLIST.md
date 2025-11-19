# ✅ Checklist de Configuration - Phase 1

**Date** : Février 2025  
**Objectif** : Vérifier que tout est configuré pour la génération de factures et l'envoi d'emails

---

## 🔧 Configuration Supabase Storage

### 1. Créer le Bucket

**Action** : Exécuter le script SQL dans Supabase Dashboard

**Fichier** : `supabase/scripts/create_foire_dakar_storage_bucket.sql`

**Vérification** :
```sql
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'foire-dakar-documents';
```

**Résultat attendu** :
- ✅ Bucket créé
- ✅ Public : `true`
- ✅ File size limit : 5MB
- ✅ Allowed MIME types : `application/pdf`

---

## 🔑 Variables d'Environnement

### Vérifier `.env.local`

```env
# Resend (emails)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://gocsjmtsfoadcozhhsxn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Site URL (pour liens dans emails)
NEXT_PUBLIC_SITE_URL=https://foire-dakar-2025.com
# ou pour développement local :
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Vérifications** :
- [ ] `RESEND_API_KEY` est définie et valide
- [ ] `NEXT_PUBLIC_SUPABASE_URL` pointe vers le bon projet
- [ ] `SUPABASE_SERVICE_ROLE_KEY` est définie (pour uploads Storage)
- [ ] `NEXT_PUBLIC_SITE_URL` est définie (pour liens dans emails)

---

## 📦 Packages NPM

### Vérifier Installation

```bash
npm list jspdf jspdf-autotable resend qrcode
```

**Résultat attendu** :
- ✅ `jspdf@^3.0.3`
- ✅ `jspdf-autotable@^5.0.2`
- ✅ `resend@^3.2.0`
- ✅ `qrcode@^1.5.4`

**Si manquants** :
```bash
npm install jspdf jspdf-autotable resend qrcode
```

---

## 🗄️ Structure Base de Données

### Vérifier Table `exhibitors`

```sql
-- Vérifier colonnes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'exhibitors'
AND column_name IN ('invoice_url', 'metadata', 'payment_status', 'payment_amount');

-- Vérifier que metadata peut stocker JSON
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'exhibitors'
AND column_name = 'metadata';
-- Résultat attendu : data_type = 'jsonb'
```

**Vérifications** :
- [ ] Colonne `invoice_url` existe (TEXT, nullable)
- [ ] Colonne `metadata` existe (JSONB)
- [ ] Colonne `payment_status` existe
- [ ] Colonne `payment_amount` existe

---

## 🧪 Tests de Fonctionnement

### Test 1 : Génération Facture Isolée

**Via API** :
```bash
POST http://localhost:3000/api/foires/foire-dakar-2025/invoices/[exhibitorId]
```

**Réponse attendue** :
```json
{
  "success": true,
  "invoiceUrl": "https://...",
  "invoiceNumber": "FD2025-0001"
}
```

**Vérifications** :
- [ ] Facture générée sans erreur
- [ ] PDF uploadé dans Storage
- [ ] `invoice_url` mis à jour dans DB
- [ ] URL accessible publiquement

---

### Test 2 : Téléchargement Facture

**Via API** :
```bash
GET http://localhost:3000/api/foires/foire-dakar-2025/invoices/[exhibitorId]
```

**Réponse attendue** :
- Content-Type: `application/pdf`
- PDF téléchargeable
- Nom fichier : `facture-FD2025-0001.pdf`

**Vérifications** :
- [ ] PDF téléchargeable
- [ ] Contenu correct (en-tête, client, articles, totaux)
- [ ] Format français (FCFA, date FR)

---

### Test 3 : Envoi Email

**Via Code** :
```typescript
import { sendExhibitorConfirmationEmail } from '@/lib/services/email/templates'

await sendExhibitorConfirmationEmail({
  to: 'test@example.com',
  exhibitorName: 'Test User',
  companyName: 'Test Company',
  standNumber: 'A-12',
  pavilionName: 'Pavillon Principal',
  surfaceArea: 20,
  totalPrice: 500000,
  invoiceUrl: 'https://...',
})
```

**Vérifications** :
- [ ] Email reçu dans la boîte de réception
- [ ] Template HTML correct (responsive)
- [ ] Lien facture fonctionnel
- [ ] Design conforme (couleurs Foire Dakar)

---

### Test 4 : Workflow Complet

**Scénario** :
1. Remplir formulaire inscription
2. Soumettre avec paiement cash
3. Vérifier facture générée
4. Vérifier email reçu
5. Télécharger facture via lien

**Vérifications** :
- [ ] Exposant créé dans DB
- [ ] Facture générée automatiquement
- [ ] Email envoyé avec lien facture
- [ ] Facture téléchargeable
- [ ] Staff members créés

---

## 🔍 Vérifications Finales

### Code

- [ ] `lib/services/pdf/invoice-generator.ts` existe et exporte `generateExhibitorInvoice`
- [ ] `lib/services/email/resend-client.ts` existe et initialise Resend
- [ ] `lib/services/email/templates.ts` existe avec 3 templates
- [ ] `app/api/foires/[eventSlug]/invoices/[exhibitorId]/route.ts` existe avec GET et POST
- [ ] Intégration dans `inscription/page.tsx` (2 endroits)

### Configuration

- [ ] Bucket Supabase Storage créé
- [ ] RLS policies configurées
- [ ] Variables d'environnement définies
- [ ] Packages NPM installés

### Tests

- [ ] Génération facture isolée fonctionne
- [ ] Upload Storage fonctionne
- [ ] Envoi email fonctionne
- [ ] Workflow complet fonctionne

---

## 🚨 Problèmes Courants

### Erreur : "Bucket not found"

**Solution** : Exécuter le script SQL de création du bucket

---

### Erreur : "Failed to upload invoice"

**Solution** :
1. Vérifier `SUPABASE_SERVICE_ROLE_KEY`
2. Vérifier RLS policies sur Storage
3. Vérifier que le bucket est public

---

### Erreur : "RESEND_API_KEY is not defined"

**Solution** :
1. Ajouter `RESEND_API_KEY` dans `.env.local`
2. Redémarrer le serveur Next.js
3. Vérifier que la clé est valide dans Resend Dashboard

---

### Email non reçu

**Solution** :
1. Vérifier spam/courrier indésirable
2. Vérifier domaine vérifié dans Resend
3. Vérifier logs Resend Dashboard
4. Vérifier que `to` est une adresse valide

---

## ✅ Statut Final

**Configuration** : ✅ **100% Complète**

**Tests** : ⏳ À effectuer après configuration

**Production** : ✅ **Prêt** (après tests)

---

**Prochaine étape** : Exécuter les tests de fonctionnement pour valider le système complet.

