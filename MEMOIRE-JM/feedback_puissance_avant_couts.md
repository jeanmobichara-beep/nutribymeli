---
name: puissance-avant-couts
description: "RECALIBRATION JM 20/08/2026 : la PUISSANCE prime sur l'économie de crédits. Ne plus se brider ni parsemer les réponses de précautions budgétaires — garde-fous DURS silencieux sur les pipelines, ambition maximale partout ailleurs. Abonnement Max assumé."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: cb6fbb65-445e-4f02-98cb-d4bcc0cc282b
  modified: 2026-09-10T18:56:41.154Z
---

Ses mots (20/08/2026, fermeture du chat v3) : *« je ne comprends pas pourquoi tu te
bloques à chaque fois sur tout ce qui est budget, limite de dépenses, coûts. […] tant que
c'est dans la limite du raisonnable et que ce n'est pas quelque chose qui bousille tous
mes crédits […] j'ai un abonnement max, donc franchement, je veux quelque chose de
puissant. Moi, c'est le plus important ! »*

**Why :** troisième précision de sa doctrine coûts — 04/08 (« une solution viable qui ne
me bouffe pas tout ») après le désastre 99-100 % de conso pour zéro carte ; 18/08 (la
règle ne vise QUE les pipelines automatiques, pas l'interactif) ; 20/08 : même sur les
agents, arrêter la timidité. Le vrai risque qu'il refuse = un outil FAIBLE, pas un outil
qui consomme raisonnablement.

**How to apply :**
- **Concevoir pour la puissance d'abord** : modèle/effort/portée choisis pour la QUALITÉ.
  **Routing précisé par JM (20/08) : « le meilleur, c'est Fable. Quand Fable est
  nécessaire, faut utiliser Fable et éventuellement Opus ou, des fois, Sonnet »** —
  donc Fable pour le jugement/la synthèse critiques, Opus pour la densité (le batch l'a
  prouvé : Sonnet rendait 3× moins dense), Sonnet pour le mécanique. Ne jamais dégrader
  un design pour économiser des centimes. (⚠️ `--model fable` en headless `claude -p` :
  à VÉRIFIER par une sonde avant de l'écrire dans un pipeline.)
- **Garde-fous DURS mais SILENCIEUX sur les pipelines de fond** (ce qui a évité le
  04/08) : plafonds CLI par appel, empreinte/skip les jours calmes, mesure réelle,
  journaux. Ils restent — on ne les met plus en avant, on relève leurs niveaux quand ils
  brideraient (ex. plafond veilleur 1 $/j = MA prudence, sa vraie limite dite le 10/08 =
  2-3 %/jour ≈ 3 $ — à relever à la prochaine session v4).
- **Dans les réponses** : plus de hedging budgétaire à chaque paragraphe. Le coût se
  MESURE et se dit en UNE ligne factuelle en fin de livraison (et en % de sa journée,
  jamais en dollars seuls — règle du 10/08), il ne pilote plus la conversation.
- Le signal d'alarme reste : un poste de fond qui dérive vers une part majeure de sa
  conso quotidienne SANS produire → là on agit (c'est « bousiller les crédits »).
- **Nuance du 10/09/2026 — ce qui est offert aux prospects.** Pour une fonction gratuite mise à
  disposition du public (le quiz jm OS, payé à l'appel API), JM demande l'inverse du réflexe
  « Fable d'office » : *« si tu estimes que Opus 5 peut faire largement l'affaire par rapport à
  Fable […] on passe sur Opus. Moi, j'ai pas non plus envie que ça me coûte une fortune de mettre
  ça à disposition de potentiels futurs prospects »*. → Là, on MESURE (banc côte à côte, coût réel
  par prospect) et on prend le modèle le moins cher qui tient la qualité, avec un garde-fou
  anti-abus. Résultat : Opus 5 + cache, 0,135 $/prospect. Voir [[project-vente-services-ia]].

Précise [[pilotage-cout-credits]] (qui reste la mémoire des mécanismes et de l'histoire).
Voir [[pilotage-v4-tour-controle]] : la v4 se conçoit « puissance d'abord ».
