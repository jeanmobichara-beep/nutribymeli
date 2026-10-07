---
name: feedback_promesses_verifiables_boutique
description: "Sur une boutique, toute promesse affichée doit être adossée à un réglage réel vérifié dans l'admin — sinon la retirer"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d1ff3769-5fc4-4395-b0e6-f67f640f6eaa
  modified: 2026-08-04T21:35:27.496Z
---

Sur les boutiques de JM, ne jamais laisser s'afficher une promesse dont on n'a pas vérifié la contrepartie réelle dans l'admin : note et nombre d'avis, seuil de livraison offerte, cadeau à partir de X €, code promo, prix barré d'une offre quantité.

**Why:** audit HAIRMELLY du 2026-08-04. Le thème brouillon affichait une note « 4,8/5 » sur **zéro avis réel**, un code promo de démo « Shopiweb10 », un faux témoignage « 1 000+ clients », et un « CADEAU GRATUIT à 100 € » pointant vers un produit inexistant. Le bloc `qty_breaks` du thème affiche en plus un prix barré **sans appliquer la moindre remise**. Chacun de ces éléments est une pratique commerciale trompeuse (art. L.121-4 C. conso) et casse la confiance sur un marché-village comme les Antilles, où la cliente déçue le dit à tout le monde.

**How to apply:** avant de livrer une page, croiser chaque chiffre affiché avec l'admin — `deliveryProfiles` pour les seuils de port, les métafields de notation pour les avis, l'existence réelle du produit cadeau, et le JS du thème pour savoir si une remise annoncée est vraiment appliquée. Ce qui n'est pas adossé à du réel se retire, sauvegarde datée à l'appui. Mieux vaut afficher « Aucun avis » que d'inventer un 4,8/5. Voir [[project_hairmelly_site_v2]] et [[project_hairmelly_relance]].
