# 📧 Système d'Emails Transactionnels - Foire Dakar 2025

## ✅ Ce qui a été créé

### 1. Client Resend (`lib/services/email/resend-client.ts`)
- ✅ Client Resend initialisé avec `RESEND_API_KEY`
- ✅ Fonction générique `sendEmail()` avec gestion d'erreurs
- ✅ Logging des envois

### 2. Templates Emails (`lib/services/email/templates.ts`)
- ✅ `sendExhibitorConfirmationEmail()` : Confirmation inscription exposant
- ✅ `sendPaymentReminderEmail()` : Rappel de paiement
- ✅ `sendTicketsEmail()` : Envoi billets avec QR codes

### 3. Intégration dans le workflow
- ✅ Email envoyé après création exhibitor (inscription)
- ✅ Email envoyé après paiement Wave réussi (webhook)
- ✅ Gestion d'erreurs non-bloquante

---

## 📋 Templates Disponibles

### 1. Confirmation Inscription Exposant

**Fonction** : `sendExhibitorConfirmationEmail()`

**Données requises** :
```typescript
{
  to: string                    // Email de l'exposant
  exhibitorName: string         // Nom du contact
  companyName: string           // Nom de l'entreprise
  standNumber: string | null    // Numéro de stand
  pavilionName: string          // Nom du pavillon
  surfaceArea: number           // Surface en m²
  totalPrice: number            // Montant total TTC
  invoiceUrl?: string           // URL de téléchargement facture
}
```

**Contenu** :
- ✅ Détails de l'inscription (entreprise, stand, pavillon, surface, montant)
- ✅ Lien téléchargement facture
- ✅ Prochaines étapes
- ✅ Informations de contact

---

### 2. Rappel de Paiement

**Fonction** : `sendPaymentReminderEmail()`

**Données requises** :
```typescript
{
  to: string                    // Email de l'exposant
  exhibitorName: string         // Nom du contact
  companyName: string           // Nom de l'entreprise
  amountDue: number             // Montant dû
  dueDate: string               // Date limite (format DD/MM/YYYY)
  paymentUrl: string            // URL pour effectuer le paiement
}
```

**Contenu** :
- ✅ Détails du paiement en attente
- ✅ Date limite
- ✅ Bouton "Effectuer le paiement"
- ✅ Modes de paiement acceptés

---

### 3. Envoi Billets avec QR Codes

**Fonction** : `sendTicketsEmail()`

**Données requises** :
```typescript
{
  to: string                    // Email de l'acheteur
  buyerName: string             // Nom de l'acheteur
  ticketType: string            // Type de billet (standard, vip, groupe)
  quantity: number               // Nombre de billets
  eventName: string             // Nom de l'événement
  eventDate: string             // Dates de l'événement
  eventLocation: string          // Lieu de l'événement
  qrCodes: string[]             // Array de QR codes (Base64 data URLs)
}
```

**Contenu** :
- ✅ QR codes pour chaque billet
- ✅ Informations événement (lieu, dates, horaires)
- ✅ Instructions importantes
- ✅ Design responsive

---

## 🔗 Intégration dans le Code

### Après création exhibitor (inscription)

**Fichier** : `app/[locale]/org/[slug]/foires/[eventSlug]/inscription/page.tsx`

```typescript
// Après création exhibitor réussie
try {
  const { sendExhibitorConfirmationEmail } = await import('@/lib/services/email/templates')
  
  await sendExhibitorConfirmationEmail({
    to: formData.contactEmail,
    exhibitorName: formData.contactName,
    companyName: formData.companyName,
    standNumber: exhibitor.booth_number || null,
    pavilionName: pavillon?.nom || formData.pavillonCode,
    surfaceArea: formData.standSize,
    totalPrice: formData.totalTTC,
    invoiceUrl: `${baseUrl}/api/foires/${eventSlug}/invoices/${exhibitor.id}`,
  })
} catch (emailError) {
  console.warn('⚠️ Erreur envoi email (non bloquant):', emailError)
}
```

### Après paiement Wave réussi (webhook)

**Fichier** : `lib/services/payments/wave.ts`

```typescript
// Dans handleWavePaymentSuccess()
try {
  const { sendExhibitorConfirmationEmail } = await import('@/lib/services/email/templates')
  
  await sendExhibitorConfirmationEmail({
    to: exhibitor.contact_email,
    exhibitorName: exhibitor.contact_name,
    companyName: exhibitor.company_name,
    standNumber: exhibitor.booth_number || null,
    pavilionName: pavillon?.nom || exhibitor.booth_location,
    surfaceArea: exhibitorMetadata.standSize || 0,
    totalPrice: exhibitor.payment_amount || 0,
    invoiceUrl: `${baseUrl}/api/foires/${eventSlug}/invoices/${exhibitor.id}`,
  })
} catch (emailError) {
  console.warn('⚠️ Erreur envoi email (non bloquant):', emailError)
}
```

---

## 🎨 Design des Emails

### Caractéristiques
- ✅ Design responsive (mobile-friendly)
- ✅ CSS inline (compatibilité email clients)
- ✅ Gradients et couleurs Foire Dakar
- ✅ Images en Base64 ou URLs publiques
- ✅ Lien de désabonnement (légal)

### Compatibilité
- ✅ Gmail
- ✅ Outlook
- ✅ Apple Mail
- ✅ Mobile (iOS, Android)

---

## ⚙️ Configuration

### Variables d'environnement

```env
RESEND_API_KEY=re_your_resend_api_key_here
```

### Configuration Resend

1. **Créer un compte** : https://resend.com
2. **Obtenir la clé API** : Dashboard → API Keys
3. **Configurer le domaine** (optionnel) : `foire-dakar-2025.com`
4. **Vérifier SPF/DKIM** : Pour améliorer la délivrabilité

---

## 🧪 Tests

### Test manuel

1. **Créer un exhibitor test** :
   ```typescript
   // Dans inscription/page.tsx
   // L'email sera envoyé automatiquement après création
   ```

2. **Vérifier l'email reçu** :
   - ✅ Email arrive dans la boîte de réception
   - ✅ Design correct (desktop + mobile)
   - ✅ Tous les liens fonctionnent
   - ✅ Facture téléchargeable

3. **Test avec Mail-Tester** :
   - Aller sur https://www.mail-tester.com
   - Obtenir une adresse de test
   - Envoyer un email à cette adresse
   - Vérifier le score (> 8/10 recommandé)

---

## 📊 Utilisation

### Exemple : Envoyer un rappel de paiement

```typescript
import { sendPaymentReminderEmail } from '@/lib/services/email/templates'

await sendPaymentReminderEmail({
  to: 'exposant@example.com',
  exhibitorName: 'John Doe',
  companyName: 'Ma Société',
  amountDue: 500000,
  dueDate: '15/03/2025',
  paymentUrl: 'https://foire-dakar-2025.com/paiement',
})
```

### Exemple : Envoyer des billets

```typescript
import { sendTicketsEmail } from '@/lib/services/email/templates'
import QRCode from 'qrcode'

// Générer les QR codes
const qrCodes = await Promise.all(
  tickets.map(ticket => 
    QRCode.toDataURL(JSON.stringify({
      ticket_id: ticket.id,
      event_slug: 'dakar-2025',
      type: ticket.type,
    }))
  )
)

// Envoyer l'email
await sendTicketsEmail({
  to: 'acheteur@example.com',
  buyerName: 'Jane Doe',
  ticketType: 'standard',
  quantity: 2,
  eventName: 'Foire Internationale de Dakar 2025',
  eventDate: '15-30 Mars 2025',
  eventLocation: 'CICES, Dakar',
  qrCodes,
})
```

---

## ✅ Checklist Validation

- [x] Client Resend créé
- [x] 3 templates emails créés
- [x] Intégration dans workflow inscription
- [x] Intégration dans webhook Wave
- [x] Design responsive
- [x] CSS inline
- [x] Gestion d'erreurs non-bloquante
- [ ] Test email reçu (à faire manuellement)
- [ ] Test Mail-Tester (à faire manuellement)
- [ ] Configuration domaine Resend (optionnel)

---

## 🔧 Améliorations Futures

### Court terme
- [ ] Ajouter logo Foire Dakar dans les emails
- [ ] Personnaliser l'adresse "from" selon l'organisation
- [ ] Ajouter tracking des emails ouverts

### Moyen terme
- [ ] Templates multilingues (FR, EN, WO)
- [ ] Système de relance automatique
- [ ] Analytics des emails (taux d'ouverture, clics)

---

**Date de création** : Février 2025  
**Statut** : ✅ Implémentation complète, prête pour tests

