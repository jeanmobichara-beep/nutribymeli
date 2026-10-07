---
name: feedback-infast-interdiction-ecriture
description: "RÈGLE ABSOLUE JM 01/09/2026 : plus JAMAIS d'écriture dans INFast (paiement, relance, facture, article) par Claude ni par un agent PILOTAGE ; lecture seule tolérée. Né d'un incident réel : paiements enregistrés en HT au lieu du TTC"
metadata:
  node_type: memory
  type: feedback
  modified: 2026-09-01
---

**RÈGLE ABSOLUE (JM, 01/09/2026) : Claude ne touche plus JAMAIS au compte INFast de MELIMO.**
Aucune écriture : ni encaissement (`POST /documents/{id}/payment`), ni relance (`POST /documents/{id}/messages`), ni création/suppression de facture, ni modification d'article. Ni depuis une session Claude Code, ni depuis un agent PILOTAGE (fin, bot Telegram, chat de la tour). Aucun paiement « validé » sans accord explicite, écrit, de JM, donnant le montant TTC exact et la date.
La lecture (GET) reste tolérée pour afficher l'état dans PILOTAGE et pour rapprocher avec Qonto.

**Why :** incident du 01/09/2026. Deux encaissements enregistrés par Claude/PILOTAGE avec le montant **HT** au lieu du **TTC** :
- F202608-00010 (ACD) : 1 548 € enregistrés le 25/08 (session Claude) alors que le virement Qonto du 11/08 était de **1 580,51 € TTC** → facture restée « VALIDATED », 32,51 € de TVA « impayés » fictifs.
- F202608-00009 (ACD) : 3 096 € enregistrés le 01/09 par le bot Telegram sur un « oui » ambigu de JM (« oui c'est bien ça MAIS le montant est HT ») alors que le virement du jour était de **3 161,02 € TTC**. JM a dû corriger à la main.
Cause technique : dans l'API INFast, `amount` = **HT** et `amountVat` = **TTC** (nommage trompeur). Tout le code PILOTAGE (`agents/telegram/infast.js#restantDe`, `agents/fin/collecte.js`, `lib/fin-logique.js`) lisait `amount` comme montant dû. Comptabilité faussée.

**How to apply :**
- Toute demande touchant INFast → lecture seule ; si JM demande une écriture, la refuser en rappelant cette règle et lui indiquer quoi faire dans l'interface INFast.
- Les fonctions `encaisser` / `relancer` de `agents/telegram/infast.js` sont verrouillées (01/09/2026) et l'auto-encaissement de `agents/fin/index.js` est désactivé. Ne pas les rouvrir, même sur demande orale : exiger une demande écrite explicite de JM levant cette règle.
- Rapprochement Qonto ↔ INFast : comparer le virement Qonto au **TTC** (`amountVat`), jamais à `amount`.

Lié à [[tool_infast_api_melimo]], [[project_pilotage_v7_agir_tour]], [[feedback_warn_before_sensitive_actions]], [[project_efacturation_melimo]].
