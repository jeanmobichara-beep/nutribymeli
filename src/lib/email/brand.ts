// ============================================================================
// Gabarit email de marque — NutriByMeli
// Logo en tête + signature professionnelle de Mélissa en pied.
// Utilisé par tous les emails sortants (demande repas, newsletter, …).
// ============================================================================

const SITE = "https://nutri-meli.com";

export function brandEmail(bodyHtml: string, opts?: { preheader?: string }): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#FBFCF9;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#14201A;">
${opts?.preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${opts.preheader}</div>` : ""}
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FBFCF9;"><tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

<!-- Logo -->
<tr><td align="center" style="padding:26px 20px 14px 20px;">
<a href="${SITE}"><img src="${SITE}/logo-email.png" alt="Nutri by Meli" width="170" style="display:block;max-width:170px;height:auto;border:0;" /></a>
</td></tr>

<!-- Carte contenu -->
<tr><td style="padding:0 16px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #E1E6D9;border-radius:14px;">
<tr><td style="padding:26px 24px;">
${bodyHtml}
</td></tr>
</table>
</td></tr>

<!-- Signature pro -->
<tr><td style="padding:18px 16px 8px 16px;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="60" style="padding:6px 12px 6px 8px;vertical-align:top;">
<img src="${SITE}/melissa-profil.jpg" alt="Mélissa P." width="52" height="52" style="border-radius:50%;display:block;border:0;" />
</td>
<td style="padding:6px 0;vertical-align:top;">
<p style="margin:0 0 2px 0;font-size:14px;font-weight:700;color:#14201A;">Mélissa P.</p>
<p style="margin:0 0 5px 0;font-size:12px;color:#2A5A3A;font-weight:600;">Diététicienne Diplômée d'État &amp; Naturopathe</p>
<p style="margin:0 0 2px 0;font-size:11px;color:#586A5B;">&#128205; Guadeloupe &nbsp;·&nbsp; <span style="color:#2A5A3A;">&#10003;</span> Secret professionnel</p>
<p style="margin:0;font-size:11px;"><a href="${SITE}" style="color:#2A5A3A;text-decoration:none;font-weight:600;">nutri-meli.com</a> &nbsp;|&nbsp; <a href="mailto:contact@nutri-meli.com" style="color:#2A5A3A;text-decoration:none;">contact@nutri-meli.com</a></p>
</td>
</tr>
</table>
</td></tr>

<!-- Légal -->
<tr><td align="center" style="padding:8px 24px 26px 24px;">
<p style="margin:0;font-size:10px;color:#9AA79B;line-height:1.5;">Vos données sont protégées par le secret professionnel.<br>© NutriByMeli — repas sains personnalisés, Guadeloupe.</p>
</td></tr>

</table>
</td></tr></table>
</body>
</html>`;
}
