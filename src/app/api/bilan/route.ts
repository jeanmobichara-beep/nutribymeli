import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SECTIONS } from "@/data/questionnaire";
import {
  AXIS_LABELS,
  type BilanResult,
  type AxisScore,
} from "@/data/scoring";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const MELISSA_EMAIL = process.env.MELISSA_EMAIL || "contact@nutri-meli.com";

// ============================================================================
// Annotations cliniques automatiques pour préparer la visio
// ============================================================================

interface Annotation {
  icon: string;
  text: string;
}

function getAnnotations(
  questionId: string,
  answer: string | string[]
): Annotation[] {
  const annotations: Annotation[] = [];
  const val = Array.isArray(answer) ? answer : [answer];

  // Habitudes alimentaires
  if (questionId === "petit_dejeuner" && val.includes("jamais")) {
    annotations.push({
      icon: "💡",
      text: "VISIO : Explorer les raisons (manque de temps, pas faim, jeûne intentionnel ?). Proposer des options rapides adaptées.",
    });
  }
  if (questionId === "petit_dejeuner" && val.includes("sucre")) {
    annotations.push({
      icon: "⚠️",
      text: "Petit-déjeuner sucré → pic glycémique matinal. À recadrer vers protéiné/gras.",
    });
  }
  if (questionId === "nb_repas" && val.includes("1")) {
    annotations.push({
      icon: "🔴",
      text: "1 seul repas/jour → risque de carences, hypoglycémie, stockage. Investiguer TCA potentiel en visio.",
    });
  }
  if (questionId === "grignotage" && val.includes("souvent")) {
    annotations.push({
      icon: "💡",
      text: "VISIO : Identifier les moments de grignotage (stress, ennui, faim réelle ?). Lien avec faim émotionnelle ?",
    });
  }
  if (questionId === "vitesse_repas" && (val.includes("1") || val.includes("2"))) {
    annotations.push({
      icon: "⚠️",
      text: "Mange trop vite → mastication insuffisante, surcharge digestive. Point clé à travailler.",
    });
  }
  if (questionId === "envie_sucre" && val.includes("oui")) {
    annotations.push({
      icon: "💡",
      text: "VISIO : Vérifier les apports en protéines et graisses aux repas. Possible dysbiose ou hypoglycémie réactionnelle.",
    });
  }
  if (questionId === "fatigue_post_repas" && val.includes("oui")) {
    annotations.push({
      icon: "⚠️",
      text: "Fatigue post-prandiale systématique → explorer composition des repas, charge glycémique, associations alimentaires.",
    });
  }
  if (questionId === "hydratation" && val.includes("<1L")) {
    annotations.push({
      icon: "🔴",
      text: "Hydratation critique (<1L). Impact direct sur transit, énergie et détox. Priorité absolue.",
    });
  }
  if (questionId === "cafe" && (val.includes("3-4") || val.includes("5+"))) {
    annotations.push({
      icon: "⚠️",
      text: "Surconsommation de café → épuisement surrénalien, nervosité. Proposer un sevrage progressif.",
    });
  }

  // Fréquences alimentaires
  if (questionId === "freq_legumes" && (val.includes("jamais") || val.includes("1-2x"))) {
    annotations.push({
      icon: "🔴",
      text: "Déficit majeur en légumes. Impact fibres, micronutriments, transit. Axe prioritaire du programme.",
    });
  }
  if (questionId === "freq_ultra_transformes" && (val.includes("3-5x") || val.includes("tous_les_jours"))) {
    annotations.push({
      icon: "🔴",
      text: "Consommation élevée d'ultra-transformés. VISIO : Identifier les produits concernés et proposer des alternatives simples.",
    });
  }
  if (questionId === "freq_poisson_gras" && val.includes("jamais")) {
    annotations.push({
      icon: "💡",
      text: "Aucun poisson gras → carence oméga-3 probable. Envisager complémentation ou alternatives végétales.",
    });
  }
  if (questionId === "alcool" && (val.includes("quotidien") || val.includes("3-5_semaine"))) {
    annotations.push({
      icon: "🔴",
      text: "Consommation d'alcool significative. VISIO : Aborder avec tact, évaluer la dépendance, impact hépatique et hormonal.",
    });
  }
  if (questionId === "tabac" && val.includes("quotidien")) {
    annotations.push({
      icon: "⚠️",
      text: "Fumeur quotidien → stress oxydatif, inflammation, besoins accrus en vitamine C et antioxydants.",
    });
  }

  // Digestif
  if (questionId === "troubles_digestifs" && val.length >= 3) {
    annotations.push({
      icon: "🔴",
      text: `${val.length} troubles digestifs simultanés. VISIO : Investiguer en détail. Envisager exploration médicale si non faite.`,
    });
  }
  if (questionId === "transit" && (val.includes("constipe") || val.includes("diarrheique"))) {
    annotations.push({
      icon: "💡",
      text: "VISIO : Détailler la fréquence exacte, la consistance (échelle de Bristol), les facteurs aggravants.",
    });
  }

  // Énergie & Nerveux
  if (questionId === "stress" && (val.includes("4") || val.includes("5"))) {
    annotations.push({
      icon: "💡",
      text: "VISIO : Explorer les sources de stress (travail, famille, santé). Impact sur alimentation et sommeil.",
    });
  }
  if (questionId === "faim_emotionnelle" && (val.includes("4") || val.includes("5"))) {
    annotations.push({
      icon: "⚠️",
      text: "Faim émotionnelle importante. VISIO : Travailler les stratégies alternatives (respiration, journal alimentaire).",
    });
  }
  if (questionId === "sommeil" && (val.includes("1") || val.includes("2"))) {
    annotations.push({
      icon: "💡",
      text: "VISIO : Routine du coucher, exposition écrans, dernier repas, magnésium, phytothérapie.",
    });
  }

  // Hormonal
  if (questionId === "thyroide" && val.includes("oui")) {
    annotations.push({
      icon: "💡",
      text: "VISIO : Demander les derniers bilans thyroïdiens (TSH, T3, T4). Traitement en cours ? Dosage ?",
    });
  }
  if (questionId === "cycle_regulier" && val.includes("non")) {
    annotations.push({
      icon: "💡",
      text: "VISIO : Durée des cycles, symptômes associés. Bilan hormonal récent ? Contraception ?",
    });
  }
  if (questionId === "spm" && val.includes("oui")) {
    annotations.push({
      icon: "💡",
      text: "SPM confirmé → explorer magnésium, vitamine B6, oméga-3, gattilier. Timing dans le cycle.",
    });
  }

  // Terrain
  if (questionId === "problemes_peau" && val.includes("oui")) {
    annotations.push({
      icon: "💡",
      text: "VISIO : Type de problème (acné, eczéma, psoriasis ?), localisation, lien avec alimentation ou stress.",
    });
  }
  if (questionId === "activite_physique_freq" && val.includes("jamais")) {
    annotations.push({
      icon: "⚠️",
      text: "Sédentarité totale. VISIO : Explorer les freins, proposer une activité douce et progressive.",
    });
  }
  if (questionId === "temps_assis" && val.includes("+8h")) {
    annotations.push({
      icon: "⚠️",
      text: "+8h assis/jour → impact inflammatoire et métabolique. Proposer des micro-pauses actives.",
    });
  }

  // Nouvelles questions — Régime alimentaire
  if (questionId === "regime_alimentaire") {
    if (val.includes("vegan")) {
      annotations.push({
        icon: "🔴",
        text: "Régime végan → VISIO : Vérifier B12, fer, zinc, oméga-3, calcium, vitamine D. Complémentation obligatoire.",
      });
    }
    if (val.includes("vegetarien")) {
      annotations.push({
        icon: "💡",
        text: "Végétarien → VISIO : Vérifier fer, B12, zinc. Combinaisons protéiques végétales suffisantes ?",
      });
    }
    if (val.includes("cetogene")) {
      annotations.push({
        icon: "⚠️",
        text: "Régime cétogène → VISIO : Depuis combien de temps ? Suivi médical ? Impact sur thyroïde et cortisol à long terme.",
      });
    }
    if (val.includes("jeune_intermittent")) {
      annotations.push({
        icon: "💡",
        text: "Jeûne intermittent → VISIO : Fenêtre horaire ? Apports suffisants sur les repas ? Impact sur énergie et hormones.",
      });
    }
  }

  // Heure dernier repas
  if (questionId === "heure_dernier_repas" && val.includes("apres_21h")) {
    annotations.push({
      icon: "⚠️",
      text: "Repas tardif (après 21h) → perturbation du rythme circadien, digestion compromise, impact sommeil et métabolisme.",
    });
  }

  // Sel
  if (questionId === "sel" && val.includes("systematique")) {
    annotations.push({
      icon: "⚠️",
      text: "Ajout systématique de sel → VISIO : Vérifier tension artérielle. Rétention d'eau ? Éduquer au goût.",
    });
  }

  // Évolution du poids
  if (questionId === "evolution_poids") {
    if (val.includes("prise_importante")) {
      annotations.push({
        icon: "🔴",
        text: "Prise de poids importante sur 6 mois → VISIO : Événement déclencheur ? Changement de mode de vie ? Bilan hormonal ?",
      });
    }
    if (val.includes("perte_importante")) {
      annotations.push({
        icon: "🔴",
        text: "Perte de poids importante → VISIO : Volontaire ou involontaire ? Si involontaire, orienter vers bilan médical.",
      });
    }
    if (val.includes("yoyo")) {
      annotations.push({
        icon: "⚠️",
        text: "Effet yoyo → VISIO : Historique des régimes, relation à l'alimentation. Stabilisation métabolique avant toute restriction.",
      });
    }
  }

  // Oléagineux
  if (questionId === "freq_oleagineux" && val.includes("jamais")) {
    annotations.push({
      icon: "💡",
      text: "Aucun oléagineux → manque de bons lipides, magnésium, sélénium. Introduire progressivement.",
    });
  }

  // Volaille
  if (questionId === "freq_volaille" && val.includes("jamais") && !val.includes("vegan") && !val.includes("vegetarien")) {
    annotations.push({
      icon: "💡",
      text: "VISIO : Pas de volaille → vérifier les sources de protéines maigres alternatives.",
    });
  }

  // Sommeil durée
  if (questionId === "sommeil_duree") {
    if (val.includes("<5h")) {
      annotations.push({
        icon: "🔴",
        text: "Moins de 5h de sommeil → URGENT. Impact majeur : cortisol, r��sistance à l'insuline, inflammation, prise de poids. Priorité n°1.",
      });
    }
    if (val.includes("5-6h")) {
      annotations.push({
        icon: "⚠️",
        text: "Sommeil insuffisant (5-6h) → VISIO : Identifier les causes (écrans, stress, travail ?). Objectif 7h minimum.",
      });
    }
  }

  // Heure coucher
  if (questionId === "heure_coucher" && val.includes("apres_00h")) {
    annotations.push({
      icon: "⚠️",
      text: "Coucher après minuit → décalage circadien. Impact cortisol, mélatonine, récupération. Recaler progressivement.",
    });
  }

  // Grossesse / Allaitement
  if (questionId === "grossesse_allaitement") {
    if (val.includes("enceinte") || val.includes("enceinte_allaitement")) {
      annotations.push({
        icon: "🔴",
        text: "GROSSESSE EN COURS → Adapter TOUTES les recommandations. Pas de détox, pas de jeûne. Vérifier folates, fer, iode, DHA.",
      });
    }
    if (val.includes("allaitement") || val.includes("enceinte_allaitement")) {
      annotations.push({
        icon: "⚠️",
        text: "Allaitement en cours → besoins caloriques et hydriques accrus. Pas de restriction. Qualité nutritionnelle ++.",
      });
    }
  }

  // Thyroïde détaillée
  if (questionId === "thyroide_type") {
    if (val.includes("hashimoto")) {
      annotations.push({
        icon: "🔴",
        text: "Hashimoto → VISIO : Bilan complet (anti-TPO, anti-TG). Alimentation anti-inflammatoire, éviter gluten ? Sélénium, zinc.",
      });
    }
    if (val.includes("hypothyroidie")) {
      annotations.push({
        icon: "💡",
        text: "Hypothyroïdie → VISIO : Traitement actuel ? Dosage TSH récent ? Aliments goitrogènes à modérer si crus.",
      });
    }
    if (val.includes("hyperthyroidie") || val.includes("basedow")) {
      annotations.push({
        icon: "💡",
        text: "Hyperthyroïdie/Basedow → VISIO : Besoins caloriques augmentés, perte de poids ? Risque cardiaque, anxiété.",
      });
    }
  }

  // Troubles digestifs — fréquence
  if (questionId === "troubles_digestifs_frequence" && val.includes("permanent")) {
    annotations.push({
      icon: "🔴",
      text: "Troubles digestifs permanents → VISIO : Bilan médical fait ? Envisager test SIBO, coloscopie, bilan coeliaque si non fait.",
    });
  }

  // Fatigue post-repas moment
  if (questionId === "fatigue_post_repas_moment" && val.includes("midi")) {
    annotations.push({
      icon: "💡",
      text: "Fatigue après le déjeuner → VISIO : Analyser la composition du repas de midi. Charge glycémique ? Trop de glucides ?",
    });
  }

  // Libido (échelle)
  if (questionId === "libido" && (val.includes("1") || val.includes("2"))) {
    annotations.push({
      icon: "💡",
      text: "Libido basse → VISIO : Lien hormonal (testostérone, oestrogènes), stress, fatigue, thyroïde. Zinc, maca, ashwagandha.",
    });
  }

  // Motivation
  if (questionId === "motivation_niveau") {
    const level = parseInt(val[0] || "5");
    if (level >= 8) {
      annotations.push({
        icon: "✅",
        text: `Motivation ${level}/10 — Très motivé(e). Profil idéal pour le programme 90 jours.`,
      });
    } else if (level <= 4) {
      annotations.push({
        icon: "💡",
        text: `Motivation ${level}/10 — Faible. VISIO : Comprendre les freins, ajuster les attentes, objectifs réalistes.`,
      });
    }
  }
  if (questionId === "pret_90_jours") {
    if (val.includes("oui")) {
      annotations.push({
        icon: "✅",
        text: "Prêt(e) pour le programme 90 jours. Présenter l'offre en fin de visio.",
      });
    } else if (val.includes("pourquoi_pas")) {
      annotations.push({
        icon: "💡",
        text: "Intéressé(e) mais hésitant(e). VISIO : Répondre aux objections, montrer la valeur concrète.",
      });
    }
  }

  return annotations;
}

// ============================================================================
// Génération du dossier patient (format texte structuré)
// ============================================================================

function generatePatientDossier(
  answers: Record<string, string | string[]>,
  result: BilanResult
): string {
  const prenom = (answers.prenom as string) || "Patient";
  const nom = (answers.nom as string) || "";
  const email = (answers.email as string) || "N/A";
  const age = (answers.age as string) || "N/A";
  const sexe = (answers.sexe as string) || "N/A";
  const taille = (answers.taille as string) || "N/A";
  const poids = (answers.poids as string) || "N/A";

  const imc = taille && poids ? (
    parseFloat(poids) / Math.pow(parseFloat(taille) / 100, 2)
  ).toFixed(1) : "N/A";

  let dossier = `
══════════════════════════════════════════════════════════
  DOSSIER PATIENT — PRÉPARATION VISIO
  NutriByMeli — Mélissa P., Diététicienne DE & Naturopathe
══════════════════════════════════════════════════════════

📋 INFORMATIONS PATIENT
───────────────────────
  Nom complet : ${prenom} ${nom}
  Email       : ${email}
  Âge         : ${age} ans
  Sexe        : ${sexe === "femme" ? "Femme" : "Homme"}
  Taille      : ${taille} cm
  Poids       : ${poids} kg
  IMC         : ${imc}${imc !== "N/A" ? ` (${parseFloat(imc) < 18.5 ? "insuffisance pondérale" : parseFloat(imc) < 25 ? "poids normal" : parseFloat(imc) < 30 ? "surpoids" : "obésité"})` : ""}

📊 SCORE GLOBAL : ${result.overallScore}/100
───────────────────────
${result.overallScore >= 80 ? "✅ Terrain globalement équilibré" : result.overallScore >= 55 ? "⚠️ Quelques axes à surveiller" : result.overallScore >= 30 ? "🟠 Plusieurs axes à travailler" : "🔴 Prise en charge recommandée"}

📈 SCORES PAR AXE
───────────────────────
${result.axes.map((a) => {
  const bar = "█".repeat(Math.round(a.score / 10)) + "░".repeat(10 - Math.round(a.score / 10));
  return `  ${bar} ${a.score}/100  ${a.label} (${a.level})`;
}).join("\n")}

`;

  // Red flags
  if (result.redFlags.length > 0) {
    dossier += `\n🚨 DRAPEAUX ROUGES — ATTENTION MÉDICALE
───────────────────────\n`;
    result.redFlags.forEach((flag) => {
      dossier += `  🔴 ${flag.message}\n     → ${flag.recommendation}\n\n`;
    });
  }

  // Patterns
  if (result.detectedPatterns.length > 0) {
    dossier += `\n🔍 PATTERNS CLINIQUES DÉTECTÉS
───────────────────────\n`;
    result.detectedPatterns.forEach((p) => {
      const icon = p.severity === "alert" ? "🟠" : p.severity === "warning" ? "⚠️" : "ℹ️";
      dossier += `  ${icon} ${p.name}\n     ${p.description}\n\n`;
    });
  }

  // Priorités
  if (result.topPriorities.length > 0) {
    dossier += `\n🎯 TOP PRIORITÉS
───────────────────────\n`;
    result.topPriorities.forEach((p, i) => {
      dossier += `  ${i + 1}. ${p}\n`;
    });
  }

  // Réponses détaillées avec annotations
  dossier += `\n\n══════════════════════════════════════════════════════════
  RÉPONSES DÉTAILLÉES + ANNOTATIONS VISIO
══════════════════════════════════════════════════════════\n`;

  for (const section of SECTIONS) {
    dossier += `\n\n📂 ${section.title.toUpperCase()}
───────────────────────\n`;

    for (const question of section.questions) {
      const answer = answers[question.id];
      if (answer === undefined || answer === "") continue;

      const displayAnswer = Array.isArray(answer) ? answer.join(", ") : answer;

      // Trouver le label de la réponse si c'est une option
      let answerLabel = displayAnswer;
      if (question.options) {
        if (Array.isArray(answer)) {
          answerLabel = answer
            .map((v) => question.options?.find((o) => o.value === v)?.label || v)
            .join(", ");
        } else {
          answerLabel = question.options.find((o) => o.value === answer)?.label || answer;
        }
      }

      dossier += `\n  Q: ${question.label}\n  R: ${answerLabel}\n`;

      // Annotations cliniques
      const annotations = getAnnotations(question.id, answer);
      if (annotations.length > 0) {
        annotations.forEach((a) => {
          dossier += `  ${a.icon} ${a.text}\n`;
        });
      }
    }
  }

  // Rappel 24h
  const rappel = answers.rappel_24h as string;
  if (rappel) {
    dossier += `\n\n📝 RAPPEL 24H (VERBATIM)
───────────────────────
${rappel}

💡 VISIO : Reprendre ce rappel point par point. Identifier les écarts entre la réalité et les recommandations.
`;
  }

  // Motivation
  const motivation = answers.motivation_pourquoi as string;
  if (motivation) {
    dossier += `\n\n💪 MOTIVATION DU PATIENT (VERBATIM)
───────────────────────
"${motivation}"

💡 VISIO : Utiliser cette motivation comme levier tout au long de l'accompagnement.
`;
  }

  dossier += `\n\n══════════════════════════════════════════════════════════
  FIN DU DOSSIER — Généré automatiquement par NutriByMeli
  Date : ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
══════════════════════════════════════════════════════════\n`;

  return dossier;
}

// ============================================================================
// API Route
// ============================================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers, result } = body as {
      answers: Record<string, string | string[]>;
      result: BilanResult;
    };

    if (!answers || !result) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    const prenom = (answers.prenom as string) || "Patient";
    const nom = (answers.nom as string) || "";
    const patientEmail = (answers.email as string) || "";

    // Générer le dossier patient annoté
    const dossier = generatePatientDossier(answers, result);

    // Résumé rapide pour l'objet de l'email
    const worstAxes = result.axes
      .filter((a) => a.score < 55)
      .map((a) => a.label);
    const summary = worstAxes.length > 0
      ? `Axes à travailler : ${worstAxes.join(", ")}`
      : "Terrain globalement bon";

    // === EMAIL 1 : Notification à Mélissa (dossier complet) ===
    if (resend) {
      await resend.emails.send({
        from: "NutriByMeli <notifications@nutri-meli.com>",
        to: [MELISSA_EMAIL],
        subject: `📋 Nouveau bilan — ${prenom} ${nom} (${result.overallScore}/100) — ${summary}`,
        text: dossier,
      });

      // === EMAIL 2 : Confirmation au patient (HTML pro) ===
      if (patientEmail) {
        const scoreColor = result.overallScore >= 80 ? "#6B9E6B" : result.overallScore >= 55 ? "#E5A100" : result.overallScore >= 30 ? "#E07A3A" : "#D94343";
        const scoreLabel = result.overallScore >= 80 ? "Terrain globalement équilibré" : result.overallScore >= 55 ? "Quelques axes méritent attention" : result.overallScore >= 30 ? "Plusieurs axes à travailler" : "Prise en charge recommandée";

        const axesHtml = result.axes.map((a) => {
          const color = a.score >= 80 ? "#6B9E6B" : a.score >= 55 ? "#E5A100" : a.score >= 30 ? "#E07A3A" : "#D94343";
          const levelLabel = a.level === "optimal" ? "Optimal" : a.level === "attention" ? "À surveiller" : a.level === "préoccupant" ? "Préoccupant" : "Critique";
          return `
            <tr>
              <td style="padding:12px 16px;font-size:14px;color:#333;border-bottom:1px solid #f0ede8;">${a.label}</td>
              <td style="padding:12px 16px;border-bottom:1px solid #f0ede8;">
                <div style="background:#f0ede8;border-radius:20px;overflow:hidden;height:8px;width:100%;">
                  <div style="background:${color};height:8px;width:${a.score}%;border-radius:20px;"></div>
                </div>
              </td>
              <td style="padding:12px 16px;font-size:14px;font-weight:600;color:${color};border-bottom:1px solid #f0ede8;text-align:right;white-space:nowrap;">${a.score}/100</td>
              <td style="padding:12px 16px;font-size:12px;color:${color};border-bottom:1px solid #f0ede8;white-space:nowrap;">${levelLabel}</td>
            </tr>`;
        }).join("");

        const patternsHtml = result.detectedPatterns.length > 0
          ? `<div style="background:#FFF8F0;border-left:4px solid #E07A3A;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
              <p style="margin:0 0 8px 0;font-weight:600;color:#333;font-size:14px;">${result.detectedPatterns.length} pattern(s) clinique(s) détecté(s)</p>
              <p style="margin:0;color:#666;font-size:13px;">Ces éléments seront analysés en détail lors de votre consultation personnalisée.</p>
            </div>`
          : "";

        const redFlagsHtml = result.redFlags.length > 0
          ? `<div style="background:#FFF5F5;border-left:4px solid #D94343;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
              <p style="margin:0 0 8px 0;font-weight:600;color:#D94343;font-size:14px;">${result.redFlags.length} signal(aux) d'alerte identifié(s)</p>
              <p style="margin:0;color:#666;font-size:13px;">Nous en parlerons en détail lors de la consultation pour adapter l'accompagnement.</p>
            </div>`
          : "";

        const prioritiesHtml = result.topPriorities.length > 0
          ? `<div style="margin:20px 0;">
              <p style="font-weight:600;color:#333;font-size:14px;margin:0 0 12px 0;">Vos priorités :</p>
              ${result.topPriorities.map((p, i) => `<div style="display:flex;align-items:center;gap:10px;margin:8px 0;">
                <span style="background:#6B9E6B;color:white;width:24px;height:24px;border-radius:50%;display:inline-block;text-align:center;line-height:24px;font-size:12px;font-weight:600;">${i + 1}</span>
                <span style="font-size:13px;color:#555;">${p}</span>
              </div>`).join("")}
            </div>`
          : "";

        const patientHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F9F6F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">

    <!-- Header avec logo -->
    <div style="text-align:center;padding:32px 20px;">
      <div style="display:inline-block;">
        <span style="font-size:28px;font-weight:700;letter-spacing:-0.5px;"><span style="color:#6B9E6B;">Nutri</span><span style="color:#6B9E6B;">By</span><span style="color:#6B9E6B;">Meli</span></span>
        <p style="margin:4px 0 0 0;font-size:11px;color:#888;letter-spacing:0.5px;">Mélissa P. | Diététicienne & Naturopathe</p>
      </div>
    </div>

    <!-- Main Card -->
    <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

      <!-- Message personnel de Mélissa -->
      <div style="padding:32px 32px 24px 32px;">
        <h1 style="margin:0 0 16px 0;font-size:22px;color:#1a1a1a;">Bonjour ${prenom},</h1>
        <p style="margin:0 0 12px 0;color:#555;font-size:15px;line-height:1.7;">Je tenais à vous remercier personnellement d'avoir pris le temps de compléter ce bilan. C'est une belle première étape vers un meilleur équilibre, et je suis ravie de vous accompagner dans cette démarche.</p>
        <p style="margin:0;color:#555;font-size:15px;line-height:1.7;">J'ai analysé vos réponses avec attention. Voici une synthèse de votre pré-bilan :</p>
      </div>

      <!-- Score global -->
      <div style="margin:0 32px;padding:28px;background:linear-gradient(135deg,${scoreColor}10,${scoreColor}05);border:2px solid ${scoreColor}20;border-radius:16px;text-align:center;">
        <p style="margin:0 0 4px 0;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;">Score global</p>
        <p style="margin:0;font-size:48px;font-weight:700;color:${scoreColor};">${result.overallScore}<span style="font-size:20px;color:#aaa;">/100</span></p>
        <p style="margin:8px 0 0 0;font-size:14px;color:${scoreColor};font-weight:500;">${scoreLabel}</p>
      </div>

      <!-- Axes -->
      <div style="padding:28px 32px;">
        <h2 style="margin:0 0 16px 0;font-size:16px;color:#1a1a1a;">Vos 6 axes de santé</h2>
        <table style="width:100%;border-collapse:collapse;">
          ${axesHtml}
        </table>
      </div>

      <!-- Patterns & Red Flags -->
      <div style="padding:0 32px;">
        ${patternsHtml}
        ${redFlagsHtml}
        ${prioritiesHtml}
      </div>

      <!-- CTA -->
      <div style="padding:32px;text-align:center;border-top:1px solid #f0ede8;margin-top:20px;">
        <h2 style="margin:0 0 8px 0;font-size:18px;color:#1a1a1a;">Prochaine étape</h2>
        <p style="margin:0 0 24px 0;color:#666;font-size:14px;line-height:1.6;">60 minutes en visio pour approfondir votre bilan et construire votre feuille de route personnalisée.</p>
        <a href="https://nutri-meli.com" style="display:inline-block;background:#6B9E6B;color:white;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:600;font-size:15px;">Réserver ma consultation</a>
      </div>

    </div>

    <!-- Signature pro -->
    <div style="padding:24px 20px;">
      <div style="background:white;border-radius:12px;padding:24px;box-shadow:0 1px 6px rgba(0,0,0,0.04);">
        <table style="border-collapse:collapse;width:100%;">
          <tr>
            <td style="vertical-align:top;padding-right:16px;width:60px;">
              <img src="https://nutri-meli.com/melissa-profil.jpg" alt="Mélissa Pommez" width="56" height="56" style="border-radius:50%;object-fit:cover;display:block;" />
            </td>
            <td style="vertical-align:top;">
              <p style="margin:0 0 2px 0;font-size:14px;font-weight:600;color:#1a1a1a;">Mélissa Pommez</p>
              <p style="margin:0 0 8px 0;font-size:12px;color:#6B9E6B;font-weight:500;">Diététicienne Diplômée d'État & Naturopathe</p>
              <p style="margin:0 0 3px 0;font-size:11px;color:#888;">🎓 Expertise certifiée</p>
              <p style="margin:0 0 3px 0;font-size:11px;color:#888;">🔒 Secret professionnel garanti</p>
              <p style="margin:0 0 6px 0;font-size:11px;color:#888;">📍 Guadeloupe</p>
              <p style="margin:0;">
                <a href="https://nutri-meli.com" style="font-size:12px;color:#6B9E6B;text-decoration:none;font-weight:500;">nutri-meli.com</a>
              </p>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Legal -->
    <div style="text-align:center;padding:8px 20px 24px 20px;">
      <p style="margin:0;font-size:11px;color:#bbb;line-height:1.5;">Cet email est envoyé automatiquement suite à votre bilan nutritionnel.<br>Vos données sont protégées par le secret professionnel conformément au RGPD.</p>
    </div>

  </div>
</body>
</html>`;

        await resend!.emails.send({
          from: "Mélissa P. — NutriByMeli <contact@nutri-meli.com>",
          to: [patientEmail],
          subject: `${prenom}, votre pré-bilan NutriByMeli est prêt`,
          html: patientHtml,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Bilan envoyé avec succès",
    });
  } catch (error) {
    console.error("Erreur API bilan:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du bilan" },
      { status: 500 }
    );
  }
}
