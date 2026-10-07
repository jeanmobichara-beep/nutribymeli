---
name: feedback_ugc_factory_higgsfield
description: "UGC Factory de Higgsfield n'est PAS pilotable par MCP + règles de production UGC apprises dans la douleur le 30/07/2026"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c5331db1-24a1-4398-9211-673929e2f7ea
  modified: 2026-07-30T03:28:57.854Z
---

**UGC Factory (et Lipsync Studio, Click to Ad, Canvas, Edit Video) ne sont PAS accessibles par le MCP Higgsfield.** `apps_search` ne retourne qu'une seule app Marketplace (« Match Cut + Tracelab »). Ces studios sont en interface web uniquement → **c'est JM qui les pilote**, Claude fournit les valeurs à recopier champ par champ (Template / Image / Action / Audio text / Audio settings / Background) puis assemble les exports.

**Why:** le 30/07/2026 JM a jugé « catastrophique » un clip UGC produit via `seedance_2_0` en MCP. Diagnostic réel : mauvais modèle (Seedance interpole début→fin, ça produit le flottement « qui pue l'IA »), et surtout mauvaise conception. UGC Factory tourne sur Veo 3 avec audio natif, expose un menu **Accent** et un menu **Language French** en dur — le contrôle que le prompt MCP ne donne pas. 58 crédits / 8 s.

**How to apply:**
- Un reel = **plusieurs plans de 8 s max** (limite Veo 3), une seule phrase par plan, assemblés ensuite. Jamais un plan unique présenté comme la vidéo.
- Structure : hook → miroir/problème → b-roll voix off → chute. Le **produit doit être VISIBLE dès le plan 1** (JM : ne pas le montrer tôt = « amateurisme pur »), mais jamais « présenté » : dans le cadre, pas dans la phrase. Nuance de canal : organique = produit présent mais discret ; payant = produit lisible tôt car on achète l'impression.
- **Un décor DIFFÉRENT par plan** (bibliothèque de 15 décors banals dans le skill). Réutiliser le même fond = le premier signe qui trahit l'IA.
- **Mots interdits car cassés par la synthèse vocale** : « rituel » (devient « ritèl » → écrire « routine »), « Brahmi », « Fenugrec », « tu mélanges » (devient « tu m'allonges » → écrire « je mélange » à la 1ʳᵉ personne). Jamais de « … » dans la ligne parlée. Nombres en lettres.
- **Pas de bokeh** : un téléphone a une grande profondeur de champ, le fond doit être légèrement encombré et NET. Forcer un flou d'arrière-plan fabrique le look IA.
- **Le réalisme va dans la PEAU, la lumière, le décor, le cadrage — JAMAIS dans les cheveux.** Sur une marque capillaire les cheveux sont la démonstration produit : ils doivent être magnifiques, définis, rebondis, brillants. Prompter « frizzy, not styled today, slightly tired, unflattering light » a produit un casting rejeté en bloc par JM le 30/07 (« vieux cheveux de merde tout sale et délaissé »). Voir [[feedback_casting_vraie_mais_jolie]].
- **Ne pas sur-corriger les dents.** Écrire « mouth open » pour obtenir des dents irrégulières donne quatre femmes qui sourient toutes dents dehors à l'identique — plus faux que le défaut d'origine. Varier les expressions sur un batch : une bouche fermée, une en plein milieu d'une phrase, une neutre, une seule qui rit.
- **Le dossier de modèles curé par JM dans l'interface Higgsfield n'est PAS lisible par MCP** : `show_medias` ne rend que les uploads, `show_generations` est une liste plate sans dossiers. C'est JM qui télécharge.
- Toujours invoquer le skill `ugc-ecom-video` (Higgsfield) ou `ugc-factory` (fal.ai au clip) AVANT d'écrire un script, et lire les docs de marque (blueprint, angles, persona) — voir [[project_hairmelly_relance]] et [[project_ugc_pipeline_vitaldesir]].
- Vérification honnête possible : transcrire l'audio du clip rendu avec whisper-cli ([[tool_transcription_audio]]) pour contrôler les mots. Claude ne peut PAS juger un accent — seul JM l'entend.
