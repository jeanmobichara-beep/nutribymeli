import { NextResponse } from "next/server";
import { Resend } from "resend";
import { REPAS_SECTIONS } from "@/data/questionnaire-repas";
import { genererMenu, type MenuPropose } from "@/lib/menu/engine";
import { brandEmail } from "@/lib/email/brand";
import { encodeMenuToken } from "@/lib/menu/token";

export const maxDuration = 60; // laisse le temps à la génération IA du menu

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

    // === Génération du menu proposé (IA + calcul coût/marge) ===
    let menu: MenuPropose | null = null;
    try {
      menu = await genererMenu(answers);
    } catch (e) {
      console.error("Génération de menu impossible:", e);
    }

    if (!resend) {
      // Config email absente — on ne bloque pas l'UX mais on le signale au log
      console.error("RESEND_API_KEY manquant — email non envoyé");
      return NextResponse.json({ success: true, emailed: false, menu: menu ? { source: menu.source, jours: menu.jours.length } : null });
    }

    const menuHtml = menu ? renderMenuHtml(menu) : `<p style="color:#B45309;font-size:14px;"><strong>⚠️ Menu non généré</strong> — à composer manuellement pour ce client.</p>`;

    // Lien vers la page menu personnalisée du client (jeton encodé, pas de BDD)
    const menuUrl = menu
      ? `https://nutri-meli.com/menu?d=${encodeMenuToken(menu, prenom, clientEmail || undefined)}`
      : null;

    // === Email à Mélissa : la demande repas complète + menu proposé (interne : coûts/marge) ===
    await resend.emails.send({
      from: "NutriByMeli <notifications@nutri-meli.com>",
      to: [MELISSA_EMAIL],
      replyTo: clientEmail || undefined,
      subject: `Demande repas — ${prenom}${jours ? ` (${jours})` : ""}${menu ? ` · menu proposé ${menu.source === "ia" ? "🤖" : "(auto)"}` : ""}`,
      html: brandEmail(`
        <h2 style="color:#2A5A3A;margin:0 0 10px 0;">Nouvelle demande de repas</h2>
        <p style="margin:0 0 6px 0;"><strong>${prenom}</strong> vient de composer son menu. Ses préférences :</p>
        <table style="width:100%;border-collapse:collapse;margin:14px 0;">${rows}</table>
        ${menuHtml}
        ${menuUrl ? `<p style="font-size:13px;color:#586A5B;">Le client a reçu ce menu (sans les coûts) avec ce lien : <a href="${menuUrl}" style="color:#2A5A3A;">sa page menu</a>. S'il confirme ses jours, tu recevras une notification.</p>` : ""}
        <p style="color:#888;font-size:13px;margin:8px 0 0 0;">Réponds directement à cet email pour ajuster avec lui si besoin.</p>
      `),
    });

    // === Email au client : SON menu, tout de suite (conversion), sans les coûts ===
    if (clientEmail) {
      const menuClientHtml = menu
        ? `
          <p style="font-size:15px;line-height:1.7;color:#586A5B;margin:0 0 16px 0;">Ton menu de la semaine est prêt — composé selon ton profil, pesé et dosé pour toi. Le voici :</p>
          <table style="width:100%;border-collapse:collapse;margin:0 0 16px 0;font-size:14px;">
            ${menu.jours
              .map(
                (j) => `<tr>
                  <td style="padding:9px 8px;border-bottom:1px solid #EEF3E8;font-weight:700;color:#2A5A3A;text-transform:capitalize;white-space:nowrap;">${j.jour}</td>
                  <td style="padding:9px 8px;border-bottom:1px solid #EEF3E8;"><strong>${j.recette.nom}</strong><div style="color:#8A9A8B;font-size:12px;">${j.recette.composition}</div></td>
                </tr>`
              )
              .join("")}
          </table>
          ${menu.conseil ? `<p style="background:#EEF3E8;border-radius:10px;padding:12px 14px;font-size:13px;color:#2A5A3A;margin:0 0 18px 0;"><strong>Le mot de Mélissa :</strong> ${menu.conseil}</p>` : ""}
          <table cellpadding="0" cellspacing="0" style="margin:6px 0 10px 0;"><tr><td style="background:#C4F135;border-radius:999px;">
            <a href="${menuUrl}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:700;color:#16240F;text-decoration:none;">Voir mon menu &amp; confirmer mes jours →</a>
          </td></tr></table>
          <p style="font-size:12px;color:#9AA79B;margin:8px 0 0 0;">Mélissa peut ajuster ton menu à la marge au moment de la confirmation. Un plat ne te tente pas&nbsp;? Réponds à cet email, on l'échange.</p>`
        : `<p style="font-size:15px;line-height:1.7;color:#586A5B;">Merci ! J'ai bien reçu tes préférences. Je compose ton menu de la semaine, pesé et dosé pour toi, et je reviens vers toi très rapidement.</p>`;

      await resend.emails.send({
        from: "Mélissa P. — NutriByMeli <contact@nutri-meli.com>",
        to: [clientEmail],
        subject: menu ? `${prenom}, ton menu de la semaine est prêt 🌿` : `${prenom}, tes préférences sont bien reçues`,
        html: brandEmail(
          `<p style="font-size:16px;margin:0 0 12px 0;">Bonjour ${prenom},</p>${menuClientHtml}`,
          { preheader: menu ? "Ton menu personnalisé t'attend — confirme tes jours." : undefined }
        ),
      });
    }

    return NextResponse.json({
      success: true,
      emailed: true,
      menu: menu ? { source: menu.source, jours: menu.jours.length, url: menuUrl } : null,
    });
  } catch (error) {
    console.error("Erreur API questionnaire-repas:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi" },
      { status: 500 }
    );
  }
}

/* ----------------------- Rendu email du menu proposé ----------------------- */

function euro(n: number | null): string {
  return n == null ? "—" : n.toFixed(2).replace(".", ",") + " €";
}

function renderMenuHtml(menu: MenuPropose): string {
  const lignes = menu.jours
    .map((j) => {
      const cout = menu.cout.parRepas.find((c) => c.jour === j.jour)?.cout ?? 0;
      const prot = Math.round(j.recette.proteines * j.facteur);
      const kcal = Math.round(j.recette.kcal * j.facteur);
      const poids = Math.round(j.recette.poids * j.facteur);
      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;text-transform:capitalize;">${j.jour}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">
          <strong>${j.recette.nom}</strong>
          <div style="color:#888;font-size:12px;">${j.recette.composition}</div>
          ${j.note ? `<div style="color:#2A5A3A;font-size:12px;font-style:italic;margin-top:2px;">💡 ${j.note}</div>` : ""}
        </td>
        <td style="padding:8px;border-bottom:1px solid #eee;white-space:nowrap;font-size:13px;">×${j.facteur}<br>${prot} g prot · ${kcal} kcal<br>${poids} g</td>
        <td style="padding:8px;border-bottom:1px solid #eee;white-space:nowrap;font-weight:600;">${euro(cout)}</td>
      </tr>`;
    })
    .join("");

  const marge =
    menu.cout.prixRepas != null
      ? `<tr><td style="padding:6px 8px;color:#555;">Prix de vente (PRIX_REPAS)</td><td style="padding:6px 8px;font-weight:700;">${euro(menu.cout.prixRepas)}</td></tr>
         <tr><td style="padding:6px 8px;color:#555;">Marge brute moyenne / repas</td><td style="padding:6px 8px;font-weight:700;color:${(menu.cout.margeMoyenne ?? 0) >= 8 ? "#2A5A3A" : "#B45309"};">${euro(menu.cout.margeMoyenne)} (${menu.cout.margePct}%)</td></tr>`
      : `<tr><td style="padding:6px 8px;color:#555;">Prix de vente</td><td style="padding:6px 8px;color:#888;">non défini (variable PRIX_REPAS) — marge non calculée</td></tr>`;

  return `
  <h3 style="color:#2A5A3A;margin:22px 0 8px 0;">Menu proposé ${menu.source === "ia" ? "(composé par IA)" : "(sélection automatique — IA indisponible)"}</h3>
  <p style="color:#888;font-size:12px;margin:0 0 10px 0;">Cible : ~${menu.cible.proteines} g de protéines · ~${menu.cible.kcal} kcal par repas. <strong>Proposition à valider/ajuster avant tout envoi au client.</strong></p>
  <table style="width:100%;border-collapse:collapse;margin:0 0 14px 0;font-size:14px;">
    <tr style="background:#EEF3E8;">
      <th style="padding:8px;text-align:left;">Jour</th><th style="padding:8px;text-align:left;">Plat</th><th style="padding:8px;text-align:left;">Portion</th><th style="padding:8px;text-align:left;">Coût matière</th>
    </tr>
    ${lignes}
  </table>
  ${menu.conseil ? `<p style="background:#EEF3E8;border-radius:8px;padding:10px 12px;font-size:13px;color:#2A5A3A;"><strong>Conseil client proposé :</strong> ${menu.conseil}</p>` : ""}
  <table style="border-collapse:collapse;margin:10px 0;font-size:14px;">
    <tr><td style="padding:6px 8px;color:#555;">Coût matière total (${menu.jours.length} repas)</td><td style="padding:6px 8px;font-weight:700;">${euro(menu.cout.total)}</td></tr>
    <tr><td style="padding:6px 8px;color:#555;">Coût matière moyen / repas</td><td style="padding:6px 8px;font-weight:700;">${euro(menu.cout.moyen)}</td></tr>
    ${marge}
  </table>
  <p style="color:#B45309;font-size:12px;">⚠️ Coûts = estimation (base prix Antilles ≈ métropole +35 %, coef pertes 12 %). À recaler sur les tickets de courses réels. Grammages et macros à valider par toi.</p>`;
}
