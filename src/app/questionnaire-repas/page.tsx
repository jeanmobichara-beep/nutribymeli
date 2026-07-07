"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RepasForm } from "@/components/questionnaire/RepasForm";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

type Status = "form" | "sending" | "done" | "error";

export default function QuestionnaireRepasPage() {
  const [status, setStatus] = useState<Status>("form");
  const [prenom, setPrenom] = useState("");

  const handleComplete = async (answers: Record<string, string | string[]>) => {
    setPrenom((answers.prenom as string) || "");
    setStatus("sending");
    try {
      const res = await fetch("/api/questionnaire-repas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F6F1] to-white">
      <header className="bg-white/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="NutriByMeli" width={120} height={40} className="h-8 w-auto" />
          </Link>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Vos données sont protégées par le secret professionnel
          </span>
        </div>
      </header>

      <div className="py-8 sm:py-12 px-4 sm:px-6">
        {(status === "form" || status === "sending") && (
          <RepasForm onComplete={handleComplete} submitting={status === "sending"} />
        )}

        {status === "done" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-[#6B9E6B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#6B9E6B]" />
              </div>
              <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                Merci {prenom} ! C&apos;est bien reçu.
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto mb-8">
                Mélissa a reçu tes préférences. Elle revient vers toi avec ton menu
                de la semaine, pesé et dosé rien que pour toi. Les places sont limitées :
                tu fais partie du cercle.
              </p>
              <Link href="/">
                <Button className="bg-[#6B9E6B] hover:bg-[#5A8A5A] text-white px-8 rounded-full">
                  Retour à l&apos;accueil
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                Un petit souci technique
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto mb-8">
                Tes préférences n&apos;ont pas pu être envoyées. Réessaie dans un
                instant, ou écris directement à Mélissa.
              </p>
              <Button
                onClick={() => setStatus("form")}
                className="bg-[#6B9E6B] hover:bg-[#5A8A5A] text-white px-8 rounded-full"
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
