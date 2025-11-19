# 🎯 PLAN DE FINALISATION - FOIRE DAKAR 2025

**Date de création** : Février 2025  
**Timeline optimisée** : **2 Semaines** (au lieu de 3)  
**Statut actuel** : 85% complet  
**Objectif** : MVP Production prêt

---

## 📊 ÉTAT ACTUEL - CE QUI EXISTE DÉJÀ

### ✅ Déjà Implémenté

1. **QR Codes** : 
   - Package `qrcode` installé ✅
   - Génération QR dans `app/api/cards/route.ts` ✅
   - Composant QR Generator existant ✅

2. **PDF** :
   - Package `jspdf` installé ✅
   - Package `@react-pdf/renderer` installé ✅

3. **Email** :
   - Package `resend` installé ✅
   - Configuration dans `env.example` ✅

4. **Webhooks** :
   - Infrastructure dans `lib/utils/webhook.ts` ✅
   - Vérification signature implémentée ✅

5. **Formulaire Inscription** :
   - 6 étapes complètes ✅
   - Validation ✅
   - Upload logo/banner ✅
   - Gestion staff ✅

6. **Base de données** :
   - Tables complètes ✅
   - Relations configurées ✅
   - RLS (temporairement désactivé pour tests) ✅

### ⚠️ À Implémenter

1. **Paiements** : Intégration réelle Wave/Orange Money (UI existe mais pas d'API)
2. **Factures PDF** : Génération et stockage
3. **Emails** : Templates transactionnels
4. **Billetterie QR** : Table tickets + validation
5. **Dashboard Admin** : Statistiques et gestion

---

## 🚀 TIMELINE OPTIMISÉE - 2 SEMAINES

### **SEMAINE 1 : Paiements & Factures (5 jours)**

#### **Jour 1-2 : Intégration Paiements Wave/Orange Money**

**Ce qui existe** :
- UI de sélection paiement dans `Step6Payment` ✅
- Configuration dans `env.example` ✅
- Types définis ✅

**À créer** :
```typescript
// lib/services/payments/wave.ts
// lib/services/payments/orange-money.ts
// app/api/webhooks/wave/route.ts
// app/api/webhooks/orange-money/route.ts
```

**Actions** :
1. Créer services paiements (Wave + Orange Money)
2. Créer endpoints webhooks
3. Intégrer dans `handleSubmit` de l'inscription
4. Tester avec comptes sandbox

**Estimation** : 2 jours (avec tests)

---

#### **Jour 3 : Génération Factures PDF**

**Ce qui existe** :
- `jspdf` installé ✅
- Structure données exhibitor complète ✅

**À créer** :
```typescript
// lib/services/pdf/invoice-generator.ts
// app/api/foires/[eventSlug]/invoices/[exhibitorId]/route.ts
```

**Actions** :
1. Créer générateur PDF facture
2. Créer bucket Supabase Storage `foire-dakar-documents`
3. Upload facture après création exhibitor
4. Lien téléchargement dans email

**Estimation** : 1 jour

---

#### **Jour 4-5 : Emails Transactionnels**

**Ce qui existe** :
- `resend` installé ✅
- Configuration email ✅

**À créer** :
```typescript
// lib/services/email/templates.ts
// lib/services/email/resend-client.ts
```

**Templates à créer** :
1. Confirmation inscription exposant (avec facture)
2. Rappel paiement
3. Confirmation paiement
4. Envoi billets (avec QR codes)

**Actions** :
1. Créer client Resend
2. Créer templates HTML
3. Intégrer dans workflow inscription
4. Tester envoi emails

**Estimation** : 2 jours

---

### **SEMAINE 2 : Billetterie & Admin (5 jours)**

#### **Jour 1-2 : Système Billetterie avec QR Codes**

**Ce qui existe** :
- `qrcode` installé ✅
- Génération QR déjà implémentée ✅

**À créer** :
```sql
-- Migration: create_tickets_table.sql
-- lib/services/tickets/qr-generator.ts
-- app/api/tickets/validate/route.ts
-- app/[locale]/org/[slug]/foires/[eventSlug]/tickets/page.tsx (améliorer)
```

**Actions** :
1. Créer table `tickets` dans Supabase
2. Améliorer page billetterie (génération QR)
3. Créer endpoint validation QR
4. Créer interface scan QR (admin)

**Estimation** : 2 jours

---

#### **Jour 3-4 : Dashboard Admin**

**Ce qui existe** :
- Page admin badges ✅
- Services exhibitor ✅

**À créer** :
```typescript
// app/[locale]/org/[slug]/foires/[eventSlug]/admin/dashboard/page.tsx
// lib/services/admin/stats.service.ts
```

**Fonctionnalités** :
1. KPIs (exposants, revenus, billets)
2. Graphiques (inscriptions par jour, pavillons)
3. Table exposants avec actions
4. Workflow approbation

**Estimation** : 2 jours

---

#### **Jour 5 : Tests Finaux & Optimisations**

**Actions** :
1. Tests end-to-end complets
2. Optimisations performance
3. Corrections bugs
4. Documentation rapide

**Estimation** : 1 jour

---

## 📋 CHECKLIST DÉTAILLÉE PAR PRIORITÉ

### 🔴 PRIORITÉ CRITIQUE (Blocant Production)

#### Paiements
- [ ] **Wave API** : Service + Webhook
- [ ] **Orange Money API** : Service + Webhook
- [ ] Intégration dans formulaire inscription
- [ ] Tests paiements sandbox

#### Factures
- [ ] Génération PDF facture
- [ ] Upload Supabase Storage
- [ ] Lien téléchargement

#### Emails
- [ ] Template confirmation inscription
- [ ] Template rappel paiement
- [ ] Envoi automatique après inscription

**Temps estimé** : 5 jours

---

### 🟡 PRIORITÉ HAUTE (Important MVP)

#### Billetterie
- [ ] Table `tickets` dans Supabase
- [ ] Génération QR codes billets
- [ ] Envoi billets par email
- [ ] Validation QR à l'entrée

#### Admin
- [ ] Dashboard statistiques
- [ ] Workflow approbation exposants
- [ ] Export données

**Temps estimé** : 4 jours

---

### 🟢 PRIORITÉ MOYENNE (Nice to have)

#### Optimisations
- [ ] Cache optimisé
- [ ] Images optimisées
- [ ] SEO amélioré
- [ ] Analytics configuré

**Temps estimé** : 1 jour

---

## 💻 IMPLÉMENTATION RAPIDE - CODE À CRÉER

### 1. Services Paiements (Jour 1-2)

**Fichiers à créer** :
- `lib/services/payments/wave.ts` (100 lignes)
- `lib/services/payments/orange-money.ts` (120 lignes)
- `app/api/webhooks/wave/route.ts` (80 lignes)
- `app/api/webhooks/orange-money/route.ts` (80 lignes)

**Complexité** : Moyenne (documentation API nécessaire)

---

### 2. Génération Factures PDF (Jour 3)

**Fichiers à créer** :
- `lib/services/pdf/invoice-generator.ts` (200 lignes)
- `app/api/foires/[eventSlug]/invoices/[exhibitorId]/route.ts` (50 lignes)

**Complexité** : Faible (jspdf déjà installé)

---

### 3. Emails Transactionnels (Jour 4-5)

**Fichiers à créer** :
- `lib/services/email/resend-client.ts` (50 lignes)
- `lib/services/email/templates.ts` (300 lignes)

**Complexité** : Faible (Resend déjà installé)

---

### 4. Billetterie QR (Jour 1-2 Semaine 2)

**Fichiers à créer** :
- Migration SQL `tickets` table (50 lignes)
- `lib/services/tickets/qr-generator.ts` (100 lignes)
- `app/api/tickets/validate/route.ts` (60 lignes)

**Complexité** : Faible (QR codes déjà implémentés)

---

### 5. Dashboard Admin (Jour 3-4 Semaine 2)

**Fichiers à créer** :
- `lib/services/admin/stats.service.ts` (150 lignes)
- `app/[locale]/org/[slug]/foires/[eventSlug]/admin/dashboard/page.tsx` (300 lignes)

**Complexité** : Moyenne (requêtes Supabase complexes)

---

## 🎯 STRATÉGIE OPTIMISÉE

### Approche MVP Minimal

**Semaine 1** : Focus sur ce qui bloque la production
1. ✅ Paiements fonctionnels (Wave + Orange Money)
2. ✅ Factures PDF générées
3. ✅ Emails envoyés

**Semaine 2** : Améliorations MVP
1. ✅ Billetterie QR complète
2. ✅ Dashboard admin basique
3. ✅ Tests finaux

### Ce qui peut attendre Post-MVP

- ⏸️ Export Excel avancé
- ⏸️ Analytics détaillées
- ⏸️ Notifications push
- ⏸️ App mobile

---

## 📦 PACKAGES À INSTALLER

```bash
# Déjà installés ✅
# - qrcode ✅
# - jspdf ✅
# - resend ✅

# À installer (si nécessaire)
npm install exceljs  # Pour exports Excel (optionnel)
npm install @react-pdf/renderer  # Alternative PDF (déjà installé)
```

---

## 🔧 CONFIGURATION REQUISE

### Variables d'environnement à ajouter

```env
# Paiements
WAVE_API_KEY=your_wave_api_key
WAVE_SECRET=your_wave_secret
WAVE_WEBHOOK_SECRET=your_webhook_secret

ORANGE_MONEY_CLIENT_ID=your_client_id
ORANGE_MONEY_CLIENT_SECRET=your_client_secret
ORANGE_MONEY_MERCHANT_ID=your_merchant_id
ORANGE_MONEY_WEBHOOK_SECRET=your_webhook_secret

# Email
RESEND_API_KEY=re_your_resend_api_key

# Supabase Storage
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=foire-dakar-documents
```

---

## 🧪 TESTS À EFFECTUER

### Tests Fonctionnels

1. **Inscription Exposant** :
   - [ ] Remplir formulaire 6 étapes
   - [ ] Payer avec Wave (sandbox)
   - [ ] Recevoir email confirmation
   - [ ] Télécharger facture PDF
   - [ ] Accéder dashboard exposant

2. **Billetterie** :
   - [ ] Acheter billet
   - [ ] Recevoir email avec QR code
   - [ ] Scanner QR code (validation)
   - [ ] Marquer billet comme utilisé

3. **Admin** :
   - [ ] Voir statistiques
   - [ ] Approuver exposant
   - [ ] Exporter données

### Tests Techniques

- [ ] Performance (Lighthouse > 90)
- [ ] Mobile responsive
- [ ] Différents navigateurs
- [ ] Sécurité (RLS activé)

---

## 🚀 DÉPLOIEMENT PRODUCTION

### Checklist Pré-Déploiement

**Infrastructure** :
- [ ] Projet Vercel créé
- [ ] Domaine `foire-dakar-2025.com` configuré
- [ ] SSL activé
- [ ] Variables d'environnement production

**Base de données** :
- [ ] RLS activé sur toutes les tables
- [ ] Politiques RLS testées
- [ ] Backups configurés

**Paiements** :
- [ ] Comptes Wave/Orange Money production
- [ ] Webhooks production configurés
- [ ] Tests paiements réels (petits montants)

**Emails** :
- [ ] Domaine email configuré (Resend)
- [ ] SPF/DKIM records
- [ ] Tests envoi production

---

## 📊 MÉTRIQUES DE SUCCÈS

### Technique
- ✅ 100% inscriptions aboutissent
- ✅ 100% paiements fonctionnent
- ✅ 100% emails envoyés
- ✅ Temps chargement < 2s
- ✅ Score Lighthouse > 90

### Business
- 🎯 200 exposants inscrits
- 🎯 10 000 billets vendus
- 🎯 Taux conversion > 30%
- 🎯 0 bug critique
- 🎯 Satisfaction > 4/5

---

## 💰 COÛTS ESTIMÉS

### Développement
- **Si vous développez** : 0 FCFA (2 semaines)
- **Si prestataire** : 1 500 000 - 2 000 000 FCFA

### Infrastructure (mensuel)
- Vercel Pro : ~10 000 FCFA/mois
- Supabase Pro : ~13 000 FCFA/mois
- Domaine : ~8 000 FCFA/an
- Resend : Gratuit (< 3000 emails/mois)
- **Total** : ~25 000 FCFA/mois

### Transaction Fees
- Wave : 1-2% par transaction
- Orange Money : 1-2% par transaction

---

## 🎯 PROCHAINES ACTIONS IMMÉDIATES

### Cette Semaine

**Jour 1** :
1. Créer compte Wave Developer (sandbox)
2. Créer compte Orange Money Developer (sandbox)
3. Obtenir clés API test
4. Implémenter service Wave

**Jour 2** :
1. Implémenter service Orange Money
2. Créer webhooks
3. Tester paiements sandbox

**Jour 3** :
1. Créer générateur PDF facture
2. Créer bucket Supabase Storage
3. Tester génération + upload

**Jour 4-5** :
1. Créer templates emails
2. Intégrer dans workflow
3. Tester envoi emails

---

## 📝 NOTES IMPORTANTES

### Limitations Actuelles

1. **Paiements** : Nécessite comptes réels Wave/Orange Money (sandbox pour tests)
2. **Emails** : Resend gratuit limité à 3000 emails/mois
3. **Storage** : Supabase Storage limité selon plan

### Solutions Alternatives

Si Wave/Orange Money trop complexe :
- ✅ **Option 1** : Paiement manuel (virement bancaire) + confirmation email
- ✅ **Option 2** : Intégrer Stripe (plus simple mais moins utilisé au Sénégal)
- ✅ **Option 3** : Paiement sur place (cash) pour MVP

---

## ✅ VALIDATION FINALE

### Avant Production

- [ ] Tous les tests passent
- [ ] Paiements fonctionnent (sandbox + production)
- [ ] Emails envoyés correctement
- [ ] Factures générées
- [ ] Dashboard admin fonctionnel
- [ ] Performance optimale
- [ ] Sécurité vérifiée

---

**Document créé le** : Février 2025  
**Dernière mise à jour** : Février 2025  
**Version** : 1.0 - Optimisée

