import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { SECTIONS, type Question } from "@/data/questionnaire";
import type { BilanResult } from "@/data/scoring";

// Extend jsPDF type for autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

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

  doc.autoTable({
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

  y = doc.lastAutoTable.finalY + 10;

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

  doc.autoTable({
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
    didParseCell: (data: { section: string; column: { index: number }; cell: { styles: { textColor: number[] } }; row: { index: number } }) => {
      if (data.section === "body" && (data.column.index === 1 || data.column.index === 2)) {
        const axis = result.axes[data.row.index];
        if (axis) {
          data.cell.styles.textColor = getScoreColor(axis.score) as unknown as number[];
        }
      }
    },
  });

  y = doc.lastAutoTable.finalY + 10;

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

  doc.autoTable({
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

  y = doc.lastAutoTable.finalY + 10;

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

  doc.autoTable({
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
    didParseCell: (data: { section: string; column: { index: number }; cell: { styles: { textColor: number[] } }; row: { index: number } }) => {
      if (data.section === "body" && (data.column.index === 1 || data.column.index === 2)) {
        const axis = sortedAxes[data.row.index];
        if (axis) {
          data.cell.styles.textColor = getScoreColor(axis.score) as unknown as number[];
        }
      }
    },
  });

  y = doc.lastAutoTable.finalY + 10;

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

    doc.autoTable({
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

    y = doc.lastAutoTable.finalY + 10;
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
