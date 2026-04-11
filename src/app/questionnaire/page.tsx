"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { QuestionnaireForm } from "@/components/questionnaire/QuestionnaireForm";
import type { BilanResult } from "@/data/scoring";

export default function QuestionnairePage() {
  const router = useRouter();
  const [, setResult] = useState<BilanResult | null>(null);

  const handleComplete = async (
    bilanResult: BilanResult,
    answers: Record<string, string | string[]>
  ) => {
    setResult(bilanResult);
    // Store in sessionStorage (no server persistence — privacy by design)
    sessionStorage.setItem("bilan_result", JSON.stringify(bilanResult));
    sessionStorage.setItem("bilan_answers", JSON.stringify(answers));

    // Envoyer le dossier à Mélissa + email confirmation patient (fire & forget)
    fetch("/api/bilan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, result: bilanResult }),
    }).catch(() => {
      // Silencieux — l'envoi d'email ne doit pas bloquer l'UX
    });

    router.push("/bilan");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F6F1] to-white">
      {/* Mini header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="NutriByMeli"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Vos données sont protégées par le secret professionnel
          </span>
        </div>
      </header>

      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <QuestionnaireForm onComplete={handleComplete} />
      </div>
    </div>
  );
}
