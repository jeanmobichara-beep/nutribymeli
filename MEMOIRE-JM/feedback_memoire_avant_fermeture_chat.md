---
name: feedback-memoire-avant-fermeture-chat
description: "RÈGLE JM (10/08/2026) : avant qu'un chat se termine, la mémoire DOIT être à jour. Un chat fermé emporte tout ce qui n'a pas été écrit. Réflexe à avoir sans qu'il le demande."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d85b97ff-ef20-4939-bf9a-2492895de218
  modified: 2026-08-10T23:33:10.698Z
---

**Ses mots, 10/08/2026** : *« si on ferme un chat où il n'a pas bien enregistré en mémoire et
qu'on reprend dans un nouveau chat, ça veut dire qu'il aura oublié certaines choses. Il faut
toujours qu'il ait ce réflexe. Je pense que c'est une règle que tu as dû graver : une fois qu'on
va fermer un chat, la mémoire doit être à jour. »*

**Why** : JM travaille sur des fils très longs — 805 k, 716 k, 646 k tokens mesurés le même jour.
Un fil de cette taille contient des décisions, des chiffres et des arbitrages **qui n'existent
nulle part ailleurs**. Le fermer sans les avoir écrits, c'est les perdre pour de bon, et le
nouveau chat repart en ayant oublié. C'est exactement ce qui lui a fait dire, sur d'autres
sujets, qu'il devait « corriger sans cesse » — le contraire du deuxième cerveau qu'il veut.

**How to apply** :
- **Ne pas attendre qu'il le demande.** Dès qu'un fil approche de sa fin (livrable posé, sujet
  soldé, ou lui qui dit « on reprendra », « je ferme », « nouveau chat »), écrire la mémoire
  AVANT de conclure — et le dire dans la réponse, pour qu'il sache que c'est fait.
- **Toujours quand un chat devient lourd.** Le dashboard le signale désormais tout seul
  (`veilleur/hygiene.js`, seuil 500 k tokens) ; le signal vaut aussi pour moi.
- **Ce qui se grave** : les décisions, les mesures réelles, les règles qu'il pose, les causes
  racines trouvées, ce qui reste ouvert. Jamais ce que le code ou git raconte déjà.
- **Mettre à jour le fichier existant** plutôt qu'en créer un de plus, et actualiser le pointeur
  dans `MEMORY.md`.

**Outil qui l'assiste** : bouton « 📄 Préparer la reprise » sur chaque chat lourd du dashboard
(`/api/hygiene/reprise`) → écrit `~/CLAUDE Code/dashboard/reprises/<date>-<sujet>.md` avec le
chemin du transcript, ses derniers messages **recopiés et non résumés** (un résumé serait une
occasion d'inventer), et le prompt à coller dans le nouveau chat. La fiche est un POINTEUR, pas
un substitut à la mémoire : elle ne dispense jamais de la règle ci-dessus.

Voir [[project_pilotage_prochaine_session]], [[project_pilotage_cout_credits]].
