# 📋 Phase 1 : Factures PDF + Emails Transactionnels

**Objectif** : Implémenter la génération automatique de factures PDF et l'envoi d'emails transactionnels pour la Foire Dakar 2025.

**Durée estimée** : 3 jours

---

## ✅ État Actuel

### Packages Installés
- ✅ `jspdf` - Génération PDF
- ✅ `jspdf-autotable` - Tableaux dans PDF
- ✅ `resend` - Envoi d'emails
- ✅ `qrcode` - Génération QR codes

### Services Existants
- ✅ `lib/services/pdf/invoice-generator.ts` - Générateur de factures PDF
- ✅ `lib/services/email/resend-client.ts` - Client Resend
- ✅ `lib/services/email/templates.ts` - Templates d'emails
- ✅ `app/api/foires/[eventSlug]/invoices/[exhibitorId]/route.ts` - Endpoint factures

### Intégrations Existantes
- ✅ Email de confirmation après inscription (partiel)
- ✅ Email de confirmation après paiement Wave (partiel)
- ⚠️ Génération automatique de facture manquante
- ⚠️ URL facture incorrecte dans les emails

---

## 🔧 Corrections Nécessaires

### 1. Corriger les URLs de Facture

**Problème** : Les URLs de facture dans les emails sont incorrectes.

**Fichiers à corriger** :
- `lib/services/payments/wave.ts` (ligne 323)
- `app/[locale]/org/[slug]/foires/[eventSlug]/inscription/page.tsx` (ligne 257)

**Solution** : Utiliser l'endpoint API correct :
```typescript
const invoiceUrl = `${baseUrl}/api/foires/${eventSlug}/invoices/${exhibitorId}`
```

---

### 2. Génération Automatique de Facture après Paiement

**Fichier** : `lib/services/payments/wave.ts`

**Action** : Ajouter la génération automatique de facture dans `handleWavePaymentSuccess` :

```typescript
// Après la mise à jour du statut de paiement
// Générer et uploader la facture PDF
const { generateInvoicePDF, uploadInvoiceToStorage, buildInvoiceDataFromExhibitor } = 
  await import('@/lib/services/pdf/invoice-generator')

const invoiceData = buildInvoiceDataFromExhibitor(exhibitor, event)
const pdfBlob = await generateInvoicePDF(invoiceData)
const invoiceUrl = await uploadInvoiceToStorage(pdfBlob, exhibitor.id, invoiceData.invoice_number)

// Mettre à jour metadata avec l'URL de la facture
await supabase
  .from('exhibitors')
  .update({
    metadata: {
      ...exhibitor.metadata,
      invoice_url: invoiceUrl,
      invoice_number: invoiceData.invoice_number,
    }
  })
  .eq('id', exhibitor.id)
```

---

### 3. Service d'Automatisation

**Nouveau fichier** : `lib/services/invoice-automation.service.ts`

**Fonctionnalités** :
- Générer facture après inscription (si paiement immédiat)
- Générer facture après paiement confirmé
- Envoyer email avec facture attachée
- Mettre à jour metadata exhibitor

---

### 4. Endpoint Rappels de Paiement

**Nouveau fichier** : `app/api/foires/[eventSlug]/reminders/route.ts`

**Fonctionnalités** :
- GET : Liste des exposants avec paiement en attente
- POST : Envoyer rappel à un exposant spécifique
- POST /bulk : Envoyer rappels en masse

---

## 📝 Plan d'Implémentation

### Jour 1 : Corrections et Génération Automatique

1. ✅ Corriger les URLs de facture dans les emails
2. ✅ Ajouter génération automatique de facture dans `handleWavePaymentSuccess`
3. ✅ Tester génération facture après paiement Wave
4. ✅ Tester email avec facture

### Jour 2 : Service d'Automatisation

1. ✅ Créer `lib/services/invoice-automation.service.ts`
2. ✅ Intégrer dans le workflow d'inscription
3. ✅ Intégrer dans le workflow de paiement
4. ✅ Tester end-to-end

### Jour 3 : Rappels et Documentation

1. ✅ Créer endpoint rappels de paiement
2. ✅ Créer interface admin pour rappels
3. ✅ Documenter le système complet
4. ✅ Tests finaux

---

## 🎯 Résultat Attendu

Après la Phase 1 :

- ✅ Facture PDF générée automatiquement après paiement
- ✅ Email de confirmation avec lien facture
- ✅ Facture stockée dans Supabase Storage
- ✅ Rappels de paiement automatisés
- ✅ Système complet documenté

---

## 📚 Documentation à Créer

1. Guide d'utilisation du système de factures
2. Guide d'utilisation du système d'emails
3. API Reference pour les endpoints
4. Troubleshooting guide

---

**Statut** : 🚧 En cours d'implémentation

