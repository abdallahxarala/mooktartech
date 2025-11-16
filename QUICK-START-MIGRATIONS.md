# 🚀 Guide Rapide - Exécution des Migrations Foire Dakar 2025

## 📋 Fichier à utiliser

**`MIGRATIONS-COMBINEES.sql`** (à la racine du projet)

---

## ✅ Actions à effectuer

### **ACTION 1 : Ouvrir le fichier**

```bash
cat MIGRATIONS-COMBINEES.sql
```

Ou ouvrez-le directement dans votre éditeur de code.

### **ACTION 2 : Copier le contenu**

1. **Sélectionnez tout** : `Ctrl+A`
2. **Copiez** : `Ctrl+C`

### **ACTION 3 : Exécuter dans Supabase**

1. **Ouvrez l'éditeur SQL** :
   👉 https://app.supabase.com/project/gocsjmtsfoadcozhhsxn/sql/new

2. **Collez** dans l'éditeur SQL : `Ctrl+V`

3. **Cliquez** sur le bouton **"Run"** (en bas à droite)
   - OU appuyez sur **Ctrl+Enter**

4. **Attendez** 2-3 secondes

### **ACTION 4 : Vérifier les Résultats**

Regardez les **logs en bas de l'écran**. Vous devriez voir :

```
✅ Migration 1 réussie: Colonnes event_type et foire_config ajoutées
✅ Migration 2 réussie: Organisation "Foire Dakar 2025" créée
✅ Migration 2 réussie: Événement "Foire Internationale de Dakar 2025" créé avec 3 pavillons

🎉 CONFIGURATION TERMINÉE AVEC SUCCÈS !
```

---

## 📊 Résultat attendu

Après exécution réussie :

- ✅ Table `events` étendue avec `event_type` et `foire_config`
- ✅ Organisation "Foire Internationale de Dakar 2025" créée
- ✅ Événement créé avec :
  - 3 pavillons (Agriculture, Artisanat, Technologie)
  - Dates : 1er au 15 décembre 2025
  - Lieu : CICES Dakar
  - Configuration complète (horaires, services, contact)

---

## ⚠️ En cas d'erreur

- **"column already exists"** → Normal, la migration est idempotente
- **"duplicate key"** → Normal, les données existantes seront mises à jour
- **"permission denied"** → Vérifiez vos droits administrateur sur Supabase

---

## 📝 Prochaines étapes

Une fois les migrations réussies :

1. `npm install openai`
2. `npm run db:generate`
3. `npm run seed:foire`
4. Créer la landing page

---

**Temps estimé** : 30 secondes ⏱️

