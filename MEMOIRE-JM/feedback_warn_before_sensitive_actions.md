---
name: toujours-pr-venir-avant-action-sensible-risqu-e-jm-tranche
description: "Règle de travail JM 2026-06-02 — même avec credentials/autonomie (Supabase PAT, déploiements, suppressions, migrations), TOUJOURS prévenir avant une action sensible ou risquée ; JM prend la décision finale"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 61d85dee-f45d-4d75-bbc8-8c706e05b1b7
---

**Règle posée par JM le 2026-06-02**, en m'accordant un Personal Access Token Supabase (pour que je fasse les opérations DB moi-même) : « même si tu fais tout, tu me préviens TOUJOURS quand il s'agit de choses sensibles ou risquées, et moi tel un président je tranche ».

**Why :** JM veut l'autonomie d'exécution (ne plus faire les manips lui-même) MAIS garder le contrôle décisionnel sur tout ce qui touche à la sécurité, aux données de production, à l'argent, ou à l'irréversible. Confiance ≠ chèque en blanc.

**How to apply :**
- Actions courantes/réversibles (lire, tester, corriger du code, déployer une amélioration vérifiée) → je fais, je rends compte.
- Actions SENSIBLES ou RISQUÉES → j'explique clairement (quoi, pourquoi, le risque), je recommande, et J'ATTENDS sa décision avant d'agir. Exemples : suppression de données/tables, migration de schéma en prod, modification de config sécurité/auth/RLS, dépense/engagement financier, envoi externe (emails, publication), tout ce qui est dur à annuler.
- Toujours présenter une reco claire (mode partenaire critique [[feedback_critical_partner]]) — il tranche.

Lié à [[feedback_critical_partner]], [[reference_lawby_infra]].
