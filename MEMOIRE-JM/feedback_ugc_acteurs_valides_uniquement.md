---
name: feedback-ugc-acteurs-valides-uniquement
description: "RÈGLE ABSOLUE (12/08/2026, colère JM) : ne JAMAIS générer un visage UGC sans partir d'un acteur que JM a personnellement validé (son dossier Higgsfield). L'Element KARINE 1e1a2f48 n'est PAS validé. Le style « fatiguée/imparfaite » est REJETÉ — c'est « vraie MAIS jolie »."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a743af58-a87a-4f20-a1d2-22dc4b59f0d7
  modified: 2026-08-13T17:20:47.512Z
---

Le 12/08/2026, j'ai généré 5 keyframes VitalDésir avec l'Element « KARINE » (`1e1a2f48…`,
créé le 13/07) + prompts « tired, fine lines, minimal makeup ». Verdict JM : « nulle à chier,
ça pue l'IA, elle ressemble à rien » — et surtout : « j'avais déjà dit d'arrêter avec ce type
d'acteurs IA qui fait trop fake ». Keyframes déplacées en `_rejets/`.

**Why :** deux règles existantes non appliquées, cumulées :
1. JM a un **dossier d'acteurs UGC qu'il a validés dans l'interface Higgsfield** (non lisible
   par MCP — cf. [[feedback_ugc_factory_higgsfield]]). C'est LA source des visages. Un Element
   qui traîne dans elements.json n'est PAS une validation.
2. [[feedback_casting_vraie_mais_jolie]] (30/07) avait déjà tué la doctrine « imparfaite/fatiguée »
   des docs de juillet. Les docs CASTING/Bloc E de juillet sont PÉRIMÉS sur ce point précis.

**How to apply :**
- AVANT toute génération avec un visage : demander à JM ses acteurs validés (il les télécharge
  depuis son dossier Higgsfield, ou pointe un dossier local). Zéro visage inventé par Claude,
  même « pour aller vite », même si un Element existe déjà.
- Créer les Elements à partir de SES fichiers, ranger dans `05 - Vidéos/Acteurs UGC/[Prénom]/`,
  noter dans elements.json avec mention « validé JM le [date] ».
- Style : belle, moderne, naturelle — le réalisme passe par lumière/décor/cadrage/peau,
  JAMAIS par l'enlaidissement.
- **QC LOGIQUE PHYSIQUE obligatoire (ajout 13/08, raté sur K3)** : dans un selfie, un bras
  tient le téléphone → la main libre ne peut tenir QU'UN SEUL objet, et RIEN ne flotte (la
  tasse de JM était en suspension dans l'air — c'est LUI qui l'a vue). Compter les bras/mains
  (2 max), vérifier chaque objet posé/tenu, AVANT le label. Dans le prompt : « one arm extended
  taking the selfie, her only other hand holds X, the mug rests on the table, exactly two arms ».
- **Recette anti-loterie label (validée 13/08, LIMITES apprises le même jour)** : quand une
  micro-mention est fautée, NE PAS relancer la loterie ni Nano Banana flash (a détruit tout le
  label) — greffe PIL depuis un rendu antérieur propre : fond reconstruit par dégradé vertical
  + texte par masque de luminance (>110, flou 0.6). **Valable UNIQUEMENT pour une petite zone
  isolée (≤ ~60 px, ex. « Goût Cacao »)** : sur une ligne entière adjacente à d'autres éléments,
  la greffe a mordu la ligne d'or voisine et embarqué des pixels parasites (doigt, 120g) → échec,
  restauration backup. Toujours faire une copie AVANT la greffe, et si les coordonnées ne sont
  pas certaines à ±3 px, ne pas tenter : présenter le défaut à JM (accepter ou re-tirage).
- Purger/mettre à jour le brand-brief VitalDésir : la section « portraits candidats » et les
  blocs CASTING de juillet ne font plus foi pour les visages.
