# Checklist de Lancement - Xarala Solutions


## ✅ PRÉ-REQUIS (Must Have)


### Backend

- [ ] API `/api/orders/submit` créée et testée
- [ ] Webhooks Stripe fonctionnels
- [ ] Emails confirmation configurés
- [ ] Variables d'environnement production
- [ ] HTTPS/SSL configuré


### Frontend

- [ ] Flow cart → checkout → success testé
- [ ] Pas d'erreurs hydration
- [ ] Pas d'erreurs console
- [ ] Mobile responsive testé
- [ ] Formulaires validés


### Paiements

- [ ] Au moins 1 méthode fonctionnelle (cash ou Stripe)
- [ ] Calculs prix corrects (TVA, livraison)
- [ ] Page success avec tracking


### Contenu

- [ ] Tous textes français corrects
- [ ] Images produits optimisées
- [ ] Prix à jour
- [ ] CGV et mentions légales


## 🎯 RECOMMANDÉ (Should Have)

- [ ] Wave API intégrée
- [ ] WhatsApp notifications
- [ ] Analytics (Google/Plausible)
- [ ] SEO meta tags
- [ ] Sitemap.xml
- [ ] robots.txt


## 💎 NICE TO HAVE (Could Have)

- [ ] Orange Money
- [ ] Multi-langue EN complet
- [ ] Badge designer fonctionnel
- [ ] Dashboard admin
- [ ] Gestion stock
- [ ] Multi-tenant


## 🚫 POST-LAUNCH (Won't Have v1)

- [ ] Export PDF badges
- [ ] Intégrations CRM
- [ ] Programme fidélité
- [ ] Codes promo
- [ ] Marketplace tiers


---


## 🔍 TESTS AVANT LAUNCH


### Test 1 : Parcours Client Complet

1. Ajouter 3 produits différents au panier
2. Vérifier 3 lignes distinctes affichées
3. Modifier quantités
4. Aller au checkout
5. Remplir formulaire
6. Confirmer commande
7. Vérifier page success
8. Vérifier email reçu


### Test 2 : Calculs Prix

1. Ajouter produit <500K → vérifier frais livraison
2. Ajouter produit >500K → vérifier livraison gratuite
3. Vérifier TVA 18% correcte
4. Vérifier total = sous-total + TVA + livraison


### Test 3 : Responsive

1. Tester sur mobile (375px)
2. Tester sur tablette (768px)
3. Tester sur desktop (1920px)
4. Vérifier mega menu mobile
5. Vérifier formulaires mobile


### Test 4 : Performance

1. Lighthouse score >90
2. Temps chargement <3s
3. Pas d'images non optimisées
4. Pas de requêtes bloquantes


---


## 📞 SUPPORT LAUNCH DAY


**Équipe disponible :**

- Dev backend : [NOM]
- Dev frontend : [NOM]
- Support client : [NOM]


**Outils monitoring :**

- Logs serveur : [OUTIL]
- Analytics : [OUTIL]
- Erreurs : Sentry / LogRocket


**Plan urgence :**

1. Bug critique → Rollback version précédente
2. Paiements KO → Activer "Maintenance mode"
3. Surcharge serveur → Activer CDN/cache

