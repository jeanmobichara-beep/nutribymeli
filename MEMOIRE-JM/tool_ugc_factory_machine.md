---
name: tool-ugc-factory-machine
description: "Machine à vidéos UGC sans visage (skills ugc-factory + ugc-actor, fal.ai ~1$/clip), banque d'acteurs, keyframe gate — construite et testée 2026-07-13"
metadata: 
  node_type: memory
  type: project
  originSessionId: 63a1a8a4-ab56-469f-9613-eb634a82a4af
---

Machine UGC sans visage pour les marques de JM (2026-07-13) : skill **ugc-factory**
(orchestrateur : scripts → keyframes → GATE JM → voix ElevenLabs → clips lip-sync fal.ai
OmniHuman ~1,15 $/8 s) + skill **ugc-actor** (banque d'acteurs visage verrouillé dans
`~/Desktop/04-Projets IA & Services/UGC-FACTORY/acteurs/`, keyframe gate 7 points).
Réutilise les references de [[project-ugc-pipeline-vitaldesir]] (ugc-ecom-video =
bibliothèques créatives + voie Higgsfield).

État 16/07 : **banque de 12 avatars générée** (H/F, origines variées, pas d'asiatique,
décors différents, réalisme max) dans `~/Desktop/04-Projets IA & Services/UGC-FACTORY/
acteurs/_BANQUE-CASTING-2026-07-15/` + `_PLANCHE-12-avatars.png`. Camille (#01) = Element
officiel `d56ded1e`. **À FAIRE (nouveau chat)** : JM choisit ses avatars → créer 1 Element
par avatar retenu → scripts UGC → voix → clips. Recap complet :
`.../UGC-FACTORY/RECAP - 2026-07-16 - Etat complet pour reprise.md`.
Point accent JM : voix FR métropolitaine sur visage antillais = faux → voix adaptée ou
UGC texte/sous-titres. FAL_KEY toujours à créer si on veut la voie fal.ai.

**Why:** JM veut produire ses vidéos UGC au clip (~1 $) sans tournage ni visage réel
(cf. [[feedback-no-founder-face-content]]), pour ses propres marques (pas de revente).

**How to apply:** « machine UGC » / « usine à clips » / « au clip » / fal.ai → skill
ugc-factory ; acteur/keyframe seuls → ugc-actor ; crédits Higgsfield → ugc-ecom-video.
Jamais itérer en vidéo : itérer en keyframe.
