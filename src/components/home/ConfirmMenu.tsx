"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

/** Bouton de confirmation du menu (page /menu) — notifie Mélissa + confirme au client. */
export function ConfirmMenu({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("idle");

  const confirm = async () => {
    if (status === "sending" || status === "done") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/menu-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ d: token }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p
        role="status"
        style={{
          display: "inline-block", background: "var(--nb-surface)", color: "var(--nb-brand)",
          fontWeight: 700, borderRadius: 999, padding: "0.9em 1.6em", marginTop: 24,
        }}
      >
        ✓ C&apos;est confirmé ! Mélissa valide ton menu et te recontacte très vite.
      </p>
    );
  }

  return (
    <>
      <button className="btn btn-accent btn-arrow" onClick={confirm} disabled={status === "sending"}>
        {status === "sending" ? "Confirmation…" : "Je confirme mon menu"}
      </button>
      {status === "error" && (
        <p style={{ marginTop: 12, color: "#B45309", fontSize: "0.9rem" }}>
          Oups, réessaie dans un instant — ou écris-nous directement.
        </p>
      )}
    </>
  );
}
