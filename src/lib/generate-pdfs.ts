import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { SECTIONS, type Question } from "@/data/questionnaire";
import type { BilanResult } from "@/data/scoring";

// ============================================================================
// COULEURS & CONSTANTES
// ============================================================================

const COLORS = {
  green: [107, 158, 107] as [number, number, number],
  greenDark: [45, 90, 61] as [number, number, number],
  orange: [224, 122, 58] as [number, number, number],
  red: [217, 67, 67] as [number, number, number],
  yellow: [229, 161, 0] as [number, number, number],
  gray: [136, 136, 136] as [number, number, number],
  grayLight: [240, 237, 232] as [number, number, number],
  black: [26, 26, 26] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

function getScoreColor(score: number): [number, number, number] {
  if (score >= 65) return COLORS.green;
  if (score >= 45) return COLORS.yellow;
  if (score >= 25) return COLORS.orange;
  return COLORS.red;
}

function getScoreLabel(score: number): string {
  if (score >= 65) return "Bon";
  if (score >= 45) return "A ameliorer";
  if (score >= 25) return "Preoccupant";
  return "Critique";
}

// Helper to sanitize text for jsPDF (remove emojis that cause issues)
function sanitize(text: string): string {
  return text
    .replace(/[\u{1F600}-\u{1F9FF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[💡⚠️🔴📍🎓🔒]/g, "")
    .trim();
}

// Helper to format answer for display
function formatAnswer(
  question: Question,
  answer: string | string[]
): string {
  const vals = Array.isArray(answer) ? answer : [answer];

  if (question.options) {
    return vals
      .map((v) => {
        const opt = question.options!.find((o) => o.value === v);
        return opt ? opt.label : v;
      })
      .join(", ");
  }

  if (question.type === "scale") {
    return `${vals[0]}/${question.max || 5}`;
  }

  return vals.join(", ");
}

// ============================================================================
// PDF 1 : DOSSIER PATIENT COMPLET
// ============================================================================

export function generateDossierPDF(
  answers: Record<string, string | string[]>,
  result: BilanResult,
  getAnnotations: (qId: string, answer: string | string[]) => { icon: string; text: string }[]
): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const prenom = (answers.prenom as string) || "Patient";
  const nom = (answers.nom as string) || "";
  const email = (answers.email as string) || "";
  const age = (answers.age as string) || "";
  const sexe = (answers.sexe as string) || "";
  const taille = (answers.taille as string) || "";
  const poids = (answers.poids as string) || "";

  // --- HEADER ---
  doc.setFillColor(...COLORS.greenDark);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("NutriByMeli", margin, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Dossier Patient Complet", margin, 26);

  doc.setFontSize(9);
  doc.text(`Genere le ${new Date().toLocaleDateString("fr-FR")}`, margin, 33);

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`${prenom} ${nom}`, pageWidth - margin, 18, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(email, pageWidth - margin, 26, { align: "right" });

  y = 50;

  // --- INFOS PATIENT ---
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Informations patient", margin, y);
  y += 8;

  // Calculate IMC
  const tailleNum = parseFloat(taille);
  const poidsNum = parseFloat(poids);
  const imc = tailleNum > 0 ? poidsNum / ((tailleNum / 100) ** 2) : 0;
  const imcRounded = Math.round(imc * 10) / 10;
  const imcCat = imc < 18.5 ? "Maigreur" : imc < 25 ? "Normal" : imc < 30 ? "Surpoids" : "Obesite";

  autoTable(doc, {
    startY: y,
    head: [],
    body: [
      ["Prenom / Nom", `${prenom} ${nom}`],
      ["Email", email],
      ["Age", age],
      ["Sexe", sexe === "homme" ? "Homme" : sexe === "femme" ? "Femme" : sexe],
      ["Taille / Poids", `${taille} cm / ${poids} kg`],
      ["IMC", `${imcRounded} (${imcCat})`],
    ],
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 45, textColor: COLORS.gray },
      1: { textColor: COLORS.black },
    },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // --- SCORE GLOBAL ---
  const scoreColor = getScoreColor(result.overallScore);
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(margin, y, contentWidth, 30, 3, 3, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(`${result.overallScore}/100`, margin + contentWidth / 2, y + 14, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const scoreText = result.overallScore >= 65 ? "Terrain globalement equilibre" : result.overallScore >= 45 ? "Quelques axes meritent attention" : result.overallScore >= 25 ? "Plusieurs axes a travailler" : "Prise en charge recommandee";
  doc.text(scoreText, margin + contentWidth / 2, y + 23, { align: "center" });

  y += 38;

  // --- 6 AXES ---
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Vos 6 axes de sante", margin, y);
  y += 3;

  const axesData = result.axes.map((a) => {
    const color = getScoreColor(a.score);
    return [a.label, `${a.score}/100`, getScoreLabel(a.score)];
  });

  autoTable(doc, {
    startY: y,
    head: [["Axe", "Score", "Niveau"]],
    body: axesData,
    theme: "striped",
    headStyles: {
      fillColor: COLORS.greenDark,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 10,
    },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: "center", fontStyle: "bold" },
      2: { cellWidth: 40, halign: "center" },
    },
    margin: { left: margin, right: margin },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    didParseCell: (data: any) => {
      if (data.section === "body" && (data.column.index === 1 || data.column.index === 2)) {
        const axis = result.axes[data.row.index];
        if (axis) {
          data.cell.styles.textColor = getScoreColor(axis.score) as unknown as number[];
        }
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // --- RED FLAGS ---
  if (result.redFlags.length > 0) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFillColor(255, 245, 245);
    doc.roundedRect(margin, y, contentWidth, 8 + result.redFlags.length * 12, 3, 3, "F");
    doc.setDrawColor(...COLORS.red);
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin, y + 8 + result.redFlags.length * 12);

    doc.setTextColor(...COLORS.red);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SIGNAUX D'ALERTE", margin + 6, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    result.redFlags.forEach((flag, i) => {
      doc.text(`- ${sanitize(flag.message)}`, margin + 6, y + 14 + i * 12);
      doc.setTextColor(...COLORS.gray);
      doc.text(sanitize(flag.recommendation), margin + 10, y + 19 + i * 12);
      doc.setTextColor(...COLORS.red);
    });

    y += 14 + result.redFlags.length * 12;
  }

  // --- PATTERNS ---
  if (result.detectedPatterns.length > 0) {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setTextColor(...COLORS.orange);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Patterns cliniques detectes", margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    result.detectedPatterns.forEach((p) => {
      doc.setTextColor(...COLORS.black);
      doc.text(`- ${sanitize(p.name)}`, margin + 4, y);
      y += 4;
      doc.setTextColor(...COLORS.gray);
      doc.text(sanitize(p.description), margin + 8, y);
      y += 6;
    });
    y += 4;
  }

  // ===========================================================================
  // SECTION PAR SECTION : REPONSES + ANNOTATIONS
  // ===========================================================================

  doc.addPage();
  y = 20;

  doc.setFillColor(...COLORS.greenDark);
  doc.rect(0, 0, pageWidth, 25, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Recapitulatif des reponses", margin, 16);
  y = 35;

  for (const section of SECTIONS) {
    // Check if we need a new page
    if (y > 250) { doc.addPage(); y = 20; }

    // Section header
    doc.setFillColor(...COLORS.grayLight);
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
    doc.setTextColor(...COLORS.greenDark);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(sanitize(section.title), margin + 4, y + 7);
    y += 14;

    for (const question of section.questions) {
      const answer = answers[question.id];
      if (!answer || (Array.isArray(answer) && answer.length === 0)) continue;

      // Check conditional
      if (question.conditionalOn) {
        const condAnswer = answers[question.conditionalOn.questionId];
        const condVals = Array.isArray(condAnswer) ? condAnswer : [condAnswer];
        if (!question.conditionalOn.values.some((v) => condVals.includes(v))) continue;
      }

      if (y > 265) { doc.addPage(); y = 20; }

      const formattedAnswer = formatAnswer(question, answer);
      const annotations = getAnnotations(question.id, answer);

      // Question label
      doc.setTextColor(...COLORS.gray);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const questionLines = doc.splitTextToSize(sanitize(question.label), contentWidth - 4);
      doc.text(questionLines, margin + 2, y);
      y += questionLines.length * 4;

      // Answer
      doc.setTextColor(...COLORS.black);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const answerLines = doc.splitTextToSize(sanitize(formattedAnswer), contentWidth - 4);
      doc.text(answerLines, margin + 2, y);
      y += answerLines.length * 5;

      // Annotations
      if (annotations.length > 0) {
        annotations.forEach((ann) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.setFillColor(255, 252, 245);
          const annText = sanitize(ann.text);
          const annLines = doc.splitTextToSize(annText, contentWidth - 16);
          const annHeight = annLines.length * 4 + 4;
          doc.roundedRect(margin + 4, y - 2, contentWidth - 8, annHeight, 1, 1, "F");

          const isRed = ann.icon.includes("🔴");
          const isWarn = ann.icon.includes("⚠");
          doc.setTextColor(isRed ? 217 : isWarn ? 224 : 107, isRed ? 67 : isWarn ? 122 : 158, isRed ? 67 : isWarn ? 58 : 107);
          doc.setFontSize(8);
          doc.setFont("helvetica", "italic");
          doc.text(annLines, margin + 8, y + 2);
          y += annHeight + 2;
        });
      }

      y += 4;
    }

    y += 4;
  }

  // --- RAPPEL 24H ---
  const rappel = answers.rappel_24h as string;
  if (rappel) {
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setTextColor(...COLORS.greenDark);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Rappel alimentaire 24h", margin, y);
    y += 6;

    doc.setTextColor(...COLORS.black);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const rappelLines = doc.splitTextToSize(sanitize(rappel), contentWidth - 4);
    doc.text(rappelLines, margin + 2, y);
    y += rappelLines.length * 5 + 6;
  }

  // --- MOTIVATION ---
  const motivation = answers.motivation_pourquoi as string;
  if (motivation) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setTextColor(...COLORS.greenDark);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Motivation du patient", margin, y);
    y += 6;

    doc.setTextColor(...COLORS.black);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const motLines = doc.splitTextToSize(sanitize(motivation), contentWidth - 4);
    doc.text(motLines, margin + 2, y);
    y += motLines.length * 5;
  }

  // --- FOOTER on each page ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    doc.text(
      `NutriByMeli - Melissa Pommez, Dieteticienne DE & Naturopathe | Document confidentiel | Page ${i}/${totalPages}`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}

// ============================================================================
// PDF 2 : BRIEFING VISIO (Notes de preparation pour Melissa)
// ============================================================================

export function generateBriefingPDF(
  answers: Record<string, string | string[]>,
  result: BilanResult,
  getAnnotations: (qId: string, answer: string | string[]) => { icon: string; text: string }[]
): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const prenom = (answers.prenom as string) || "Patient";
  const nom = (answers.nom as string) || "";

  // --- HEADER ---
  doc.setFillColor(...COLORS.green);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("BRIEFING VISIO", margin, 16);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Patient : ${prenom} ${nom}`, margin, 25);

  doc.setFontSize(9);
  doc.text(`Prepare le ${new Date().toLocaleDateString("fr-FR")} | NutriByMeli`, margin, 32);

  y = 45;

  // --- SYNTHESE RAPIDE ---
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Synthese rapide", margin, y);
  y += 8;

  // Score + IMC
  const tailleNum = parseFloat(answers.taille as string);
  const poidsNum = parseFloat(answers.poids as string);
  const imc = tailleNum > 0 ? poidsNum / ((tailleNum / 100) ** 2) : 0;
  const imcRounded = Math.round(imc * 10) / 10;

  const sexeLabel = (answers.sexe as string) === "homme" ? "Homme" : (answers.sexe as string) === "femme" ? "Femme" : (answers.sexe as string) || "";
  const objectifs = Array.isArray(answers.objectif) ? answers.objectif : [];

  autoTable(doc, {
    startY: y,
    head: [],
    body: [
      ["Score global", `${result.overallScore}/100`],
      ["IMC", `${imcRounded} kg/m2`],
      ["Profil", `${sexeLabel}, ${answers.age || "?"}, ${answers.taille || "?"}cm / ${answers.poids || "?"}kg`],
      ["Objectif(s)", objectifs.map((o) => {
        const map: Record<string, string> = {
          perdre_poids: "Perte de poids",
          prendre_poids: "Prise de poids",
          plus_energie: "Plus d'energie",
          meilleure_digestion: "Meilleure digestion",
          equilibre_alimentaire: "Equilibre alimentaire",
          gestion_stress: "Gestion du stress",
          performance_sportive: "Performance sportive",
          grossesse: "Grossesse/allaitement",
        };
        return map[o] || o;
      }).join(", ")],
      ["Motivation", `${answers.motivation || "?"}/10`],
    ],
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40, textColor: COLORS.green },
      1: { textColor: COLORS.black },
    },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // --- DRAPEAUX ROUGES ---
  if (result.redFlags.length > 0) {
    doc.setFillColor(255, 240, 240);
    const flagHeight = 12 + result.redFlags.length * 14;
    doc.roundedRect(margin, y, contentWidth, flagHeight, 3, 3, "F");

    doc.setTextColor(...COLORS.red);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DRAPEAUX ROUGES - A ABORDER EN PRIORITE", margin + 4, y + 8);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    result.redFlags.forEach((flag, i) => {
      doc.text(`! ${sanitize(flag.message)}`, margin + 6, y + 18 + i * 14);
      doc.setTextColor(...COLORS.gray);
      doc.setFontSize(9);
      doc.text(`  -> ${sanitize(flag.recommendation)}`, margin + 8, y + 23 + i * 14);
      doc.setTextColor(...COLORS.red);
      doc.setFontSize(10);
    });

    y += flagHeight + 6;
  }

  // --- AXES PROBLEMATIQUES ---
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Axes a travailler (par priorite)", margin, y);
  y += 3;

  const sortedAxes = [...result.axes].sort((a, b) => a.score - b.score);
  const axesTableData = sortedAxes.map((a) => {
    const label = getScoreLabel(a.score);
    const prios = a.priorities.length > 0 ? a.priorities.map((p) => sanitize(p)).join("\n") : "RAS";
    return [a.label, `${a.score}/100`, label, prios];
  });

  autoTable(doc, {
    startY: y,
    head: [["Axe", "Score", "Niveau", "Actions suggerees"]],
    body: axesTableData,
    theme: "striped",
    headStyles: {
      fillColor: COLORS.green,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 9,
    },
    styles: { fontSize: 9, cellPadding: 4, overflow: "linebreak" },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 20, halign: "center", fontStyle: "bold" },
      2: { cellWidth: 28, halign: "center" },
      3: { cellWidth: 70 },
    },
    margin: { left: margin, right: margin },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    didParseCell: (data: any) => {
      if (data.section === "body" && (data.column.index === 1 || data.column.index === 2)) {
        const axis = sortedAxes[data.row.index];
        if (axis) {
          data.cell.styles.textColor = getScoreColor(axis.score) as unknown as number[];
        }
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // --- NOTES CLINIQUES (toutes les annotations) ---
  if (y > 200) { doc.addPage(); y = 20; }

  doc.setTextColor(...COLORS.greenDark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Notes cliniques pour la visio", margin, y);
  y += 3;

  // Collect all annotations
  const allAnnotations: { question: string; notes: string[] }[] = [];

  for (const section of SECTIONS) {
    for (const question of section.questions) {
      const answer = answers[question.id];
      if (!answer || (Array.isArray(answer) && answer.length === 0)) continue;

      const annotations = getAnnotations(question.id, answer);
      if (annotations.length > 0) {
        allAnnotations.push({
          question: sanitize(question.label),
          notes: annotations.map((a) => sanitize(a.text)),
        });
      }
    }
  }

  if (allAnnotations.length > 0) {
    const notesData = allAnnotations.map((a) => [
      a.question,
      a.notes.join("\n"),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Question", "Notes / Points a aborder en visio"]],
      body: notesData,
      theme: "striped",
      headStyles: {
        fillColor: COLORS.greenDark,
        textColor: COLORS.white,
        fontStyle: "bold",
        fontSize: 9,
      },
      styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak" },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: "bold" },
        1: { cellWidth: 115 },
      },
      margin: { left: margin, right: margin },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setTextColor(...COLORS.gray);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Aucune annotation clinique particuliere pour ce profil.", margin, y + 6);
    y += 14;
  }

  // --- PATTERNS DETECTES ---
  if (result.detectedPatterns.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }

    doc.setTextColor(...COLORS.orange);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Patterns cliniques detectes", margin, y);
    y += 6;

    result.detectedPatterns.forEach((p) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setTextColor(...COLORS.black);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`- ${sanitize(p.name)}`, margin + 2, y);
      y += 4;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLORS.gray);
      doc.setFontSize(9);
      const descLines = doc.splitTextToSize(sanitize(p.description), contentWidth - 10);
      doc.text(descLines, margin + 6, y);
      y += descLines.length * 4 + 4;
    });
  }

  // --- GUIDE D'ENTRETIEN ---
  if (y > 200) { doc.addPage(); y = 20; }

  doc.setTextColor(...COLORS.greenDark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Guide d'entretien suggere", margin, y);
  y += 8;

  const entretienSteps = [
    {
      title: "1. Accueil & mise en confiance (5 min)",
      points: [
        "Remercier pour le questionnaire",
        "Expliquer le deroulement de la consultation",
        `Rappeler l'objectif principal : ${Array.isArray(answers.objectif) ? answers.objectif[0] || "equilibre" : "equilibre"}`,
      ],
    },
    {
      title: "2. Exploration du rappel 24h (10 min)",
      points: [
        "Reprendre le rappel alimentaire en detail",
        "Questionner les horaires, quantites, contexte emotionnel",
        "Identifier les ecarts entre ce qui est declare et la realite",
      ],
    },
    {
      title: "3. Approfondissement des axes critiques (15 min)",
      points: sortedAxes
        .filter((a) => a.score < 65)
        .slice(0, 3)
        .map((a) => `${a.label} (${a.score}/100) : approfondir les causes`),
    },
    {
      title: "4. Drapeaux rouges et patterns (10 min)",
      points: [
        ...(result.redFlags.length > 0 ? result.redFlags.map((f) => `ALERTE : ${sanitize(f.message)}`) : ["Aucun drapeau rouge identifie"]),
        ...(result.detectedPatterns.length > 0 ? result.detectedPatterns.map((p) => `Pattern : ${sanitize(p.name)}`) : []),
      ],
    },
    {
      title: "5. Plan d'action & objectifs (15 min)",
      points: [
        "Definir 3 objectifs concrets pour les 90 jours",
        ...result.topPriorities.slice(0, 3).map((p) => `Priorite : ${sanitize(p)}`),
        "Fixer le prochain rendez-vous de suivi",
      ],
    },
    {
      title: "6. Conclusion (5 min)",
      points: [
        "Recapituler les 3 actions principales",
        "S'assurer que le patient a bien compris",
        "Envoyer le plan d'action par email apres la visio",
      ],
    },
  ];

  entretienSteps.forEach((step) => {
    if (y > 260) { doc.addPage(); y = 20; }

    doc.setTextColor(...COLORS.green);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(step.title, margin, y);
    y += 5;

    doc.setTextColor(...COLORS.black);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    step.points.forEach((point) => {
      if (y > 275) { doc.addPage(); y = 20; }
      const lines = doc.splitTextToSize(`  - ${point}`, contentWidth - 10);
      doc.text(lines, margin + 4, y);
      y += lines.length * 4;
    });
    y += 4;
  });

  // --- FOOTER ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    doc.text(
      `CONFIDENTIEL - NutriByMeli | Briefing visio ${prenom} ${nom} | Page ${i}/${totalPages}`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}

// ============================================================================
// PDF 3 : ARGUMENTAIRE DE VENTE — Programme 90 Jours
// ============================================================================

export function generateArgumentairePDF(
  answers: Record<string, string | string[]>,
  result: BilanResult
): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const prenom = (answers.prenom as string) || "Patient";
  const nom = (answers.nom as string) || "";
  const sexe = (answers.sexe as string) || "";
  const accord = sexe === "femme" ? "e" : "";

  // Objectifs du patient
  const objectifs = Array.isArray(answers.objectif) ? answers.objectif : [];
  const objectifLabels: Record<string, string> = {
    perte_poids: "Perte de poids",
    prendre_poids: "Prise de poids",
    energie: "Retrouver de l'energie",
    digestion: "Ameliorer la digestion",
    hormones: "Equilibrer les hormones",
    alimentation: "Ameliorer l'alimentation",
    douleurs: "Diminuer les douleurs/inflammations",
    sommeil: "Mieux dormir",
    stress: "Gerer le stress",
  };

  // Axes faibles = arguments de vente
  const weakAxes = result.axes.filter((a) => a.score < 65).sort((a, b) => a.score - b.score);

  // IMC
  const tailleNum = parseFloat(answers.taille as string);
  const poidsNum = parseFloat(answers.poids as string);
  const imc = tailleNum > 0 ? poidsNum / ((tailleNum / 100) ** 2) : 0;

  // === HEADER ===
  doc.setFillColor(45, 90, 61);
  doc.rect(0, 0, pageWidth, 42, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ARGUMENTAIRE DE VENTE", margin, 18);

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.text("Programme 90 Jours - NutriByMeli", margin, 27);

  doc.setFontSize(9);
  doc.text(`Prepare pour : ${prenom} ${nom} | ${new Date().toLocaleDateString("fr-FR")}`, margin, 35);

  y = 52;

  // === PROFIL CLIENT ===
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Profil du/de la patient(e)", margin, y);
  y += 3;

  const motivationLevel = parseInt((answers.motivation as string) || (answers.motivation_niveau as string) || "5");
  const pret90 = (answers.pret_90_jours as string) || "";

  autoTable(doc, {
    startY: y,
    head: [],
    body: [
      ["Nom", `${prenom} ${nom}`],
      ["Score global", `${result.overallScore}/100 (${getScoreLabel(result.overallScore)})`],
      ["IMC", imc > 0 ? `${Math.round(imc * 10) / 10} kg/m2` : "N/A"],
      ["Objectif(s)", objectifs.map((o) => objectifLabels[o] || o).join(", ") || "Non precise"],
      ["Motivation", `${motivationLevel}/10`],
      ["Pret(e) 90 jours", pret90 === "oui" ? "OUI" : pret90 === "pourquoi_pas" ? "Interesse(e) mais hesitant(e)" : "Non pour l'instant"],
      ["Axes faibles", weakAxes.length > 0 ? weakAxes.map((a) => `${a.label} (${a.score})`).join(", ") : "Aucun"],
      ["Red flags", result.redFlags.length > 0 ? result.redFlags.map((f) => sanitize(f.message)).join(", ") : "Aucun"],
    ],
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40, textColor: COLORS.greenDark },
      1: { textColor: COLORS.black },
    },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // === STRATEGIE DE VENTE PERSONNALISEE ===
  doc.setTextColor(...COLORS.greenDark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Strategie de vente personnalisee", margin, y);
  y += 8;

  // Determine la temperature du lead
  let leadTemp = "FROID";
  let leadColor: [number, number, number] = COLORS.red;
  if (pret90 === "oui" && motivationLevel >= 7) {
    leadTemp = "CHAUD";
    leadColor = COLORS.green;
  } else if (pret90 === "pourquoi_pas" || motivationLevel >= 5) {
    leadTemp = "TIEDE";
    leadColor = COLORS.yellow;
  }

  doc.setFillColor(leadColor[0], leadColor[1], leadColor[2]);
  doc.roundedRect(margin, y, 50, 12, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Lead ${leadTemp}`, margin + 25, y + 8, { align: "center" });

  doc.setTextColor(...COLORS.black);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const tempAdvice = leadTemp === "CHAUD"
    ? `${prenom} est tres motive${accord} et pret${accord}. Presenter l'offre directement en fin de visio.`
    : leadTemp === "TIEDE"
      ? `${prenom} est interesse${accord} mais hesite. Construire la valeur, lever les objections, creer l'urgence.`
      : `${prenom} n'est pas encore convaincu${accord}. Focus sur la valeur du bilan gratuit, planter les graines pour un suivi.`;
  const tempLines = doc.splitTextToSize(tempAdvice, contentWidth - 60);
  doc.text(tempLines, margin + 55, y + 4);

  y += Math.max(16, tempLines.length * 4 + 8);

  // === ACCROCHE PERSONNALISEE ===
  if (y > 250) { doc.addPage(); y = 20; }

  doc.setTextColor(...COLORS.greenDark);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Accroche d'ouverture suggeree", margin, y);
  y += 6;

  const mainObjectif = objectifs[0] ? (objectifLabels[objectifs[0]] || objectifs[0]).toLowerCase() : "ameliorer votre sante";
  const hookText = `"${prenom}, au vu de votre bilan, je vois clairement que vous avez un potentiel enorme d'amelioration, surtout sur ${weakAxes.length > 0 ? weakAxes[0].label.toLowerCase() : "votre terrain global"}. Avec un score de ${result.overallScore}/100, il y a de vrais leviers qu'on peut activer ensemble pour ${mainObjectif}. Et la bonne nouvelle, c'est que votre motivation a ${motivationLevel}/10 me montre que vous etes pret${accord} a passer a l'action."`;

  doc.setTextColor(...COLORS.black);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  const hookLines = doc.splitTextToSize(hookText, contentWidth - 8);
  doc.setFillColor(245, 250, 245);
  doc.roundedRect(margin, y - 2, contentWidth, hookLines.length * 4 + 6, 2, 2, "F");
  doc.text(hookLines, margin + 4, y + 2);
  y += hookLines.length * 4 + 10;

  // === ARGUMENTS PERSONNALISES PAR AXE ===
  if (y > 230) { doc.addPage(); y = 20; }

  doc.setTextColor(...COLORS.greenDark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Arguments de vente par axe", margin, y);
  y += 8;

  const axeArguments = weakAxes.map((a) => {
    const args: Record<string, { argument: string; benefit: string }> = {
      equilibre_alimentaire: {
        argument: "Votre alimentation presente des desequilibres que je peux corriger avec un plan structure.",
        benefit: "En 90 jours, vous aurez une alimentation equilibree sans frustration, avec des recettes adaptees a vos gouts.",
      },
      hydratation_micronutriments: {
        argument: "Votre hydratation et vos apports en micronutriments sont insuffisants, ce qui impacte tout votre organisme.",
        benefit: "Meilleure energie, meilleure peau, meilleure digestion — juste en optimisant eau et micronutriments.",
      },
      habitudes_repas: {
        argument: "Vos habitudes de repas (horaires, contexte, vitesse) freinent votre digestion et votre metabolisme.",
        benefit: "Des ajustements simples dans votre routine vont transformer votre confort digestif et votre energie.",
      },
      digestif_transit: {
        argument: "Votre systeme digestif montre des signes de desequilibre qui meritent un protocole structure.",
        benefit: "Fini les ballonnements, la fatigue apres manger et les troubles du transit — en 90 jours, tout change.",
      },
      energie_vitalite: {
        argument: "Votre energie et votre vitalite sont en dessous de votre potentiel — c'est souvent le premier benefice visible.",
        benefit: "Vous retrouverez une energie stable toute la journee, un meilleur sommeil et une clarte mentale.",
      },
      mode_de_vie: {
        argument: "Votre mode de vie (stress, activite, sommeil) impacte directement vos resultats nutritionnels.",
        benefit: "On va integrer des routines simples dans votre quotidien pour que les changements tiennent sur le long terme.",
      },
    };
    return {
      label: a.label,
      score: a.score,
      axis: a.axis,
      argument: args[a.axis]?.argument || "Cet axe necessite un accompagnement structure.",
      benefit: args[a.axis]?.benefit || "Des ameliorations concretes et durables.",
    };
  });

  axeArguments.forEach((arg) => {
    if (y > 255) { doc.addPage(); y = 20; }

    const color = getScoreColor(arg.score);
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(margin, y, 4, 18, 1, 1, "F");

    doc.setTextColor(...COLORS.black);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${arg.label} (${arg.score}/100)`, margin + 8, y + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    const argLines = doc.splitTextToSize(`Argument : ${arg.argument}`, contentWidth - 12);
    doc.text(argLines, margin + 8, y + 9);
    const benLines = doc.splitTextToSize(`Benefice : ${arg.benefit}`, contentWidth - 12);
    doc.setTextColor(...COLORS.green);
    doc.text(benLines, margin + 8, y + 9 + argLines.length * 3.5);

    y += 12 + (argLines.length + benLines.length) * 3.5 + 4;
  });

  // === PRESENTATION DU PROGRAMME ===
  doc.addPage();
  y = 20;

  doc.setFillColor(...COLORS.greenDark);
  doc.rect(0, 0, pageWidth, 25, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Presentation du Programme 90 Jours", margin, 16);

  y = 35;

  const programSteps = [
    {
      phase: "Phase 1 : Reset (Semaines 1-3)",
      desc: "Bilan approfondi, identification des priorites, premiers ajustements alimentaires. Plan personnalise avec recettes et listes de courses.",
    },
    {
      phase: "Phase 2 : Transformation (Semaines 4-8)",
      desc: "Mise en place des nouvelles habitudes, suivi hebdomadaire, ajustements en fonction des progres. Travail sur les axes prioritaires.",
    },
    {
      phase: "Phase 3 : Ancrage (Semaines 9-12)",
      desc: "Consolidation des acquis, autonomie progressive, strategies pour maintenir les resultats sur le long terme.",
    },
  ];

  programSteps.forEach((step) => {
    if (y > 255) { doc.addPage(); y = 20; }

    doc.setFillColor(245, 250, 245);
    doc.roundedRect(margin, y, contentWidth, 22, 3, 3, "F");

    doc.setTextColor(...COLORS.greenDark);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(step.phase, margin + 4, y + 6);

    doc.setTextColor(...COLORS.black);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(step.desc, contentWidth - 8);
    doc.text(descLines, margin + 4, y + 12);

    y += 26;
  });

  y += 4;

  // === CE QUI EST INCLUS ===
  doc.setTextColor(...COLORS.greenDark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Ce qui est inclus", margin, y);
  y += 8;

  const inclusions = [
    "Consultation initiale approfondie (60 min)",
    "Plan alimentaire 100% personnalise + recettes",
    "Liste de courses hebdomadaire",
    `Programme adapte a ${sexe === "femme" ? "votre cycle et vos besoins feminins" : "vos besoins specifiques"}`,
    "4 consultations de suivi en visio (1 par quinzaine puis mensuelle)",
    "Messagerie illimitee entre les consultations (WhatsApp/email)",
    "Complementation ciblee si necessaire",
    "Fiches pratiques et guides nutritionnels",
    "Acces a vie aux ressources du programme",
  ];

  inclusions.forEach((item) => {
    if (y > 275) { doc.addPage(); y = 20; }
    doc.setTextColor(...COLORS.green);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("V", margin, y);
    doc.setTextColor(...COLORS.black);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(item, margin + 6, y);
    y += 5;
  });

  y += 8;

  // === TARIFICATION ===
  if (y > 220) { doc.addPage(); y = 20; }

  doc.setFillColor(...COLORS.greenDark);
  doc.roundedRect(margin, y, contentWidth, 40, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Programme 90 Jours - Accompagnement complet", margin + contentWidth / 2, y + 10, { align: "center" });

  doc.setFontSize(28);
  doc.text("297 EUR", margin + contentWidth / 2, y + 26, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("ou 3 x 99 EUR sans frais", margin + contentWidth / 2, y + 34, { align: "center" });

  y += 48;

  // === SCRIPT DE CLOSING ===
  if (y > 200) { doc.addPage(); y = 20; }

  doc.setTextColor(...COLORS.greenDark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Script de closing", margin, y);
  y += 8;

  const closingSteps = [
    {
      step: "1. Resume de la valeur",
      script: `"${prenom}, on a vu ensemble que votre bilan revele ${weakAxes.length} axe(s) a travailler. Avec le programme 90 jours, on va pouvoir agir sur chacun d'eux de maniere structuree et personnalisee."`,
    },
    {
      step: "2. Projection de resultat",
      script: `"Dans 3 mois, l'objectif c'est que vous ayez ${objectifs.includes("perte_poids") ? "atteint votre objectif de poids, " : ""}retrouve une energie stable, une digestion confortable, et surtout que vous ayez les cles pour maintenir ces resultats seul${accord}."`,
    },
    {
      step: "3. Transition vers l'offre",
      script: `"Est-ce que vous aimeriez qu'on travaille ensemble sur ces ${weakAxes.length} axes pendant 90 jours ? Je peux vous expliquer comment ca se passe concretement."`,
    },
    {
      step: "4. Faciliter la decision",
      script: `"Le programme est a 297 EUR, et on peut etaler en 3 fois sans frais. Vous pourrez commencer des ${new Date(Date.now() + 7 * 86400000).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}."`,
    },
  ];

  closingSteps.forEach((cs) => {
    if (y > 255) { doc.addPage(); y = 20; }

    doc.setTextColor(...COLORS.green);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(cs.step, margin, y);
    y += 5;

    doc.setTextColor(...COLORS.black);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    const scriptLines = doc.splitTextToSize(cs.script, contentWidth - 8);
    doc.text(scriptLines, margin + 4, y);
    y += scriptLines.length * 3.5 + 5;
  });

  // === OBJECTIONS & REPONSES ===
  doc.addPage();
  y = 20;

  doc.setFillColor(...COLORS.greenDark);
  doc.rect(0, 0, pageWidth, 25, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Objections courantes & Reponses", margin, 16);

  y = 35;

  const objections = [
    {
      objection: "C'est trop cher",
      response: "Rapporte a 90 jours, c'est 3,30 EUR/jour — moins qu'un cafe. Et c'est un investissement dans votre sante qui va vous faire economiser en consultations medicales, medicaments et fatigue. De plus, le paiement en 3 fois est disponible.",
      tip: "Comparer avec le cout de NE RIEN FAIRE (medicaments, fatigue, arret maladie...)",
    },
    {
      objection: "J'ai pas le temps",
      response: "Le programme est concu pour les gens occupes. Les recettes prennent 15-20 min max, et les consultations sont en visio — vous choisissez votre creneau. Les listes de courses sont toutes faites.",
      tip: "Demander : \"Combien de temps passez-vous a etre fatigue(e) ou a gerer vos symptomes ?\"",
    },
    {
      objection: "J'ai deja essaye des regimes et ca n'a pas marche",
      response: "Justement, c'est pour ca que je ne propose PAS de regime. Mon approche est une reeducation alimentaire douce et personnalisee. On ne supprime rien, on reequilibre. 90% de mes patients gardent leurs resultats apres le programme.",
      tip: "Valider l'echec passe : \"C'est normal, les regimes ne marchent pas. Ce que je propose est fondamentalement different.\"",
    },
    {
      objection: "Je vais reflechir / J'en parle a mon conjoint",
      response: "Bien sur, prenez le temps. Sachez que votre bilan est une photographie d'aujourd'hui — plus on attend, plus les desequilibres s'installent. Si vous vous inscrivez cette semaine, je peux demarrer votre plan des la semaine prochaine.",
      tip: "Creer l'urgence douce. Proposer un rappel dans 48h : \"Je vous rappelle jeudi pour voir si vous avez des questions ?\"",
    },
    {
      objection: "Je peux le faire seul(e)",
      response: `Avec un score de ${result.overallScore}/100 et ${weakAxes.length} axes a travailler, il y a beaucoup de parametres a ajuster en meme temps. L'accompagnement vous evite les erreurs, la demotivation et les fausses pistes. C'est comme avoir un GPS au lieu de chercher votre chemin seul${accord}.`,
      tip: "Rappeler la complexite revelee par le bilan. Seul(e), il faudrait des mois pour arriver au meme resultat.",
    },
    {
      objection: "Je ne suis pas sur(e) que ca marchera pour moi",
      response: `Votre profil (motivation a ${motivationLevel}/10, ${objectifs.length} objectif(s) clair(s)) est exactement le type de profil qui obtient les meilleurs resultats. Et si jamais les resultats ne sont pas au rendez-vous apres 30 jours, on ajuste ensemble.`,
      tip: "Utiliser le bilan comme preuve : les donnees sont la, le plan est personnalise, ce n'est pas du generique.",
    },
    {
      objection: "Est-ce que c'est adapte si j'ai des problemes de sante ?",
      response: "En tant que Dieteticienne Diplomee d'Etat, je suis habilitee a prendre en charge les pathologies nutritionnelles. Le programme est 100% personnalise et adapte a votre contexte medical. Si necessaire, je travaille en coordination avec votre medecin.",
      tip: "Rassurer sur les qualifications : DE (diplome d'Etat) = profession reglementee de sante.",
    },
    {
      objection: "Pourquoi 90 jours et pas moins ?",
      response: "90 jours, c'est le temps scientifiquement prouve pour ancrer de nouvelles habitudes alimentaires. Moins, c'est du bricolage. Plus, c'est souvent inutile si le travail est bien fait. C'est le juste milieu entre efficacite et durabilite.",
      tip: "Citer les etudes sur les 66-90 jours pour l'ancrage des habitudes (Lally et al., 2010).",
    },
  ];

  objections.forEach((obj) => {
    if (y > 235) { doc.addPage(); y = 20; }

    doc.setFillColor(255, 245, 245);
    doc.roundedRect(margin, y, contentWidth, 6, 2, 2, "F");
    doc.setTextColor(...COLORS.red);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`"${obj.objection}"`, margin + 3, y + 4);
    y += 9;

    doc.setTextColor(...COLORS.black);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const respLines = doc.splitTextToSize(`Reponse : ${obj.response}`, contentWidth - 8);
    doc.text(respLines, margin + 4, y);
    y += respLines.length * 3.5 + 2;

    doc.setTextColor(...COLORS.green);
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    const tipLines = doc.splitTextToSize(`Astuce : ${obj.tip}`, contentWidth - 8);
    doc.text(tipLines, margin + 4, y);
    y += tipLines.length * 3 + 6;
  });

  // === QUESTIONS FREQUENTES ===
  if (y > 200) { doc.addPage(); y = 20; }

  doc.setTextColor(...COLORS.greenDark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Questions frequentes", margin, y);
  y += 8;

  const faqs = [
    { q: "Comment se passent les consultations ?", a: "En visio (Google Meet ou Zoom), depuis chez vous. Duree : 30-45 min pour les suivis. Vous recevez un recap ecrit apres chaque seance." },
    { q: "Est-ce que je pourrai manger ce que j'aime ?", a: "Oui ! On ne supprime jamais un aliment. On reequilibre, on ameliore les choix et on adapte a vos gouts et votre culture culinaire." },
    { q: "Et si je craque ou si j'ai un ecart ?", a: "Les ecarts font partie du processus. On en parle, on comprend pourquoi, et on ajuste. Zero culpabilite, 100% bienveillance." },
    { q: "Est-ce que je recevrai des menus tout faits ?", a: "Vous recevrez un plan alimentaire avec des recettes et listes de courses, mais adapte a VOS gouts. Pas de menu generique copie-colle." },
    { q: "Comment je vous contacte entre les consultations ?", a: "Par WhatsApp ou email, en illimite. Je reponds sous 24h en semaine. Vous n'etes jamais seul(e) dans votre demarche." },
    { q: "Faut-il acheter des complements ?", a: "Pas obligatoirement. Si des complements sont recommandes, ce sera uniquement base sur votre bilan et vos besoins reels, pas du marketing." },
  ];

  faqs.forEach((faq) => {
    if (y > 265) { doc.addPage(); y = 20; }

    doc.setTextColor(...COLORS.black);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`Q : ${faq.q}`, margin, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    const aLines = doc.splitTextToSize(`R : ${faq.a}`, contentWidth - 4);
    doc.text(aLines, margin + 2, y);
    y += aLines.length * 3.5 + 5;
  });

  // === CHECKLIST POST-VISIO ===
  if (y > 230) { doc.addPage(); y = 20; }

  doc.setTextColor(...COLORS.greenDark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Checklist post-visio", margin, y);
  y += 8;

  const checklist = [
    `Si ${prenom} accepte : envoyer le lien de paiement + email de bienvenue`,
    "Planifier la premiere consultation de suivi (sous 7 jours)",
    "Commencer a preparer le plan alimentaire personnalise",
    "Si hesitation : programmer un rappel dans 48h",
    "Si refus : remercier, laisser la porte ouverte, proposer un suivi ponctuel",
    "Dans tous les cas : envoyer un email de suivi post-visio (recap + offre)",
  ];

  checklist.forEach((item) => {
    if (y > 275) { doc.addPage(); y = 20; }
    doc.setTextColor(...COLORS.black);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`[ ] ${item}`, margin + 2, y);
    y += 5;
  });

  // === FOOTER ===
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    doc.text(
      `CONFIDENTIEL - NutriByMeli | Argumentaire ${prenom} ${nom} | Page ${i}/${totalPages}`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}
