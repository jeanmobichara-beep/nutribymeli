"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { REPAS_SECTIONS } from "@/data/questionnaire-repas";
import type { Question } from "@/data/questionnaire";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, UtensilsCrossed, Target, Apple } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = { Target, UtensilsCrossed, Apple };

interface RepasFormProps {
  onComplete: (answers: Record<string, string | string[]>) => void;
  submitting?: boolean;
}

export function RepasForm({ onComplete, submitting = false }: RepasFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showIntro, setShowIntro] = useState(true);

  const totalSections = REPAS_SECTIONS.length;
  const progress = ((currentSection + 1) / totalSections) * 100;
  const section = REPAS_SECTIONS[currentSection];

  const setAnswer = useCallback((questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const toggleCheckbox = useCallback(
    (questionId: string, value: string, maxChoices?: number) => {
      setAnswers((prev) => {
        const current = (prev[questionId] as string[]) || [];
        if (current.includes(value)) {
          return { ...prev, [questionId]: current.filter((v) => v !== value) };
        }
        if (maxChoices && current.length >= maxChoices) return prev;
        if (questionId === "allergies") {
          return { ...prev, [questionId]: value === "aucune" ? [value] : [...current.filter((v) => v !== "aucune"), value] };
        }
        return { ...prev, [questionId]: [...current, value] };
      });
    },
    []
  );

  const canProceed = (): boolean =>
    section.questions
      .filter((q) => q.required)
      .every((q) => {
        const val = answers[q.id];
        if (!val) return false;
        if (Array.isArray(val)) return val.length > 0;
        return val.trim() !== "";
      });

  const handleNext = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection((s) => s + 1);
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection((s) => s - 1);
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  };

  // Intro screen
  if (showIntro) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#dce4d8] overflow-hidden">
          <div className="relative h-48 sm:h-56">
            <Image src="/home/pesee.jpg" alt="Une portion pesée avec soin en cuisine" fill sizes="(max-width: 672px) 100vw, 672px" className="object-cover" preload />
          </div>
          <div className="p-7 sm:p-10">
          <div className="mb-7">
            <p className="text-xs font-medium text-[#25573E] mb-3">Ton profil NutriByMeli</p>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#17291F] mb-4">
              Ton assiette commence par toi.
            </h1>
            <p className="text-[#546458] text-sm sm:text-base leading-relaxed">
              Parle à Mélissa de ton quotidien, de tes goûts et de tes besoins.
              Tes réponses l&apos;aident à penser tes portions et, si tu le souhaites,
              à te proposer une collation en complément.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <Image src="/home/melissa.jpg" alt="" width={40} height={40} className="rounded-full h-10 w-10 object-cover" />
              <p className="text-xs text-[#546458]"><strong className="block text-[#17291F] font-semibold">Mélissa</strong>Diététicienne diplômée d&apos;État</p>
            </div>
          </div>

          <div className="bg-[#FBFCF9] rounded-xl p-6 mb-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tes réponses servent à préparer ta proposition de repas.
              Les tarifs, les possibilités de livraison et les adaptations sont
              confirmés avec Mélissa avant toute commande. Tu peux consulter notre{" "}
              <a href="/politique-confidentialite" className="underline underline-offset-2">politique de confidentialité</a>.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
            <span className="bg-[#2A5A3A]/10 text-[#2A5A3A] px-3 py-1 rounded-full text-xs font-medium">
              Quelques minutes
            </span>
            <span>Sans engagement</span>
          </div>

          <Button
            onClick={() => setShowIntro(false)}
            className="w-full bg-[#C4F135] hover:bg-[#b3dd2a] text-[#16240F] py-6 rounded-full text-base font-semibold"
          >
            Créer mon profil
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          </div>
        </div>
      </div>
    );
  }

  const SectionIcon = ICON_MAP[section.icon] || UtensilsCrossed;
  const isLast = currentSection === totalSections - 1;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">
            Étape {currentSection + 1} / {totalSections}
          </span>
          <span className="text-xs font-medium text-[#2A5A3A]">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-100" />
      </div>

      {/* Section card */}
      <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8 sm:p-10">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 bg-[#2A5A3A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <SectionIcon className="w-6 h-6 text-[#2A5A3A]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1a1a1a]">{section.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{section.subtitle}</p>
          </div>
        </div>

        <div className="space-y-8">
          {section.questions.map((q) => (
            <RepasQuestionField
              key={q.id}
              question={q}
              value={answers[q.id]}
              onChange={setAnswer}
              onToggleCheckbox={toggleCheckbox}
            />
          ))}
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-10 pt-6 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentSection === 0 || submitting}
            className="text-muted-foreground w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed() || submitting}
            className="bg-[#C4F135] hover:bg-[#b3dd2a] text-[#16240F] px-6 rounded-full w-full sm:w-auto"
          >
            {submitting ? "Envoi…" : isLast ? "Envoyer mes préférences" : "Continuer"}
            {!submitting && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== Question renderer (calqué sur QuestionnaireForm) =====

interface RepasQuestionFieldProps {
  question: Question;
  value: string | string[] | undefined;
  onChange: (id: string, value: string | string[]) => void;
  onToggleCheckbox: (id: string, value: string, maxChoices?: number) => void;
}

function RepasQuestionField({
  question: q,
  value,
  onChange,
  onToggleCheckbox,
}: RepasQuestionFieldProps) {
  return (
    <div>
      <Label id={"label-" + q.id} htmlFor={"repas-" + q.id} className="text-sm font-semibold text-[#1a1a1a] mb-3 block">
        {q.label}
        {q.required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      {q.helpText && (
        <p className="text-xs text-muted-foreground mb-3">{q.helpText}</p>
      )}

      {(q.type === "text" || q.type === "email" || q.type === "number") && (
        <Input
          id={"repas-" + q.id}
          type={q.type}
          placeholder={q.placeholder}
          value={(value as string) || ""}
          onChange={(e) => onChange(q.id, e.target.value)}
          className="bg-[#FBFCF9] border-0 focus-visible:ring-[#2A5A3A] h-12 rounded-xl"
        />
      )}

      {q.type === "textarea" && (
        <Textarea
          id={"repas-" + q.id}
          placeholder={q.placeholder}
          value={(value as string) || ""}
          onChange={(e) => onChange(q.id, e.target.value)}
          rows={4}
          className="bg-[#FBFCF9] border-0 focus-visible:ring-[#2A5A3A] rounded-xl resize-none"
        />
      )}

      {q.type === "radio" && q.options && (
        <RadioGroup
          aria-labelledby={"label-" + q.id}
          value={(value as string) || ""}
          onValueChange={(v) => onChange(q.id, v)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
        >
          {q.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-sm ${
                value === opt.value
                  ? "bg-[#2A5A3A]/10 border-2 border-[#2A5A3A] text-[#2A5A3A] font-medium"
                  : "bg-[#FBFCF9] border-2 border-transparent hover:border-[#2A5A3A]/30"
              }`}
            >
              <RadioGroupItem value={opt.value} className="border-[#2A5A3A]" />
              {opt.label}
            </label>
          ))}
        </RadioGroup>
      )}

      {q.type === "checkbox" && q.options && (
        <div role="group" aria-labelledby={"label-" + q.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {q.options.map((opt) => {
            const checked = ((value as string[]) || []).includes(opt.value);
            return (
              <label
                key={opt.value}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-sm ${
                  checked
                    ? "bg-[#2A5A3A]/10 border-2 border-[#2A5A3A] text-[#2A5A3A] font-medium"
                    : "bg-[#FBFCF9] border-2 border-transparent hover:border-[#2A5A3A]/30"
                }`}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => onToggleCheckbox(q.id, opt.value, q.maxChoices)}
                  className="border-[#2A5A3A]"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
