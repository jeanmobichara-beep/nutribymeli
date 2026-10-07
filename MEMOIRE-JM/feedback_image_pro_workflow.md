---
name: Workflow image-pro — assets réels + rangement par marque
description: Pour toute génération d'image liée à une marque (HAIRMELLY, SHILAMAYA, NutriByMeli, HACHIJO, SPICEX, etc.), TOUJOURS scanner d'abord ~/Desktop/[BRAND].ecom/ pour utiliser les vraies photos produit en référence Nano Banana Pro (image-to-image), et TOUJOURS ranger les visuels dans ~/Desktop/[NUMÉRO]-[BRAND]/[BRAND].ecom/Visuels generes IA/[YYYY-MM-DD]/
type: feedback
originSessionId: 74fba446-034b-4e27-a7f9-af67ab78fb80
---
Pour toute génération d'image liée à une marque e-commerce, deux règles **non négociables** :

1. **Utiliser les vrais assets** — scanner `~/Desktop/[BRAND].ecom/` AVANT d'écrire le prompt. S'il existe une photo du vrai produit, utiliser Nano Banana Pro en image-to-image avec cette photo en référence (jamais GPT Image 2 / DALL-E en text-to-image quand le produit réel existe).

2. **Ranger dans le dossier de la marque** — chemin canonique : `~/Desktop/[NUMÉRO]-[BRAND]/[BRAND].ecom/Visuels generes IA/[YYYY-MM-DD]/` (jamais `~/Desktop/Captures-écran/` quand il y a une marque identifiée).
   - Ex. HAIRMELLY → `~/Desktop/01-HAIRMELLY/HAIRMELLY.ecom/Visuels generes IA/2026-04-30/`
   - Ex. SHILAMAYA → `~/Desktop/02-SHILAMAYA/SHILAMAYA.ecom/Visuels generes IA/2026-04-30/`
   - Pour Cabinet PBJ / PM Avocat : `~/Desktop/06-Cabinet PBJ/Visuels generes IA/[date]/`

**Why:** Demandé par JM le 2026-04-30 après que j'ai généré 2 packshots HAIRMELLY en text-to-image (en imaginant une bouteille fictive) alors que c'est une pochette stand-up + rangé les fichiers dans `Captures-écran/` au lieu du dossier de la marque. Erreur logique double.

**How to apply:** Ces règles font partie du skill `image-pro` (`~/.claude/skills/image-pro/SKILL.md`) — appliquer systématiquement dès qu'une marque est citée ou identifiable dans le prompt.

**Bonus — typo packaging :** quand on régénère un packshot avec Nano Banana Pro, toujours ajouter au prompt un bloc "CRITICAL TEXT ACCURACY RULES" qui liste mot pour mot le texte du packaging avec orthographe française (ex. "Poids" avec un S, pas "Poide"). Sinon le modèle introduit des micro-typos OCR.
