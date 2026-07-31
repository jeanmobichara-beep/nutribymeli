// ============================================================================
// MOTEUR DE MENU — NutriByMeli
// Profil (questionnaire repas) → menu de la semaine proposé + coût matière/marge.
// Sélection des plats par IA (Vercel AI Gateway → Claude) avec repli
// déterministe si l'IA est indisponible : un menu sort TOUJOURS.
// Les portions/macros restent CALCULÉES par le code (pas par l'IA) et sont
// présentées à Mélissa comme une PROPOSITION à valider — jamais envoyées
// directement au client.
// ============================================================================

import { generateObject } from "ai";
import { z } from "zod";
import { RECETTES, coutMatiere, type Recette } from "./recettes";

type Answers = Record<string, string | string[]>;

export interface JourMenu {
  jour: string;
  recette: Recette;
  facteur: number; // échelle de portion (1 = portion de base)
  note?: string;
}

export interface MenuPropose {
  source: "ia" | "fallback";
  jours: JourMenu[];
  conseil?: string;
  cible: { proteines: number; kcal: number };
  cout: {
    parRepas: { jour: string; cout: number }[];
    total: number;
    moyen: number;
    prixRepas: number | null;
    margeMoyenne: number | null; // € par repas si prix défini
    margePct: number | null;
  };
}

const ORDRE_JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];

/* ----------------------- Ciblage nutritionnel ----------------------- */

function cibles(answers: Answers) {
  const poids = parseFloat(String(answers.poids || "")) || 70;
  const objectif = String(answers.objectif || "maintien");
  const activite = String(answers.activite || "moderee");
  const appetit = String(answers.appetit || "normale");

  // Protéines cibles du déjeuner (g) — heuristique D.E.-compatible, à valider par Mélissa
  let protParKg = 0.45; // part du déjeuner dans ~1,4-1,8 g/kg/j
  if (objectif === "prise_muscle") protParKg = 0.55;
  if (objectif === "perte_poids") protParKg = 0.5; // satiété
  if (activite === "sportive") protParKg += 0.05;
  const proteines = Math.round(Math.min(55, Math.max(25, poids * protParKg)));

  let kcal = 560;
  if (objectif === "perte_poids") kcal = 500;
  if (objectif === "prise_muscle") kcal = 640;
  if (appetit === "grosse") kcal += 60;
  if (appetit === "petite") kcal -= 60;

  return { proteines, kcal };
}

function facteurPortion(answers: Answers, cible: { proteines: number; kcal: number }, r: Recette) {
  // Échelle guidée par la cible protéique, bornée pour rester réaliste en cuisine
  const f = cible.proteines / r.proteines;
  return Math.round(Math.min(1.35, Math.max(0.8, f)) * 20) / 20; // pas de 0,05
}

/* ----------------------- Filtrage compatibilité ----------------------- */

function compatibles(answers: Answers): Recette[] {
  const allergies = ([] as string[]).concat((answers.allergies as string[]) || []);
  const dislikes = String(answers.aliments_detestes || "").toLowerCase();
  const proteinePref = String(answers.proteines || "peu_importe");
  const epices = String(answers.epices || "doux");

  return RECETTES.filter((r) => {
    if (allergies.includes("gluten") && !r.tags.includes("sans_gluten")) return false;
    if (allergies.includes("fruits_de_mer") && r.tags.includes("poisson")) return false;
    if (proteinePref === "vegetarien" && !(r.tags.includes("vege") || r.tags.includes("vegetarien_oeuf"))) return false;
    if (epices === "doux" && r.epices === "releve") return false;
    // aliments détestés : filtre grossier sur le nom/composition
    const txt = (r.nom + " " + r.composition).toLowerCase();
    for (const mot of dislikes.split(/[,;]+/).map((s) => s.trim()).filter((s) => s.length > 3)) {
      if (txt.includes(mot)) return false;
    }
    return true;
  });
}

/* ----------------------- Sélection IA (avec repli) ----------------------- */

const SelectionSchema = z.object({
  jours: z.array(
    z.object({
      jour: z.string(),
      recetteId: z.string(),
      note: z.string().describe("Une phrase courte : pourquoi ce plat ce jour-là pour CE profil"),
    })
  ),
  conseil: z.string().describe("Un conseil personnalisé de 1-2 phrases pour ce client, ton chaleureux de diététicienne"),
});

async function selectionIA(
  answers: Answers,
  joursDemandes: string[],
  pool: Recette[]
): Promise<{ jours: { jour: string; recetteId: string; note?: string }[]; conseil?: string } | null> {
  try {
    const { gateway } = await import("@ai-sdk/gateway");
    const profil = {
      prenom: answers.prenom, age: answers.age, sexe: answers.sexe,
      taille: answers.taille, poids: answers.poids,
      objectif: answers.objectif, activite: answers.activite, appetit: answers.appetit,
      proteines_pref: answers.proteines, densite: answers.densite, epices: answers.epices,
      allergies: answers.allergies, deteste: answers.aliments_detestes,
    };
    const { object } = await generateObject({
      model: gateway("anthropic/claude-sonnet-5"),
      schema: SelectionSchema,
      prompt: `Tu es l'assistante d'une diététicienne D.E. qui prépare des déjeuners personnalisés en Guadeloupe.
Compose le menu de la semaine pour ce client, UNIQUEMENT avec les recettes de la liste (utilise leurs id exacts).
Varie les protéines sur la semaine (jamais 2 jours de suite le même plat), respecte le profil, privilégie ce qui colle à son objectif.
IMPORTANT : dans les notes et le conseil, TUTOIE toujours le client (« tu », jamais « vous ») — ton chaleureux et direct, comme le site.

PROFIL CLIENT : ${JSON.stringify(profil)}
JOURS DEMANDÉS : ${joursDemandes.join(", ")}
RECETTES DISPONIBLES : ${JSON.stringify(pool.map((r) => ({ id: r.id, nom: r.nom, tags: r.tags, proteines: r.proteines, kcal: r.kcal })))}

Rends exactement un plat par jour demandé.`,
    });
    // valide que les ids existent
    const ids = new Set(pool.map((r) => r.id));
    const jours = object.jours.filter((j) => ids.has(j.recetteId));
    if (jours.length === 0) return null;
    return { jours, conseil: object.conseil };
  } catch (e) {
    console.error("Sélection IA indisponible, repli déterministe:", e);
    return null;
  }
}

function selectionFallback(joursDemandes: string[], pool: Recette[], answers: Answers) {
  // Rotation simple : privilégie la préférence protéine, alterne les familles
  const pref = String(answers.proteines || "peu_importe");
  const scored = [...pool].sort((a, b) => {
    const sa = (pref === "poisson" && a.tags.includes("poisson") ? -1 : 0) + (pref === "viande" && a.tags.includes("viande") ? -1 : 0);
    const sb = (pref === "poisson" && b.tags.includes("poisson") ? -1 : 0) + (pref === "viande" && b.tags.includes("viande") ? -1 : 0);
    return sa - sb;
  });
  return joursDemandes.map((jour, i) => ({ jour, recetteId: scored[i % scored.length].id }));
}

/* ----------------------- Assemblage ----------------------- */

export async function genererMenu(answers: Answers): Promise<MenuPropose> {
  const joursBruts = ([] as string[]).concat((answers.jours as string[]) || []);
  const joursDemandes = ORDRE_JOURS.filter((j) => joursBruts.includes(j));
  const jours = joursDemandes.length > 0 ? joursDemandes : ["lundi"];

  const cible = cibles(answers);
  let pool = compatibles(answers);
  if (pool.length === 0) pool = RECETTES; // jamais bloqué : Mélissa arbitrera

  const ia = await selectionIA(answers, jours, pool);
  const selection = ia?.jours?.length ? ia.jours : selectionFallback(jours, pool, answers);
  const source: "ia" | "fallback" = ia?.jours?.length ? "ia" : "fallback";

  const byId = new Map(RECETTES.map((r) => [r.id, r]));
  const menuJours: JourMenu[] = selection
    .filter((s) => byId.has(s.recetteId))
    .map((s) => {
      const r = byId.get(s.recetteId)!;
      const note = "note" in s && typeof s.note === "string" ? s.note : undefined;
      return { jour: s.jour, recette: r, facteur: facteurPortion(answers, cible, r), note };
    });

  const prixRepas = process.env.PRIX_REPAS ? parseFloat(process.env.PRIX_REPAS) : null;
  const parRepas = menuJours.map((j) => ({ jour: j.jour, cout: coutMatiere(j.recette, j.facteur) }));
  const total = Math.round(parRepas.reduce((s, x) => s + x.cout, 0) * 100) / 100;
  const moyen = parRepas.length ? Math.round((total / parRepas.length) * 100) / 100 : 0;
  const margeMoyenne = prixRepas != null ? Math.round((prixRepas - moyen) * 100) / 100 : null;
  const margePct = prixRepas != null && prixRepas > 0 ? Math.round(((prixRepas - moyen) / prixRepas) * 100) : null;

  return {
    source,
    jours: menuJours,
    conseil: ia?.conseil,
    cible,
    cout: { parRepas, total, moyen, prixRepas, margeMoyenne, margePct },
  };
}
