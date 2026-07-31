"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "sending" | "done" | "error";
const KEY = "nl_popup_seen"; // timestamp du dernier affichage
const COOLDOWN_J = 30;

/** Popup de collecte email — discret : 30 s OU 45 % de scroll, 1×/30 jours. */
export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    try {
      const last = parseInt(localStorage.getItem(KEY) || "0", 10);
      if (Date.now() - last < COOLDOWN_J * 24 * 3600 * 1000) return;
    } catch {
      /* localStorage indisponible */
    }

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
      try {
        localStorage.setItem(KEY, String(Date.now()));
      } catch {}
      window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop + window.innerHeight) / h.scrollHeight;
      if (pct > 0.45) show();
    };
    const timer = window.setTimeout(show, 30000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) setTimeout(() => setOpen(false), 2600);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="nl-pop" role="dialog" aria-label="Newsletter NutriByMeli">
      <button className="nl-pop-x" aria-label="Fermer" onClick={() => setOpen(false)}>
        ✕
      </button>
      <p className="nl-pop-eyebrow">La newsletter</p>
      <p className="nl-pop-title">Les conseils nutrition de Mélissa</p>
      {status === "done" ? (
        <p className="nl-pop-ok" role="status">✓ C&apos;est noté, à très vite !</p>
      ) : (
        <>
          <p className="nl-pop-sub">Bien-être, recettes, santé — 1 à 2 emails par mois, zéro spam.</p>
          <form onSubmit={submit} className="nl-pop-row">
            <input
              type="email"
              required
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="nl-input"
              autoComplete="email"
            />
            <button type="submit" className="btn btn-accent btn-sm" disabled={status === "sending"}>
              {status === "sending" ? "…" : "OK"}
            </button>
          </form>
          {status === "error" && <p className="nl-pop-err">Oups, réessaie dans un instant.</p>}
        </>
      )}
    </div>
  );
}
