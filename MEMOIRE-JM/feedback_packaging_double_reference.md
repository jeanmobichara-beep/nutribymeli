---
name: feedback-packaging-double-reference
description: "RECETTE VALIDÉE (JM bluffé, 13/07/2026) — packaging photoréaliste = artwork officiel + photo RÉELLE du produit passés ENSEMBLE en référence. Un seul des deux = raté."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 63a1a8a4-ab56-469f-9613-eb634a82a4af
---

**La recette du packaging vrai** : passer **DEUX références produit ensemble** dans toute
génération d'image où le packaging est visible :
1. **l'artwork officiel** → le label exact (typo, pictos, texte au caractère près) ;
2. **une photo RÉELLE du produit physique** (même iPhone) → la matière (kraft mat,
   micro-plis, chute de lumière).

Artwork seul = rendu CGI/plastique. Photo seule = label qui dérive. **Les deux = le vrai
produit.** Validé sur VitalDésir le 13/07/2026 : « ultra réaliste, c'est vraiment à ça que
mon packaging ressemble » (JM). Corollaire : **on ne nourrit pas une IA avec de l'IA** —
un acteur généré depuis un portrait IA garde une peau lisse.

**Why:** Le packaging de JM est intouchable (cf. règles ecom) et le label est la zone de
risque n°1 (piège « Goût Cacao » → « Coût Cacao »). Sans photo réelle, le rendu trahit l'IA.

**How to apply:**
- Higgsfield : créer UN Element `prop` contenant les 2 médias, puis `<<<element_id>>>` dans
  le prompt (modèles gpt_image_2 / nano_banana_2 / seedream / seedance / kling — pas Veo).
  VitalDésir : sachet `e11d4d49-4e58-4463-aa6d-393c26305cc4`, actrice KARINE
  `1e1a2f48-6dd8-49c1-8d10-3cb4739029e5`. Forcer `resolution: 2k`, `quality: high`.
- Hors Higgsfield : `~/.claude/skills/ugc-actor/scripts/gpt_image.py` (refs dans l'ordre :
  acteur, artwork, photo réelle).
- **Contrôle obligatoire** : relire le label sur un CROP ZOOMÉ. Le 13/07, 1 image sur 2
  avait une typo invisible en vignette (« alimenttare »). Une lettre fausse = image rejetée.
- Recette complète : `~/.claude/skills/ugc-actor/references/product-fidelity.md`.
  Voir aussi [[tool-ugc-factory-machine]] et [[feedback-image-pro-workflow]].
