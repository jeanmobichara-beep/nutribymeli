---
name: feedback_toujours_pdf_avec_docx
description: "RÈGLE JM 20/08/2026 — tout livrable cabinet (acte, fiche interne) sort en .docx ET .pdf (impression/annotation papier de Me BICHARA-JABOUR)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 403a73a2-8519-45a5-8b80-61c3e070010b
  modified: 2026-08-20T17:33:40.991Z
---

Tout livrable du cabinet — acte, fiche interne, courrier — est produit en **.docx ET .pdf**,
même s'il reste des encadrés « À COMPLÉTER ».

**Why :** demande de JM le 20/08/2026 (dossier FEVRIER) : Me BICHARA-JABOUR imprime et
**surligne au stylo sur papier** ce qu'il faut corriger ; l'impression passe mieux depuis le PDF.
JM imprime aussi ses fiches internes.

**How to apply :** après chaque génération .docx, convertir :
`soffice --headless --convert-to pdf --outdir "<dossier>" "<fichier>.docx"`
(LibreOffice installé : `/opt/homebrew/bin/soffice` ; `docx2pdf` dispo aussi). Vérifier le rendu
(les encadrés jaunes et cartouches passent bien). Livrer les deux fichiers côte à côte dans le
dossier du dossier. Complète [[feedback_format_docs]] (.docx jamais .txt).
