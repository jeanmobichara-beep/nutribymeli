---
name: feedback_env_local_editeur_ouvert
description: "Ne jamais ouvrir .env.local (ou tout fichier que je modifie) dans TextEdit/VS Code pendant que je continue d'y écrire : un enregistrement depuis l'éditeur écrase mes ajouts (perte du secret webhook Stripe live le 08/09/2026)"
metadata:
  type: feedback
---

Le 2026-09-08, j'ai ouvert `~/dev/lawby/.env.local` dans TextEdit pour que JM y colle une clé, puis j'ai continué à y ajouter des lignes par le shell. L'enregistrement de JM depuis TextEdit (tampon périmé) a écrasé le fichier : identifiants live, taux de TVA, pied de facture et **secret de signature du webhook live** (montré une seule fois par Stripe) perdus ; webhook à recréer.

**Why :** un éditeur graphique garde sa propre copie et l'écrit intégralement à la sauvegarde ; tout ce que j'ai ajouté entre l'ouverture et l'enregistrement disparaît.

**How to apply :** si JM doit coller une valeur, (1) ouvrir l'éditeur, (2) attendre son « c'est fait », (3) vérifier le fichier, et **ne rien écrire dans ce fichier tant qu'il est ouvert** (`lsof` pour le savoir). Les valeurs non secrètes (clé publiable `pk_`, identifiants `price_`, `txr_`, `bpc_`, `we_`) peuvent être données dans le chat. Garder une trace des identifiants non secrets dans la mémoire projet pour pouvoir reconstituer.
