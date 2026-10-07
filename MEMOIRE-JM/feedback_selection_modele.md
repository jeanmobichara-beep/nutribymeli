---
name: feedback-selection-modele-auto
description: JM veut que je détecte le sujet en cours et signale/applique le modèle optimal (Haiku/Sonnet 5/Opus 4.8/Fable 5) à chaque bascule
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 362996b9-6acb-4a50-9252-afb4083500f4
---

JM (2026-07-02) veut que je prenne en charge le choix du modèle : détecter le sujet en cours et signaler/appliquer le bon modèle sans qu'il y pense.

Claude Code n'a PAS de routeur automatique (vérifié via claude-code-guide, 2026-07) : le modèle de la session principale ne change QUE via `/model` manuel. Je ne peux donc pas auto-switcher la session. Mes deux vrais leviers :
1. **Signaler la bascule** : à chaque changement de sujet, dire en une ligne quel `/model` est optimal et l'inviter à basculer si l'écart le justifie (ne PAS spammer sur chaque micro-tâche).
2. **Déléguer à un subagent** (paramètre `model`: haiku/sonnet/opus/fable) pour une sous-tâche lourde, sans toucher sa session.

Grille de correspondance (validée avec JM, 2026-07) :
- **Haiku 4.5** → trivial/rapide (reformuler, trier, petit script).
- **Sonnet 5** → défaut ecom/agentique/code courant (meilleur rapport qualité-prix).
- **Opus 4.8 (1M)** → juridique critique PBJ/LAWBY (fiabilité + contexte dossier complet).
- **Fable 5** → frontier, gros raisonnement/créatif ; gratuit sous Max jusqu'au 7 juillet 2026, ensuite crédits payants.

**Why:** JM ne veut pas gérer /model à la main ; le bon modèle par tâche préserve son allocation Max et améliore la qualité.
**How to apply:** au début d'un nouveau sujet, une phrase max sur le modèle recommandé ; déléguer en subagent quand la tâche mérite un autre modèle que la session. La gratuité API Fable 5 ne s'applique PAS à [[project_lawby_sprint2_progress]] (API payante ≠ abonnement Max). Lié à [[user_plan]].
