"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem("cookie_consent", "refused");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-border/50 shadow-2xl p-4 sm:p-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-[#555] leading-relaxed flex-1">
          Ce site utilise des cookies essentiels pour son fonctionnement.
          Aucune donnée n&apos;est partagée avec des tiers.{" "}
          <Link href="/politique-confidentialite" className="text-[#6B9E6B] underline">
            Politique de confidentialité
          </Link>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={refuse}
            className="text-sm text-muted-foreground hover:text-foreground px-4 py-2 rounded-full border border-border/50 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="text-sm text-white bg-[#6B9E6B] hover:bg-[#5A8A5A] px-6 py-2 rounded-full font-medium transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
