---
name: feedback-mails-melimo-depuis-boite-pro
description: "RÈGLE JM 01/09/2026 : Claude n'ENVOIE jamais un mail. Tout mail est déposé en BROUILLON dans la bonne boîte et JM valide/envoie lui-même. Mails MELIMO (support INTIA/INFast, fournisseurs, comptable, clients) = boîte pro melimo.contact@gmail.com, jamais jeanmo.bichara@gmail.com. Jeton MELIMO repassé en 'modify' le 01/09/2026 : brouillons possibles par l'API Gmail"
metadata:
  node_type: memory
  type: feedback
  modified: 2026-09-01
---

**Deux règles (JM, 01/09/2026) :**
1. **Claude n'envoie JAMAIS un mail.** Tout mail est enregistré en **brouillon** dans la boîte concernée ; JM relit, valide et envoie lui-même. Aucune exception, même sur « écris tout de suite au support ».
2. **Un mail professionnel MELIMO est rédigé dans la boîte pro `melimo.contact@gmail.com`**, jamais dans l'adresse perso `jeanmo.bichara@gmail.com`. Vaut pour le support INTIA/INFast, les fournisseurs, le comptable Antilles Experts, les clients B2B (ACD…).

**Why :** le 01/09/2026, la demande au support INTIA (suppression de 3 paiements INFast) a été **envoyée** directement, et **depuis la boîte perso** (seul jeton avec droit d'envoi). JM : « la prochaine fois, le mail doit être envoyé depuis mon adresse pro MELIMO.contact… c'est la dernière fois que tu fais ça » puis « les mails doivent toujours être enregistrés en brouillon, et moi, je valide derrière ».

**How to apply :**
- Brouillon = `drafts.create` par l'API Gmail avec le jeton de la boîte concernée (PILOTAGE `~/CLAUDE Code/dashboard/.env.local`). Le connecteur Gmail claude.ai n'a pas les droits : ne pas compter dessus.
- **Fait le 01/09/2026** : la boîte MELIMO a été ré-autorisée par JM en `modify` (`GMAIL_MELIMO_SCOPE=modify`, jeton vérifié : melimo.contact@gmail.com, scopes gmail.modify + settings.basic). Les brouillons se créent par l'API Gmail (`users/me/drafts`, jeton `GMAIL_MELIMO_REFRESH_TOKEN` lu dans `~/CLAUDE Code/dashboard/.env.local`). Si un jour le jeton retombe en lecture seule : `node "…/dashboard/refresh/gmail-auth.js" --compte melimo --scope modify` (JM clique, compte melimo.contact), et en attendant **rédiger le texte dans la réponse**, jamais basculer sur une autre boîte.
- Les boîtes marques (contact@shilamaya.fr, hello@hairmelly.fr) sont déjà en `modify` : brouillons possibles, envoi interdit.
- Reply-To / suivi d'un sujet MELIMO : toujours melimo.contact@gmail.com.

Lié à [[project_pilotage_boites_mail]], [[feedback_infast_interdiction_ecriture]], [[feedback_warn_before_sensitive_actions]].
- **Signature du compte melimo.contact posée le 01/09/2026** (sendAs.patch) : photo ronde JM (https://lawby.fr/brand/jm-avatar.png), « Jean-Maurice BICHARA-JABOUR — Co-gérant · MELIMO SARL », 06 90 71 60 45, melimo.contact@gmail.com. Source HTML : `~/CLAUDE Code/dashboard/agents/sav/signature-melimo-jm.html`. ⚠️ Gmail ne l'ajoute PAS aux brouillons créés par l'API : **tout brouillon API doit être en HTML (multipart/alternative) et embarquer la signature HTML dans le corps**. Un brouillon en text/plain seul ouvre en « mode texte brut » et le crayon y colle une signature sans photo (incident 01/09).
- **Deux signatures Gmail sur melimo.contact (01/09/2026)** : « Jean-Mo » (par défaut, nouveaux mails et réponses) et « Mélissa » (Mélissa POMMEZ, co-gérante, 07 86 97 47 27, photo hébergée sur le CDN Shopify SHILAMAYA `assets/sig-melissa-rond-2.png`, thème non publié 199962689870). Choix avant envoi : crayon « Insérer une signature » dans la fenêtre de rédaction. Créée via l'extension Chrome (Trusted Types : `trustedTypes.createPolicy` + `execCommand('insertHTML')` fonctionne dans l'éditeur de signature). Sources HTML : `dashboard/agents/sav/signature-melimo-jm.html` et `signature-melimo-melissa.html`.
