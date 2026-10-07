---
name: reference-shopify-token-devdashboard
description: Comment obtenir un token Admin API Shopify (SHILAMAYA) depuis 2026 via le Dev Dashboard — les custom apps héritées (shpat_ direct) sont supprimées depuis 01/2026. Méthode validée 15/07/2026.
metadata: 
  node_type: memory
  type: reference
  originSessionId: 63a1a8a4-ab56-469f-9613-eb634a82a4af
---

Depuis **janvier 2026**, Shopify a supprimé les « applications personnalisées héritées »
(l'ancien chemin Admin → Développer des applications → token `shpat_` direct). Pour un
token Admin API, il faut passer par le **Dev Dashboard** et faire le OAuth authorization
code grant à la main.

## Contexte SHILAMAYA (shilamaya.fr)
- Domaine API : `2d041e-03.myshopify.com` (handle boutique `2d041e-03`)
- App créée : `claude-theme` (id 398235729921) · client_id `1322f0ee16a230c42b8820d277cbecf1`
- **Token fonctionnel `shpat_…`** stocké dans `~/CLAUDE Code/vitaldesir-page/.env.local`
  (`SHOPIFY_ADMIN_TOKEN=`), scope `write_themes,write_theme_code`. N'expire pas (offline).
- Thèmes : **1.10 (celui que JM veut) = 199962689870** ; MAIN 1.8.1 = 182296609102.

## Procédure (si le token est révoqué / nouvelle boutique)
1. dev.shopify.com/dashboard → créer une app → « Commencer à partir du Dev Dashboard ».
2. Version → Champs d'accès : `read_themes,write_themes,write_theme_code`.
3. **Cocher « Utiliser le flux d'installation hérité »**.
4. **Renseigner une URL de redirection** (ex. `https://example.com/callback`) — SANS elle,
   le OAuth authorize échoue (c'était le blocage). Publier.
5. Ouvrir dans le navigateur (user connecté admin) :
   `https://<domaine>.myshopify.com/admin/oauth/authorize?client_id=<CID>&scope=read_themes,write_themes,write_theme_code&redirect_uri=https://example.com/callback&state=x`
   → cliquer **Installer**.
6. La redirection vers `example.com/callback?code=…` contient le **code**. Le récupérer.
7. Échanger : `POST https://<domaine>.myshopify.com/admin/oauth/access_token`
   `{client_id, client_secret, code}` → renvoie `access_token` (`shpat_…`).
   (Le « jeton d'automatisation » `atkn_` NE marche PAS sur l'Admin API classique.)

## Écrire un fichier de thème (byte-safe, sans passer par les tokens du modèle)
Script `~/…/scratchpad/inject.py` : lit le fichier depuis le disque + `themeFilesUpsert`
(mutation GraphQL, API `2025-10`). ⚠️ Le thème **1.10 reformate** le JSON à l'écriture
(checksum/​taille changent — normal, données préservées) ; le 1.8.1 le garde tel quel.
Vérifier le rendu à l'aperçu `?preview_theme_id=<id>`, pas au checksum, pour le 1.10.

## Incompatibilité template 1.8.1 → 1.10 (résolue 15/07)
Le template `product.v2-vital-desir.json` venait du 1.8.1. Seul le block **`benefit`**
(section `template-product`) n'existe pas dans le schéma 1.10 → converti en block **`text`**
(champ `description` richtext, les 3 bénéfices en `<ul>`). Tout le reste est compatible.

Voir [[project-lawby-infra]] pour le pattern « token dans .env.local, jamais en clair ».
