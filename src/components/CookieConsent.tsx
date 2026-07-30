"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * Bannière cookies — charte « précision tropicale ».
 * Autonome (aucune dépendance aux tokens .nb-home) : elle s'affiche sur toutes les pages.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const choose = (value: "accepted" | "refused") => {
    localStorage.setItem("cookie_consent", value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[100]">
      <div className="rounded-2xl border border-[#E1E6D9] bg-[#FBFCF9]/95 backdrop-blur-md shadow-[0_24px_60px_-24px_rgba(20,50,30,0.45)] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#C4F135] text-base"
          >
            🍪
          </span>
          <div>
            <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-[#2A5A3A]">
              Cookies
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#586A5B]">
              Uniquement des cookies essentiels au fonctionnement du site. Aucune
              donnée partagée avec des tiers — promis, on ne pèse que les
              assiettes.{" "}
              <Link
                href="/politique-confidentialite"
                className="font-medium text-[#2A5A3A] underline underline-offset-2 hover:text-[#14201A]"
              >
                En savoir plus
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => choose("refused")}
            className="rounded-full border border-[#E1E6D9] px-4 py-2 text-sm font-semibold text-[#586A5B] transition-colors hover:border-[#2A5A3A] hover:text-[#14201A]"
          >
            Refuser
          </button>
          <button
            onClick={() => choose("accepted")}
            className="rounded-full bg-[#C4F135] px-5 py-2 text-sm font-bold text-[#16240F] shadow-[0_6px_22px_-8px_rgba(120,160,20,0.7)] transition-transform hover:-translate-y-0.5"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
