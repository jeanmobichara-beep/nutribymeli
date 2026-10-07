---
name: design-recipe-sites-premium
description: "Recette validée par JM (7/10 « vraiment top ») pour produire des pages web au rendu premium US — à réutiliser sur TOUS ses sites, y compris les shops ecom"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 62372205-d8bf-4986-8a76-b2931d765d21
---

**Le fait** : la maquette NutriByMeli du 30/07/2026 (« précision tropicale ») a décroché un 7/10 et un « c'est vraiment top, la charte graphique et les couleurs » — alors que mes pages Shopify habituelles « n'ont pas le même rendu ». JM demande explicitement d'enregistrer la méthode pour la réappliquer à son e-commerce.

**Why** : la différence de rendu ne vient pas du talent du jour mais du process. Quand je saute les étapes (pas de skill design, pas de direction artistique, pas de vérif screenshot), je produis du générique.

**How to apply** — la recette, dans l'ordre, pour toute page/landing/section de site (Shopify inclus) :
1. **Charger le skill `artifact-design` AVANT d'écrire la moindre ligne** (ou son équivalent d'exigence si hors artifact) — c'est lui qui force les étapes suivantes.
2. **Écrire un plan design en tokens AVANT le code** : 4-6 couleurs nommées (hex), 2-3 rôles typo, un concept de layout en 2 phrases. Le code dérive du plan, jamais l'inverse.
3. **Interdire les looks « défaut IA »** : crème #F4F1EA + serif + terracotta ; near-black + un seul accent acide ; dégradé violet-bleu ; Inter/Space Grotesk par réflexe ; emojis en puces ; tout centré ; rounded-lg partout. Si la direction n'est pas imposée par le client, en choisir une SPÉCIFIQUE au sujet.
4. **Tirer le style du MÉTIER du sujet** (le truc qui a fait mouche) : pour une diététicienne → données nutritionnelles en typo mono façon étiquette (34 g · 520 kcal). Chaque marque a son équivalent — trouver le sien.
5. **Système de tokens CSS** (`:root` + variables), thème clair ET sombre via tokens, mobile-first, `gap` plutôt que margins, `tabular-nums` sur les chiffres.
6. **Vraies images intégrées** (base64/assets réels, allégés via sips ~<500 Ko), jamais de placeholder gris.
7. **Copy = matériau de design** : bénéfices concrets chiffrés (« ~3 h gagnées »), voix active, vocabulaire du client (cf. skills copywriting ecom).
8. **Micro-animations sobres** : reveal au scroll via IntersectionObserver + `prefers-reduced-motion` respecté. Un seul geste fort, pas dix.
9. **VÉRIFIER par screenshots desktop + mobile (Chrome headless) AVANT de montrer** — et corriger ce qu'on voit. Jamais livrer sans avoir regardé le rendu.

**Palette NutriByMeli validée** (réutilisable sur ce projet) : fond #FBFCF9 · surface #EEF3E8 · encre #14201A · brand #2A5A3A · accent lime #C4F135 · mono pour toutes les données chiffrées. Maquette : https://claude.ai/code/artifact/3f2fa32c-8153-4913-8b7f-77f06c0b972e (source `/tmp/nutri_mockup/gen.js`, régénérable).

Corrections demandées par JM sur v1 (à ne pas reproduire) : hero mobile = l'image doit se voir DÈS l'arrivée (banner), pas après scroll ; logo header jamais minuscule ; footer avec le vrai logo. Voir [[Projet NutriByMeli]].

**Gotchas de portage (appris sur NutriByMeli, valables partout)** :
- Dans un projet Tailwind, JAMAIS de classe custom homonyme d'un utilitaire (`invert`, `container`, `hidden`, `truncate`, `collapse`…) — Tailwind v4 scanne le JSX et génère l'utilitaire → styles fantômes en prod (bug réel : section entière couleur-inversée).
- Vérifier la page ENTIÈRE en capture avant de livrer, pas seulement le haut (le bug était en bas de page, c'est le client qui l'a vu).
- Chrome headless a une largeur minimale de 500 px : capturer « mobile » à 500, jamais 430 (sinon fausse impression de débordement).
- Fonts : définir la police de marque sur `body` dans le CSS global — sinon les composants hors page d'accueil (bannières, forms) retombent sur la police système et trahissent l'harmonie.


## 🔴 RÉCIDIVE DU 27/08/2026 — cette recette a été violée une 2ᵉ fois, le travail a été JETÉ
Sur le portage Shopify HAIRMELLY, j'ai modifié le skin du thème brouillon (radius, ombres, dégradé, pinceau doré, magenta) **sans charger le moindre skill design et sans faire valider de plan**, puis j'ai montré à JM un état intermédiaire (skin corrigé, mais structure/visuels/copy v7 pas encore portés).
Réaction JM : « je pète les plombs, c'est de la grosse merde… arrête ». Annulation complète exigée. Le travail était techniquement juste et vérifié — **il a quand même été intégralement annulé, parce que la méthode était mauvaise.**

**Trois règles durcies :**
1. Dès qu'une tâche touche à l'**apparence**, la première action est `Skill` (`web-design-pro`, `ui-ux-pro-max`, `frontend-design`, `design-review`), **jamais** `Edit`/`write`. L'étape 1 ci-dessus n'est pas optionnelle et ne vaut pas que pour les artifacts : elle vaut aussi pour un thème Shopify.
2. **Ne jamais montrer un état intermédiaire de rendu.** JM juge ce qu'il voit comme un livrable, et il a raison. Tant que structure + visuels + copy ne sont pas portés, on ne montre rien.
3. Quand JM dit « **arrête** » : arrêter immédiatement, restaurer, **vérifier** la restauration, rendre compte — sans plaider le travail accompli.

Ne pas non plus ouvrir de fenêtres/onglets Chrome en rafale pendant le travail (déjà relevé au Loom 3 du 26/08 : fermer les onglets de QA).

Voir [[project_hairmelly_site_v2]], [[feedback_critical_partner]], [[feedback_verifier_avant_affirmer_ui]].
