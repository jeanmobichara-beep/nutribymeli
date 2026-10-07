---
name: feedback-shopify-cles-api-pas-mcp
description: "Shopify (SHILAMAYA, HAIRMELLY) — passer par les clés API de dashboard/.env.local, ne jamais demander à JM de reconnecter le connecteur MCP"
metadata:
  node_type: memory
  type: feedback
  originSessionId: aae83922-2628-44bf-b217-124707386181
  modified: 2026-10-05T18:22:18.240Z
---

Pour lire les boutiques Shopify de JM, utiliser directement l'API Admin avec les clés de `~/CLAUDE Code/dashboard/.env.local` (`SHOPIFY_SHILAMAYA_STORE` / `SHOPIFY_SHILAMAYA_TOKEN`, `SHOPIFY_HAIRMELLY_STORE` / `SHOPIFY_HAIRMELLY_TOKEN`), lues au moment de l'usage, jamais affichées. Ne pas demander à JM de faire `/mcp` quand le connecteur Shopify est déconnecté.

**Why:** le 05/10/2026, JM s'est agacé (« pourquoi tu veux à chaque fois te connecter via MCP alors que tu as accès à tous mes Shopify via des clés API ? ») après que je lui ai demandé de reconnecter le connecteur.

**How to apply:** connecteur Shopify en panne ou expiré → script python3 sur `https://<store>/admin/api/2026-07/graphql.json`. Depuis le 05/10/2026, le jeton SHILAMAYA a aussi les droits `merchant_managed` et `assigned` `fulfillment_orders` (lecture vérifiée, `CREATE_FULFILLMENT` proposé ; écriture pas encore exercée) : traiter une commande avec son suivi peut donc passer par l'API, plus besoin de Chrome. Élargir des droits = ajouter au tableau `SCOPES` de `dashboard/agents/ecom/autoriser.js`, ouvrir le lien, JM clique Installer, URL de retour prise par `pbpaste`, puis `--echanger` ; la valeur du jeton ne change pas. Voir aussi [[reference-coliship-etiquettes]].
