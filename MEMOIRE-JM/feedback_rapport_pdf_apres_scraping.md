---
name: feedback_rapport_pdf_apres_scraping
description: RÈGLE JM 09/09/2026 — tout scraping/prospection se termine par un rapport PDF listant les prospects AVEC leurs adresses
metadata:
  type: feedback
---

Après toute opération de scraping ou de prospection, sortir **systématiquement un rapport PDF** listant les prospects **avec leurs adresses**, en plus des fichiers de travail (Excel, JSON).

**Pourquoi :** JM veut « une vraie visibilité » — il lit et annote sur un document, pas dans un tableur ni dans le chat. Le PDF est le format qu'il ouvre pour décider et pour emporter en rendez-vous.

**Comment l'appliquer :** générer le `.docx` avec `python-docx` (A4 **paysage**, tableaux à en-tête répété via `w:tblHeader`, police 8-9 pt), puis convertir avec `soffice --headless --convert-to pdf`. Découper en sections utiles (ex. « sans site web » séparé de « avec email valide ») plutôt qu'une liste unique. Cohérent avec [[feedback_toujours_pdf_avec_docx]] et [[feedback_format_docs]].

Le tableur reste utile pour trier et filtrer — il ne remplace pas le PDF, il l'accompagne. Voir [[tool_chaine_prospection_leads]].
