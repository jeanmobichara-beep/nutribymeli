---
name: feedback_compter_les_succes
description: Un compte rendu doit compter ses succès, jamais ses tentatives
metadata:
  type: feedback
---

RÈGLE née d'un vrai raté (2026-08-28) : le nettoyage de la boîte perso a annoncé
« **150 filtre(s) posé(s)** » alors que Google les avait **tous** refusés — la boucle comptait
les adresses traitées, pas les réponses acceptées.

**Why** : c'est la même faute que « c'est le cache » ou « fait » sans vérification — un rapport
qui compte ses intentions ment, et JM ne l'aurait découvert qu'un mois plus tard en voyant sa
boîte se remplir à nouveau.

**How to apply** : dans toute boucle qui agit sur un service externe, compter **séparément** les
succès et les échecs, afficher le motif du dernier refus, et imprimer la marche à suivre quand
l'échec est réparable. Ne jamais dériver un compte rendu de la longueur de la liste d'entrée.
Voir [[feedback_verifier_avant_affirmer_ui]], [[project_nettoyage_boite_perso]].
