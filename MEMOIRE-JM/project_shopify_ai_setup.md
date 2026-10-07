---
name: Setup Shopify AI Toolkit
description: Shopify AI Toolkit installé dans Claude Code — setup CLI + custom app token PAS encore fait, plan de redesign boutiques multi-marques en attente
type: project
originSessionId: 41939628-d438-4e62-a169-ac2beba81253
---
**État au 2026-04-20 :** Shopify AI Toolkit officiel (by Shopify, sorti 9 avril 2026) installé via `/plugin install shopify-plugin@shopify-ai-toolkit` (scope user). 19 skills actifs : shopify-liquid, shopify-admin, shopify-hydrogen, shopify-admin-execution, shopify-polaris-* (admin/checkout/customer-account/app-home), shopify-customer, shopify-storefront-graphql, shopify-functions, shopify-dev, shopify-onboarding-dev/merchant, shopify-pos-ui, shopify-payments-apps, shopify-partner, shopify-app-store-review, shopify-custom-data.

**Objectif :** utiliser Claude Code pour redesigner les boutiques Shopify (HAIRMELLY, SHILAMAYA) en intégrant le copywriting pro depuis les PDF dans les dossiers `.ecom`. Skill `pdf` d'Anthropic installé le même jour pour lire les PDF de copywriting.

**Why:** L'user veut industrialiser le workflow "copywriting pro + intégration thème Shopify" sans repasser par un dev ou une agence. Multi-marques donc workflow répétable.

**How to apply (étapes non-faites, à exécuter à la reprise) :**
1. **Confirmer le setup :** boutiques réellement sur Shopify ? quel thème de base ? quelle marque on attaque en premier ?
2. **Installer Shopify CLI** : `npm install -g @shopify/cli`
3. **OAuth login** : `shopify login --store=<boutique>.myshopify.com`
4. **Créer une custom app** dans Shopify Admin → Settings → Apps → Develop apps → Create an app. Scopes : `write_products`, `write_themes`, `write_content`, `read_orders`. Récupérer l'Admin API access token → `.env`.
5. **RÈGLE DE SÉCURITÉ CRITIQUE :** toujours dupliquer le thème en preview avant modif, jamais toucher au thème publié, backup (`shopify theme pull` dans dossier horodaté) avant chaque session. L'user fait du CA sur ces boutiques, une régression = perte de vente directe.

**Documentation locale :** dossier `~/Desktop/10-SHOPIFY/` créé le 2026-04-20, contient `SETUP.md` (guide complet toolkit + étapes CLI/custom app) et `PROMPT-REPRISE.md` (prompts prêts à coller). À lire en priorité à chaque reprise.

**Autres skills installés le même jour :**
- `pdf` (Anthropic, officiel) — lecture/OCR/édition PDF. Flagué Snyk High Risk (probable faux positif deps OCR : pypdf, tesseract, pillow). À surveiller.
- `docx` (Anthropic, officiel) — Word docs, utile aussi pour actes juridiques cabinet PBJ.
- `ai-pdf-builder` (pedronauck) **désinstallé** — remplacé par `pdf` officiel Anthropic (supérieur + moins risqué que Med Risk Snyk).
