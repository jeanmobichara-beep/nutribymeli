---
name: project-ugc-pipeline-vitaldesir
description: "Pipeline UGC Higgsfield (skill ugc-ecom-video étendu) — état, gates restants, produit pilote VitalDésir (marque SHILAMAYA)"
metadata: 
  node_type: memory
  type: project
  originSessionId: da558702-680b-40c5-bbc8-e02ca9e8c64f
---

Pipeline « usine à clips UGC » construit le 2026-07-10 dans `~/.claude/skills/ugc-ecom-video/`
(spec `docs/2026-07-10-pipeline-higgsfield-design.md`, plan `docs/plans/2026-07-10-pipeline-higgsfield.md`).
5 phases / 3 gates : setup marque (brand-loader, dossier localisé PAR NOM — jamais exiger `.ecom`) →
script → clip test (GATE BUDGET : 1 seul clip, JM valide avant tout batch) → plans restants
(routing modèle PLAN PAR PLAN : veo3_1 talking / seedance_2_0 b-roll / kling3_0 / cinematic_studio_3_0
hero — verdicts JM accumulés dans references/routing-verdicts.md) → sortie clips + SRT
(scripts/srt_builder.py, 9 tests unittest OK) + montage.md ; montage manuel CapCut par JM+Mélissa (v1).
Higgsfield ONLY (D1) : Veo 3/3.1/3.1-lite CONFIRMÉS au catalogue MCP. D2 RÉVISÉE 2026-07-10 :
voix intégrée = Veo natif (UNIQUEMENT variant preview + quality high/ultra — fast/basic rejeté
au duel v1 : visage+lip-sync+voix+rendu tous en défaut) ; voix séparée = ELEVENLABS préféré
(« 11labs c'est beaucoup mieux » — via variant elevenlabs de text2speech_v2 Higgsfield, ou
compte 11labs externe selon les cas) ; minimax « Maya » jugée plate. get_cost avec count>1 =
coût PAR job (piège vérifié : 4 annoncé → 16 débité pour count=4). Identité acteur =
portrait figé → Element (Seedance/Kling) ou start_image (Veo) ; cause historique du rendu
« pas naturel » = 0 Element/0 Soul sur le compte (constaté 2026-07-10, plan max, ~1 811 crédits).
Marque pilote VitalDésir : brief + elements.json dans
`…/02-SHILAMAYA/VITALDÉSIR/06 - Références Higgsfield/` ; ses 3 docx (CASTING 16 acteurs,
PROMPTS V4 blocs A-E + scripts C1-C7, GUIDE VIDÉOS V1-V9) = source de vérité, jamais réinventer.
AUCUN portrait casting solo n'existe encore (constat 10/07) ; chemin recommandé = générer les
portraits depuis les blocs CASTING (KARINE prioritaire = V1 miroir), ranger dans
`05 - Vidéos/Acteurs UGC/[Prénom]/`. Downloads : motif `hf_*` introuvable — demander à JM.
OUVERT : gate avatar Phase 0 → création Elements → clip test duel veo3_1 vs seedance_2_0+voix ;
briques suivantes = statiques Higgsfield (réutilise brand-loader, gpt_image_2/nano_banana_2)
puis community manager Instagram (`08 - Stratégie de lancement`).
Lié : [[ecom-brands-verticales]], [[feedback-no-founder-face-content]], [[project-ecom-objectif-2026]].
