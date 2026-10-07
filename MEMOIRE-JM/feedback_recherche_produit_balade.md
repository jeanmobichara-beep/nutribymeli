---
name: feedback_recherche_produit_balade
description: "Recherche produit : se balader sur TrendTrack sans filtre AVANT de filtrer ; toute boutique croisée doit être évaluée, jamais servir seulement d'argument ; démonter le modèle en deux tas"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 241842fd-1355-4a93-a0df-f0c1989e5bbc
  modified: 2026-07-30T00:43:37.171Z
---

Retour cinglant de JM le 2026-07-29 sur la 1re chasse de [[project_chasse_produit_2026-07-29]] — noté **9/20**. Trois corrections, toutes intégrées au skill `winning-product-finder`.

**1. Se balader avant de filtrer.** JM : « Faut arrêter de mettre des filtres ultra poussés. Tu fais une recherche classique, tu te balades sur l'interface, tu scrolles et tu trouves des trucs intéressants. » Il a trouvé en **2 minutes** ce que la chasse filtrée avait manqué. → mode **R0 BALADE** ajouté en tête du moteur 1 : `search_shops` / `search_ads` sans aucun seuil, tri simple (`monthlyVisits`, `growth30d`, `mostDuplicates`, `newAds`), on lit et on note avant de former une hypothèse.

**Why :** un filtre de précision ne peut structurellement rendre que ce qu'on lui a demandé. Il ne surprend jamais. La sérendipité est un mode de découverte, pas un défaut de rigueur.

**2. Toute boutique croisée est une candidate.** La boutique que JM a envoyée (Resilia, `2448e346-411d-4bfa-8dc0-e88508ac1a95`, 4,4 M visites/mois) **était déjà dans les résultats** de `find_similar_shops` — elle a servi d'argument pour écarter le soursop, sans jamais être évaluée pour elle-même. → règle de triage non négociable : interdit d'utiliser une boutique uniquement comme pièce à conviction. Elle est analysée d'abord, versée aux écartés ensuite.

**3. Démonter le modèle en deux tas.** Dire « c'est de l'affiliation de masse » et passer à la suite fait perdre l'enseignement principal. Pour toute boutique à forte traction, séparer **ce qui est reproductible légalement** (prix, structure de gamme, mécanisme de copy, simplicité de sourcing, rythme email, offre) de **ce qui est à jeter** (faux experts type « Nutritionist - X, PhD », advertorials alarmistes, allégations détox/parasites, ciblage de complaisance, réseaux d'annonceurs écrans).

Signaux « opération, pas marque » : `linkedAdvertisersCount` > 20, copy identique chez plusieurs annonceurs, `reach30d` à 0 malgré des centaines d'ads actives, duplicatas massifs à reach individuel faible, pays d'audience déclaré incohérent avec le trafic réel (Resilia déclare IE, vend à 86,9 % aux US).

**4. Format livrable : PDF mis en forme, pas .docx.** Un `.docx` pandoc sans feuille de style est jugé illisible. Nuance à [[feedback_format_docs]] : le .docx reste la règle pour les actes et courriers, le **PDF mis en forme** pour les rapports d'analyse.

Voir [[feedback_critical_partner]], [[tool_trendtrack]], [[tool_skills_custom_ecom]].
