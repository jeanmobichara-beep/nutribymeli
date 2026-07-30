"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

/** Capture d'emails newsletter (footer homepage) — palette « précision tropicale ». */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

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
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="nl-ok" role="status">
        ✓ C&apos;est noté ! Tu recevras les conseils de Mélissa — promis, que du bon.
      </p>
    );
  }

  return (
    <form className="nl-form" onSubmit={submit}>
      <label htmlFor="nl-email" className="nl-label">
        Les conseils nutrition de Mélissa, direct dans ta boîte mail
      </label>
      <div className="nl-row">
        <input
          id="nl-email"
          type="email"
          required
          placeholder="ton@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="nl-input"
          autoComplete="email"
        />
        <button type="submit" className="btn btn-accent btn-sm" disabled={status === "sending"}>
          {status === "sending" ? "…" : "S'abonner"}
        </button>
      </div>
      <p className="nl-hint">
        {status === "error"
          ? "Oups, réessaie dans un instant."
          : "Bien-être, recettes, santé — 1 à 2 emails par mois, zéro spam."}
      </p>
    </form>
  );
}
