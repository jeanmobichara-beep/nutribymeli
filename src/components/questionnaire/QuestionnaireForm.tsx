"use client";

import { useState, useCallback } from "react";
import { SECTIONS, type Question } from "@/data/questionnaire";
import { calculateBilan, type BilanResult } from "@/data/scoring";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Target,
  UtensilsCrossed,
  Apple,
  Shield,
  HeartPulse,
  Stethoscope,
  Brain,
  Dna,
  Activity,
  Sparkles,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Target,
  UtensilsCrossed,
  Apple,
  Shield,
  HeartPulse,
  Stethoscope,
  Brain,
  Dna,
  Activity,
  Sparkles,
};

interface QuestionnaireFormProps {
  onComplete: (result: BilanResult, answers: Record<string, string | string[]>) => void;
}

export function QuestionnaireForm({ onComplete }: QuestionnaireFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsent, setShowConsent] = useState(true);

  const totalSections = SECTIONS.length;
  const progress = ((currentSection + 1) / totalSections) * 100;
  const section = SECTIONS[currentSection];

  const setAnswer = useCallback(
    (questionId: string, value: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  const toggleCheckbox = useCallback(
    (questionId: string, value: string, maxChoices?: number) => {
      setAnswers((prev) => {
        const current = (prev[questionId] as string[]) || [];
        if (current.includes(value)) {
          return { ...prev, [questionId]: current.filter((v) => v !== value) };
        }
        if (maxChoices && current.length >= maxChoices) return prev;
        return { ...prev, [questionId]: [...current, value] };
      });
    },
    []
  );

  const isQuestionVisible = (q: Question): boolean => {
    if (!q.conditionalOn) return true;
    const val = answers[q.conditionalOn.questionId];
    if (!val) return false;
    const vals = Array.isArray(val) ? val : [val];
    return q.conditionalOn.values.some((v) => vals.includes(v));
  };

  const canProceed = (): boolean => {
    const visibleQuestions = section.questions.filter(isQuestionVisible);
    return visibleQuestions
      .filter((q) => q.required)
      .every((q) => {
        const val = answers[q.id];
        if (!val) return false;
        if (Array.isArray(val)) return val.length > 0;
        return val.trim() !== "";
      });
  };

  const handleNext = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection((s) => s + 1);
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    } else {
      const result = calculateBilan(answers);
      onComplete(result, answers);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection((s) => s - 1);
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  };

  // Consent screen
  if (showConsent) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8 sm:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#6B9E6B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-[#6B9E6B]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">
              Bilan Nutrition, Digestion & Hygiène de Vie
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
              Ce bilan me permet de réaliser une première analyse professionnelle
              de votre terrain alimentaire, digestif, métabolique et global.
            </p>
          </div>

          <div className="bg-[#F9F6F1] rounded-xl p-6 mb-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Vos réponses sont <strong className="text-foreground">strictement confidentielles</strong> et
              protégées par le secret professionnel, conformément au cadre
              déontologique de ma profession de{" "}
              <strong className="text-foreground">Diététicienne Diplômée d&apos;État</strong>.
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Il n&apos;y a aucun jugement, uniquement une analyse bienveillante
              pour mieux vous accompagner.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
            <span className="bg-[#6B9E6B]/10 text-[#2D5A3D] px-3 py-1 rounded-full text-xs font-medium">
              10-12 min
            </span>
            <span>10 sections</span>
            <span>&middot;</span>
            <span>100% confidentiel</span>
          </div>

          <div className="flex items-start gap-3 mb-8">
            <Checkbox
              id="consent"
              checked={consentGiven}
              onCheckedChange={(checked) => setConsentGiven(checked === true)}
              className="mt-0.5"
            />
            <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              J&apos;accepte que mes donnees de sante soient traitees par Melissa P.,
              Dieteticienne Diplomee d&apos;Etat, dans le cadre exclusif de ce bilan
              nutritionnel. Mes donnees ne seront ni partagees ni vendues a des
              tiers, conformement au RGPD et au secret professionnel.
            </Label>
          </div>

          <Button
            onClick={() => setShowConsent(false)}
            disabled={!consentGiven}
            className="w-full bg-[#6B9E6B] hover:bg-[#5A8A5A] text-white py-6 rounded-full text-base font-semibold"
          >
            Commencer mon bilan
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  const SectionIcon = ICON_MAP[section.icon] || Target;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">
            Section {currentSection + 1} / {totalSections}
          </span>
          <span className="text-xs font-medium text-[#6B9E6B]">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-100" />
      </div>

      {/* Section card */}
      <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8 sm:p-10">
        {/* Section header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 bg-[#6B9E6B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <SectionIcon className="w-6 h-6 text-[#6B9E6B]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1a1a1a]">
              {section.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {section.subtitle}
            </p>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {section.questions.filter(isQuestionVisible).map((q) => (
            <QuestionField
              key={q.id}
              question={q}
              value={answers[q.id]}
              onChange={setAnswer}
              onToggleCheckbox={toggleCheckbox}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentSection === 0}
            className="text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-[#6B9E6B] hover:bg-[#5A8A5A] text-white px-8 rounded-full"
          >
            {currentSection === totalSections - 1
              ? "Voir mon bilan"
              : "Continuer"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== Individual question renderer =====

interface QuestionFieldProps {
  question: Question;
  value: string | string[] | undefined;
  onChange: (id: string, value: string | string[]) => void;
  onToggleCheckbox: (id: string, value: string, maxChoices?: number) => void;
}

function QuestionField({
  question: q,
  value,
  onChange,
  onToggleCheckbox,
}: QuestionFieldProps) {
  return (
    <div>
      <Label className="text-sm font-semibold text-[#1a1a1a] mb-3 block">
        {q.label}
        {q.required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      {q.helpText && (
        <p className="text-xs text-muted-foreground mb-3">{q.helpText}</p>
      )}

      {/* Text / Email / Number */}
      {(q.type === "text" || q.type === "email" || q.type === "number") && (
        <Input
          type={q.type}
          placeholder={q.placeholder}
          value={(value as string) || ""}
          onChange={(e) => onChange(q.id, e.target.value)}
          className="bg-[#F9F6F1] border-0 focus-visible:ring-[#6B9E6B] h-12 rounded-xl"
        />
      )}

      {/* Textarea */}
      {q.type === "textarea" && (
        <Textarea
          placeholder={q.placeholder}
          value={(value as string) || ""}
          onChange={(e) => onChange(q.id, e.target.value)}
          rows={4}
          className="bg-[#F9F6F1] border-0 focus-visible:ring-[#6B9E6B] rounded-xl resize-none"
        />
      )}

      {/* Radio */}
      {q.type === "radio" && q.options && (
        <RadioGroup
          value={(value as string) || ""}
          onValueChange={(v) => onChange(q.id, v)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
        >
          {q.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-sm ${
                value === opt.value
                  ? "bg-[#6B9E6B]/10 border-2 border-[#6B9E6B] text-[#2D5A3D] font-medium"
                  : "bg-[#F9F6F1] border-2 border-transparent hover:border-[#6B9E6B]/30"
              }`}
            >
              <RadioGroupItem value={opt.value} className="border-[#6B9E6B]" />
              {opt.label}
            </label>
          ))}
        </RadioGroup>
      )}

      {/* Checkbox */}
      {q.type === "checkbox" && q.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {q.options.map((opt) => {
            const checked = ((value as string[]) || []).includes(opt.value);
            return (
              <label
                key={opt.value}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-sm ${
                  checked
                    ? "bg-[#6B9E6B]/10 border-2 border-[#6B9E6B] text-[#2D5A3D] font-medium"
                    : "bg-[#F9F6F1] border-2 border-transparent hover:border-[#6B9E6B]/30"
                }`}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => onToggleCheckbox(q.id, opt.value, q.maxChoices)}
                  className="border-[#6B9E6B]"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      )}

      {/* Scale */}
      {q.type === "scale" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              {q.scaleLabels?.min}
            </span>
            <span className="text-xs text-muted-foreground">
              {q.scaleLabels?.max}
            </span>
          </div>
          <div className="flex gap-2">
            {Array.from(
              { length: (q.max || 5) - (q.min || 1) + 1 },
              (_, i) => i + (q.min || 1)
            ).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange(q.id, String(n))}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  value === String(n)
                    ? "bg-[#6B9E6B] text-white shadow-md"
                    : "bg-[#F9F6F1] text-muted-foreground hover:bg-[#6B9E6B]/10"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
