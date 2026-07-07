import { NextResponse } from "next/server";
import { Resend } from "resend";
import { REPAS_SECTIONS } from "@/data/questionnaire-repas";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const MELISSA_EMAIL = process.env.MELISSA_EMAIL || "contact@nutri-meli.com";

type Answers = Record<string, string | string[]>;

// Résout la réponse humaine (label) d'une question
function humanAnswer(questionId: string, answer: string | string[]): string {
  for (const section of REPAS_SECTIONS) {
    const q = section.questions.find((x) => x.id === questionId);
    if (!q) continue;
    if (Array.isArray(answer)) {
      return answer
        .map((v) => q.options?.find((o) => o.value === v)?.label || v)
        .join(", ");
    }
    return q.options?.find((o) => o.value === answer)?.label || answer;
  }
  return Array.isArray(answer) ? answer.join(", ") : answer;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const answers: Answers = body?.answers;

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const prenom = (answers.prenom as string) || "Client";
    const clientEmail = (answers.email as string) || "";
    const jours = humanAnswer("jours", answers.jours || []);

    // Table récap de toutes les réponses (dans l'ordre du questionnaire)
    const rows = REPAS_SECTIONS.flatMap((section) =>
      section.questions
        .filter((q) => {
          const a = answers[q.id];
          if (a === undefined || a === null) return false;
          if (Array.isArray(a)) return a.length > 0;
          return String(a).trim() !== "";
        })
        .map((q) => {
          const human = humanAnswer(q.id, answers[q.id]);
          return `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee;color:#888;width:45%;">${q.label}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;font-weight:500;">${human}</td>
          </tr>`;
        })
    ).join("");

    if (!resend) {
      // Config email absente — on ne bloque pas l'UX mais on le signale au log
      console.error("RESEND_API_KEY manquant — email non envoyé");
      return NextResponse.json({ success: true, emailed: false });
    }

    // === Email à Mélissa : la demande repas complète ===
    await resend.emails.send({
      from: "NutriByMeli <notifications@nutri-meli.com>",
      to: [MELISSA_EMAIL],
      replyTo: clientEmail || undefined,
      subject: `Nouvelle demande repas — ${prenom}${jours ? ` (${jours})` : ""}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#2D5A3D;">Nouvelle demande de repas</h2>
        <p><strong>${prenom}</strong> souhaite rejoindre l'offre repas. Voici ses préférences pour caler le dosage :</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">${rows}</table>
        <p style="color:#888;font-size:13px;">Réponds directement à cet email pour lui revenir avec son menu.</p>
      </div>`,
    });

    // === Confirmation au client (courte) ===
    if (clientEmail) {
      await resend.emails.send({
        from: "Mélissa P. — NutriByMeli <contact@nutri-meli.com>",
        to: [clientEmail],
        subject: `${prenom}, tes préférences repas sont bien reçues`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#333;">
          <p style="font-size:16px;">Bonjour ${prenom},</p>
          <p style="font-size:15px;line-height:1.7;color:#555;">Merci ! J'ai bien reçu tes préférences. Je te prépare un menu de la semaine
          pesé et dosé rien que pour toi, et je reviens vers toi très vite.</p>
          <p style="font-size:15px;line-height:1.7;color:#555;">Les places sont limitées — tu fais partie du cercle. 🌿</p>
          <p style="font-size:14px;color:#6B9E6B;margin-top:20px;"><strong>Mélissa P.</strong><br>Diététicienne Diplômée d'État &amp; Naturopathe</p>
        </div>`,
      });
    }

    return NextResponse.json({ success: true, emailed: true });
  } catch (error) {
    console.error("Erreur API questionnaire-repas:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi" },
      { status: 500 }
    );
  }
}
