// ============================================================================
// BANQUE DE RECETTES — NutriByMeli
// Grammages/macros = base « portion normale » — À VALIDER PAR MÉLISSA (D.E.).
// Prix €/kg = estimation ANTILLES (base métropole × ~1,35), à recaler sur les
// tickets de courses réels. Le calcul de coût/marge en dépend directement.
// ============================================================================

export interface Ingredient {
  nom: string;
  g: number; // grammes par portion de base
  prixKg: number; // €/kg estimé Antilles (bio pour fruits/légumes)
}

export interface Recette {
  id: string;
  nom: string;
  composition: string;
  tags: string[]; // ex. "sans_gluten", "vege", "poisson", "viande", "super_proteine"
  proteines: number; // g / portion base
  kcal: number; // kcal / portion base
  poids: number; // g / portion base (l'assiette)
  epices: "doux" | "releve" | "les_deux";
  ingredients: Ingredient[];
}

export const RECETTES: Recette[] = [
  {
    id: "steaks-sardines",
    nom: "Steaks de sardines, légumes wok, sauce blanche",
    composition: "Sardines, œufs, avoine — légumes sautés au wok, sauce blanche allégée.",
    tags: ["poisson", "signature", "omega3"],
    proteines: 34, kcal: 560, poids: 460, epices: "les_deux",
    ingredients: [
      { nom: "Sardines (boîtes)", g: 120, prixKg: 9 },
      { nom: "Œufs", g: 60, prixKg: 8 },
      { nom: "Flocons d'avoine", g: 30, prixKg: 4.5 },
      { nom: "Légumes wok (bio)", g: 180, prixKg: 6.5 },
      { nom: "Fromage blanc (sauce)", g: 60, prixKg: 4.5 },
      { nom: "Oignon, ail, épices", g: 20, prixKg: 5 },
    ],
  },
  {
    id: "patate-douce-farcie",
    nom: "Patate douce farcie, sauce fromage blanc à l'ail",
    composition: "Patate douce rôtie, viande hachée 5 %, sauce yaourt grec / ail / herbes.",
    tags: ["viande", "signature", "sans_gluten"],
    proteines: 36, kcal: 590, poids: 480, epices: "les_deux",
    ingredients: [
      { nom: "Patate douce (bio)", g: 220, prixKg: 5 },
      { nom: "Viande hachée 5 %", g: 130, prixKg: 15 },
      { nom: "Yaourt grec / skyr", g: 70, prixKg: 6 },
      { nom: "Ail, herbes fraîches (bio)", g: 15, prixKg: 12 },
      { nom: "Salade verte (bio)", g: 45, prixKg: 7 },
    ],
  },
  {
    id: "saumon-miso",
    nom: "Saumon laqué miso-érable, riz noir, brocolis sésame",
    composition: "Pavé de saumon laqué, riz noir, brocolis rôtis au sésame.",
    tags: ["poisson", "sans_gluten", "omega3"],
    proteines: 38, kcal: 620, poids: 470, epices: "doux",
    ingredients: [
      { nom: "Pavé de saumon", g: 140, prixKg: 26 },
      { nom: "Riz noir", g: 70, prixKg: 7 },
      { nom: "Brocolis (bio)", g: 160, prixKg: 7 },
      { nom: "Miso, érable, sésame", g: 25, prixKg: 18 },
    ],
  },
  {
    id: "poulet-curcuma",
    nom: "Poulet curcuma & citron confit, boulgour grenade, houmous betterave",
    composition: "Haut de cuisse mariné, boulgour aux herbes, grenade, houmous de betterave.",
    tags: ["viande", "super_proteine", "signature"],
    proteines: 42, kcal: 590, poids: 480, epices: "les_deux",
    ingredients: [
      { nom: "Poulet (haut de cuisse)", g: 160, prixKg: 12 },
      { nom: "Boulgour", g: 70, prixKg: 4.5 },
      { nom: "Betterave + pois chiches (houmous)", g: 90, prixKg: 6 },
      { nom: "Grenade, herbes (bio)", g: 40, prixKg: 10 },
      { nom: "Yaourt, curcuma, citron confit", g: 45, prixKg: 9 },
    ],
  },
  {
    id: "dahl-corail",
    nom: "Dahl de lentilles corail coco-curcuma, riz basmati",
    composition: "Lentilles corail au lait de coco, riz basmati, épinards, oignons frits maison.",
    tags: ["vege", "sans_gluten", "fibres"],
    proteines: 24, kcal: 540, poids: 460, epices: "les_deux",
    ingredients: [
      { nom: "Lentilles corail", g: 80, prixKg: 5.5 },
      { nom: "Riz basmati", g: 70, prixKg: 4.5 },
      { nom: "Lait de coco", g: 80, prixKg: 6 },
      { nom: "Épinards (bio)", g: 120, prixKg: 8 },
      { nom: "Oignons, épices", g: 40, prixKg: 5 },
    ],
  },
  {
    id: "poke-bowl",
    nom: "Bowl poké revisité (thon), riz vinaigré, avocat, edamame",
    composition: "Thon, riz vinaigré léger, avocat, edamame, radis, sauce tahin-citron.",
    tags: ["poisson", "sans_gluten", "froid"],
    proteines: 34, kcal: 580, poids: 470, epices: "doux",
    ingredients: [
      { nom: "Thon (frais ou naturel)", g: 120, prixKg: 20 },
      { nom: "Riz", g: 75, prixKg: 4.5 },
      { nom: "Avocat (bio)", g: 70, prixKg: 9 },
      { nom: "Edamame, radis, concombre (bio)", g: 130, prixKg: 8 },
      { nom: "Tahin, citron, sésame", g: 25, prixKg: 16 },
    ],
  },
  {
    id: "kefta-boeuf",
    nom: "Boulettes kefta bœuf-menthe, boulgour, tzatziki allégé",
    composition: "Boulettes de bœuf maigre à la menthe (air fryer), boulgour, tzatziki, tomates confites.",
    tags: ["viande", "super_proteine"],
    proteines: 40, kcal: 600, poids: 470, epices: "releve",
    ingredients: [
      { nom: "Bœuf haché 5 %", g: 140, prixKg: 16 },
      { nom: "Boulgour", g: 70, prixKg: 4.5 },
      { nom: "Concombre + yaourt (tzatziki)", g: 100, prixKg: 5.5 },
      { nom: "Tomates confites, menthe (bio)", g: 45, prixKg: 11 },
    ],
  },
  {
    id: "colombo-poisson",
    nom: "Colombo de poisson coco léger, riz rouge, légumes péyi",
    composition: "Poisson blanc au colombo et lait de coco léger, riz rouge, légumes péyi rôtis.",
    tags: ["poisson", "sans_gluten", "creole"],
    proteines: 33, kcal: 560, poids: 480, epices: "releve",
    ingredients: [
      { nom: "Poisson blanc (vivaneau…)", g: 150, prixKg: 18 },
      { nom: "Riz rouge", g: 70, prixKg: 6 },
      { nom: "Légumes péyi (christophine…) (bio)", g: 170, prixKg: 6.5 },
      { nom: "Lait de coco, colombo", g: 60, prixKg: 7 },
    ],
  },
  {
    id: "buddha-falafels",
    nom: "Buddha bowl falafels au four, taboulé de quinoa, sauce tahin",
    composition: "Falafels au four, houmous, taboulé de quinoa, légumes rôtis, sauce tahin.",
    tags: ["vege", "fibres"],
    proteines: 26, kcal: 570, poids: 480, epices: "doux",
    ingredients: [
      { nom: "Pois chiches (falafels + houmous)", g: 130, prixKg: 5 },
      { nom: "Quinoa", g: 65, prixKg: 8 },
      { nom: "Légumes rôtis (bio)", g: 160, prixKg: 6.5 },
      { nom: "Tahin, citron, herbes", g: 30, prixKg: 16 },
    ],
  },
  {
    id: "quiche-allegee",
    nom: "Quiche allégée & salade croquante",
    composition: "Quiche légère (fromage blanc), légumes du moment, salade et vinaigrette allégée.",
    tags: ["signature", "vegetarien_oeuf"],
    proteines: 28, kcal: 550, poids: 450, epices: "doux",
    ingredients: [
      { nom: "Œufs", g: 110, prixKg: 8 },
      { nom: "Pâte complète (ou base avoine)", g: 70, prixKg: 6 },
      { nom: "Fromage blanc + lait", g: 90, prixKg: 4.5 },
      { nom: "Légumes du moment (bio)", g: 150, prixKg: 6.5 },
      { nom: "Salade + vinaigrette", g: 60, prixKg: 7 },
    ],
  },
  {
    id: "salade-quinoa-poulet",
    nom: "Salade de quinoa, poulet, crudités, vinaigrette citron",
    composition: "Quinoa, émincé de poulet, crudités croquantes, vinaigrette allégée au citron.",
    tags: ["viande", "sans_gluten", "froid"],
    proteines: 35, kcal: 540, poids: 460, epices: "doux",
    ingredients: [
      { nom: "Filet de poulet", g: 130, prixKg: 13 },
      { nom: "Quinoa", g: 70, prixKg: 8 },
      { nom: "Crudités (bio)", g: 170, prixKg: 6.5 },
      { nom: "Citron, huile d'olive, herbes", g: 25, prixKg: 12 },
    ],
  },
  {
    id: "wok-crevettes",
    nom: "Wok de crevettes ail-piment doux, nouilles de riz, légumes croquants",
    composition: "Crevettes sautées, nouilles de riz, légumes croquants, sauce soja-sésame.",
    tags: ["poisson", "sans_gluten"],
    proteines: 32, kcal: 550, poids: 470, epices: "releve",
    ingredients: [
      { nom: "Crevettes", g: 130, prixKg: 22 },
      { nom: "Nouilles de riz", g: 70, prixKg: 5.5 },
      { nom: "Légumes croquants (bio)", g: 170, prixKg: 6.5 },
      { nom: "Soja, sésame, ail", g: 25, prixKg: 12 },
    ],
  },
];

/** Marge de sécurité sur le coût matière (pertes, huiles, condiments, consommables). */
export const COEF_PERTES = 1.12;

/** Coût matière d'une portion (facteur d'échelle appliqué), en euros. */
export function coutMatiere(r: Recette, facteur = 1): number {
  const brut = r.ingredients.reduce((s, i) => s + (i.g * facteur * i.prixKg) / 1000, 0);
  return Math.round(brut * COEF_PERTES * 100) / 100;
}
