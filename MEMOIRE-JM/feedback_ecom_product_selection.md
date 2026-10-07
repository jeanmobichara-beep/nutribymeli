---
name: Heuristique sélection produit ecom
description: Filtre personnel de l'utilisateur pour choisir un produit ecom — préférer résonance perso + utilité vécue sur tendance brute
type: feedback
originSessionId: 41939628-d438-4e62-a169-ac2beba81253
---
Pour l'utilisateur, les meilleurs produits ecom qu'il a lancés sont ceux qu'il a **découverts par hasard**, qu'il **utilise lui-même au quotidien**, et qui lui apportent une **vraie plus-value perçue** — pas ceux sortis d'une analyse pure de tendance.

**Why:** Insight validé explicitement le 2026-04-20 en construisant le skill `winning-product-finder`. Ses marques (HAIRMELLY, SHILAMAYA, HACHIJO Ashitaba, NutriByMeli) suivent toutes ce pattern — utilité vraie sur un besoin identifié par usage perso ou proche.

**How to apply:**
- Toute recherche/reco de produit ecom doit **inclure un filtre "résonance personnelle"** (est-ce qu'il l'utiliserait lui-même ? ça résout-il un vrai problème quotidien ?). Ne pas se contenter de "c'est trending".
- Dans le skill `winning-product-finder`, critère "Résonance personnelle" pondéré à 15%, seuil minimum 8/20 pour faire partie du top 10.
- En conversation libre, quand on brainstorm produits, toujours croiser : tendance + utilité + usage perso. Un produit trending "vide" (pas de vraie value) doit être challengé.
- Ne JAMAIS pousser un produit juste parce qu'il est trending si l'utilité réelle est faible — c'est explicitement contre son style.
