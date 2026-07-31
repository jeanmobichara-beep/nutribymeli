import { NextResponse } from "next/server";
import { Resend } from "resend";
import { decodeMenuToken } from "@/lib/menu/token";
import { RECETTES } from "@/lib/menu/recettes";
import { brandEmail } from "@/lib/email/brand";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const MELISSA_EMAIL = process.env.MELISSA_EMAIL || "contact@nutri-meli.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tok = typeof body?.d === "string" ? decodeMenuToken(body.d) : null;
    if (!tok) {
      return NextResponse.json({ error: "Lien invalide" }, { status: 400 });
    }

    const byId = new Map(RECETTES.map((r) => [r.id, r]));
    const jours = tok.j.filter((j) => byId.has(j.r));
    const lignes = jours
      .map((j) => `<li style="margin:4px 0;"><strong style="text-transform:capitalize;">${j.jour}</strong> — ${byId.get(j.r)!.nom}</li>`)
      .join("");

    if (!resend) {
      console.error("RESEND_API_KEY manquant — confirmation non notifiée");
      return NextResponse.json({ success: true, emailed: false });
    }

    // Notification à Mélissa (GO client)
    await resend.emails.send({
      from: "NutriByMeli <notifications@nutri-meli.com>",
      to: [MELISSA_EMAIL],
      replyTo: tok.e || undefined,
      subject: `✅ ${tok.p || "Un client"} CONFIRME son menu (${jours.length} j)`,
      html: brandEmail(`
        <h2 style="color:#2A5A3A;margin:0 0 10px 0;">Menu confirmé par ${tok.p || "le client"}</h2>
        <p style="margin:0 0 10px 0;">${tok.e ? `Email : <a href="mailto:${tok.e}" style="color:#2A5A3A;">${tok.e}</a>` : "Email non fourni"}</p>
        <ul style="margin:0 0 12px 0;padding-left:18px;">${lignes}</ul>
        <p style="color:#586A5B;font-size:13px;margin:0;">Prochaine étape : valider le menu, caler la mise en route et le règlement directement avec ${tok.p || "le client"}.</p>
      `),
    });

    // Confirmation au client
    if (tok.e) {
      await resend.emails.send({
        from: "Mélissa P. — NutriByMeli <contact@nutri-meli.com>",
        to: [tok.e],
        subject: `${tok.p ? tok.p + ", c" : "C"}'est confirmé 🌿`,
        html: brandEmail(`
          <p style="font-size:16px;margin:0 0 12px 0;">${tok.p ? `Merci ${tok.p} !` : "Merci !"}</p>
          <p style="font-size:15px;line-height:1.7;color:#586A5B;margin:0 0 10px 0;">Ta confirmation est bien enregistrée. Mélissa valide ton menu et revient vers toi très vite pour caler la mise en route de ta semaine.</p>
          <ul style="margin:0 0 12px 0;padding-left:18px;font-size:14px;">${lignes}</ul>
          <p style="font-size:13px;color:#9AA79B;margin:0;">Une question, une envie d'échanger un plat ? Réponds simplement à cet email.</p>
        `),
      });
    }

    return NextResponse.json({ success: true, emailed: true });
  } catch (error) {
    console.error("Erreur API menu-confirm:", error);
    return NextResponse.json({ error: "Erreur lors de la confirmation" }, { status: 500 });
  }
}
