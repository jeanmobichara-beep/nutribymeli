// ============================================================================
// STRUCTURE DU QUESTIONNAIRE — NutriByMeli
// Ordre optimisé pour la conversion (email au milieu, pas au début)
// ============================================================================

export type QuestionType =
  | "text"
  | "email"
  | "number"
  | "radio"
  | "checkbox"
  | "scale"
  | "select"
  | "textarea"
  | "frequency_grid";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface FrequencyItem {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  options?: QuestionOption[];
  frequencyItems?: FrequencyItem[];
  placeholder?: string;
  min?: number;
  max?: number;
  scaleLabels?: { min: string; max: string };
  conditionalOn?: { questionId: string; values: string[] };
  helpText?: string;
  maxChoices?: number;
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  questions: Question[];
}

const FREQUENCY_OPTIONS: QuestionOption[] = [
  { value: "jamais", label: "Jamais" },
  { value: "occasionnel", label: "Occasionnellement" },
  { value: "1-2x", label: "1-2x / sem." },
  { value: "3-5x", label: "3-5x / sem." },
  { value: "tous_les_jours", label: "Tous les jours" },
];

export const SECTIONS: Section[] = [
  // ---- SECTION 1: Objectif (on commence par l'engagement émotionnel, PAS l'email) ----
  {
    id: "objectif",
    title: "Votre objectif",
    subtitle:
      "Comprendre votre objectif me permet d'orienter l'analyse de votre bilan.",
    icon: "Target",
    color: "amber",
    questions: [
      {
        id: "objectif",
        label: "Quel est votre objectif principal ?",
        type: "checkbox",
        required: true,
        maxChoices: 3,
        helpText: "Sélectionnez jusqu'à 3 réponses.",
        options: [
          { value: "perte_poids", label: "Perte de poids" },
          { value: "energie", label: "Retrouver de l'énergie" },
          { value: "digestion", label: "Améliorer ma digestion" },
          { value: "hormones", label: "Équilibrer mes hormones" },
          { value: "alimentation", label: "Améliorer mon alimentation" },
          {
            value: "douleurs",
            label: "Diminuer mes douleurs / inflammations",
          },
          { value: "sommeil", label: "Mieux dormir" },
          { value: "stress", label: "Gérer mon stress" },
          { value: "autre", label: "Autre" },
        ],
      },
      {
        id: "objectif_autre",
        label: "Précisez votre objectif",
        type: "textarea",
        placeholder: "Décrivez votre objectif...",
        conditionalOn: { questionId: "objectif", values: ["autre"] },
      },
    ],
  },

  // ---- SECTION 2: Habitudes alimentaires ----
  {
    id: "habitudes",
    title: "Vos habitudes alimentaires",
    subtitle:
      "Votre manière de manger influence directement votre digestion, votre énergie et votre métabolisme.",
    icon: "UtensilsCrossed",
    color: "green",
    questions: [
      {
        id: "regime_alimentaire",
        label: "Suivez-vous un régime alimentaire particulier ?",
        type: "checkbox",
        helpText: "Cochez tout ce qui vous concerne.",
        options: [
          { value: "aucun", label: "Aucun en particulier" },
          { value: "vegetarien", label: "Végétarien" },
          { value: "vegan", label: "Végan" },
          { value: "sans_gluten", label: "Sans gluten" },
          { value: "sans_lactose", label: "Sans lactose" },
          { value: "halal", label: "Halal" },
          { value: "casher", label: "Casher" },
          { value: "cetogene", label: "Cétogène / Low carb" },
          { value: "jeune_intermittent", label: "Jeûne intermittent" },
          { value: "autre", label: "Autre" },
        ],
      },
      {
        id: "regime_autre",
        label: "Précisez votre régime :",
        type: "text",
        placeholder: "Décrivez votre régime alimentaire",
        conditionalOn: { questionId: "regime_alimentaire", values: ["autre"] },
      },
      {
        id: "petit_dejeuner",
        label: "Prenez-vous un petit-déjeuner ?",
        type: "radio",
        required: true,
        options: [
          { value: "jamais", label: "Jamais" },
          { value: "rapide", label: "Rapide (café + tartine)" },
          { value: "sucre", label: "Sucré (céréales, viennoiserie...)" },
          { value: "sale", label: "Salé" },
          { value: "proteine", label: "Protéiné (oeufs, fromage blanc...)" },
          { value: "variable", label: "Variable" },
        ],
      },
      {
        id: "nb_repas",
        label: "Combien de repas prenez-vous par jour ?",
        type: "radio",
        required: true,
        options: [
          { value: "1", label: "1 repas" },
          { value: "2", label: "2 repas" },
          { value: "3", label: "3 repas ou plus" },
        ],
      },
      {
        id: "grignotage",
        label: "Grignotez-vous en dehors des repas ?",
        type: "radio",
        required: true,
        options: [
          { value: "jamais", label: "Jamais" },
          { value: "parfois", label: "Parfois" },
          { value: "souvent", label: "Souvent" },
        ],
      },
      {
        id: "vitesse_repas",
        label: "À quelle vitesse mangez-vous ?",
        type: "scale",
        required: true,
        min: 1,
        max: 5,
        scaleLabels: { min: "Très vite", max: "Très lentement" },
      },
      {
        id: "mastication",
        label: "Mastiquez-vous suffisamment ?",
        type: "scale",
        required: true,
        min: 1,
        max: 5,
        scaleLabels: { min: "Pas du tout", max: "Très bien" },
      },
      {
        id: "envie_sucre",
        label: "Avez-vous envie de sucré après les repas ?",
        type: "radio",
        required: true,
        options: [
          { value: "oui", label: "Oui, souvent" },
          { value: "parfois", label: "Parfois" },
          { value: "non", label: "Non" },
        ],
      },
      {
        id: "fatigue_post_repas",
        label: "Ressentez-vous un coup de fatigue après manger ?",
        type: "radio",
        required: true,
        options: [
          { value: "oui", label: "Oui, régulièrement" },
          { value: "parfois", label: "Parfois" },
          { value: "non", label: "Non" },
        ],
      },
      {
        id: "fatigue_post_repas_moment",
        label: "À quel(s) moment(s) ressentez-vous cette fatigue ?",
        type: "checkbox",
        helpText: "Plusieurs réponses possibles.",
        conditionalOn: { questionId: "fatigue_post_repas", values: ["oui", "parfois"] },
        required: true,
        options: [
          { value: "matin", label: "Après le petit-déjeuner" },
          { value: "midi", label: "Après le déjeuner" },
          { value: "soir", label: "Après le dîner" },
        ],
      },
      {
        id: "hydratation",
        label: "Quelle est votre hydratation quotidienne (eau) ?",
        type: "radio",
        required: true,
        options: [
          { value: "<1L", label: "Moins d'1 litre" },
          { value: "1-1.5L", label: "1 à 1,5 litre" },
          { value: "2L", label: "Environ 2 litres" },
          { value: "+2L", label: "Plus de 2 litres" },
        ],
      },
      {
        id: "cafe",
        label: "Consommation de café ?",
        type: "radio",
        options: [
          { value: "non", label: "Jamais" },
          { value: "parfois", label: "Occasionnellement" },
          { value: "1-2", label: "1 à 2 par jour" },
          { value: "3-4", label: "3 à 4 par jour" },
          { value: "5+", label: "5 ou plus par jour" },
        ],
      },
      {
        id: "heure_dernier_repas",
        label: "À quelle heure prenez-vous votre dernier repas ?",
        type: "radio",
        required: true,
        options: [
          { value: "avant_19h", label: "Avant 19h" },
          { value: "19h_20h", label: "Entre 19h et 20h" },
          { value: "20h_21h", label: "Entre 20h et 21h" },
          { value: "apres_21h", label: "Après 21h" },
        ],
      },
      {
        id: "sel",
        label: "Ajoutez-vous du sel à vos plats ?",
        type: "radio",
        options: [
          { value: "jamais", label: "Jamais / rarement" },
          { value: "parfois", label: "Parfois" },
          { value: "souvent", label: "Souvent" },
          { value: "systematique", label: "Systématiquement, avant même de goûter" },
        ],
      },
      {
        id: "cuisson",
        label: "Modes de cuisson les plus fréquents ?",
        type: "checkbox",
        required: true,
        helpText: "Plusieurs réponses possibles.",
        options: [
          { value: "frit", label: "Friture" },
          { value: "poele", label: "Poêle" },
          { value: "four", label: "Four" },
          { value: "vapeur", label: "Vapeur" },
          { value: "cru", label: "Cru" },
          { value: "mix", label: "Un peu de tout" },
        ],
      },
    ],
  },

  // ---- SECTION 3: Fréquences alimentaires ----
  {
    id: "frequences",
    title: "Votre assiette au quotidien",
    subtitle:
      "À quelle fréquence consommez-vous ces catégories d'aliments ?",
    icon: "Apple",
    color: "emerald",
    questions: [
      {
        id: "freq_legumes",
        label: "Légumes (cuits ou crus)",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "freq_fruits",
        label: "Fruits frais",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "freq_cereales_completes",
        label: "Céréales complètes (riz complet, quinoa, avoine...)",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "freq_legumineuses",
        label: "Légumineuses (lentilles, pois chiches, haricots...)",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "freq_oeufs",
        label: "Oeufs",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "freq_oleagineux",
        label: "Oléagineux (noix, amandes, noisettes, cajou...)",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "oleagineux_types",
        label: "Lesquels consommez-vous principalement ?",
        type: "checkbox",
        helpText: "Cochez tout ce qui vous concerne.",
        conditionalOn: { questionId: "freq_oleagineux", values: ["occasionnel", "1-2x", "3-5x", "tous_les_jours"] },
        options: [
          { value: "amandes", label: "Amandes" },
          { value: "noix", label: "Noix" },
          { value: "noisettes", label: "Noisettes" },
          { value: "cajou", label: "Noix de cajou" },
          { value: "noix_bresil", label: "Noix du Brésil" },
          { value: "pistaches", label: "Pistaches" },
          { value: "graines_lin", label: "Graines de lin" },
          { value: "graines_chia", label: "Graines de chia" },
          { value: "graines_courge", label: "Graines de courge" },
          { value: "graines_tournesol", label: "Graines de tournesol" },
          { value: "autre", label: "Autre" },
        ],
      },
      {
        id: "oleagineux_quantite",
        label: "Quantité approximative par jour",
        type: "radio",
        conditionalOn: { questionId: "freq_oleagineux", values: ["occasionnel", "1-2x", "3-5x", "tous_les_jours"] },
        options: [
          { value: "poignee", label: "Une petite poignée (~15g)" },
          { value: "30g", label: "Une poignée (~30g)" },
          { value: "50g", label: "Plus d'une poignée (~50g+)" },
        ],
      },
      {
        id: "freq_poisson_gras",
        label: "Poissons gras",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "poisson_gras_types",
        label: "Lesquels consommez-vous ?",
        type: "checkbox",
        helpText: "Cochez tout ce qui vous concerne.",
        conditionalOn: { questionId: "freq_poisson_gras", values: ["occasionnel", "1-2x", "3-5x", "tous_les_jours"] },
        options: [
          { value: "sardines", label: "Sardines" },
          { value: "saumon", label: "Saumon" },
          { value: "maquereau", label: "Maquereau" },
          { value: "thon", label: "Thon" },
          { value: "hareng", label: "Hareng" },
          { value: "truite", label: "Truite" },
          { value: "anchois", label: "Anchois" },
          { value: "autre", label: "Autre" },
        ],
      },
      {
        id: "freq_volaille",
        label: "Volaille (poulet, dinde, canard...)",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "freq_viande_rouge",
        label: "Viande rouge (boeuf, agneau, porc...)",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "freq_charcuterie",
        label: "Charcuteries (jambon, saucisson, lardons...)",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "freq_laitiers",
        label: "Produits laitiers (lait, fromage, yaourt...)",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "freq_gluten",
        label: "Produits contenant du gluten (pain, pâtes, blé...)",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "freq_sucres_industriels",
        label: "Produits sucrés industriels (gâteaux, biscuits, viennoiseries...)",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "freq_boissons_sucrees",
        label: "Boissons sucrées (sodas, jus industriels...)",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "freq_ultra_transformes",
        label: "Plats préparés / ultra-transformés",
        type: "radio",
        required: true,
        options: FREQUENCY_OPTIONS,
      },
      {
        id: "alcool",
        label: "Alcool",
        type: "radio",
        required: true,
        options: [
          { value: "jamais", label: "Jamais" },
          { value: "occasionnel", label: "Occasionnellement" },
          { value: "1-2_semaine", label: "1-2 fois par semaine" },
          { value: "3-5_semaine", label: "3-5 fois par semaine" },
          { value: "quotidien", label: "Tous les jours" },
        ],
      },
      {
        id: "tabac",
        label: "Tabac",
        type: "radio",
        required: true,
        options: [
          { value: "non", label: "Non-fumeur" },
          { value: "ancien", label: "Ancien fumeur" },
          { value: "occasionnel", label: "Occasionnel" },
          { value: "quotidien", label: "Fumeur quotidien" },
        ],
      },
    ],
  },

  // ---- SECTION 4: Capture email (sunken cost — après 3 sections remplies) ----
  {
    id: "coordonnees",
    title: "Sauvegardez votre progression",
    subtitle:
      "Vos informations permettent de générer votre bilan personnalisé et de le protéger par le secret professionnel.",
    icon: "Shield",
    color: "blue",
    questions: [
      {
        id: "prenom",
        label: "Prénom",
        type: "text",
        required: true,
        placeholder: "Votre prénom",
      },
      {
        id: "nom",
        label: "Nom",
        type: "text",
        required: true,
        placeholder: "Votre nom",
      },
      {
        id: "email",
        label: "Adresse e-mail",
        type: "email",
        required: true,
        placeholder: "votre@email.com",
        helpText:
          "Votre bilan sera envoyé à cette adresse. Vos données sont protégées par le secret professionnel.",
      },
      {
        id: "age",
        label: "Âge",
        type: "number",
        required: true,
        placeholder: "Ex: 35",
      },
      {
        id: "sexe",
        label: "Sexe",
        type: "radio",
        required: true,
        options: [
          { value: "femme", label: "Femme" },
          { value: "homme", label: "Homme" },
        ],
      },
      {
        id: "taille",
        label: "Taille (cm)",
        type: "number",
        required: true,
        placeholder: "Ex: 165",
      },
      {
        id: "poids",
        label: "Poids (kg)",
        type: "number",
        required: true,
        placeholder: "Ex: 68",
      },
      {
        id: "evolution_poids",
        label: "Comment a évolué votre poids ces 6 derniers mois ?",
        type: "radio",
        required: true,
        options: [
          { value: "stable", label: "Stable" },
          { value: "prise_legere", label: "Prise légère (1-3 kg)" },
          { value: "prise_importante", label: "Prise importante (+ de 3 kg)" },
          { value: "perte_legere", label: "Perte légère (1-3 kg)" },
          { value: "perte_importante", label: "Perte importante (+ de 3 kg)" },
          { value: "yoyo", label: "Effet yoyo (fluctuations)" },
        ],
      },
      {
        id: "profession",
        label: "Profession",
        type: "text",
        placeholder: "Votre profession",
      },
    ],
  },

  // ---- SECTION 5: Contexte médical ----
  {
    id: "medical",
    title: "Contexte médical",
    subtitle:
      "Ces informations sont essentielles pour adapter les recommandations à votre situation.",
    icon: "HeartPulse",
    color: "red",
    questions: [
      {
        id: "traitement_medical",
        label: "Suivez-vous actuellement un traitement médical ?",
        type: "radio",
        required: true,
        options: [
          { value: "non", label: "Non" },
          { value: "oui", label: "Oui" },
        ],
      },
      {
        id: "traitement_detail",
        label: "Précisions sur votre traitement",
        type: "textarea",
        placeholder: "Quel(s) traitement(s) et pour quelle(s) raison(s) ?",
        conditionalOn: { questionId: "traitement_medical", values: ["oui"] },
      },
      {
        id: "antecedents",
        label: "Antécédents médicaux notables ?",
        type: "textarea",
        placeholder:
          "Diabète, cholestérol, hypertension, operations, hospitalisations...",
      },
      {
        id: "antecedents_familiaux",
        label: "Antécédents familiaux importants ?",
        type: "textarea",
        placeholder:
          "Diabète, maladies cardiovasculaires, cancers, maladies auto-immunes dans votre famille...",
        helpText:
          "Permet d'évaluer les prédispositions héréditaires de votre terrain.",
      },
      {
        id: "allergies",
        label: "Allergies ou intolérances connues ?",
        type: "textarea",
        placeholder:
          "Allergies alimentaires, intolérances (lactose, gluten...), allergies médicamenteuses...",
      },
      {
        id: "complements",
        label: "Prenez-vous des compléments alimentaires ou des vitamines ?",
        type: "radio",
        options: [
          { value: "non", label: "Non" },
          { value: "oui", label: "Oui" },
        ],
      },
      {
        id: "complements_detail",
        label: "Lesquels ?",
        type: "textarea",
        placeholder: "Vitamine D, magnésium, probiotiques, oméga-3...",
        conditionalOn: { questionId: "complements", values: ["oui"] },
      },
    ],
  },

  // ---- SECTION 6: Digestif & Transit ----
  {
    id: "digestif",
    title: "Digestion & Transit",
    subtitle:
      '"Toutes les maladies commencent dans l\'intestin." — Hippocrate',
    icon: "Stethoscope",
    color: "orange",
    questions: [
      {
        id: "troubles_digestifs",
        label: "Êtes-vous concerné(e) par l'un de ces troubles ?",
        type: "checkbox",
        helpText: "Cochez tout ce qui vous concerne. Si aucun trouble ne vous concerne, ne cochez rien et passez à la suite.",
        options: [
          { value: "ballonnements", label: "Ballonnements" },
          { value: "gaz", label: "Gaz" },
          { value: "rgo", label: "Reflux gastrique (RGO)" },
          { value: "digestion_lente", label: "Digestion lente / lourdeurs" },
          { value: "nausees", label: "Nausées" },
          { value: "constipation", label: "Constipation" },
          { value: "diarrhee", label: "Diarrhée" },
          { value: "douleurs_abdominales", label: "Douleurs abdominales" },
          { value: "langue_chargee", label: "Langue chargée / pâteuse" },
          { value: "mauvaise_haleine", label: "Mauvaise haleine" },
        ],
      },
      {
        id: "troubles_digestifs_frequence",
        label: "À quelle fréquence ressentez-vous ces troubles ?",
        type: "radio",
        required: true,
        conditionalOn: {
          questionId: "troubles_digestifs",
          values: ["ballonnements", "gaz", "rgo", "digestion_lente", "nausees", "constipation", "diarrhee", "douleurs_abdominales", "langue_chargee", "mauvaise_haleine"],
        },
        options: [
          { value: "occasionnel", label: "Occasionnellement (quelques fois par mois)" },
          { value: "regulier", label: "Régulièrement (plusieurs fois par semaine)" },
          { value: "permanent", label: "Quasi permanent (tous les jours ou presque)" },
        ],
      },
      {
        id: "troubles_digestifs_moment",
        label: "À quel(s) moment(s) de la journée principalement ?",
        type: "checkbox",
        helpText: "Plusieurs réponses possibles.",
        conditionalOn: {
          questionId: "troubles_digestifs",
          values: ["ballonnements", "gaz", "rgo", "digestion_lente", "nausees", "constipation", "diarrhee", "douleurs_abdominales", "langue_chargee", "mauvaise_haleine"],
        },
        options: [
          { value: "matin", label: "Le matin / au réveil" },
          { value: "apres_midi", label: "Après le déjeuner (midi)" },
          { value: "apres_soir", label: "Après le dîner (soir)" },
          { value: "nuit", label: "La nuit" },
          { value: "variable", label: "Variable / pas de moment précis" },
        ],
      },
      {
        id: "transit",
        label: "Votre transit intestinal est :",
        type: "radio",
        required: true,
        options: [
          { value: "quotidien", label: "Quotidien et régulier" },
          { value: "tous_2_jours", label: "Tous les 2 jours" },
          { value: "irregulier", label: "Irrégulier" },
          { value: "constipe", label: "Constipé" },
          { value: "diarrheique", label: "Diarrhéique" },
        ],
      },
    ],
  },

  // ---- SECTION 7: Énergie & Nerveux ----
  {
    id: "energie_nerveux",
    title: "Énergie & Équilibre nerveux",
    subtitle:
      "Votre état nerveux et émotionnel influence fortement votre alimentation et votre digestion.",
    icon: "Brain",
    color: "purple",
    questions: [
      {
        id: "energie_matin",
        label: "Niveau d'énergie le matin",
        type: "scale",
        required: true,
        min: 1,
        max: 5,
        scaleLabels: { min: "Épuisé(e)", max: "En pleine forme" },
      },
      {
        id: "energie_aprem",
        label: "Niveau d'énergie l'après-midi",
        type: "scale",
        required: true,
        min: 1,
        max: 5,
        scaleLabels: { min: "Épuisé(e)", max: "En pleine forme" },
      },
      {
        id: "stress",
        label: "Niveau de stress quotidien",
        type: "scale",
        required: true,
        min: 1,
        max: 5,
        scaleLabels: { min: "Détendu(e)", max: "Très stressé(e)" },
      },
      {
        id: "irritabilite",
        label: "Irritabilité",
        type: "scale",
        required: true,
        min: 1,
        max: 5,
        scaleLabels: { min: "Calme", max: "Très irritable" },
      },
      {
        id: "anxiete",
        label: "Anxiété",
        type: "scale",
        required: true,
        min: 1,
        max: 5,
        scaleLabels: { min: "Serein(e)", max: "Très anxieux(se)" },
      },
      {
        id: "faim_emotionnelle",
        label: "Faim émotionnelle (manger en réaction au stress/émotions)",
        type: "scale",
        required: true,
        min: 1,
        max: 5,
        scaleLabels: { min: "Jamais", max: "Très souvent" },
      },
      {
        id: "sommeil",
        label: "Qualité du sommeil",
        type: "scale",
        required: true,
        min: 1,
        max: 5,
        scaleLabels: { min: "Très mauvaise", max: "Excellente" },
      },
      {
        id: "sommeil_duree",
        label: "Combien d'heures dormez-vous en moyenne par nuit ?",
        type: "radio",
        required: true,
        options: [
          { value: "<5h", label: "Moins de 5h" },
          { value: "5-6h", label: "5 à 6h" },
          { value: "6-7h", label: "6 à 7h" },
          { value: "7-8h", label: "7 à 8h" },
          { value: "+8h", label: "Plus de 8h" },
        ],
      },
      {
        id: "heure_coucher",
        label: "À quelle heure vous couchez-vous en général ?",
        type: "radio",
        required: true,
        options: [
          { value: "avant_22h", label: "Avant 22h" },
          { value: "22h_23h", label: "Entre 22h et 23h" },
          { value: "23h_00h", label: "Entre 23h et minuit" },
          { value: "apres_00h", label: "Après minuit" },
        ],
      },
      {
        id: "heure_lever",
        label: "À quelle heure vous levez-vous en général ?",
        type: "radio",
        required: true,
        options: [
          { value: "avant_6h", label: "Avant 6h" },
          { value: "6h_7h", label: "Entre 6h et 7h" },
          { value: "7h_8h", label: "Entre 7h et 8h" },
          { value: "apres_8h", label: "Après 8h" },
        ],
      },
      {
        id: "reveils_nocturnes",
        label: "Réveils nocturnes",
        type: "scale",
        required: true,
        min: 1,
        max: 5,
        scaleLabels: { min: "Jamais", max: "Chaque nuit" },
      },
      {
        id: "maux_tete",
        label: "Maux de tête / migraines",
        type: "scale",
        required: true,
        min: 1,
        max: 5,
        scaleLabels: { min: "Jamais", max: "Très fréquent" },
      },
      {
        id: "immunite",
        label: "Fréquence des maladies (rhume, infections...)",
        type: "scale",
        required: true,
        min: 1,
        max: 5,
        scaleLabels: { min: "Rarement malade", max: "Très souvent malade" },
      },
    ],
  },

  // ---- SECTION 8: Hormonal & Métabolique ----
  {
    id: "hormonal",
    title: "Hormonal & Métabolique",
    subtitle:
      "Ces questions permettent d'évaluer l'impact de votre métabolisme et de votre équilibre hormonal.",
    icon: "Dna",
    color: "rose",
    questions: [
      {
        id: "thyroide",
        label: "Problème thyroïdien connu ?",
        type: "radio",
        required: true,
        options: [
          { value: "non", label: "Non" },
          { value: "oui", label: "Oui" },
        ],
      },
      {
        id: "thyroide_type",
        label: "Quel(s) problème(s) thyroïdien(s) ?",
        type: "checkbox",
        helpText: "Plusieurs réponses possibles",
        conditionalOn: { questionId: "thyroide", values: ["oui"] },
        required: true,
        options: [
          { value: "hypothyroidie", label: "Hypothyroïdie" },
          { value: "hyperthyroidie", label: "Hyperthyroïdie" },
          { value: "hashimoto", label: "Thyroïdite de Hashimoto" },
          { value: "basedow", label: "Maladie de Basedow" },
          { value: "nodules", label: "Nodules thyroïdiens" },
          { value: "goitre", label: "Goitre" },
          { value: "thyroidectomie", label: "Thyroïdectomie (ablation)" },
          { value: "autre", label: "Autre" },
        ],
      },
      {
        id: "thyroide_autre",
        label: "Précisez :",
        type: "text",
        placeholder: "Décrivez votre problème thyroïdien",
        conditionalOn: { questionId: "thyroide_type", values: ["autre"] },
      },
      {
        id: "cholesterol_diabete_tension",
        label: "Cholestérol, diabète ou tension artérielle élevée ?",
        type: "radio",
        required: true,
        options: [
          { value: "non", label: "Non" },
          { value: "oui", label: "Oui" },
        ],
      },
      {
        id: "frilosite",
        label: "Frilosité excessive ?",
        type: "radio",
        required: true,
        options: [
          { value: "non", label: "Non" },
          { value: "oui", label: "Oui" },
        ],
      },
      {
        id: "libido",
        label: "Comment évaluez-vous votre libido ?",
        type: "scale",
        required: true,
        min: 1,
        max: 5,
        scaleLabels: { min: "Très basse", max: "Épanouie" },
      },
      {
        id: "cycle_regulier",
        label: "Votre cycle menstruel est-il régulier ?",
        type: "radio",
        conditionalOn: { questionId: "sexe", values: ["femme"] },
        options: [
          { value: "oui", label: "Oui" },
          { value: "non", label: "Non" },
        ],
      },
      {
        id: "spm",
        label: "Souffrez-vous de syndrome prémenstruel ?",
        type: "radio",
        conditionalOn: { questionId: "sexe", values: ["femme"] },
        options: [
          { value: "non", label: "Non" },
          { value: "oui", label: "Oui" },
        ],
      },
      {
        id: "contraception_menopause",
        label: "Êtes-vous concernée par :",
        type: "checkbox",
        conditionalOn: { questionId: "sexe", values: ["femme"] },
        options: [
          { value: "contraception", label: "Contraception hormonale" },
          { value: "menopause", label: "Péri-ménopause ou ménopause" },
          { value: "endometriose", label: "Endométriose" },
          { value: "sopk", label: "SOPK" },
        ],
      },
      {
        id: "grossesse_allaitement",
        label: "Êtes-vous actuellement enceinte ou en période d'allaitement ?",
        type: "radio",
        conditionalOn: { questionId: "sexe", values: ["femme"] },
        required: true,
        options: [
          { value: "non", label: "Non" },
          { value: "enceinte", label: "Oui, enceinte" },
          { value: "allaitement", label: "Oui, en allaitement" },
          { value: "enceinte_allaitement", label: "Enceinte et allaitante" },
        ],
      },
    ],
  },

  // ---- SECTION 9: Ostéo / Cutané + Mode de vie ----
  {
    id: "terrain_mode_vie",
    title: "Terrain & Mode de vie",
    subtitle:
      "Ces éléments traduisent souvent un terrain inflammatoire ou carencé.",
    icon: "Activity",
    color: "teal",
    questions: [
      {
        id: "douleurs_articulaires",
        label: "Douleurs articulaires ou tendinites ?",
        type: "radio",
        options: [
          { value: "non", label: "Non" },
          { value: "oui", label: "Oui" },
        ],
      },
      {
        id: "jambes_lourdes",
        label: "Jambes lourdes / rétention d'eau ?",
        type: "radio",
        options: [
          { value: "non", label: "Non" },
          { value: "oui", label: "Oui" },
        ],
      },
      {
        id: "problemes_peau",
        label: "Problèmes de peau (acné, eczéma, psoriasis) ?",
        type: "radio",
        options: [
          { value: "non", label: "Non" },
          { value: "oui", label: "Oui" },
        ],
      },
      {
        id: "chute_cheveux_ongles",
        label: "Chute de cheveux ou ongles cassants ?",
        type: "radio",
        options: [
          { value: "non", label: "Non" },
          { value: "oui", label: "Oui" },
        ],
      },
      {
        id: "activite_physique_type",
        label: "Type d'activité physique pratiquée",
        type: "text",
        placeholder: "Ex: marche, yoga, natation, musculation...",
      },
      {
        id: "activite_physique_freq",
        label: "Fréquence d'activité physique",
        type: "radio",
        required: true,
        options: [
          { value: "jamais", label: "Aucune activité" },
          { value: "1-2x", label: "1-2 fois par semaine" },
          { value: "3-5x", label: "3-5 fois par semaine" },
          { value: "quotidien", label: "Tous les jours" },
        ],
      },
      {
        id: "temps_assis",
        label: "Temps passé assis(e) par jour (estimation)",
        type: "radio",
        required: true,
        options: [
          { value: "<4h", label: "Moins de 4h" },
          { value: "4-6h", label: "4 à 6h" },
          { value: "6-8h", label: "6 à 8h" },
          { value: "+8h", label: "Plus de 8h" },
        ],
      },
      {
        id: "exposition_soleil",
        label: "Exposition au soleil",
        type: "scale",
        min: 1,
        max: 5,
        scaleLabels: { min: "Très peu", max: "Beaucoup" },
      },
      {
        id: "contexte_repas_midi",
        label: "Vos repas du midi sont souvent pris :",
        type: "radio",
        required: true,
        options: [
          { value: "calme", label: "Au calme, à table" },
          { value: "rapide", label: "Rapidement, sur le pouce" },
          { value: "ecran", label: "Devant un écran" },
          { value: "stressant", label: "Dans un contexte stressant" },
        ],
      },
      {
        id: "contexte_repas_soir",
        label: "Vos repas du soir sont souvent pris :",
        type: "radio",
        required: true,
        options: [
          { value: "calme", label: "Au calme, à table" },
          { value: "rapide", label: "Rapidement, sur le pouce" },
          { value: "ecran", label: "Devant un écran" },
          { value: "stressant", label: "Dans un contexte stressant" },
        ],
      },
    ],
  },

  // ---- SECTION 10: Rappel 24h + Motivation (fin — max sunken cost) ----
  {
    id: "motivation",
    title: "Vos dernières 24h & Motivation",
    subtitle:
      "Dernière étape ! Ces informations finalisent votre bilan personnalisé.",
    icon: "Sparkles",
    color: "yellow",
    questions: [
      {
        id: "rappel_24h",
        label: "Décrivez tout ce que vous avez mangé et bu hier",
        type: "textarea",
        placeholder:
          "Du lever au coucher : horaires approximatifs, contenu des repas, boissons, quantités estimées, contexte (à table, rapide, devant un écran...)",
        helpText:
          "Il ne s'agit pas d'un jugement, mais d'un élément très précieux pour analyser vos habitudes réelles.",
      },
      {
        id: "motivation_pourquoi",
        label: "Pourquoi remplissez-vous ce bilan aujourd'hui ?",
        type: "textarea",
        required: true,
        placeholder: "Qu'est-ce qui vous a poussé à faire cette démarche ?",
      },
      {
        id: "motivation_niveau",
        label:
          "Sur 10, à quel point voulez-vous changer vos habitudes alimentaires ?",
        type: "scale",
        required: true,
        min: 1,
        max: 10,
        scaleLabels: { min: "Peu motivé(e)", max: "Très déterminé(e)" },
      },
      {
        id: "pret_90_jours",
        label: "Seriez-vous prêt(e) à être accompagné(e) sur 90 jours ?",
        type: "radio",
        required: true,
        options: [
          { value: "oui", label: "Oui, je suis prêt(e)" },
          { value: "pourquoi_pas", label: "Pourquoi pas, j'aimerais en savoir plus" },
          { value: "non", label: "Non, pas pour l'instant" },
        ],
      },
    ],
  },
];
