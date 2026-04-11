import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SECTIONS } from "@/data/questionnaire";
import {
  AXIS_LABELS,
  type BilanResult,
  type AxisScore,
} from "@/data/scoring";
import { generateDossierPDF, generateBriefingPDF } from "@/lib/generate-pdfs";

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

    // Générer les PDFs
    const dossierPDF = generateDossierPDF(answers, result, getAnnotations);
    const briefingPDF = generateBriefingPDF(answers, result, getAnnotations);

    // Résumé rapide pour l'objet de l'email
    const worstAxes = result.axes
      .filter((a) => a.score < 55)
      .map((a) => a.label);
    const summary = worstAxes.length > 0
      ? `Axes à travailler : ${worstAxes.join(", ")}`
      : "Terrain globalement bon";

    // === EMAIL 1 : Notification à Mélissa (dossier + PDFs) ===
    if (resend) {
      await resend.emails.send({
        from: "NutriByMeli <notifications@nutri-meli.com>",
        to: [MELISSA_EMAIL],
        subject: `Nouveau bilan — ${prenom} ${nom} (${result.overallScore}/100) — ${summary}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#2D5A3D;">Nouveau bilan recu</h2>
          <p><strong>${prenom} ${nom}</strong> vient de completer son questionnaire.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Score global</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;font-size:18px;color:${result.overallScore >= 65 ? "#6B9E6B" : result.overallScore >= 45 ? "#E5A100" : "#D94343"};">${result.overallScore}/100</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${patientEmail}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Axes critiques</td><td style="padding:8px;border-bottom:1px solid #eee;">${worstAxes.length > 0 ? worstAxes.join(", ") : "Aucun"}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Red flags</td><td style="padding:8px;border-bottom:1px solid #eee;color:${result.redFlags.length > 0 ? "#D94343" : "#6B9E6B"};">${result.redFlags.length > 0 ? result.redFlags.length + " signal(aux)" : "Aucun"}</td></tr>
          </table>
          <p style="color:#888;font-size:13px;">2 PDFs en piece jointe :<br>- <strong>Dossier patient</strong> : recap complet du questionnaire avec annotations<br>- <strong>Briefing visio</strong> : notes de preparation pour ta consultation</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <pre style="font-size:12px;color:#555;white-space:pre-wrap;line-height:1.6;">${dossier}</pre>
        </div>`,
        attachments: [
          {
            filename: `Dossier_${prenom}_${nom}_${new Date().toISOString().split("T")[0]}.pdf`,
            content: dossierPDF,
          },
          {
            filename: `Briefing_Visio_${prenom}_${nom}_${new Date().toISOString().split("T")[0]}.pdf`,
            content: briefingPDF,
          },
        ],
      });

      // === EMAIL 2 : Confirmation au patient (HTML pro) ===
      if (patientEmail) {
        const scoreColor = result.overallScore >= 65 ? "#6B9E6B" : result.overallScore >= 45 ? "#E5A100" : result.overallScore >= 25 ? "#E07A3A" : "#D94343";
        const scoreLabel = result.overallScore >= 65 ? "Terrain globalement équilibré" : result.overallScore >= 45 ? "Quelques axes méritent attention" : result.overallScore >= 25 ? "Plusieurs axes à travailler" : "Prise en charge recommandée";

        const axesHtml = result.axes.map((a) => {
          const color = a.score >= 65 ? "#6B9E6B" : a.score >= 45 ? "#E5A100" : a.score >= 25 ? "#E07A3A" : "#D94343";
          const levelLabel = a.score >= 65 ? "Bon" : a.score >= 45 ? "À améliorer" : a.score >= 25 ? "Préoccupant" : "Critique";
          const pct = Math.max(a.score, 5);
          return `<tr>
            <td colspan="3" style="padding:10px 0 2px 0;font-size:13px;color:#333333;font-weight:500;">${a.label} <span style="float:right;color:${color};font-weight:700;">${a.score}/100 <span style="font-weight:400;font-size:11px;">${levelLabel}</span></span></td>
          </tr>
          <tr>
            <td colspan="3" style="padding:0 0 10px 0;border-bottom:1px solid #f0f0f0;">
              <!--[if mso]><table width="${pct}%" cellpadding="0" cellspacing="0"><tr><td style="background:${color};height:8px;font-size:1px;">&nbsp;</td></tr></table><![endif]-->
              <!--[if !mso]><!--><div style="background-color:#f0ede8;border-radius:4px;height:8px;width:100%;"><div style="background-color:${color};border-radius:4px;height:8px;width:${pct}%;"></div></div><!--<![endif]-->
            </td>
          </tr>`;
        }).join("");

        const alertsHtml: string[] = [];
        if (result.detectedPatterns.length > 0) {
          alertsHtml.push(`<p style="margin:12px 0 4px 0;font-size:13px;color:#E07A3A;font-weight:600;">${result.detectedPatterns.length} pattern(s) clinique(s) détecté(s)</p><p style="margin:0;font-size:13px;color:#666666;">Ces éléments seront analysés lors de votre consultation.</p>`);
        }
        if (result.redFlags.length > 0) {
          alertsHtml.push(`<p style="margin:12px 0 4px 0;font-size:13px;color:#D94343;font-weight:600;">${result.redFlags.length} signal(aux) d'alerte identifié(s)</p><p style="margin:0;font-size:13px;color:#666666;">Nous en parlerons en détail lors de la consultation.</p>`);
        }

        const prioritiesHtml = result.topPriorities.length > 0
          ? `<p style="margin:16px 0 8px 0;font-size:14px;font-weight:600;color:#333333;">Vos priorités :</p>` +
            result.topPriorities.map((p, i) => `<p style="margin:4px 0;font-size:13px;color:#555555;"><span style="color:#6B9E6B;font-weight:700;">${i + 1}.</span> ${p}</p>`).join("")
          : "";

        const patientHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Logo -->
<tr><td align="center" style="padding:30px 20px 10px 20px;">
<img src="https://nutri-meli.com/logo-email.png" alt="NutriByMeli" width="160" style="display:block;max-width:160px;height:auto;" />
</td></tr>

<!-- Contenu -->
<tr><td style="padding:0 24px;">

<p style="margin:0;font-size:1px;line-height:1px;height:20px;">&nbsp;</p>
<h1 style="margin:0 0 12px 0;font-size:22px;color:#1a1a1a;font-weight:700;">Bonjour ${prenom},</h1>
<p style="margin:0 0 10px 0;color:#555555;font-size:15px;line-height:1.7;">Je tenais à vous remercier personnellement d'avoir pris le temps de compléter ce bilan. C'est une belle première étape vers un meilleur équilibre, et je suis ravie de vous accompagner dans cette démarche.</p>
<p style="margin:0 0 24px 0;color:#555555;font-size:15px;line-height:1.7;">J'ai analysé vos réponses avec attention. Voici une synthèse de votre pré-bilan :</p>

<!-- Score -->
<table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e0e0e0;border-radius:10px;margin:0 0 24px 0;">
<tr><td align="center" style="padding:20px;">
<p style="margin:0 0 4px 0;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:1px;">Score global</p>
<p style="margin:0;font-size:44px;font-weight:700;color:${scoreColor};">${result.overallScore}<span style="font-size:18px;color:#aaaaaa;">/100</span></p>
<p style="margin:6px 0 0 0;font-size:14px;color:${scoreColor};">${scoreLabel}</p>
</td></tr>
</table>

<!-- Axes -->
<h2 style="margin:0 0 10px 0;font-size:16px;color:#1a1a1a;">Vos 6 axes de santé</h2>
<table width="100%" cellpadding="0" cellspacing="0">
${axesHtml}
</table>

<!-- Alertes -->
${alertsHtml.join("")}

<!-- Priorités -->
${prioritiesHtml}

<!-- CTA -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0 0;border-top:1px solid #eeeeee;">
<tr><td align="center" style="padding:24px 0;">
<h2 style="margin:0 0 8px 0;font-size:18px;color:#1a1a1a;">Prochaine étape</h2>
<p style="margin:0 0 16px 0;color:#666666;font-size:14px;line-height:1.6;">60 minutes en visio pour approfondir votre bilan et construire votre feuille de route personnalisée.</p>
<a href="https://nutri-meli.com" style="background-color:#6B9E6B;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:50px;font-weight:600;font-size:15px;display:inline-block;">Réserver ma consultation</a>
</td></tr>
</table>

<!-- Signature -->
<table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eeeeee;margin:8px 0 0 0;">
<tr>
<td width="56" style="padding:16px 12px 16px 0;vertical-align:top;">
<img src="https://nutri-meli.com/melissa-profil.jpg" alt="Mélissa Pommez" width="48" height="48" style="border-radius:50%;display:block;" />
</td>
<td style="padding:16px 0;vertical-align:top;">
<p style="margin:0 0 2px 0;font-size:14px;font-weight:600;color:#1a1a1a;">Mélissa Pommez</p>
<p style="margin:0 0 6px 0;font-size:12px;color:#6B9E6B;">Diététicienne Diplômée d'État &amp; Naturopathe</p>
<p style="margin:0 0 2px 0;font-size:11px;color:#888888;"><span style="color:#6B9E6B;font-weight:700;">&#10003;</span> Expertise certifiée &nbsp; <span style="color:#6B9E6B;font-weight:700;">&#10003;</span> Secret professionnel</p>
<p style="margin:0 0 4px 0;font-size:11px;color:#888888;">&#128205; Guadeloupe</p>
<p style="margin:0;font-size:11px;"><a href="https://nutri-meli.com" style="color:#6B9E6B;text-decoration:none;">nutri-meli.com</a> &nbsp;|&nbsp; <a href="mailto:contact@nutri-meli.com" style="color:#6B9E6B;text-decoration:none;">contact@nutri-meli.com</a></p>
</td>
</tr>
</table>

</td></tr>

<!-- Legal -->
<tr><td align="center" style="padding:16px 24px 24px 24px;">
<p style="margin:0;font-size:11px;color:#bbbbbb;line-height:1.5;">Cet email est envoyé automatiquement suite à votre bilan.<br>Vos données sont protégées par le secret professionnel.</p>
</td></tr>

</table>
</td></tr></table>
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
