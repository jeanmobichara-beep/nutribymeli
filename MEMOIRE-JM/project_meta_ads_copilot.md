---
name: project-meta-ads-copilot
description: Skill meta-ads-copilot construit le 21/09/2026 — pilotage Meta Ads via Plugkit, limites vérifiées du connecteur, écriture verrouillée
metadata:
  type: project
---

Skill `meta-ads-copilot` construit le 2026-09-21 depuis le cahier des charges `~/Downloads/CAHIER-DES-CHARGES.md`. Installé dans `~/.claude/skills/meta-ads-copilot/`, empaqueté en `~/Desktop/meta-ads-copilot.skill`. Données de marque **hors du skill** : `~/Desktop/02-SHILAMAYA/meta-ads/`.

Un seul compte publicitaire connecté à Plugkit : `act_1058695325777760` « Ecom Backup » (business Melimo), EUR, Europe/Paris, **sans plafond de dépenses**. Il porte SHILAMAYA, HAIRMELLY et d'anciennes campagnes CAPILUXY — d'où une règle de rattachement campagne→marque obligatoire.

Le connecteur a le scope `mcp:write`. **L'écriture n'est jamais autorisée par défaut** : accord explicite de JM sur un lot chiffré, puis `scripts/guard_batch.py` avant tout appel.

Trois limites vérifiées du connecteur, non contournables : les lignes de `get_ads_insights` ne portent **aucun identifiant** (un appel par `objectId` obligatoire) ; les budgets sont en centimes sur les objets mais en décimales dans les insights ; l'achat remonte sous 7 clés d'action simultanées et ne doit **jamais** être sommé.

**Why:** ces limites ne sont écrites nulle part dans la doc Plugkit — elles ont été établies par appels réels, et les ignorer produit un diagnostic faux sans erreur visible.

Rapprochement Shopify du 21/09 (API Admin via `.env.local` de la marque, vérifiée) : **Meta n'attribue que 58 % des commandes réelles** (7 sur 12). Sur 15→20/09 : 259,35 € dépensés, 685,05 € encaissés, **+156,53 € de marge après publicité**, CPA réel 23,58 € contre un seuil à 37,81 €. Coût produit VitalDésir confirmé par JM : **6,10 € le sachet rendu**, alors que Shopify porte **12,96 €** — saisie doublée, qui fausse aussi les rapports de bénéfice de JM.

Dossier livré : `~/Desktop/02-SHILAMAYA/meta-ads/` (rapport .docx, fiche marque, journal, données brutes, paquet du skill).

**How to apply:** avant toute analyse Meta Ads, lire `references/plugkit-inventory.md` du skill. Bloquants restants côté JM : coûts variables SHILAMAYA et enveloppe maximale autorisée. Voir [[reference-shilamaya-vitaldesir]] et [[feedback-warn-before-sensitive-actions]].
