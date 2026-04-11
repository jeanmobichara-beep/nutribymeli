"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  type BilanResult,
  type AxisScore,
  AXIS_LABELS,
} from "@/data/scoring";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ShieldAlert,
  TrendingUp,
  Calendar,
  Info,
} from "lucide-react";

const LEVEL_COLORS: Record<string, string> = {
  optimal: "#22c55e",
  attention: "#eab308",
  "préoccupant": "#f97316",
  critique: "#ef4444",
};

const LEVEL_BG: Record<string, string> = {
  optimal: "bg-green-50 border-green-200",
  attention: "bg-amber-50 border-amber-200",
  "préoccupant": "bg-orange-50 border-orange-200",
  critique: "bg-red-50 border-red-200",
};

const LEVEL_LABELS: Record<string, string> = {
  optimal: "Optimal",
  attention: "A surveiller",
  "préoccupant": "Preoccupant",
  critique: "Critique",
};

export default function BilanPage() {
  const router = useRouter();
  const [result, setResult] = useState<BilanResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    const stored = sessionStorage.getItem("bilan_result");
    const storedAnswers = sessionStorage.getItem("bilan_answers");
    if (!stored) {
      router.push("/questionnaire");
      return;
    }
    setResult(JSON.parse(stored));
    if (storedAnswers) setAnswers(JSON.parse(storedAnswers));
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Chargement de votre bilan...
        </div>
      </div>
    );
  }

  const prenom = (answers.prenom as string) || "vous";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F6F1] to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="NutriByMeli"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#6B9E6B]/10 text-[#2D5A3D] text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Bilan généré avec succès
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-3">
            Votre pré-bilan personnalisé
          </h1>
          <p className="text-muted-foreground">
            {prenom}, voici l&apos;analyse de votre terrain sur 6 axes cliniques.
          </p>
        </div>

        {/* Red Flags (critical — show first) */}
        {result.redFlags.length > 0 && (
          <div className="mb-8">
            {result.redFlags.map((flag) => (
              <div
                key={flag.id}
                className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-4"
              >
                <div className="flex gap-3">
                  <ShieldAlert className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-2">
                      {flag.message}
                    </h3>
                    <p className="text-sm text-red-700 leading-relaxed">
                      {flag.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Radar Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8 mb-8">
          <h2 className="text-lg font-bold text-[#1a1a1a] text-center mb-6">
            Vos 6 axes de santé
          </h2>
          <div className="max-w-[360px] mx-auto mb-8">
            <RadarChart axes={result.axes} />
          </div>

          {/* Score global */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-[#F9F6F1] rounded-2xl px-6 py-4">
              <div
                className="text-3xl font-bold"
                style={{
                  color:
                    result.overallScore >= 80
                      ? "#22c55e"
                      : result.overallScore >= 55
                        ? "#eab308"
                        : result.overallScore >= 30
                          ? "#f97316"
                          : "#ef4444",
                }}
              >
                {result.overallScore}
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Score global de santé</p>
                <p className="text-sm font-medium text-[#1a1a1a]">
                  {result.overallScore >= 80
                    ? "Terrain globalement équilibré"
                    : result.overallScore >= 55
                      ? "Quelques axes à surveiller"
                      : result.overallScore >= 30
                        ? "Plusieurs axes à travailler"
                        : "Prise en charge recommandée"}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              <Info className="w-3 h-3 inline mr-1" />
              100 = optimal &middot; Plus votre score est élevé, meilleur est votre terrain.
            </p>
          </div>

          {/* Axes détaillés */}
          <div className="space-y-4">
            {result.axes.map((axis) => (
              <AxisDetail key={axis.axis} axis={axis} />
            ))}
          </div>
        </div>

        {/* Patterns détectés */}
        {result.detectedPatterns.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8 mb-8">
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#6B9E6B]" />
              Patterns détectés
            </h2>
            <div className="space-y-4">
              {result.detectedPatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className={`rounded-xl border p-5 ${
                    pattern.severity === "alert"
                      ? "bg-orange-50 border-orange-200"
                      : pattern.severity === "warning"
                        ? "bg-amber-50 border-amber-200"
                        : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex gap-3">
                    <AlertTriangle
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        pattern.severity === "alert"
                          ? "text-orange-500"
                          : pattern.severity === "warning"
                            ? "text-amber-500"
                            : "text-blue-500"
                      }`}
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-[#1a1a1a] mb-1">
                        {pattern.name}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {pattern.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top priorités */}
        {result.topPriorities.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8 mb-8">
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">
              Vos priorités
            </h2>
            <div className="space-y-3">
              {result.topPriorities.map((priority, i) => (
                <div
                  key={priority}
                  className="flex items-center gap-3 bg-[#F9F6F1] rounded-xl px-5 py-4"
                >
                  <span className="w-8 h-8 bg-[#6B9E6B] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    {priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Synthèse personnalisée */}
        <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8 mb-8">
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[#6B9E6B]" />
            Synthèse de votre pré-bilan
          </h2>
          <div className="prose prose-sm max-w-none text-[#444] leading-relaxed space-y-3">
            <p>
              {prenom}, votre score global est de <strong>{result.overallScore}/100</strong>.{" "}
              {result.overallScore >= 80
                ? "Votre terrain est globalement bien équilibré. Quelques ajustements ciblés pourraient encore optimiser votre santé."
                : result.overallScore >= 55
                  ? "Votre terrain présente des points forts mais aussi des axes qui méritent attention. Un accompagnement ciblé pourrait faire une vraie différence."
                  : result.overallScore >= 30
                    ? "Plusieurs axes de votre terrain nécessitent un travail en profondeur. C'est le signe que votre corps vous envoie des signaux qu'il est important d'écouter."
                    : "Votre terrain présente des déséquilibres importants sur plusieurs axes. Une prise en charge structurée est fortement recommandée pour rétablir l'équilibre."}
            </p>

            {result.topPriorities.length > 0 && (
              <p>
                <strong>Vos axes prioritaires :</strong>{" "}
                {result.topPriorities.join(", ")}. Ce sont les domaines où un accompagnement personnalisé
                aura le plus d&apos;impact sur votre quotidien.
              </p>
            )}

            {result.detectedPatterns.length > 0 && (
              <p>
                <strong>{result.detectedPatterns.length} pattern{result.detectedPatterns.length > 1 ? "s" : ""} clinique{result.detectedPatterns.length > 1 ? "s" : ""}</strong>{" "}
                {result.detectedPatterns.length > 1 ? "ont été détectés" : "a été détecté"} dans vos réponses
                ({result.detectedPatterns.map((p) => p.name.toLowerCase()).join(", ")}).
                Ces interactions entre vos symptômes méritent une analyse approfondie.
              </p>
            )}

            {result.redFlags.length > 0 && (
              <p className="text-red-700 font-medium">
                ⚠ Attention : {result.redFlags.length} signal{result.redFlags.length > 1 ? "aux" : ""} d&apos;alerte
                {result.redFlags.length > 1 ? " ont été identifiés" : " a été identifié"}.
                Il est important d&apos;en discuter avec un professionnel de santé.
              </p>
            )}

            <p>
              Ce pré-bilan est une première photographie de votre terrain. Lors de la consultation,
              nous approfondirons ensemble chaque axe pour construire un plan d&apos;action concret,
              personnalisé et adapté à votre rythme de vie.
            </p>
          </div>
        </div>

        {/* CTA Consultation */}
        <div className="bg-[#2D5A3D] rounded-2xl p-8 sm:p-10 text-white text-center">
          <p className="text-[#A8C5A0] text-xs font-medium uppercase tracking-wider mb-3">
            Prochaine étape
          </p>
          <h2 className="text-2xl font-bold mb-3">
            {prenom}, passons à l&apos;action ensemble
          </h2>
          <p className="text-white/70 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
            Lors de la consultation, nous analyserons en détail votre bilan et je vous
            construirai une feuille de route claire et personnalisée pour les 90 prochains jours.
            Pas de régime, pas de frustration — un vrai plan adapté à votre vie.
          </p>

          <a
            href="#reserver"
            className="inline-flex items-center gap-2 bg-white text-[#2D5A3D] font-semibold px-8 py-4 rounded-full text-lg transition-all hover:shadow-xl hover:bg-[#F9F6F1] mb-4"
          >
            <Calendar className="w-5 h-5" />
            Réserver ma consultation — 69&euro;
          </a>
          <p className="text-white/50 text-xs">
            60 minutes en visio &middot; Analyse approfondie &middot; Feuille de route personnalisée
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground mt-8 max-w-lg mx-auto leading-relaxed">
          Ce pré-bilan est généré automatiquement à partir de vos réponses. Il ne
          constitue pas un diagnostic médical. Pour une analyse complète et
          personnalisée, réservez votre consultation avec Melissa P.,
          Diététicienne Diplômée d&apos;État.
        </p>
      </div>
    </div>
  );
}

// ===== Radar Chart Component =====

function RadarChart({ axes }: { axes: AxisScore[] }) {
  const sortedAxes = [...axes].sort((a, b) => {
    const order = [
      "digestif",
      "energetique",
      "inflammatoire",
      "hormonal",
      "nerveux",
      "nutritionnel",
    ];
    return order.indexOf(a.axis) - order.indexOf(b.axis);
  });

  const cx = 150,
    cy = 150,
    maxR = 110;
  const n = sortedAxes.length;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = (value / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const getLabelPoint = (index: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = maxR + 24;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Grid
  const gridLevels = [25, 50, 75, 100];
  const gridPolygons = gridLevels.map((level) => {
    const points = sortedAxes
      .map((_, i) => {
        const p = getPoint(i, level);
        return `${p.x},${p.y}`;
      })
      .join(" ");
    return points;
  });

  // Data polygon
  const dataPoints = sortedAxes
    .map((axis, i) => {
      const p = getPoint(i, axis.score);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 300 300" className="w-full h-auto">
      {/* Grid */}
      {gridPolygons.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {sortedAxes.map((_, i) => {
        const p = getPoint(i, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        );
      })}

      {/* Data area */}
      <polygon
        points={dataPoints}
        fill="#6B9E6B"
        fillOpacity="0.2"
        stroke="#6B9E6B"
        strokeWidth="2.5"
      />

      {/* Data points */}
      {sortedAxes.map((axis, i) => {
        const p = getPoint(i, axis.score);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="5"
            fill={LEVEL_COLORS[axis.level]}
            stroke="white"
            strokeWidth="2"
          />
        );
      })}

      {/* Labels */}
      {sortedAxes.map((axis, i) => {
        const p = getLabelPoint(i);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground"
            fontSize="10"
            fontWeight="500"
          >
            {AXIS_LABELS[axis.axis].split(" ")[0]}
          </text>
        );
      })}
    </svg>
  );
}

// ===== Axis Detail Component =====

function AxisDetail({ axis }: { axis: AxisScore }) {
  return (
    <div className={`rounded-xl border p-5 ${LEVEL_BG[axis.level]}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-[#1a1a1a]">{axis.label}</h3>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: LEVEL_COLORS[axis.level] + "20",
            color: LEVEL_COLORS[axis.level],
          }}
        >
          {LEVEL_LABELS[axis.level]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/60 rounded-full h-2.5 mb-3">
        <div
          className="h-2.5 rounded-full transition-all"
          style={{
            width: `${axis.score}%`,
            backgroundColor: LEVEL_COLORS[axis.level],
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground mb-2">{axis.description}</p>

      {/* Priorities */}
      {axis.priorities.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {axis.priorities.map((p) => (
            <div key={p} className="flex gap-2 text-xs">
              <ArrowRight className="w-3.5 h-3.5 text-[#6B9E6B] flex-shrink-0 mt-0.5" />
              <span className="text-[#1a1a1a] font-medium">{p}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
