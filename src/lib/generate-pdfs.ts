import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { SECTIONS, type Question } from "@/data/questionnaire";
import type { BilanResult } from "@/data/scoring";
import { AXIS_LABELS } from "@/data/scoring";

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
  if (score >= 45) return "A am\u00E9liorer";
  if (score >= 25) return "Pr\u00E9occupant";
  return "Critique";
}

// Helper to sanitize text for jsPDF (remove emojis that cause issues)
function sanitize(text: string | undefined | null): string {
  if (!text) return "";
  return text
    .replace(/[\u{1F600}-\u{1F9FF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[💡⚠️🔴📍🎓🔒]/g, "")
    .replace(/\u{2192}/gu, " - ")   // → arrow breaks jsPDF font encoding
    .replace(/\u{2026}/gu, "...")    // … ellipsis
    .replace(/[\u{2000}-\u{206F}]/gu, " ") // misc Unicode punctuation
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "") // variation selectors
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
  doc.text(`G\u00E9n\u00E9r\u00E9 le ${new Date().toLocaleDateString("fr-FR")}`, margin, 33);

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
  const imcCat = imc < 18.5 ? "Maigreur" : imc < 25 ? "Normal" : imc < 30 ? "Surpoids" : "Ob\u00E9sit\u00E9";

  autoTable(doc, {
    startY: y,
    head: [],
    body: [
      ["Pr\u00E9nom / Nom", `${prenom} ${nom}`],
      ["Email", email],
      ["Age", `${age} ans`],
      ["Sexe", sexe === "homme" ? "Homme" : sexe === "femme" ? "Femme" : sexe],
      ["Taille / Poids", `${taille} cm / ${poids} kg`],
      ["IMC", `${imcRounded} (${imcCat})`],
    ],
    tableWidth: contentWidth,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3, overflow: "linebreak" },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 45, textColor: COLORS.gray },
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
  const scoreText = result.overallScore >= 65 ? "Terrain globalement \u00E9quilibr\u00E9" : result.overallScore >= 45 ? "Quelques axes m\u00E9ritent attention" : result.overallScore >= 25 ? "Plusieurs axes \u00E0 travailler" : "Prise en charge recommand\u00E9e";
  doc.text(scoreText, margin + contentWidth / 2, y + 23, { align: "center" });

  y += 38;

  // --- 6 AXES ---
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Vos 6 axes de sant\u00E9", margin, y);
  y += 3;

  const axesData = result.axes.map((a) => {
    const color = getScoreColor(a.score);
    return [a.label || AXIS_LABELS[a.axis] || a.axis, `${a.score}/100`, getScoreLabel(a.score)];
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
    tableWidth: contentWidth,
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 25, halign: "center", fontStyle: "bold" },
      2: { cellWidth: 35, halign: "center" },
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
    if (y > 230) { doc.addPage(); y = 20; }

    doc.setTextColor(...COLORS.red);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SIGNAUX D'ALERTE", margin, y);
    y += 7;

    result.redFlags.forEach((flag) => {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setFillColor(255, 245, 245);
      const msgText = sanitize(flag.message);
      const recText = sanitize(flag.recommendation);
      const msgLines = doc.splitTextToSize(`- ${msgText}`, contentWidth - 12);
      const recLines = doc.splitTextToSize(recText, contentWidth - 16);
      const blockH = msgLines.length * 4 + recLines.length * 3.5 + 6;
      doc.roundedRect(margin, y - 2, contentWidth, blockH, 2, 2, "F");
      doc.setDrawColor(...COLORS.red);
      doc.setLineWidth(0.8);
      doc.line(margin, y - 2, margin, y - 2 + blockH);

      doc.setTextColor(...COLORS.red);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(msgLines, margin + 6, y + 2);
      doc.setTextColor(...COLORS.gray);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(recLines, margin + 10, y + 2 + msgLines.length * 4);
      y += blockH + 3;
    });
    y += 4;
  }

  // --- PATTERNS ---
  if (result.detectedPatterns.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setTextColor(...COLORS.orange);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Patterns cliniques d\u00E9tect\u00E9s", margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    result.detectedPatterns.forEach((p) => {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setTextColor(...COLORS.black);
      doc.setFont("helvetica", "bold");
      const nameLines = doc.splitTextToSize(`- ${sanitize(p.name)}`, contentWidth - 8);
      doc.text(nameLines, margin + 4, y);
      y += nameLines.length * 4;
      doc.setTextColor(...COLORS.gray);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const descLines = doc.splitTextToSize(sanitize(p.description), contentWidth - 12);
      doc.text(descLines, margin + 8, y);
      y += descLines.length * 3.5 + 3;
      doc.setFontSize(9);
    });
    y += 4;
  }

  // ===========================================================================
  // SECTION PAR SECTION : R\u00C9PONSES + ANNOTATIONS
  // ===========================================================================

  doc.addPage();
  y = 20;

  doc.setFillColor(...COLORS.greenDark);
  doc.rect(0, 0, pageWidth, 25, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("R\u00E9capitulatif des r\u00E9ponses", margin, 16);
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

      const formattedAnswer = formatAnswer(question, answer);
      const annotations = getAnnotations(question.id, answer);

      // Estimate block height to avoid splitting Q/A across pages
      const estHeight = 12 + annotations.length * 10;
      if (y + estHeight > 275) { doc.addPage(); y = 20; }

      // Question label
      doc.setTextColor(...COLORS.gray);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const maxTextW = contentWidth - 10;
      const questionLines = doc.splitTextToSize(sanitize(question.label), maxTextW);
      doc.text(questionLines, margin + 4, y);
      y += questionLines.length * 3.5;

      // Answer
      doc.setTextColor(...COLORS.black);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      const answerLines = doc.splitTextToSize(sanitize(formattedAnswer), maxTextW);
      doc.text(answerLines, margin + 4, y);
      y += answerLines.length * 4;

      // Annotations
      if (annotations.length > 0) {
        annotations.forEach((ann) => {
          if (y > 268) { doc.addPage(); y = 20; }
          doc.setFillColor(255, 252, 245);
          const annText = sanitize(ann.text);
          const annW = contentWidth - 16;
          const annLines = doc.splitTextToSize(annText, annW);
          const annHeight = annLines.length * 3.5 + 3;
          doc.roundedRect(margin + 6, y - 1, contentWidth - 12, annHeight, 1, 1, "F");

          const isRed = ann.text.includes("URGENT") || ann.text.includes("Priorite");
          const isWarn = ann.text.includes("VISIO") || ann.text.includes("Explorer");
          const isGood = ann.text.startsWith("Bon") || ann.text.startsWith("Excellente") || ann.text.startsWith("Pas de");
          doc.setTextColor(
            isRed ? 217 : isWarn ? 180 : isGood ? 45 : 107,
            isRed ? 67 : isWarn ? 100 : isGood ? 90 : 158,
            isRed ? 67 : isWarn ? 20 : isGood ? 61 : 107
          );
          doc.setFontSize(7);
          doc.setFont("helvetica", "italic");
          doc.text(annLines, margin + 10, y + 1);
          y += annHeight + 1;
        });
      }

      y += 3;
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
      `NutriByMeli - M. Pommez, Di\u00E9t. DE & Naturopathe | Confidentiel | Page ${i}/${totalPages}`,
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
  doc.text(`Pr\u00E9par\u00E9 le ${new Date().toLocaleDateString("fr-FR")} | NutriByMeli`, margin, 32);

  y = 45;

  // --- SYNTHESE RAPIDE ---
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Synth\u00E8se rapide", margin, y);
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
          perte_poids: "Perte de poids",
          perdre_poids: "Perte de poids",
          prise_masse: "Prise de masse",
          prendre_poids: "Prise de poids",
          energie: "Retrouver de l'\u00E9nergie",
          plus_energie: "Plus d'\u00E9nergie",
          digestion: "Am\u00E9liorer la digestion",
          meilleure_digestion: "Meilleure digestion",
          equilibre: "R\u00E9\u00E9quilibrage alimentaire",
          equilibre_alimentaire: "\u00C9quilibre alimentaire",
          stress_sommeil: "Gestion stress/sommeil",
          gestion_stress: "Gestion du stress",
          hormones: "\u00C9quilibre hormonal",
          immunite: "Renforcer l'immunit\u00E9",
          peau: "Sant\u00E9 de la peau",
          performance_sportive: "Performance sportive",
          grossesse: "Grossesse/allaitement",
        };
        return map[o] || o;
      }).join(", ") || "Non pr\u00E9cis\u00E9"],
      ["Motivation", `${answers.motivation || "?"}/10`],
    ],
    tableWidth: contentWidth,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3, overflow: "linebreak" },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40, textColor: COLORS.green },
    },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // --- DRAPEAUX ROUGES ---
  if (result.redFlags.length > 0) {
    doc.setTextColor(...COLORS.red);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DRAPEAUX ROUGES - \u00C0 ABORDER EN PRIORIT\u00C9", margin, y);
    y += 7;

    result.redFlags.forEach((flag) => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFillColor(255, 240, 240);
      const msgLines = doc.splitTextToSize(`! ${sanitize(flag.message)}`, contentWidth - 12);
      const recLines = doc.splitTextToSize(`-> ${sanitize(flag.recommendation)}`, contentWidth - 16);
      const blockH = msgLines.length * 4 + recLines.length * 3.5 + 5;
      doc.roundedRect(margin, y - 2, contentWidth, blockH, 2, 2, "F");

      doc.setTextColor(...COLORS.red);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(msgLines, margin + 4, y + 1);
      doc.setTextColor(...COLORS.gray);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(recLines, margin + 8, y + 1 + msgLines.length * 4);
      y += blockH + 3;
    });
    y += 4;
  }

  // --- AXES PROBLEMATIQUES ---
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Axes \u00E0 travailler (par priorit\u00E9)", margin, y);
  y += 3;

  const sortedAxes = [...result.axes].sort((a, b) => a.score - b.score);
  const axesTableData = sortedAxes.map((a) => {
    const label = getScoreLabel(a.score);
    const prios = a.priorities && a.priorities.length > 0 ? a.priorities.map((p) => sanitize(p)).join("\n") : "RAS";
    return [a.label || AXIS_LABELS[a.axis] || a.axis, `${a.score}/100`, label, prios];
  });

  autoTable(doc, {
    startY: y,
    head: [["Axe", "Score", "Niveau", "Actions sugg\u00E9r\u00E9es"]],
    body: axesTableData,
    theme: "striped",
    headStyles: {
      fillColor: COLORS.green,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 9,
    },
    tableWidth: contentWidth,
    styles: { fontSize: 8, cellPadding: 2, overflow: "linebreak" },
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 18, halign: "center", fontStyle: "bold" },
      2: { cellWidth: 22, halign: "center" },
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
      head: [["Question", "Notes / Points \u00E0 aborder en visio"]],
      body: notesData,
      theme: "striped",
      tableWidth: contentWidth,
      headStyles: {
        fillColor: COLORS.greenDark,
        textColor: COLORS.white,
        fontStyle: "bold",
        fontSize: 8,
      },
      styles: { fontSize: 7, cellPadding: 2, overflow: "linebreak" },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: "bold" },
      },
      margin: { left: margin, right: margin },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setTextColor(...COLORS.gray);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Aucune annotation clinique particuli\u00E8re pour ce profil.", margin, y + 6);
    y += 14;
  }

  // --- PATTERNS DETECTES ---
  if (result.detectedPatterns.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }

    doc.setTextColor(...COLORS.orange);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Patterns cliniques d\u00E9tect\u00E9s", margin, y);
    y += 7;

    result.detectedPatterns.forEach((p) => {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setTextColor(...COLORS.black);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      const nameLines = doc.splitTextToSize(`- ${sanitize(p.name)}`, contentWidth - 8);
      doc.text(nameLines, margin + 2, y);
      y += nameLines.length * 4;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLORS.gray);
      doc.setFontSize(8);
      const descLines = doc.splitTextToSize(sanitize(p.description), contentWidth - 12);
      doc.text(descLines, margin + 6, y);
      y += descLines.length * 3.5 + 4;
    });
  }

  // --- GUIDE D'ENTRETIEN ---
  if (y > 200) { doc.addPage(); y = 20; }

  doc.setTextColor(...COLORS.greenDark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Guide d'entretien sugg\u00E9r\u00E9", margin, y);
  y += 8;

  const entretienSteps = [
    {
      title: "1. Accueil & mise en confiance (5 min)",
      points: [
        "Remercier pour le questionnaire",
        "Expliquer le d\u00E9roulement de la consultation",
        `Rappeler l'objectif principal : \u00E9quilibre`,
      ],
    },
    {
      title: "2. Exploration du rappel 24h (10 min)",
      points: [
        "Reprendre le rappel alimentaire en d\u00E9tail",
        "Questionner les horaires, quantit\u00E9s, contexte \u00E9motionnel",
        "Identifier les \u00E9carts entre ce qui est d\u00E9clar\u00E9 et la r\u00E9alit\u00E9",
      ],
    },
    {
      title: "3. Approfondissement des axes critiques (15 min)",
      points: sortedAxes
        .filter((a) => a.score < 65)
        .slice(0, 3)
        .map((a) => `${a.label || AXIS_LABELS[a.axis] || a.axis} (${a.score}/100) : approfondir les causes`),
    },
    {
      title: "4. Drapeaux rouges et patterns (10 min)",
      points: [
        ...(result.redFlags && result.redFlags.length > 0 ? result.redFlags.map((f) => `ALERTE : ${sanitize(f.message)}`) : ["Aucun drapeau rouge identifi\u00E9"]),
        ...(result.detectedPatterns && result.detectedPatterns.length > 0 ? result.detectedPatterns.map((p) => `Pattern : ${sanitize(p.name || p.description)}`) : []),
      ],
    },
    {
      title: "5. Plan d'action & objectifs (15 min)",
      points: [
        "D\u00E9finir 3 objectifs concrets pour les 90 jours",
        ...result.topPriorities.slice(0, 3).map((p) => `Priorit\u00E9 : ${sanitize(p)}`),
        "Fixer le prochain rendez-vous de suivi",
      ],
    },
    {
      title: "6. Conclusion (5 min)",
      points: [
        "R\u00E9capituler les 3 actions principales",
        "S'assurer que le patient a bien compris",
        "Envoyer le plan d'action par email apr\u00E8s la visio",
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
    perdre_poids: "Perte de poids",
    prise_masse: "Prise de masse",
    prendre_poids: "Prise de poids",
    energie: "Retrouver de l'\u00E9nergie",
    plus_energie: "Plus d'\u00E9nergie",
    digestion: "Am\u00E9liorer la digestion",
    meilleure_digestion: "Meilleure digestion",
    hormones: "\u00C9quilibrer les hormones",
    alimentation: "Am\u00E9liorer l'alimentation",
    equilibre: "R\u00E9\u00E9quilibrage alimentaire",
    equilibre_alimentaire: "\u00C9quilibre alimentaire",
    douleurs: "Diminuer les douleurs/inflammations",
    sommeil: "Mieux dormir",
    stress: "G\u00E9rer le stress",
    stress_sommeil: "Gestion stress/sommeil",
    immunite: "Renforcer l'immunit\u00E9",
    peau: "Sant\u00E9 de la peau",
    performance_sportive: "Performance sportive",
    grossesse: "Grossesse/allaitement",
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
  doc.text(`Pr\u00E9par\u00E9 pour : ${prenom} ${nom} | ${new Date().toLocaleDateString("fr-FR")}`, margin, 35);

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
      ["Objectif(s)", objectifs.map((o) => objectifLabels[o] || o).join(", ") || "Non pr\u00E9cis\u00E9"],
      ["Motivation", `${motivationLevel}/10`],
      ["Pr\u00EAt(e) 90 jours", pret90 === "oui" ? "OUI" : pret90 === "pourquoi_pas" ? "Int\u00E9ress\u00E9(e) mais h\u00E9sitant(e)" : "Non pour l'instant"],
      ["Axes faibles", weakAxes.length > 0 ? weakAxes.map((a) => `${a.label || AXIS_LABELS[a.axis] || a.axis} (${a.score})`).join(", ") : "Aucun"],
      ["Red flags", result.redFlags.length > 0 ? result.redFlags.map((f) => sanitize(f.message)).join(", ") : "Aucun"],
    ],
    tableWidth: contentWidth,
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 3, overflow: "linebreak" },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40, textColor: COLORS.greenDark },
    },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // === STRATEGIE DE VENTE PERSONNALISEE ===
  doc.setTextColor(...COLORS.greenDark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Strat\u00E9gie de vente personnalis\u00E9e", margin, y);
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
    ? `${prenom} est tr\u00E8s motiv\u00E9${accord} et pr\u00EAt${accord}. Pr\u00E9senter l'offre directement en fin de visio.`
    : leadTemp === "TIEDE"
      ? `${prenom} est int\u00E9ress\u00E9${accord} mais h\u00E9site. Construire la valeur, lever les objections, cr\u00E9er l'urgence.`
      : `${prenom} n'est pas encore convaincu${accord}. Focus sur la valeur du bilan gratuit, planter les graines pour un suivi.`;
  const tempLines = doc.splitTextToSize(tempAdvice, contentWidth - 60);
  doc.text(tempLines, margin + 55, y + 4);

  y += Math.max(16, tempLines.length * 4 + 8);

  // === ACCROCHE PERSONNALISEE ===
  if (y > 250) { doc.addPage(); y = 20; }

  doc.setTextColor(...COLORS.greenDark);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Accroche d'ouverture sugg\u00E9r\u00E9e", margin, y);
  y += 6;

  const mainObjectif = objectifs[0] ? (objectifLabels[objectifs[0]] || objectifs[0]).toLowerCase() : "am\u00E9liorer votre sant\u00E9";
  const weakLabel = weakAxes.length > 0 ? (weakAxes[0].label || AXIS_LABELS[weakAxes[0].axis] || weakAxes[0].axis).toLowerCase() : "votre terrain global";
  const hookText = `"${prenom}, au vu de votre bilan, je vois clairement que vous avez un potentiel \u00E9norme d'am\u00E9lioration, surtout sur ${weakLabel}. Avec un score de ${result.overallScore}/100, il y a de vrais leviers qu'on peut activer ensemble pour ${mainObjectif}. Et la bonne nouvelle, c'est que votre motivation \u00E0 ${motivationLevel}/10 me montre que vous \u00EAtes pr\u00EAt${accord} \u00E0 passer \u00E0 l'action."`;

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
      nutritionnel: {
        argument: "Votre alimentation pr\u00E9sente des d\u00E9s\u00E9quilibres que je peux corriger avec un plan structur\u00E9.",
        benefit: "En 90 jours, vous aurez une alimentation \u00E9quilibr\u00E9e sans frustration, avec des recettes adapt\u00E9es \u00E0 vos go\u00FBts.",
      },
      digestif: {
        argument: "Votre syst\u00E8me digestif montre des signes de d\u00E9s\u00E9quilibre qui m\u00E9ritent un protocole structur\u00E9.",
        benefit: "Fini les ballonnements, la fatigue apr\u00E8s manger et les troubles du transit - en 90 jours, tout change.",
      },
      energetique: {
        argument: "Votre \u00E9nergie et votre vitalit\u00E9 sont en dessous de votre potentiel - c'est souvent le premier b\u00E9n\u00E9fice visible.",
        benefit: "Vous retrouverez une \u00E9nergie stable toute la journ\u00E9e, un meilleur sommeil et une clart\u00E9 mentale.",
      },
      inflammatoire: {
        argument: "Votre terrain inflammatoire est \u00E9lev\u00E9, ce qui peut expliquer douleurs, fatigue et difficult\u00E9s \u00E0 perdre du poids.",
        benefit: "En r\u00E9duisant l'inflammation par l'alimentation, vous retrouverez confort articulaire et \u00E9nergie.",
      },
      hormonal: {
        argument: "Votre \u00E9quilibre hormonal et m\u00E9tabolique n\u00E9cessite une attention particuli\u00E8re pour optimiser vos r\u00E9sultats.",
        benefit: "Un m\u00E9tabolisme r\u00E9\u00E9quilibr\u00E9 pour une gestion du poids plus facile et une meilleure \u00E9nergie.",
      },
      nerveux: {
        argument: "Votre mode de vie (stress, sommeil) impacte directement vos r\u00E9sultats nutritionnels.",
        benefit: "On va int\u00E9grer des routines simples dans votre quotidien pour que les changements tiennent sur le long terme.",
      },
    };
    return {
      label: a.label || AXIS_LABELS[a.axis] || a.axis,
      score: a.score,
      axis: a.axis,
      argument: args[a.axis]?.argument || "Cet axe n\u00E9cessite un accompagnement structur\u00E9.",
      benefit: args[a.axis]?.benefit || "Des am\u00E9liorations concr\u00E8tes et durables.",
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
    const benLines = doc.splitTextToSize(`B\u00E9n\u00E9fice : ${arg.benefit}`, contentWidth - 12);
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
  doc.text("Pr\u00E9sentation du Programme 90 Jours", margin, 16);

  y = 35;

  const programSteps = [
    {
      phase: "Phase 1 : Reset (Semaines 1-3)",
      desc: "Bilan approfondi, identification des priorit\u00E9s, premiers ajustements alimentaires. Plan personnalis\u00E9 avec recettes et listes de courses.",
    },
    {
      phase: "Phase 2 : Transformation (Semaines 4-8)",
      desc: "Mise en place des nouvelles habitudes, suivi hebdomadaire, ajustements en fonction des progr\u00E8s. Travail sur les axes prioritaires.",
    },
    {
      phase: "Phase 3 : Ancrage (Semaines 9-12)",
      desc: "Consolidation des acquis, autonomie progressive, strat\u00E9gies pour maintenir les r\u00E9sultats sur le long terme.",
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
    "Plan alimentaire 100% personnalis\u00E9 + recettes",
    "Liste de courses hebdomadaire",
    `Programme adapt\u00E9 \u00E0 ${sexe === "femme" ? "votre cycle et vos besoins f\u00E9minins" : "vos besoins sp\u00E9cifiques"}`,
    "4 consultations de suivi en visio (1 par quinzaine puis mensuelle)",
    "Messagerie illimit\u00E9e entre les consultations (WhatsApp/email)",
    "Compl\u00E9mentation cibl\u00E9e si n\u00E9cessaire",
    "Fiches pratiques et guides nutritionnels",
    "Acc\u00E8s \u00E0 vie aux ressources du programme",
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
  doc.text("790 EUR", margin + contentWidth / 2, y + 26, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("ou 3 x 263 EUR sans frais", margin + contentWidth / 2, y + 34, { align: "center" });

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
      step: "1. R\u00E9sum\u00E9 de la valeur",
      script: `"${prenom}, on a vu ensemble que votre bilan r\u00E9v\u00E8le ${weakAxes.length} axe(s) \u00E0 travailler. Avec le programme 90 jours, on va pouvoir agir sur chacun d'eux de mani\u00E8re structur\u00E9e et personnalis\u00E9e."`,
    },
    {
      step: "2. Projection de r\u00E9sultat",
      script: `"Dans 3 mois, l'objectif c'est que vous ayez ${objectifs.includes("perte_poids") ? "atteint votre objectif de poids, " : ""}retrouv\u00E9 une \u00E9nergie stable, une digestion confortable, et surtout que vous ayez les cl\u00E9s pour maintenir ces r\u00E9sultats seul${accord}."`,
    },
    {
      step: "3. Transition vers l'offre",
      script: `"Est-ce que vous aimeriez qu'on travaille ensemble sur ces ${weakAxes.length} axes pendant 90 jours ? Je peux vous expliquer comment \u00E7a se passe concr\u00E8tement."`,
    },
    {
      step: "4. Faciliter la d\u00E9cision",
      script: `"Le programme est \u00E0 790 EUR, et on peut \u00E9taler en 3 fois sans frais. Vous pourrez commencer d\u00E8s ${new Date(Date.now() + 7 * 86400000).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}."`,
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
  doc.text("Objections courantes & R\u00E9ponses", margin, 16);

  y = 35;

  const objections = [
    {
      objection: "C'est trop cher",
      response: "Rapport\u00E9 \u00E0 90 jours, c'est 8,78 EUR/jour - moins qu'un caf\u00E9. Et c'est un investissement dans votre sant\u00E9 qui va vous faire \u00E9conomiser en consultations m\u00E9dicales, m\u00E9dicaments et fatigue. De plus, le paiement en 3 fois est disponible.",
      tip: "Comparer avec le co\u00FBt de NE RIEN FAIRE (m\u00E9dicaments, fatigue, arr\u00EAt maladie...)",
    },
    {
      objection: "J'ai pas le temps",
      response: "Le programme est con\u00E7u pour les gens occup\u00E9s. Les recettes prennent 15-20 min max, et les consultations sont en visio - vous choisissez votre cr\u00E9neau. Les listes de courses sont toutes faites.",
      tip: "Demander : \"Combien de temps passez-vous \u00E0 \u00EAtre fatigu\u00E9(e) ou \u00E0 g\u00E9rer vos sympt\u00F4mes ?\"",
    },
    {
      objection: "J'ai d\u00E9j\u00E0 essay\u00E9 des r\u00E9gimes et \u00E7a n'a pas march\u00E9",
      response: "Justement, c'est pour \u00E7a que je ne propose PAS de r\u00E9gime. Mon approche est une r\u00E9\u00E9ducation alimentaire douce et personnalis\u00E9e. On ne supprime rien, on r\u00E9\u00E9quilibre. 90% de mes patients gardent leurs r\u00E9sultats apr\u00E8s le programme.",
      tip: "Valider l'\u00E9chec pass\u00E9 : \"C'est normal, les r\u00E9gimes ne marchent pas. Ce que je propose est fondamentalement diff\u00E9rent.\"",
    },
    {
      objection: "Je vais r\u00E9fl\u00E9chir / J'en parle \u00E0 mon conjoint",
      response: "Bien s\u00FBr, prenez le temps. Sachez que votre bilan est une photographie d'aujourd'hui - plus on attend, plus les d\u00E9s\u00E9quilibres s'installent. Si vous vous inscrivez cette semaine, je peux d\u00E9marrer votre plan d\u00E8s la semaine prochaine.",
      tip: "Cr\u00E9er l'urgence douce. Proposer un rappel dans 48h : \"Je vous rappelle jeudi pour voir si vous avez des questions ?\"",
    },
    {
      objection: "Je peux le faire seul(e)",
      response: `Avec un score de ${result.overallScore}/100 et ${weakAxes.length} axes \u00E0 travailler, il y a beaucoup de param\u00E8tres \u00E0 ajuster en m\u00EAme temps. L'accompagnement vous \u00E9vite les erreurs, la d\u00E9motivation et les fausses pistes. C'est comme avoir un GPS au lieu de chercher votre chemin seul${accord}.`,
      tip: "Rappeler la complexit\u00E9 r\u00E9v\u00E9l\u00E9e par le bilan. Seul(e), il faudrait des mois pour arriver au m\u00EAme r\u00E9sultat.",
    },
    {
      objection: "Je ne suis pas s\u00FBr(e) que \u00E7a marchera pour moi",
      response: `Votre profil (motivation \u00E0 ${motivationLevel}/10, ${objectifs.length} objectif(s) clair(s)) est exactement le type de profil qui obtient les meilleurs r\u00E9sultats. Et si jamais les r\u00E9sultats ne sont pas au rendez-vous apr\u00E8s 30 jours, on ajuste ensemble.`,
      tip: "Utiliser le bilan comme preuve : les donn\u00E9es sont l\u00E0, le plan est personnalis\u00E9, ce n'est pas du g\u00E9n\u00E9rique.",
    },
    {
      objection: "Est-ce que c'est adapt\u00E9 si j'ai des probl\u00E8mes de sant\u00E9 ?",
      response: "En tant que Di\u00E9t\u00E9ticienne Dipl\u00F4m\u00E9e d'\u00C9tat, je suis habilit\u00E9e \u00E0 prendre en charge les pathologies nutritionnelles. Le programme est 100% personnalis\u00E9 et adapt\u00E9 \u00E0 votre contexte m\u00E9dical. Si n\u00E9cessaire, je travaille en coordination avec votre m\u00E9decin.",
      tip: "Rassurer sur les qualifications : DE (dipl\u00F4me d'\u00C9tat) = profession r\u00E9glement\u00E9e de sant\u00E9.",
    },
    {
      objection: "Pourquoi 90 jours et pas moins ?",
      response: "90 jours, c'est le temps scientifiquement prouv\u00E9 pour ancrer de nouvelles habitudes alimentaires. Moins, c'est du bricolage. Plus, c'est souvent inutile si le travail est bien fait. C'est le juste milieu entre efficacit\u00E9 et durabilit\u00E9.",
      tip: "Citer les \u00E9tudes sur les 66-90 jours pour l'ancrage des habitudes (Lally et al., 2010).",
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
    const respLines = doc.splitTextToSize(`R\u00E9ponse : ${obj.response}`, contentWidth - 8);
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
  doc.text("Questions fr\u00E9quentes", margin, y);
  y += 8;

  const faqs = [
    { q: "Comment se passent les consultations ?", a: "En visio (Google Meet ou Zoom), depuis chez vous. Dur\u00E9e : 30-45 min pour les suivis. Vous recevez un r\u00E9cap \u00E9crit apr\u00E8s chaque s\u00E9ance." },
    { q: "Est-ce que je pourrai manger ce que j'aime ?", a: "Oui ! On ne supprime jamais un aliment. On r\u00E9\u00E9quilibre, on am\u00E9liore les choix et on adapte \u00E0 vos go\u00FBts et votre culture culinaire." },
    { q: "Et si je craque ou si j'ai un \u00E9cart ?", a: "Les \u00E9carts font partie du processus. On en parle, on comprend pourquoi, et on ajuste. Z\u00E9ro culpabilit\u00E9, 100% bienveillance." },
    { q: "Est-ce que je recevrai des menus tout faits ?", a: "Vous recevrez un plan alimentaire avec des recettes et listes de courses, mais adapt\u00E9 \u00E0 VOS go\u00FBts. Pas de menu g\u00E9n\u00E9rique copi\u00E9-coll\u00E9." },
    { q: "Comment je vous contacte entre les consultations ?", a: "Par WhatsApp ou email, en illimit\u00E9. Je r\u00E9ponds sous 24h en semaine. Vous n'\u00EAtes jamais seul(e) dans votre d\u00E9marche." },
    { q: "Faut-il acheter des compl\u00E9ments ?", a: "Pas obligatoirement. Si des compl\u00E9ments sont recommand\u00E9s, ce sera uniquement bas\u00E9 sur votre bilan et vos besoins r\u00E9els, pas du marketing." },
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
    "Planifier la premi\u00E8re consultation de suivi (sous 7 jours)",
    "Commencer \u00E0 pr\u00E9parer le plan alimentaire personnalis\u00E9",
    "Si h\u00E9sitation : programmer un rappel dans 48h",
    "Si refus : remercier, laisser la porte ouverte, proposer un suivi ponctuel",
    "Dans tous les cas : envoyer un email de suivi post-visio (r\u00E9cap + offre)",
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
