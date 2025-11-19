# 🔑 Environment Variables

**Date de sauvegarde** : 2025-02-02  
**Version** : v0.1.0-pre-multitenant

---

## ⚠️ IMPORTANT

Le fichier `.env.local` contient des secrets et ne doit **JAMAIS** être commité dans Git.

Ce document liste les variables nécessaires sans leurs valeurs.

---

## Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]
```

**Project ID** : `gocsjmtsfoadcozhhsxn`

---

## Email (Resend)

```env
RESEND_API_KEY=[RESEND_API_KEY]
```

**Usage** : Envoi d'emails transactionnels (confirmations, factures, tickets)

---

## Site

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Production** : À configurer avec l'URL de production

---

## Wave Payment (Optionnel)

```env
WAVE_API_KEY=[WAVE_API_KEY]
WAVE_SECRET=[WAVE_SECRET]
WAVE_WEBHOOK_SECRET=[WAVE_WEBHOOK_SECRET]
WAVE_API_URL=https://api.wave.com/v1
```

**Usage** : Paiements en ligne pour inscriptions exposants

---

## Storage Supabase

```env
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=foire-dakar-documents
```

**Usage** : Stockage des documents PDF (factures, badges)

---

## Vérification

Pour vérifier que toutes les variables sont configurées :

```bash
# Vérifier les variables Supabase
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Vérifier Resend
echo $RESEND_API_KEY

# Vérifier Wave (si configuré)
echo $WAVE_API_KEY
```

---

## Notes

- Toutes les variables `NEXT_PUBLIC_*` sont exposées au client
- Les variables sans `NEXT_PUBLIC_` sont uniquement côté serveur
- Ne jamais commiter `.env.local` dans Git
- Utiliser `.env.example` pour documenter les variables nécessaires

