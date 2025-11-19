# 📄 Générateur de Factures PDF - Implémentation Complète

## ✅ Ce qui a été créé

### 1. Package installé
- ✅ `jspdf-autotable` installé via npm

### 2. Service PDF (`lib/services/pdf/invoice-generator.ts`)
- ✅ `generateInvoicePDF()` : Génère le PDF avec design professionnel
- ✅ `uploadInvoiceToStorage()` : Upload vers Supabase Storage
- ✅ `generateInvoiceNumber()` : Génère numéro de facture séquentiel (FD2025-0001)
- ✅ `buildInvoiceDataFromExhibitor()` : Construit les données depuis un exhibitor

### 3. Endpoint API (`app/api/foires/[eventSlug]/invoices/[exhibitorId]/route.ts`)
- ✅ GET endpoint pour générer et télécharger la facture
- ✅ Récupère exhibitor et event depuis Supabase
- ✅ Génère PDF et upload vers Storage
- ✅ Retourne le PDF en téléchargement

### 4. Script SQL (`supabase/scripts/create_foire_dakar_storage_bucket.sql`)
- ✅ Création du bucket `foire-dakar-documents`
- ✅ Politiques RLS pour lecture publique et upload admin/exhibitor

---

## 🎨 Design de la Facture

### Structure
1. **En-tête** : Logo Foire Dakar (à ajouter si disponible)
2. **Titre** : "FACTURE" centré
3. **Informations Foire** (gauche) :
   - Nom de l'événement
   - Adresse CICES
   - Contact
4. **Informations Facture** (droite) :
   - Numéro de facture
   - Date
   - Statut paiement
5. **Client** : Encadré avec informations exposant
6. **Tableau Articles** : Stand + meubles avec totaux
7. **Totaux** : Sous-total, TVA (18%), Total TTC
8. **Informations Bancaires** : IBAN, Swift
9. **Pied de page** : Message de remerciement

---

## 📋 Utilisation

### Générer une facture

**Endpoint** :
```
GET /api/foires/[eventSlug]/invoices/[exhibitorId]
```

**Exemple** :
```typescript
// Dans un composant ou service
const response = await fetch(
  `/api/foires/dakar-2025/invoices/${exhibitorId}`
)
const blob = await response.blob()

// Créer un lien de téléchargement
const url = window.URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `facture-${invoiceNumber}.pdf`
a.click()
```

### Utiliser le service directement

```typescript
import {
  generateInvoicePDF,
  buildInvoiceDataFromExhibitor,
  uploadInvoiceToStorage,
} from '@/lib/services/pdf/invoice-generator'

// Construire les données
const invoiceData = buildInvoiceDataFromExhibitor(exhibitor, event)

// Générer le PDF
const pdfBlob = await generateInvoicePDF(invoiceData)

// Upload vers Storage
const publicUrl = await uploadInvoiceToStorage(
  pdfBlob,
  exhibitorId,
  invoiceData.invoice_number
)
```

---

## 🗄️ Configuration Supabase Storage

### Étape 1 : Créer le bucket

Exécuter le script SQL dans Supabase SQL Editor :
```sql
-- Voir : supabase/scripts/create_foire_dakar_storage_bucket.sql
```

### Étape 2 : Vérifier les politiques

Les politiques créées permettent :
- ✅ Lecture publique des documents
- ✅ Upload par exposants (leurs propres documents)
- ✅ Upload par admins (tous documents)
- ✅ Suppression par admins uniquement

---

## 📊 Données Utilisées

### Depuis `exhibitors` :
- `company_name` : Nom de l'entreprise
- `contact_name` : Nom du contact
- `contact_email` : Email
- `contact_phone` : Téléphone
- `booth_location` : Code pavillon
- `payment_amount` : Montant total TTC
- `payment_status` : Statut paiement
- `metadata` : Données supplémentaires (standSize, furnitureOptions)

### Depuis `events.foire_config` :
- `tarification.prix_m2` : Prix au m²
- `tarification.tva_pourcent` : Taux TVA (18%)
- `tarification.options_meubles` : Liste des meubles disponibles

---

## 🔧 Améliorations Futures

### Court terme
- [ ] Ajouter logo Foire Dakar dans l'en-tête
- [ ] Stocker `standSize` et `furnitureOptions` dans `metadata` lors de l'inscription
- [ ] Ajouter colonnes `invoice_url` et `invoice_number` à la table `exhibitors`

### Moyen terme
- [ ] Génération automatique après paiement réussi
- [ ] Envoi automatique par email avec facture en pièce jointe
- [ ] Historique des factures (révisions, annulations)

---

## 🧪 Tests

### Test manuel

1. **Créer un exposant test** :
   ```sql
   INSERT INTO exhibitors (
     event_id,
     organization_id,
     company_name,
     slug,
     contact_name,
     contact_email,
     contact_phone,
     booth_location,
     payment_amount,
     payment_status,
     currency,
     metadata
   ) VALUES (
     '[event_id]',
     '[org_id]',
     'Test Company',
     'test-company-123',
     'John Doe',
     'test@example.com',
     '+221 77 000 00 00',
     'PAV-A',
     500000,
     'pending',
     'FCFA',
     '{"standSize": 20, "furnitureOptions": {"table_presentation": 2}}'::jsonb
   );
   ```

2. **Tester l'endpoint** :
   ```
   GET http://localhost:3000/api/foires/dakar-2025/invoices/[exhibitor_id]
   ```

3. **Vérifier** :
   - ✅ PDF téléchargé
   - ✅ Contenu correct
   - ✅ Design professionnel
   - ✅ Upload Storage réussi

---

## 📝 Notes Importantes

### Stockage des données

Actuellement, `standSize` et `furnitureOptions` ne sont **pas stockés** dans la table `exhibitors` lors de l'inscription.

**Solution temporaire** : Le générateur utilise `payment_amount` pour reconstruire la facture.

**Solution recommandée** : Modifier `handleSubmit` dans `inscription/page.tsx` pour stocker ces données dans `metadata` :

```typescript
const exhibitorData = {
  // ... autres champs
  metadata: {
    standSize: formData.standSize,
    furnitureOptions: formData.furnitureOptions,
    // ... autres métadonnées
  },
}
```

### Numéro de facture

Le numéro est généré à partir de `booth_number` si disponible, sinon depuis l'ID de l'exhibitor.

Format : `FD2025-0001`, `FD2025-0002`, etc.

---

## ✅ Checklist Validation

- [x] Package `jspdf-autotable` installé
- [x] Service `invoice-generator.ts` créé
- [x] Endpoint API créé
- [x] Script SQL bucket créé
- [x] Code compile sans erreurs
- [ ] Bucket Supabase créé (à faire manuellement)
- [ ] Test génération PDF réussi
- [ ] Test upload Storage réussi
- [ ] Facture contient toutes les informations
- [ ] Design professionnel vérifié

---

**Date de création** : Février 2025  
**Statut** : ✅ Implémentation complète, prête pour tests

