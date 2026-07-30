import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const MELISSA_EMAIL = process.env.MELISSA_EMAIL || "contact@nutri-meli.com";
// Optionnel : ID d'audience Resend pour stocker les contacts (Resend → Audiences)
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    if (!resend) {
      console.error("RESEND_API_KEY manquant — inscription newsletter non traitée");
      return NextResponse.json({ success: true, stored: false });
    }

    // 1) Stocker le contact dans l'audience Resend (si configurée)
    let stored = false;
    if (AUDIENCE_ID) {
      try {
        await resend.contacts.create({
          email,
          audienceId: AUDIENCE_ID,
          unsubscribed: false,
        });
        stored = true;
      } catch (e) {
        console.error("Resend audience error:", e);
      }
    }

    // 2) Notifier Mélissa (toujours — c'est sa liste de leads)
    await resend.emails.send({
      from: "NutriByMeli <notifications@nutri-meli.com>",
      to: [MELISSA_EMAIL],
      subject: `Nouvel abonné newsletter — ${email}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:20px;">
        <h2 style="color:#2A5A3A;margin:0 0 10px 0;">Nouvel abonné newsletter</h2>
        <p style="font-size:15px;color:#333;"><strong>${email}</strong> s'est inscrit à la newsletter bien-être / nutrition depuis nutri-meli.com.</p>
        <p style="font-size:13px;color:#888;">${stored ? "Contact ajouté à l'audience Resend." : "Astuce : configure RESEND_AUDIENCE_ID pour stocker automatiquement les contacts dans Resend → Audiences."}</p>
      </div>`,
    });

    return NextResponse.json({ success: true, stored });
  } catch (error) {
    console.error("Erreur API newsletter:", error);
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}
