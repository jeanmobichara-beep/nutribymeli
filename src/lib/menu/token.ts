// ============================================================================
// Jeton de menu — encode la proposition dans l'URL (aucune base de données).
// /menu?d=<base64url(JSON)> — lisible uniquement par qui possède le lien.
// ============================================================================

import type { MenuPropose } from "./engine";

export interface MenuToken {
  p: string; // prénom
  e?: string; // email client (pour la confirmation)
  c?: string; // conseil IA
  j: { jour: string; r: string; f: number }[]; // jour / recetteId / facteur
  t: number; // timestamp (ms)
}

export function encodeMenuToken(menu: MenuPropose, prenom: string, email?: string): string {
  const tok: MenuToken = {
    p: prenom,
    e: email,
    c: menu.conseil,
    j: menu.jours.map((x) => ({ jour: x.jour, r: x.recette.id, f: x.facteur })),
    t: Date.now(),
  };
  return Buffer.from(JSON.stringify(tok), "utf-8").toString("base64url");
}

export function decodeMenuToken(d: string): MenuToken | null {
  try {
    const tok = JSON.parse(Buffer.from(d, "base64url").toString("utf-8")) as MenuToken;
    if (!Array.isArray(tok.j) || tok.j.length === 0) return null;
    return tok;
  } catch {
    return null;
  }
}
