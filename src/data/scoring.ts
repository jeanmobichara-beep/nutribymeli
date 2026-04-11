// ============================================================================
// MOTEUR DE SCORING CLINIQUE — NutriByMeli
// 6 axes cliniques pondérés + patterns croisés + drapeaux rouges
// ============================================================================

export type ClinicalAxis =
  | "digestif"
  | "energetique"
  | "inflammatoire"
  | "hormonal"
  | "nerveux"
  | "nutritionnel";

export interface AxisScore {
  axis: ClinicalAxis;
  score: number; // 0-100 (0 = optimal, 100 = très problématique)
  level: "optimal" | "attention" | "préoccupant" | "critique";
  label: string;
  description: string;
  priorities: string[];
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  conditions: PatternCondition[];
  severity: "info" | "warning" | "alert";
}

export interface PatternCondition {
  questionId: string;
  values: string[];
}

export interface RedFlag {
  id: string;
  message: string;
  conditions: PatternCondition[];
  recommendation: string;
}

export interface BilanResult {
  axes: AxisScore[];
  detectedPatterns: Pattern[];
  redFlags: RedFlag[];
  overallScore: number;
  topPriorities: string[];
  motivationLevel: number;
  readyFor90Days: string;
}

// Noms affichés des axes
export const AXIS_LABELS: Record<ClinicalAxis, string> = {
  digestif: "Digestif & Transit",
  energetique: "Énergie & Vitalité",
  inflammatoire: "Inflammation & Terrain",
  hormonal: "Hormonal & Métabolique",
  nerveux: "Nerveux & Émotionnel",
  nutritionnel: "Équilibre Nutritionnel",
};

export const AXIS_DESCRIPTIONS: Record<ClinicalAxis, string> = {
  digestif:
    "Évalue la qualité de votre digestion, votre transit et la santé de votre microbiote intestinal.",
  energetique:
    "Mesure votre niveau d'énergie globale, la qualité de votre sommeil et votre capacité de récupération.",
  inflammatoire:
    "Identifie les signes d'inflammation chronique de bas grade à travers la peau, les articulations et l'alimentation.",
  hormonal:
    "Analyse l'équilibre hormonal, le métabolisme thyroïdien et les marqueurs métaboliques.",
  nerveux:
    "Évalue votre gestion du stress, votre équilibre émotionnel et leur impact sur votre alimentation.",
  nutritionnel:
    "Mesure la qualité globale de votre alimentation, l'équilibre des macronutriments et les potentielles carences.",
};

// ============================================================================
// PONDÉRATIONS PAR QUESTION → AXES
// Chaque question contribue à un ou plusieurs axes avec un poids (0-5)
// ============================================================================

export interface QuestionWeight {
  axis: ClinicalAxis;
  weight: number; // 0-5
}

// Mapping: questionId → réponse → points par axe
// Points élevés = problématique
export const SCORING_MATRIX: Record<
  string,
  Record<string, QuestionWeight[]>
> = {
  // SECTION 1 — Contexte
  traitement_medical: {
    oui: [
      { axis: "hormonal", weight: 2 },
      { axis: "inflammatoire", weight: 1 },
    ],
    non: [],
  },

  // SECTION 2 — Objectif
  objectif: {
    perte_poids: [
      { axis: "nutritionnel", weight: 2 },
      { axis: "hormonal", weight: 1 },
    ],
    energie: [
      { axis: "energetique", weight: 3 },
      { axis: "nutritionnel", weight: 1 },
    ],
    digestion: [
      { axis: "digestif", weight: 3 },
      { axis: "inflammatoire", weight: 1 },
    ],
    hormones: [
      { axis: "hormonal", weight: 3 },
      { axis: "nerveux", weight: 1 },
    ],
    alimentation: [{ axis: "nutritionnel", weight: 2 }],
    douleurs: [
      { axis: "inflammatoire", weight: 3 },
      { axis: "nutritionnel", weight: 1 },
    ],
    sommeil: [
      { axis: "nerveux", weight: 3 },
      { axis: "energetique", weight: 2 },
    ],
    stress: [
      { axis: "nerveux", weight: 3 },
      { axis: "hormonal", weight: 1 },
    ],
  },

  // SECTION 3 — Enquête alimentaire
  petit_dejeuner: {
    jamais: [
      { axis: "nutritionnel", weight: 3 },
      { axis: "energetique", weight: 2 },
    ],
    rapide: [
      { axis: "nutritionnel", weight: 2 },
      { axis: "digestif", weight: 1 },
    ],
    sucre: [
      { axis: "nutritionnel", weight: 2 },
      { axis: "hormonal", weight: 2 },
      { axis: "inflammatoire", weight: 1 },
    ],
    sale: [],
    proteine: [],
    variable: [{ axis: "nutritionnel", weight: 1 }],
  },

  nb_repas: {
    "1": [
      { axis: "nutritionnel", weight: 4 },
      { axis: "energetique", weight: 3 },
      { axis: "hormonal", weight: 2 },
    ],
    "2": [
      { axis: "nutritionnel", weight: 2 },
      { axis: "energetique", weight: 1 },
    ],
    "3": [],
  },

  grignotage: {
    jamais: [],
    parfois: [
      { axis: "nutritionnel", weight: 1 },
      { axis: "nerveux", weight: 1 },
    ],
    souvent: [
      { axis: "nutritionnel", weight: 3 },
      { axis: "nerveux", weight: 2 },
      { axis: "hormonal", weight: 1 },
    ],
  },

  vitesse_repas: {
    "1": [
      { axis: "digestif", weight: 4 },
      { axis: "nerveux", weight: 2 },
    ],
    "2": [
      { axis: "digestif", weight: 3 },
      { axis: "nerveux", weight: 1 },
    ],
    "3": [{ axis: "digestif", weight: 1 }],
    "4": [],
    "5": [],
  },

  mastication: {
    "1": [
      { axis: "digestif", weight: 4 },
      { axis: "nutritionnel", weight: 1 },
    ],
    "2": [{ axis: "digestif", weight: 3 }],
    "3": [{ axis: "digestif", weight: 1 }],
    "4": [],
    "5": [],
  },

  envie_sucre: {
    oui: [
      { axis: "hormonal", weight: 3 },
      { axis: "nutritionnel", weight: 2 },
      { axis: "nerveux", weight: 1 },
    ],
    parfois: [
      { axis: "hormonal", weight: 1 },
      { axis: "nutritionnel", weight: 1 },
    ],
    non: [],
  },

  fatigue_post_repas: {
    oui: [
      { axis: "digestif", weight: 3 },
      { axis: "hormonal", weight: 2 },
      { axis: "energetique", weight: 2 },
    ],
    parfois: [
      { axis: "digestif", weight: 1 },
      { axis: "hormonal", weight: 1 },
    ],
    non: [],
  },

  hydratation: {
    "<1L": [
      { axis: "digestif", weight: 3 },
      { axis: "energetique", weight: 2 },
      { axis: "nutritionnel", weight: 2 },
      { axis: "inflammatoire", weight: 1 },
    ],
    "1-1.5L": [
      { axis: "digestif", weight: 1 },
      { axis: "nutritionnel", weight: 1 },
    ],
    "2L": [],
    "+2L": [],
  },

  cafe: {
    non: [],
    parfois: [],
    "1-2": [{ axis: "nerveux", weight: 1 }],
    "3-4": [
      { axis: "nerveux", weight: 2 },
      { axis: "hormonal", weight: 1 },
    ],
    "5+": [
      { axis: "nerveux", weight: 4 },
      { axis: "hormonal", weight: 2 },
      { axis: "digestif", weight: 1 },
    ],
  },

  cuisson: {
    frit: [
      { axis: "inflammatoire", weight: 3 },
      { axis: "nutritionnel", weight: 2 },
    ],
    poele: [{ axis: "inflammatoire", weight: 1 }],
    four: [],
    vapeur: [],
    cru: [],
    mix: [],
  },

  // Fréquences alimentaires (Q22 étendu)
  freq_charcuterie: {
    jamais: [],
    "1-2x": [{ axis: "inflammatoire", weight: 1 }],
    "3-5x": [
      { axis: "inflammatoire", weight: 3 },
      { axis: "nutritionnel", weight: 1 },
    ],
    tous_les_jours: [
      { axis: "inflammatoire", weight: 5 },
      { axis: "nutritionnel", weight: 2 },
      { axis: "digestif", weight: 1 },
    ],
  },

  freq_sucres_industriels: {
    jamais: [],
    "1-2x": [{ axis: "nutritionnel", weight: 1 }],
    "3-5x": [
      { axis: "nutritionnel", weight: 3 },
      { axis: "inflammatoire", weight: 2 },
      { axis: "hormonal", weight: 1 },
    ],
    tous_les_jours: [
      { axis: "nutritionnel", weight: 4 },
      { axis: "inflammatoire", weight: 3 },
      { axis: "hormonal", weight: 2 },
    ],
  },

  freq_boissons_sucrees: {
    jamais: [],
    "1-2x": [{ axis: "nutritionnel", weight: 1 }],
    "3-5x": [
      { axis: "nutritionnel", weight: 3 },
      { axis: "hormonal", weight: 2 },
    ],
    tous_les_jours: [
      { axis: "nutritionnel", weight: 4 },
      { axis: "hormonal", weight: 3 },
      { axis: "inflammatoire", weight: 2 },
    ],
  },

  freq_gluten: {
    jamais: [],
    "1-2x": [],
    "3-5x": [{ axis: "digestif", weight: 1 }],
    tous_les_jours: [
      { axis: "digestif", weight: 2 },
      { axis: "inflammatoire", weight: 1 },
    ],
  },

  freq_laitiers: {
    jamais: [],
    "1-2x": [],
    "3-5x": [{ axis: "digestif", weight: 1 }],
    tous_les_jours: [
      { axis: "digestif", weight: 2 },
      { axis: "inflammatoire", weight: 1 },
    ],
  },

  freq_legumes: {
    jamais: [
      { axis: "nutritionnel", weight: 5 },
      { axis: "digestif", weight: 3 },
      { axis: "inflammatoire", weight: 2 },
    ],
    "1-2x": [
      { axis: "nutritionnel", weight: 3 },
      { axis: "digestif", weight: 2 },
    ],
    "3-5x": [{ axis: "nutritionnel", weight: 1 }],
    tous_les_jours: [],
  },

  freq_fruits: {
    jamais: [
      { axis: "nutritionnel", weight: 3 },
      { axis: "inflammatoire", weight: 1 },
    ],
    "1-2x": [{ axis: "nutritionnel", weight: 2 }],
    "3-5x": [],
    tous_les_jours: [],
  },

  freq_legumineuses: {
    jamais: [
      { axis: "nutritionnel", weight: 2 },
      { axis: "digestif", weight: 1 },
    ],
    "1-2x": [{ axis: "nutritionnel", weight: 1 }],
    "3-5x": [],
    tous_les_jours: [],
  },

  freq_poisson_gras: {
    jamais: [
      { axis: "inflammatoire", weight: 3 },
      { axis: "nutritionnel", weight: 2 },
      { axis: "nerveux", weight: 1 },
    ],
    "1-2x": [],
    "3-5x": [],
    tous_les_jours: [],
  },

  freq_viande_rouge: {
    jamais: [],
    "1-2x": [],
    "3-5x": [
      { axis: "inflammatoire", weight: 2 },
      { axis: "digestif", weight: 1 },
    ],
    tous_les_jours: [
      { axis: "inflammatoire", weight: 4 },
      { axis: "digestif", weight: 2 },
    ],
  },

  freq_ultra_transformes: {
    jamais: [],
    "1-2x": [{ axis: "nutritionnel", weight: 1 }],
    "3-5x": [
      { axis: "nutritionnel", weight: 3 },
      { axis: "inflammatoire", weight: 2 },
      { axis: "digestif", weight: 1 },
    ],
    tous_les_jours: [
      { axis: "nutritionnel", weight: 5 },
      { axis: "inflammatoire", weight: 3 },
      { axis: "digestif", weight: 2 },
      { axis: "hormonal", weight: 1 },
    ],
  },

  freq_cereales_completes: {
    jamais: [{ axis: "nutritionnel", weight: 2 }],
    "1-2x": [{ axis: "nutritionnel", weight: 1 }],
    "3-5x": [],
    tous_les_jours: [],
  },

  // Alcool et tabac (ajouts critiques)
  alcool: {
    jamais: [],
    occasionnel: [{ axis: "nutritionnel", weight: 1 }],
    "1-2_semaine": [
      { axis: "nutritionnel", weight: 1 },
      { axis: "hormonal", weight: 1 },
    ],
    "3-5_semaine": [
      { axis: "nutritionnel", weight: 3 },
      { axis: "hormonal", weight: 2 },
      { axis: "inflammatoire", weight: 2 },
      { axis: "digestif", weight: 1 },
    ],
    quotidien: [
      { axis: "nutritionnel", weight: 5 },
      { axis: "hormonal", weight: 3 },
      { axis: "inflammatoire", weight: 3 },
      { axis: "digestif", weight: 2 },
      { axis: "nerveux", weight: 2 },
    ],
  },

  tabac: {
    non: [],
    ancien: [{ axis: "inflammatoire", weight: 1 }],
    occasionnel: [
      { axis: "inflammatoire", weight: 2 },
      { axis: "nutritionnel", weight: 1 },
    ],
    quotidien: [
      { axis: "inflammatoire", weight: 4 },
      { axis: "nutritionnel", weight: 2 },
      { axis: "energetique", weight: 2 },
      { axis: "hormonal", weight: 1 },
    ],
  },

  // SECTION 4 — Digestif
  troubles_digestifs: {
    ballonnements: [
      { axis: "digestif", weight: 3 },
      { axis: "inflammatoire", weight: 1 },
    ],
    gaz: [{ axis: "digestif", weight: 2 }],
    rgo: [
      { axis: "digestif", weight: 3 },
      { axis: "nerveux", weight: 1 },
    ],
    digestion_lente: [
      { axis: "digestif", weight: 3 },
      { axis: "energetique", weight: 1 },
    ],
    nausees: [
      { axis: "digestif", weight: 2 },
      { axis: "hormonal", weight: 1 },
    ],
    constipation: [
      { axis: "digestif", weight: 3 },
      { axis: "nutritionnel", weight: 1 },
    ],
    diarrhee: [
      { axis: "digestif", weight: 3 },
      { axis: "inflammatoire", weight: 1 },
    ],
    douleurs_abdominales: [
      { axis: "digestif", weight: 4 },
      { axis: "inflammatoire", weight: 2 },
    ],
    langue_chargee: [
      { axis: "digestif", weight: 2 },
      { axis: "inflammatoire", weight: 2 },
    ],
    mauvaise_haleine: [{ axis: "digestif", weight: 2 }],
  },

  transit: {
    quotidien: [],
    tous_2_jours: [{ axis: "digestif", weight: 2 }],
    irregulier: [
      { axis: "digestif", weight: 3 },
      { axis: "nerveux", weight: 1 },
    ],
    constipe: [
      { axis: "digestif", weight: 4 },
      { axis: "nutritionnel", weight: 1 },
    ],
    diarrheique: [
      { axis: "digestif", weight: 4 },
      { axis: "inflammatoire", weight: 2 },
    ],
  },

  // SECTION 5 — Énergie & Nerveux (échelles 1-5, inversées: 1=mauvais, 5=bon)
  energie_matin: {
    "1": [{ axis: "energetique", weight: 4 }],
    "2": [{ axis: "energetique", weight: 3 }],
    "3": [{ axis: "energetique", weight: 1 }],
    "4": [],
    "5": [],
  },

  energie_aprem: {
    "1": [
      { axis: "energetique", weight: 4 },
      { axis: "hormonal", weight: 1 },
    ],
    "2": [{ axis: "energetique", weight: 3 }],
    "3": [{ axis: "energetique", weight: 1 }],
    "4": [],
    "5": [],
  },

  // Pour stress/irritabilité/anxiété: 1=faible, 5=élevé
  stress: {
    "1": [],
    "2": [{ axis: "nerveux", weight: 1 }],
    "3": [{ axis: "nerveux", weight: 2 }],
    "4": [
      { axis: "nerveux", weight: 3 },
      { axis: "hormonal", weight: 1 },
    ],
    "5": [
      { axis: "nerveux", weight: 5 },
      { axis: "hormonal", weight: 2 },
      { axis: "digestif", weight: 1 },
    ],
  },

  irritabilite: {
    "1": [],
    "2": [{ axis: "nerveux", weight: 1 }],
    "3": [{ axis: "nerveux", weight: 2 }],
    "4": [
      { axis: "nerveux", weight: 3 },
      { axis: "hormonal", weight: 1 },
    ],
    "5": [
      { axis: "nerveux", weight: 4 },
      { axis: "hormonal", weight: 2 },
    ],
  },

  anxiete: {
    "1": [],
    "2": [{ axis: "nerveux", weight: 1 }],
    "3": [{ axis: "nerveux", weight: 2 }],
    "4": [
      { axis: "nerveux", weight: 4 },
      { axis: "energetique", weight: 1 },
    ],
    "5": [
      { axis: "nerveux", weight: 5 },
      { axis: "energetique", weight: 2 },
      { axis: "hormonal", weight: 1 },
    ],
  },

  faim_emotionnelle: {
    "1": [],
    "2": [{ axis: "nerveux", weight: 1 }],
    "3": [
      { axis: "nerveux", weight: 2 },
      { axis: "nutritionnel", weight: 1 },
    ],
    "4": [
      { axis: "nerveux", weight: 3 },
      { axis: "nutritionnel", weight: 2 },
    ],
    "5": [
      { axis: "nerveux", weight: 4 },
      { axis: "nutritionnel", weight: 3 },
      { axis: "hormonal", weight: 1 },
    ],
  },

  // Sommeil: 1=mauvais, 5=bon
  sommeil: {
    "1": [
      { axis: "energetique", weight: 4 },
      { axis: "nerveux", weight: 2 },
    ],
    "2": [
      { axis: "energetique", weight: 3 },
      { axis: "nerveux", weight: 1 },
    ],
    "3": [{ axis: "energetique", weight: 1 }],
    "4": [],
    "5": [],
  },

  // Réveils nocturnes: 1=jamais, 5=toutes les nuits
  reveils_nocturnes: {
    "1": [],
    "2": [{ axis: "energetique", weight: 1 }],
    "3": [
      { axis: "energetique", weight: 2 },
      { axis: "nerveux", weight: 1 },
    ],
    "4": [
      { axis: "energetique", weight: 3 },
      { axis: "nerveux", weight: 2 },
      { axis: "hormonal", weight: 1 },
    ],
    "5": [
      { axis: "energetique", weight: 4 },
      { axis: "nerveux", weight: 3 },
      { axis: "hormonal", weight: 2 },
    ],
  },

  maux_tete: {
    "1": [],
    "2": [{ axis: "nerveux", weight: 1 }],
    "3": [
      { axis: "nerveux", weight: 2 },
      { axis: "inflammatoire", weight: 1 },
    ],
    "4": [
      { axis: "nerveux", weight: 3 },
      { axis: "inflammatoire", weight: 2 },
    ],
    "5": [
      { axis: "nerveux", weight: 4 },
      { axis: "inflammatoire", weight: 3 },
    ],
  },

  immunite: {
    "1": [],
    "2": [{ axis: "nutritionnel", weight: 1 }],
    "3": [
      { axis: "nutritionnel", weight: 2 },
      { axis: "inflammatoire", weight: 1 },
    ],
    "4": [
      { axis: "nutritionnel", weight: 3 },
      { axis: "inflammatoire", weight: 2 },
    ],
    "5": [
      { axis: "nutritionnel", weight: 4 },
      { axis: "inflammatoire", weight: 3 },
      { axis: "energetique", weight: 1 },
    ],
  },

  // SECTION 6 — Hormonal
  thyroide: {
    oui: [
      { axis: "hormonal", weight: 4 },
      { axis: "energetique", weight: 2 },
    ],
    non: [],
  },

  cholesterol_diabete_tension: {
    oui: [
      { axis: "hormonal", weight: 3 },
      { axis: "inflammatoire", weight: 2 },
      { axis: "nutritionnel", weight: 1 },
    ],
    non: [],
  },

  frilosite: {
    oui: [
      { axis: "hormonal", weight: 3 },
      { axis: "energetique", weight: 1 },
    ],
    non: [],
  },

  libido_basse: {
    oui: [
      { axis: "hormonal", weight: 3 },
      { axis: "nerveux", weight: 1 },
      { axis: "energetique", weight: 1 },
    ],
    non: [],
  },

  cycle_regulier: {
    oui: [],
    non: [
      { axis: "hormonal", weight: 3 },
      { axis: "inflammatoire", weight: 1 },
    ],
  },

  spm: {
    oui: [
      { axis: "hormonal", weight: 3 },
      { axis: "nerveux", weight: 1 },
      { axis: "inflammatoire", weight: 1 },
    ],
    non: [],
  },

  // SECTION 7 — Ostéo / Articulaire / Cutané
  douleurs_articulaires: {
    oui: [
      { axis: "inflammatoire", weight: 4 },
      { axis: "nutritionnel", weight: 1 },
    ],
    non: [],
  },

  jambes_lourdes: {
    oui: [
      { axis: "inflammatoire", weight: 2 },
      { axis: "hormonal", weight: 1 },
    ],
    non: [],
  },

  problemes_peau: {
    oui: [
      { axis: "inflammatoire", weight: 3 },
      { axis: "digestif", weight: 2 },
      { axis: "hormonal", weight: 1 },
    ],
    non: [],
  },

  chute_cheveux_ongles: {
    oui: [
      { axis: "nutritionnel", weight: 3 },
      { axis: "hormonal", weight: 2 },
    ],
    non: [],
  },

  // SECTION 8 — Mode de vie
  activite_physique_freq: {
    jamais: [
      { axis: "energetique", weight: 3 },
      { axis: "inflammatoire", weight: 2 },
      { axis: "hormonal", weight: 1 },
    ],
    "1-2x": [{ axis: "energetique", weight: 1 }],
    "3-5x": [],
    quotidien: [],
  },

  temps_assis: {
    "<4h": [],
    "4-6h": [{ axis: "inflammatoire", weight: 1 }],
    "6-8h": [
      { axis: "inflammatoire", weight: 2 },
      { axis: "energetique", weight: 1 },
    ],
    "+8h": [
      { axis: "inflammatoire", weight: 3 },
      { axis: "energetique", weight: 2 },
      { axis: "digestif", weight: 1 },
    ],
  },

  // Exposition soleil: 1=jamais, 5=beaucoup
  exposition_soleil: {
    "1": [
      { axis: "hormonal", weight: 2 },
      { axis: "energetique", weight: 1 },
    ],
    "2": [{ axis: "hormonal", weight: 1 }],
    "3": [],
    "4": [],
    "5": [],
  },

  contexte_repas: {
    calme: [],
    rapide: [
      { axis: "digestif", weight: 2 },
      { axis: "nerveux", weight: 1 },
    ],
    ecran: [
      { axis: "digestif", weight: 1 },
      { axis: "nerveux", weight: 1 },
    ],
    stressant: [
      { axis: "digestif", weight: 3 },
      { axis: "nerveux", weight: 3 },
    ],
  },

  // Compléments alimentaires (ajout)
  complements: {
    oui: [{ axis: "nutritionnel", weight: 1 }],
    non: [],
  },
};

// ============================================================================
// PATTERNS CROISÉS — combinaisons de réponses qui révèlent un terrain
// ============================================================================

export const PATTERNS: Pattern[] = [
  {
    id: "dysbiose_suspectee",
    name: "Suspicion de dysbiose intestinale",
    description:
      "La combinaison de ballonnements, fatigue post-prandiale et envies de sucre peut indiquer un déséquilibre de la flore intestinale.",
    conditions: [
      { questionId: "troubles_digestifs", values: ["ballonnements", "gaz"] },
      { questionId: "fatigue_post_repas", values: ["oui"] },
      { questionId: "envie_sucre", values: ["oui"] },
    ],
    severity: "warning",
  },
  {
    id: "hypoglycemie_reactionnelle",
    name: "Probable hypoglycémie réactionnelle",
    description:
      "Coups de fatigue après les repas, envies de sucre et grignotage fréquent suggèrent des variations importantes de glycémie.",
    conditions: [
      { questionId: "fatigue_post_repas", values: ["oui"] },
      { questionId: "envie_sucre", values: ["oui"] },
      { questionId: "grignotage", values: ["souvent"] },
    ],
    severity: "warning",
  },
  {
    id: "terrain_inflammatoire",
    name: "Terrain inflammatoire chronique",
    description:
      "Douleurs articulaires, problèmes cutanés et consommation élevée d'aliments pro-inflammatoires suggèrent une inflammation de bas grade.",
    conditions: [
      { questionId: "douleurs_articulaires", values: ["oui"] },
      { questionId: "problemes_peau", values: ["oui"] },
    ],
    severity: "warning",
  },
  {
    id: "epuisement_surrenalien",
    name: "Signes d'épuisement surrénalien",
    description:
      "Stress élevé, fatigue matinale, sommeil de mauvaise qualité et consommation importante de café suggèrent un épuisement des surrénales.",
    conditions: [
      { questionId: "stress", values: ["4", "5"] },
      { questionId: "energie_matin", values: ["1", "2"] },
      { questionId: "sommeil", values: ["1", "2"] },
    ],
    severity: "warning",
  },
  {
    id: "hypothyroidie_fonctionnelle",
    name: "Signes compatibles avec un ralentissement thyroïdien",
    description:
      "Frilosité, fatigue, chute de cheveux et prise de poids peuvent indiquer un ralentissement de la fonction thyroïdienne.",
    conditions: [
      { questionId: "frilosite", values: ["oui"] },
      { questionId: "chute_cheveux_ongles", values: ["oui"] },
      { questionId: "energie_matin", values: ["1", "2"] },
    ],
    severity: "alert",
  },
  {
    id: "alimentation_pro_inflammatoire",
    name: "Alimentation à forte charge inflammatoire",
    description:
      "La consommation fréquente de charcuteries, sucres industriels et ultra-transformés, combinée à un déficit en légumes et poissons gras, crée un terrain inflammatoire.",
    conditions: [
      {
        questionId: "freq_ultra_transformes",
        values: ["3-5x", "tous_les_jours"],
      },
      { questionId: "freq_legumes", values: ["jamais", "1-2x"] },
    ],
    severity: "warning",
  },
  {
    id: "stress_alimentaire",
    name: "Cercle vicieux stress-alimentation",
    description:
      "Un niveau de stress élevé combiné à une faim émotionnelle importante indique un cercle vicieux où le stress pousse à manger et l'alimentation renforce le stress.",
    conditions: [
      { questionId: "stress", values: ["4", "5"] },
      { questionId: "faim_emotionnelle", values: ["4", "5"] },
    ],
    severity: "warning",
  },
  {
    id: "desequilibre_hormonal_feminin",
    name: "Déséquilibre hormonal féminin",
    description:
      "Cycles irréguliers, syndrome prémenstruel et irritabilité peuvent indiquer un déséquilibre œstrogène-progestérone.",
    conditions: [
      { questionId: "cycle_regulier", values: ["non"] },
      { questionId: "spm", values: ["oui"] },
    ],
    severity: "warning",
  },
  {
    id: "sedentarite_avancee",
    name: "Sédentarité préoccupante",
    description:
      "L'absence d'activité physique combinée à un temps assis prolongé impacte le métabolisme, la digestion et l'équilibre hormonal.",
    conditions: [
      { questionId: "activite_physique_freq", values: ["jamais"] },
      { questionId: "temps_assis", values: ["6-8h", "+8h"] },
    ],
    severity: "info",
  },
];

// ============================================================================
// DRAPEAUX ROUGES — nécessitent un avis médical prioritaire
// ============================================================================

export const RED_FLAGS: RedFlag[] = [
  {
    id: "perte_poids_involontaire",
    message: "Perte de poids involontaire significative",
    conditions: [],
    recommendation:
      "Si vous avez perdu du poids de manière involontaire et significative ces derniers mois, il est important de consulter votre médecin traitant avant tout accompagnement nutritionnel.",
  },
  {
    id: "douleurs_abdominales_severes",
    message: "Douleurs abdominales intenses associées à des troubles du transit",
    conditions: [
      { questionId: "troubles_digestifs", values: ["douleurs_abdominales"] },
      { questionId: "transit", values: ["diarrheique"] },
    ],
    recommendation:
      "La combinaison de douleurs abdominales et de troubles du transit persistants nécessite un bilan médical (coloscopie, bilan sanguin) avant tout accompagnement nutritionnel.",
  },
  {
    id: "signes_thyroidiens_non_suivis",
    message: "Signes thyroïdiens sans suivi médical",
    conditions: [
      { questionId: "frilosite", values: ["oui"] },
      { questionId: "chute_cheveux_ongles", values: ["oui"] },
      { questionId: "thyroide", values: ["non"] },
    ],
    recommendation:
      "Vos réponses suggèrent des signes compatibles avec un dysfonctionnement thyroïdien non diagnostiqué. Je vous recommande un bilan thyroïdien (TSH, T3, T4) auprès de votre médecin.",
  },
  {
    id: "alcool_quotidien",
    message: "Consommation d'alcool quotidienne",
    conditions: [{ questionId: "alcool", values: ["quotidien"] }],
    recommendation:
      "Une consommation d'alcool quotidienne nécessite un accompagnement médical spécifique avant ou en parallèle de tout suivi nutritionnel.",
  },
];

// ============================================================================
// FONCTION DE CALCUL PRINCIPALE
// ============================================================================

export function calculateBilan(
  answers: Record<string, string | string[]>
): BilanResult {
  const axisRawScores: Record<ClinicalAxis, number> = {
    digestif: 0,
    energetique: 0,
    inflammatoire: 0,
    hormonal: 0,
    nerveux: 0,
    nutritionnel: 0,
  };

  const axisMaxPossible: Record<ClinicalAxis, number> = {
    digestif: 0,
    energetique: 0,
    inflammatoire: 0,
    hormonal: 0,
    nerveux: 0,
    nutritionnel: 0,
  };

  // Calculer les scores bruts par axe
  for (const [questionId, answer] of Object.entries(answers)) {
    const matrix = SCORING_MATRIX[questionId];
    if (!matrix) continue;

    // Gérer les réponses multiples (checkboxes)
    const values = Array.isArray(answer) ? answer : [answer];

    for (const value of values) {
      const weights = matrix[value];
      if (!weights) continue;

      for (const { axis, weight } of weights) {
        axisRawScores[axis] += weight;
      }
    }

    // Calculer le max possible pour cet axe (pire réponse possible)
    const maxWeights = Object.values(matrix).reduce(
      (max, weights) => {
        const totalPerAxis: Record<string, number> = {};
        for (const { axis, weight } of weights) {
          totalPerAxis[axis] = (totalPerAxis[axis] || 0) + weight;
        }
        for (const [axis, total] of Object.entries(totalPerAxis)) {
          if (!max[axis] || total > max[axis]) {
            max[axis] = total;
          }
        }
        return max;
      },
      {} as Record<string, number>
    );

    for (const [axis, maxWeight] of Object.entries(maxWeights)) {
      axisMaxPossible[axis as ClinicalAxis] += maxWeight;
    }
  }

  // Normaliser les scores sur 100
  const axes: AxisScore[] = (Object.keys(axisRawScores) as ClinicalAxis[]).map(
    (axis) => {
      const raw = axisRawScores[axis];
      const max = axisMaxPossible[axis] || 1;
      // Inverser : 100 = optimal, 0 = critique (plus intuitif pour l'utilisateur)
      const rawPct = Math.min(100, Math.round((raw / max) * 100));
      const score = 100 - rawPct;

      let level: AxisScore["level"];
      if (score >= 80) level = "optimal";
      else if (score >= 55) level = "attention";
      else if (score >= 30) level = "préoccupant";
      else level = "critique";

      const priorities: string[] = [];
      if (score < 55) {
        priorities.push(
          ...getPrioritiesForAxis(axis, score, answers)
        );
      }

      return {
        axis,
        score,
        level,
        label: AXIS_LABELS[axis],
        description: AXIS_DESCRIPTIONS[axis],
        priorities,
      };
    }
  );

  // Détecter les patterns croisés
  const detectedPatterns = PATTERNS.filter((pattern) =>
    pattern.conditions.every((condition) => {
      const answer = answers[condition.questionId];
      if (!answer) return false;
      const values = Array.isArray(answer) ? answer : [answer];
      return condition.values.some((v) => values.includes(v));
    })
  );

  // Détecter les drapeaux rouges
  const redFlags = RED_FLAGS.filter((flag) => {
    if (flag.conditions.length === 0) return false;
    return flag.conditions.every((condition) => {
      const answer = answers[condition.questionId];
      if (!answer) return false;
      const values = Array.isArray(answer) ? answer : [answer];
      return condition.values.some((v) => values.includes(v));
    });
  });

  // Score global (moyenne pondérée des axes)
  const overallScore = Math.round(
    axes.reduce((sum, a) => sum + a.score, 0) / axes.length
  );

  // Top 3 priorités (axes les plus problématiques = score le plus bas)
  const topPriorities = axes
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .filter((a) => a.score < 80)
    .map((a) => a.label);

  const motivationLevel = parseInt(
    (answers.motivation_niveau as string) || "5"
  );
  const readyFor90Days =
    (answers.pret_90_jours as string) || "pourquoi_pas";

  return {
    axes: axes.sort((a, b) => a.score - b.score),
    detectedPatterns,
    redFlags,
    overallScore,
    topPriorities,
    motivationLevel,
    readyFor90Days,
  };
}

// Priorités spécifiques par axe selon les réponses
function getPrioritiesForAxis(
  axis: ClinicalAxis,
  _score: number,
  answers: Record<string, string | string[]>
): string[] {
  const priorities: string[] = [];

  switch (axis) {
    case "digestif":
      if (answers.hydratation === "<1L")
        priorities.push("Augmenter l'hydratation (minimum 1,5L/jour)");
      if (answers.vitesse_repas === "1" || answers.vitesse_repas === "2")
        priorities.push("Ralentir le rythme des repas et améliorer la mastication");
      if (answers.transit === "constipe" || answers.transit === "diarrheique")
        priorities.push("Réguler le transit par l'alimentation");
      break;

    case "energetique":
      if (answers.sommeil === "1" || answers.sommeil === "2")
        priorities.push("Améliorer la qualité du sommeil");
      if (answers.nb_repas === "1")
        priorities.push("Structurer les repas (minimum 3 par jour)");
      if (answers.petit_dejeuner === "jamais")
        priorities.push("Instaurer un petit-déjeuner équilibré");
      break;

    case "inflammatoire":
      if (
        answers.freq_ultra_transformes === "3-5x" ||
        answers.freq_ultra_transformes === "tous_les_jours"
      )
        priorities.push("Réduire drastiquement les ultra-transformés");
      if (answers.freq_legumes === "jamais" || answers.freq_legumes === "1-2x")
        priorities.push("Augmenter la consommation de légumes (5 portions/jour)");
      if (answers.cuisson === "frit")
        priorities.push("Privilégier des modes de cuisson doux (vapeur, four)");
      break;

    case "hormonal":
      if (answers.envie_sucre === "oui")
        priorities.push("Stabiliser la glycémie par l'équilibre des repas");
      if (answers.frilosite === "oui")
        priorities.push("Vérifier la fonction thyroïdienne");
      if (answers.cycle_regulier === "non")
        priorities.push("Travailler l'équilibre hormonal par la micronutrition");
      break;

    case "nerveux":
      if (answers.stress === "4" || answers.stress === "5")
        priorities.push("Mettre en place des stratégies de gestion du stress");
      if (
        answers.faim_emotionnelle === "4" ||
        answers.faim_emotionnelle === "5"
      )
        priorities.push("Identifier et désamorcer les déclencheurs de faim émotionnelle");
      if (answers.cafe === "5+")
        priorities.push("Réduire progressivement la consommation de café");
      break;

    case "nutritionnel":
      if (answers.freq_legumes === "jamais" || answers.freq_legumes === "1-2x")
        priorities.push("Augmenter les apports en légumes et fibres");
      if (
        answers.freq_poisson_gras === "jamais"
      )
        priorities.push("Introduire des sources d'oméga-3 (poissons gras, graines de lin)");
      if (answers.alcool === "quotidien" || answers.alcool === "3-5_semaine")
        priorities.push("Réduire la consommation d'alcool");
      break;
  }

  return priorities.slice(0, 3);
}
