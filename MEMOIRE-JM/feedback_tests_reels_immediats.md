---
name: feedback-tests-reels-immediats
description: "RÈGLE JM 19/08/2026 : quand un changement touche un pipeline planifié (batch dominical, veilleur, intendant), le vrai test se fait IMMÉDIATEMENT en conditions réelles — jamais « en attendant dimanche » ou le prochain créneau calendaire."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: cb6fbb65-445e-4f02-98cb-d4bcc0cc282b
  modified: 2026-08-20T02:12:25.415Z
---

Ses mots (19/08/2026, fil PILOTAGE v3) : *« on ne va pas attendre dimanche à chaque fois
pour faire un vrai test. Il faut que, si des tests doivent être faits, ils soient faits
sans respecter forcément le jour du dimanche. »*

**Why :** les créneaux calendaires (batch du dimanche) retardaient la découverte des bugs
de plusieurs jours — le gel de 11 jours (6→17/08) et le lint tout-ou-rien n'ont été vus
que parce que quelqu'un a fini par regarder. Le soir même de la règle, un test réel forcé
a validé l'étanchéité ECC ET découvert+corrigé le lint tout-ou-rien ([[pilotage-v3-agents]]).

**How to apply :** après toute modification d'un pipeline planifié, déclencher un run réel
tout de suite : batch = `NO_REPRISE=1 FORCE_REFRESH=1 node refresh/run.js` (coût d'un vrai
run, ~11-14 $ équiv — assumé par JM) ; republication après correctif = reprise
`RESUME_GATED=<card-gated.json>` (0 $) ; intendant = `INTENDANT_FORCE=1 node
intendant/index.js` ; veilleur = `VEILLEUR_FORCER=1` (tour forcé). Le coût d'un test réel
est accepté ; le coût d'un bug découvert dimanche ne l'est pas. Vérifier ensuite l'ARTEFACT
(carte/rapport), jamais le seul code de sortie.
