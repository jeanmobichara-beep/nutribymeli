---
name: feedback-routing-modele-image
description: "RÈGLE (validée JM 16/07/2026) — routing par PLAN : GPT Image 2 = packaging/static ads (label parfait) ; Nano Banana Pro = scènes humaines (photoréalisme). Aucun modèle ne fait les deux."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 2b0e6dbe-f4e8-4575-88b5-eda069973d0e
  modified: 2026-08-25T21:54:16.400Z
---

**Le bon modèle par PLAN, jamais un modèle unique pour toute une page.** Constaté et validé
le 2026-07-16 par deux tirages comparés sur VitalDésir :

| Plan | Modèle | Pourquoi |
|---|---|---|
| **Packaging en héros, label lisible, static ads** | `gpt_image_2` (Higgsfield, 2k/high) | Étiqueté `text-rendering`/`typography` = moteur à TEXTE. Rend le label au caractère près. |
| **Mise en scène avec humains** | `nano_banana_pro` (Higgsfield, 4k) | Moteur à PHOTO : lumière, peau, regard vivant, objet réellement posé avec ombre de contact. |

**Preuve (16/07) :** GPT Image 2 → label parfait mais JM rejette les humains (« pue l'IA à des
km », yeux ratés, sachet en lévitation). Nano Banana Pro → humains crédibles + sachet enfin
posé, mais label **détruit** : « Shilirjp », « Anti-Sbees », « 150g · 30 Deces », et le piège
documenté « Goût Cacao » → « **Coût Sacao** ». Rejet immédiat (cf. [[feedback-packaging-double-reference]]).

## 🔑 LA RECETTE QUI RÈGLE LE LABEL (trouvée 16/07, vérifiée au crop — ZÉRO faute)

Nano Banana Pro SAIT écrire le label — à condition de le lui **dicter**. L'Element seul ne
suffit pas : il donne la matière, l'échelle et la brillance, mais le modèle **réinvente le
texte** s'il n'est pas écrit. Les 3 étapes, ensemble :

1. **Element avec les VRAIES photos** + description physique exacte (`vitaldesir-sachet-REEL`
   = `a5f13e8e-e1a6-4786-af4b-cab80d40009b`).
2. **Le label épelé MOT POUR MOT, LIGNE PAR LIGNE dans le prompt**, avec les accents, suivi de
   « Spell every word correctly in French with correct accents. Do not invent or garble any text. »
3. **Contrôle au crop zoomé** avant toute validation.

Résultat (`A2_LABEL-PARFAIT_dents-naturelles.png`) : SHILAMAYA · Complexe · VitalDésir ·
« Mélange en poudre 100% naturel à base de Shilajit, plantes adaptogènes et champignons
fonctionnels. » · Aphrodisiaque · Énergie · Libido · Anti-Stress · Synergie puissante |
Formule exclusive · Complément alimentaire naturel en poudre · **120g · 30 Doses** — tout juste.

Sans l'étape 2 (4 tirages ratés) : « Shilirjp », « Anti-Sbees », « Goût Cacao » → « **Coût Sacao** »,
« 150g · 20 Coses ». Le repli antérieur (flouter le sachet pour cacher la microcopie) est un
cache-misère : il n'est plus nécessaire.

**Corollaire clé :** ne JAMAIS partir d'un artwork/mockup plat comme référence de matière →
rendu « collé Photoshop ». Partir des **vraies photos** (`VITALDÉSIR/Référence pour visuels avec
packaging/`). L'ancien element `e11d4d49` décrivait le sachet comme « kraft mate » — **FAUX** :
c'est un petit doypack plat 120 g (~13 cm, tient dans une main), **mylar noir brillant**. Cette
description erronée a saboté 3 jours de génération.

**Piège de coût vérifié :** `count:4` est ignoré par l'API MCP (`used: 1`) — mais quand il passe,
le coût annoncé est PAR JOB (4 annoncé → 16 débité). Toujours préflighter avec `get_cost:true`.

## ⚠️ PIÈGE D'IDENTIFIANT (vérifié 30/07/2026 — a coûté une session entière)

La description de l'outil `show_reference_elements` affirme « `nano_banana_2` (Nano Banana Pro) ».
**C'EST FAUX.** Le catalogue réel (`models_explore action=list type=image`) donne :

| id à passer | nom réel | niveau |
|---|---|---|
| `nano_banana_pro` | **Nano Banana Pro** — « ultimate quality », taggé `text-rendering` | ✅ celui qu'il faut |
| `nano_banana_2` | Nano Banana 2 — « fast, next-gen » | milieu de gamme |
| `nano_banana_2_lite` / `nano_banana` | Lite / budget | à éviter |

Contrôle : le job remonte `display_name`. `nano_banana_pro` → job type `nano_banana_2`,
display **« Nano Banana Pro »**, 3072×5504 en 4k. Si le display dit « Nano Banana 2 » ou que le
job type est `nano_banana_flash`, **tu es sur le mauvais modèle** — vérifier à chaque batch.
JM (30/07) : « arrête d'utiliser nano banana 2, c'est nul, je suis pas à l'économie ». Toujours
`nano_banana_pro` + `resolution: 4k` pour tout ce qui est visage ou label.

**Why:** JM a perdu 3 jours de production sur le mauvais modèle parce que le repli GPT Image 2
(dû au géo-blocage Gemini depuis son IP) avait été généralisé à TOUS les plans, sans que
personne ne revérifie. Le géo-blocage ne s'applique pas via Higgsfield (appel côté serveur).

**How to apply:** avant tout batch d'images, se demander « ce plan, c'est du texte ou de la
peau ? » et router. Contrôle du label au CROP ZOOMÉ obligatoire dans les deux cas.
Voir [[reference-gemini-geo-block-guadeloupe]] et [[feedback-image-pro-workflow]].

## ⚠️ AFFINAGE (vérifié 25/08/2026, HAIRMELLY) : mains + label lisible = GPT Image 2 quand même

Quand le plan combine **mains manipulant le sachet ET label lisible** (ex. rituel « verser »,
sachet incliné), la recette « dicter le label » NE SUFFIT PLUS avec Nano Banana Pro : 2 tirages
NBP fautés le 25/08 (« Croissance » manquante, doublon « Volume », POIDS NET garbled) — y compris
en mode édition i2i « reproduis exactement + corrige le label ». **GPT Image 2 a réussi du
premier coup, mains + vernis rouge brillant compris.** Ses mains ont beaucoup progressé : ne
réserver NBP qu'aux plans où la peau/le visage domine et où le sachet est droit ou absent.
