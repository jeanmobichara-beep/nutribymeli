---
name: feedback_docx_tableaux_pagination
description: "Tableaux python-docx des courriers et actes du cabinet — largeurs sur la grille, jamais toutes les lignes « liées au suivant » (sinon blanc en bas de page)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c8efe1a6-0372-423b-8be0-46560ebcfa9e
  modified: 2026-09-16T20:16:45.747Z
---

**Règle (retour de Me BICHARA-JABOUR, 16/09/2026, lettre CNBF v2) :** un tableau ne doit jamais laisser un grand
blanc en bas d'une page en sautant tout entier à la page suivante. « C'est dommage, ça laisse une grande place
sur la première page. »

**Why :** dans `_generate_cnbf.py`, chaque ligne du tableau et la phrase d'introduction étaient « liées au
suivant » (`keep_with_next`) : le bloc entier ne pouvait pas se couper et partait en page 2. En plus, les
largeurs n'étaient posées que sur les cellules (`cell.width`), pas sur la grille (`w:gridCol`) : Word et
LibreOffice affichaient 3 colonnes égales, donc des lignes sur 2 lignes et un tableau deux fois trop haut. Le
même défaut existe probablement dans les générateurs dérivés du même gabarit (GUEDJ, ANTHOCHIA, JEREMIE, PIERRE).

**How to apply :**
- Largeurs : `for col, w in zip(tbl.columns, widths): col.width = w` EN PLUS de `cell.width`.
- `keep_with_next` seulement sur la phrase d'introduction, la ligne d'en-tête (répétée avec `w:tblHeader`) et les
  2 dernières lignes avant le total ; `cantSplit` sur chaque ligne. Le tableau peut alors se couper proprement.
- Viser des lignes sur une seule ligne : mesurer le texte (PIL + Times New Roman) avant de fixer les colonnes ;
  corps 10 accepté dans un tableau de courrier.
- Contrôler le rendu PDF (soffice + pdftoppm) avant de livrer. LibreOffice place le pied de page du gabarit PBJ
  ≈ 1,9 cm plus haut que Word : si ça tient sous LibreOffice, ça tient sous Word (Me BICHARA-JABOUR imprime
  depuis Word). Pas de Word sur le Mac : le rendu Word reste « non vérifié ».
Voir [[project_pbj_cnbf_echeancier]], [[reference_cabinet_pbj_identite_format]], [[feedback_toujours_pdf_avec_docx]].
