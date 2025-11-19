# ⚡ PLAN D'ACTION IMMÉDIAT - FOIRE DAKAR 2025

**Timeline Réaliste** : **10 jours ouvrables** (2 semaines)  
**Approche** : MVP Minimal Viable pour Production  
**Focus** : Fonctionnalités critiques uniquement

---

## 🎯 OBJECTIF FINAL

**Lancer la plateforme Foire Dakar 2025 en production avec** :
1. ✅ Inscription exposants fonctionnelle (déjà 85% fait)
2. ✅ Paiements Wave/Orange Money opérationnels
3. ✅ Factures PDF générées automatiquement
4. ✅ Emails de confirmation envoyés
5. ✅ Billetterie avec QR codes
6. ✅ Dashboard admin basique

---

## 📊 CE QUI EXISTE DÉJÀ (85%)

### ✅ Fonctionnel et Testé

1. **Formulaire Inscription Exposants** :
   - 6 étapes complètes ✅
   - Validation ✅
   - Upload logo/banner ✅
   - Gestion staff ✅
   - Calculs prix dynamiques ✅

2. **Infrastructure** :
   - Packages installés : `qrcode`, `jspdf`, `resend` ✅
   - Tables Supabase complètes ✅
   - Services exhibitor ✅

3. **Pages** :
   - Page d'accueil dynamique ✅
   - Catalogue exposants ✅
   - Détail exposant ✅
   - Dashboard exposant ✅
   - Page billetterie (basique) ✅
   - Admin badges ✅

### ⚠️ À Finaliser (15%)

1. **Paiements** : Intégration API réelle
2. **Factures** : Génération PDF
3. **Emails** : Templates transactionnels
4. **Billetterie** : QR codes + validation
5. **Admin** : Dashboard statistiques

---

## 🚀 PLAN 10 JOURS - DÉTAILLÉ

### **JOURS 1-2 : Paiements Wave/Orange Money**

#### Ce qui existe déjà
- UI de sélection dans `Step6Payment` ✅
- Types définis ✅
- Configuration `env.example` ✅

#### À créer (Estimation : 2 jours)

**Fichiers** :
```
lib/services/payments/
  ├── wave.ts                    (150 lignes)
  ├── orange-money.ts            (180 lignes)
  └── types.ts                   (50 lignes)

app/api/webhooks/
  ├── wave/route.ts              (100 lignes)
  └── orange-money/route.ts      (100 lignes)
```

**Actions** :
1. **Jour 1 Matin** : Créer compte Wave Developer (sandbox)
2. **Jour 1 Après-midi** : Implémenter service Wave
3. **Jour 2 Matin** : Créer compte Orange Money Developer
4. **Jour 2 Après-midi** : Implémenter service Orange Money + Webhooks

**Complexité** : ⭐⭐⭐ Moyenne (nécessite documentation API)

---

### **JOUR 3 : Factures PDF**

#### Ce qui existe déjà
- `jspdf` installé ✅
- Données exhibitor complètes ✅

#### À créer (Estimation : 1 jour)

**Fichiers** :
```
lib/services/pdf/
  └── invoice-generator.ts       (250 lignes)

app/api/foires/[eventSlug]/invoices/[exhibitorId]/
  └── route.ts                   (80 lignes)
```

**Actions** :
1. Créer générateur PDF avec jspdf
2. Créer bucket Supabase Storage `foire-dakar-documents`
3. Upload facture après création exhibitor
4. Intégrer dans `handleSubmit` inscription

**Complexité** : ⭐⭐ Faible (jspdf déjà installé)

---

### **JOURS 4-5 : Emails Transactionnels**

#### Ce qui existe déjà
- `resend` installé ✅
- Configuration email ✅

#### À créer (Estimation : 2 jours)

**Fichiers** :
```
lib/services/email/
  ├── resend-client.ts           (80 lignes)
  └── templates.ts               (400 lignes)
```

**Templates** :
1. Confirmation inscription (avec lien facture)
2. Rappel paiement
3. Confirmation paiement
4. Envoi billets (avec QR)

**Actions** :
1. **Jour 4** : Créer client Resend + templates HTML
2. **Jour 5** : Intégrer dans workflow + tests

**Complexité** : ⭐ Faible (Resend simple)

---

### **JOURS 6-7 : Billetterie QR Codes**

#### Ce qui existe déjà
- `qrcode` installé ✅
- Page tickets existe (crée `event_attendees`) ✅
- Génération QR déjà implémentée ailleurs ✅

#### À créer (Estimation : 2 jours)

**Fichiers** :
```
supabase/migrations/
  └── create_tickets_table.sql   (80 lignes)

lib/services/tickets/
  ├── qr-generator.ts            (100 lignes)
  └── validator.ts               (80 lignes)

app/api/tickets/
  └── validate/route.ts          (60 lignes)
```

**Actions** :
1. **Jour 6** : Créer table `tickets` + améliorer page billetterie
2. **Jour 7** : Créer validation QR + interface scan

**Complexité** : ⭐⭐ Faible (QR codes déjà maîtrisés)

---

### **JOURS 8-9 : Dashboard Admin**

#### Ce qui existe déjà
- Page admin badges ✅
- Services exhibitor ✅
- Layout admin ✅

#### À créer (Estimation : 2 jours)

**Fichiers** :
```
lib/services/admin/
  └── stats.service.ts           (200 lignes)

app/[locale]/org/[slug]/foires/[eventSlug]/admin/
  ├── dashboard/page.tsx         (400 lignes)
  └── exhibitors/page.tsx        (300 lignes)
```

**Fonctionnalités** :
1. KPIs (exposants, revenus, billets)
2. Graphiques simples (Recharts déjà installé)
3. Table exposants avec actions
4. Workflow approbation basique

**Complexité** : ⭐⭐⭐ Moyenne (requêtes complexes)

---

### **JOUR 10 : Tests & Optimisations**

**Actions** :
1. Tests end-to-end complets
2. Corrections bugs
3. Optimisations performance
4. Documentation rapide

**Complexité** : ⭐⭐ Faible

---

## 📋 PRIORISATION INTELLIGENTE

### 🔴 PHASE 1 : MVP Critique (Jours 1-5)

**Objectif** : Permettre inscriptions avec paiements

- [x] Paiements Wave/Orange Money
- [x] Factures PDF
- [x] Emails confirmation

**Résultat** : ✅ Inscriptions fonctionnelles

---

### 🟡 PHASE 2 : MVP Complet (Jours 6-9)

**Objectif** : Ajouter billetterie et admin

- [x] Billetterie QR
- [x] Dashboard admin

**Résultat** : ✅ Plateforme complète

---

### 🟢 PHASE 3 : Optimisations (Jour 10)

**Objectif** : Polir et tester

- [x] Tests complets
- [x] Optimisations
- [x] Documentation

**Résultat** : ✅ Prêt production

---

## 💡 STRATÉGIE ALTERNATIVE (Si Paiements Complexes)

### Option A : Paiement Manuel Temporaire

**Si intégration Wave/Orange Money prend trop de temps** :

1. **Paiement par virement bancaire** :
   - Afficher RIB dans formulaire
   - Exposant paie manuellement
   - Admin valide paiement manuellement
   - Système envoie facture après validation

2. **Avantages** :
   - ✅ Fonctionne immédiatement
   - ✅ Pas de complexité API
   - ✅ Accepté au Sénégal

3. **Inconvénients** :
   - ⚠️ Validation manuelle nécessaire
   - ⚠️ Pas de paiement instantané

**Temps économisé** : 2 jours → Peut être ajouté plus tard

---

## 🎯 PLAN B : MVP ULTRA-MINIMAL (5 jours)

### Si vous avez besoin de lancer rapidement

**Semaine 1** :
- **Jour 1** : Factures PDF
- **Jour 2** : Emails transactionnels
- **Jour 3** : Billetterie QR (améliorer existant)
- **Jour 4** : Dashboard admin basique
- **Jour 5** : Tests + Optimisations

**Paiements** : Mode manuel (virement bancaire) → Ajouter plus tard

**Résultat** : ✅ Plateforme fonctionnelle en 5 jours

---

## 📦 CODE À CRÉER (Estimation Totale)

### Lignes de code estimées

| Module | Fichiers | Lignes | Complexité |
|--------|----------|--------|------------|
| Paiements | 5 fichiers | ~580 lignes | ⭐⭐⭐ |
| Factures | 2 fichiers | ~330 lignes | ⭐⭐ |
| Emails | 2 fichiers | ~480 lignes | ⭐ |
| Billetterie | 4 fichiers | ~320 lignes | ⭐⭐ |
| Admin | 2 fichiers | ~700 lignes | ⭐⭐⭐ |
| **TOTAL** | **15 fichiers** | **~2410 lignes** | |

**Temps estimé** : 10 jours (avec tests)

---

## 🧪 TESTS MINIMAUX REQUIS

### Tests Critiques (Blocant)

1. **Inscription Exposant** :
   - [ ] Formulaire complet fonctionne
   - [ ] Paiement (ou validation manuelle) fonctionne
   - [ ] Email reçu
   - [ ] Facture téléchargeable

2. **Billetterie** :
   - [ ] Achat billet fonctionne
   - [ ] QR code généré
   - [ ] Email avec QR reçu
   - [ ] Validation QR fonctionne

### Tests Secondaires (Non-bloquant)

- [ ] Dashboard admin affiche stats
- [ ] Export données fonctionne
- [ ] Performance acceptable

---

## 🚀 DÉPLOIEMENT PRODUCTION

### Checklist Minimale

**Infrastructure** :
- [ ] Vercel configuré
- [ ] Domaine configuré
- [ ] Variables d'environnement
- [ ] SSL activé

**Base de données** :
- [ ] RLS activé
- [ ] Backups configurés

**Paiements** :
- [ ] Comptes production (ou mode manuel)
- [ ] Webhooks configurés

**Emails** :
- [ ] Resend configuré
- [ ] Domaine email vérifié

---

## 📊 MÉTRIQUES DE SUCCÈS MVP

### Technique
- ✅ Inscriptions fonctionnent
- ✅ Paiements fonctionnent (ou manuel)
- ✅ Emails envoyés
- ✅ Factures générées
- ✅ Pas de bug critique

### Business
- 🎯 50+ exposants peuvent s'inscrire
- 🎯 1000+ billets peuvent être vendus
- 🎯 Plateforme utilisable

---

## 💰 COÛTS MVP

### Développement
- **Vous** : 0 FCFA (10 jours)
- **Prestataire** : 1 000 000 - 1 500 000 FCFA

### Infrastructure (mensuel)
- Vercel : ~10 000 FCFA
- Supabase : ~13 000 FCFA
- Domaine : ~8 000 FCFA/an
- Resend : Gratuit (< 3000 emails)
- **Total** : ~25 000 FCFA/mois

---

## ✅ VALIDATION FINALE

### Avant Production

- [ ] Tous les tests critiques passent
- [ ] Paiements fonctionnent (ou mode manuel)
- [ ] Emails envoyés
- [ ] Factures générées
- [ ] Performance acceptable
- [ ] Sécurité vérifiée (RLS)

---

## 🎯 PROCHAINES ACTIONS (AUJOURD'HUI)

### Action Immédiate #1 : Paiements

**Option A** : Intégration complète (2 jours)
- Créer comptes Wave/Orange Money Developer
- Implémenter services
- Tester

**Option B** : Mode manuel (30 min)
- Afficher RIB dans formulaire
- Validation manuelle admin
- Ajouter paiements plus tard

**Recommandation** : **Option B pour MVP rapide**, puis Option A après lancement

---

### Action Immédiate #2 : Factures PDF

**Temps** : 1 jour
**Complexité** : Faible
**Priorité** : Haute

**Commencer maintenant** : ✅ Oui (peut être fait rapidement)

---

### Action Immédiate #3 : Emails

**Temps** : 2 jours
**Complexité** : Faible
**Priorité** : Haute

**Commencer après factures** : ✅ Oui

---

## 📝 RÉSUMÉ EXÉCUTIF

### Timeline Réaliste

- **10 jours** : MVP complet avec paiements
- **5 jours** : MVP ultra-minimal (paiements manuels)
- **2 semaines** : MVP + optimisations

### Recommandation

**Lancer avec MVP ultra-minimal (5 jours)** :
1. ✅ Factures PDF
2. ✅ Emails
3. ✅ Billetterie QR
4. ✅ Admin basique
5. ⏸️ Paiements manuels (ajouter plus tard)

**Puis ajouter paiements automatiques** (2 jours supplémentaires)

**Total** : 7 jours pour MVP production complet

---

**Document créé le** : Février 2025  
**Version** : 1.0 - Plan Optimisé Réaliste

