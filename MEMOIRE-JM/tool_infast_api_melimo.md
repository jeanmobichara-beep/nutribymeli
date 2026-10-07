---
name: tool-infast-api-melimo
description: "Connecteur API INFast (facturation MELIMO) : script prêt dans ~/CLAUDE Code/melimo-infast/, pièges Cloudflare + schéma de ligne, et règle JM : toute facture créée en BROUILLON"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 41f7cd30-6a76-4c63-8daf-2bf1dea9d98d
  modified: 2026-08-06T05:08:53.912Z
---

**Connecteur opérationnel depuis le 05/08/2026** : `~/CLAUDE Code/melimo-infast/infast.py`
(`ping` / `get` / `patch` / `put` / `post`). Clés dans `.env.local` du même dossier, lues au moment de l'usage — ne jamais les afficher ni les passer en argument.

- Base API : `https://api.infast.fr/api/v2` · OAuth2 `client_credentials` en **Basic Auth** (client_id:client_secret), scope `write`.
- ⚠️ **Cloudflare renvoie 403 (error 1010) sur l'User-Agent par défaut de urllib** → le script envoie un UA explicite. Ce n'est PAS un problème de clés : ne pas régénérer les identifiants sur ce symptôme.
- ⚠️ **Création de ligne de facture** : quand on réutilise un article via `itemId`, le schéma `document-line-item-reuse` **refuse les propriétés `name` et `type`**. Envoyer seulement : `lineType`, `itemId`, `description`, `reference`, `price`, `buyingPrice`, `quantity`, `vat`, `discount`.
- Endpoints utiles : `/documents`, `/customers`, `/items`. `/user` n'existe pas ; `/portal` refuse `limit`.

**RÈGLE JM (05/08/2026) : toute facture créée par Claude l'est en `status: "DRAFT"`. Jamais publiée, jamais envoyée.** JM relit et valide lui-même.

**Convention de marge INFast** — piège dans lequel Claude est tombé : le « Marge % » affiché est un **coefficient sur le prix d'achat** ((PV−PA)/PA), pas une marge sur prix de vente. 88,78 % affichés = 47 % de marge réelle. Les chiffres d'INFast sont justes, ne pas conclure à une erreur.

**TVA (confirmé par JM 05/08/2026)** : **2,1 %** pour tous les produits SHILAMAYA/compléments. **8,5 %** uniquement pour le capillaire HAIRMELLY. ⚠️ Plusieurs articles Shilajit sont encore à 8,5 % dans la base (résine 30 g et 50 g, fiole, gélules) → à corriger, et les factures passées à 8,5 % sont une question pour le comptable.

**Base articles à nettoyer** : chaque produit existe en double (variante B2B et B2C) **sous un nom identique** — risque de facturer au mauvais prix. À renommer « — B2B » / « — B2C ». Article fantôme « Shi » (0 €, TVA 20 %) à supprimer.

Lié à [[project_vitaldesir_conformite_import]], [[project_societe_tresorerie_relance]].

**🔴 01/09/2026 — INTERDICTION D'ÉCRITURE (voir [[feedback_infast_interdiction_ecriture]])** : plus aucun `patch`/`put`/`post`/`delete` sur INFast, ni depuis ce script ni depuis PILOTAGE. Lecture seule.
**Sémantique des montants (mesurée 01/09/2026)** : `amount` = **HT**, `amountVat` = **TTC**, `totalPayments` = somme des paiements rattachés. Un virement client se compare à `amountVat`. `POST /documents/{id}/payment` = `{date, amount, method}` strict ; aucun GET des paiements individuels (405/404) — le détail ne se voit que dans l'interface INFast.
**Paiements en lecture (01/09/2026)** : `GET /transactions?customerId=…` (amount, usedAmount, refundedAmount, usages) et `GET /documents/{id}/transaction-usages`. Un paiement INFast est **définitif** (ni modifiable ni supprimable, ni en interface ni par API) : un trop-perçu se corrige par remboursement (fiche client, « annule un paiement enregistré par erreur ») ou utilisation sur une autre facture.
