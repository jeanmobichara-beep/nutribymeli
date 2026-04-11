import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import Image from "next/image";
import Link from "next/link";
import {
  ClipboardList,
  BarChart3,
  Video,
  Leaf,
  GraduationCap,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Heart,
  Sparkles,
  Timer,
  MapPin,
  Dna,
  Star,
  Users,
  MessageCircle,
  BookOpen,
  ShoppingCart,
  Utensils,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&q=80"
              alt="Alimentation saine et équilibrée"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/60" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20">
            <div className="max-w-2xl">
              <p className="text-[#6B9E6B] text-sm font-semibold tracking-wide mb-2">Mélissa Pommez</p>
              <div className="inline-flex items-center gap-2 bg-[#6B9E6B]/10 text-[#2D5A3D] text-sm font-medium px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
                <Leaf className="w-4 h-4" />
                Diététicienne Diplômée d&apos;État & Naturopathe
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1a1a1a] leading-[1.1] mb-6">
                Retrouvez énergie,
                <br />
                équilibre{" "}
                <span className="text-[#6B9E6B]">& vitalité</span>
                <br />
                par l&apos;alimentation
              </h1>

              <p className="text-lg sm:text-xl text-[#555] max-w-xl mb-10 leading-relaxed">
                Une approche clinique rigoureuse, sans promesses miracles.
                Découvrez votre terrain alimentaire en 10 minutes avec un bilan
                professionnel gratuit.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link
                  href="/questionnaire"
                  className="group bg-[#6B9E6B] hover:bg-[#5A8A5A] text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:shadow-xl hover:shadow-[#6B9E6B]/25 flex items-center gap-2"
                >
                  Faire mon bilan gratuit
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-4 text-sm text-[#888] mt-2 sm:mt-3">
                  <span className="flex items-center gap-1.5">
                    <Timer className="w-4 h-4" />
                    10 min
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Confidentiel
                  </span>
                </div>
              </div>
            </div>
          </div>

          <a
            href="#methode"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#888] hover:text-foreground transition-colors"
          >
            <span className="text-xs">Découvrir</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </section>

        {/* ===== SOCIAL PROOF BAR ===== */}
        <section className="bg-white border-y border-border/50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-6">
            {[
              { icon: GraduationCap, title: "Diététicienne", sub: "Diplômée d'État" },
              { icon: Leaf, title: "Naturopathe", sub: "Certifiée AEMN" },
              { icon: Dna, title: "Longévité", sub: "Biohacking & Prévention" },
              { icon: ClipboardList, title: "Bilan gratuit", sub: "Analyse complète offerte" },
              { icon: Sparkles, title: "90 jours", sub: "Programmes sur mesure" },
              { icon: Video, title: "Visio", sub: "Consultations à distance" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6B9E6B]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#6B9E6B]" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-bold text-[#1a1a1a]">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== MÉTHODE ===== */}
        <section id="methode" className="py-24 sm:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <p className="text-[#6B9E6B] text-sm font-semibold uppercase tracking-wider mb-3">
                Notre méthode
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Un parcours structuré et bienveillant, conçu pour vous
                accompagner de A à Z.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: ClipboardList,
                  step: "01",
                  title: "Bilan gratuit en ligne",
                  desc: "Répondez à un questionnaire clinique complet (10 min). Recevez votre pré-bilan personnalisé avec analyse de votre terrain sur 6 axes de santé.",
                  img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
                },
                {
                  icon: Video,
                  step: "02",
                  title: "Consultation personnalisée",
                  desc: "60 minutes en visio avec Mélissa pour approfondir votre bilan, comprendre vos priorités et définir votre feuille de route.",
                  img: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&q=80",
                },
                {
                  icon: BarChart3,
                  step: "03",
                  title: "Programme 90 jours",
                  desc: "Un accompagnement complet sur mesure : plan alimentaire, recettes filmées, liste de courses, coaching et ajustements continus.",
                  img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-border/50 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#6B9E6B] text-xs font-bold px-3 py-1 rounded-full">
                      Étape {item.step}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-[#6B9E6B]/10 flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5 text-[#6B9E6B]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-14">
              <Link
                href="/questionnaire"
                className="inline-flex items-center gap-2 bg-[#6B9E6B] hover:bg-[#5A8A5A] text-white font-semibold px-8 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-[#6B9E6B]/20"
              >
                Commencer mon bilan gratuit
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== PRÉ-BILAN PREVIEW ===== */}
        <section className="py-24 sm:py-32 bg-[#F9F6F1]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-[#6B9E6B] text-sm font-semibold uppercase tracking-wider mb-3">
                  Votre pré-bilan
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-6 leading-tight">
                  Un pré-bilan que vous ne trouverez{" "}
                  <span className="text-[#6B9E6B]">nulle part ailleurs</span>
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Pas un simple score. Une analyse multi-dimensionnelle de votre
                  terrain sur 6 axes cliniques, avec détection automatique de
                  patterns et recommandations personnalisées.
                </p>
                <ul className="space-y-4">
                  {[
                    "Analyse sur 6 axes : digestif, énergétique, inflammatoire, hormonal, nerveux, nutritionnel",
                    "Détection de patterns croisés (dysbiose, hypoglycémie réactionnelle…)",
                    "Identification de vos 3 priorités cliniques",
                    "Drapeaux rouges si consultation médicale recommandée",
                    "Rapport visuel clair et pédagogique",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#6B9E6B] flex-shrink-0 mt-0.5" />
                      <span className="text-[#444]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-xl border border-border/50 p-8">
                <div className="text-center mb-6">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Exemple de pré-bilan
                  </p>
                  <h3 className="font-semibold text-lg">Vos 6 axes de santé</h3>
                </div>
                <div className="aspect-square max-w-[280px] mx-auto relative">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {[1, 0.75, 0.5, 0.25].map((scale) => (
                      <polygon
                        key={scale}
                        points={hexagonPoints(100, 100, 80 * scale)}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}
                    <polygon
                      points="100,35 155,60 155,130 100,165 50,130 50,60"
                      fill="#6B9E6B"
                      fillOpacity="0.15"
                      stroke="#6B9E6B"
                      strokeWidth="2"
                    />
                    {[
                      [100, 35],
                      [155, 60],
                      [155, 130],
                      [100, 165],
                      [50, 130],
                      [50, 60],
                    ].map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r="4" fill="#6B9E6B" />
                    ))}
                  </svg>
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground">
                    Digestif
                  </span>
                  <span className="absolute top-[18%] right-0 text-[10px] font-medium text-muted-foreground">
                    Énergie
                  </span>
                  <span className="absolute bottom-[18%] right-0 text-[10px] font-medium text-muted-foreground">
                    Inflamm.
                  </span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground">
                    Hormonal
                  </span>
                  <span className="absolute bottom-[18%] left-0 text-[10px] font-medium text-muted-foreground">
                    Nerveux
                  </span>
                  <span className="absolute top-[18%] left-0 text-[10px] font-medium text-muted-foreground">
                    Nutrition
                  </span>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    { label: "Digestif", pct: 72, color: "bg-orange-400" },
                    { label: "Énergie", pct: 55, color: "bg-amber-400" },
                    { label: "Inflammatoire", pct: 40, color: "bg-[#6B9E6B]" },
                  ].map((bar) => (
                    <div key={bar.label} className="flex items-center gap-3 text-xs">
                      <span className="w-24 text-muted-foreground font-medium">{bar.label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                        <div
                          className={`${bar.color} h-2.5 rounded-full`}
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right font-semibold">{bar.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== IMAGE BREAK ===== */}
        <section className="relative h-72 sm:h-96 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1920&q=80"
            alt="Légumes frais et colorés"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#2D5A3D]/60 flex items-center justify-center">
            <blockquote className="text-center text-white max-w-2xl px-6">
              <p className="text-xl sm:text-2xl font-light italic leading-relaxed">
                &laquo; Votre assiette est le premier rendez-vous avec votre santé. Faites-en un acte conscient, pas une habitude subie. &raquo;
              </p>
              <cite className="text-white/70 text-sm mt-3 block not-italic">
                — Mélissa P., NutriByMeli
              </cite>
            </blockquote>
          </div>
        </section>

        {/* ===== À PROPOS ===== */}
        <section id="a-propos" className="py-24 sm:py-32 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <p className="text-[#6B9E6B] text-sm font-semibold uppercase tracking-wider mb-3">
                Votre thérapeute
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
                Mélissa P.
              </h2>
              <p className="text-muted-foreground mt-2">Diététicienne Diplômée d&apos;État & Naturopathe</p>
            </div>

            {/* Photo carousel + Bio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <PhotoCarousel />
              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 bg-[#6B9E6B]/10 text-[#2D5A3D] text-xs font-semibold px-3 py-1.5 rounded-full">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Diplômée d&apos;État
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#6B9E6B]/10 text-[#2D5A3D] text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Leaf className="w-3.5 h-3.5" />
                    Naturopathe AEMN
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#6B9E6B]/10 text-[#2D5A3D] text-xs font-semibold px-3 py-1.5 rounded-full">
                    <MapPin className="w-3.5 h-3.5" />
                    Guadeloupe
                  </span>
                </div>
                <div className="space-y-4 text-[#555] leading-relaxed">
                  <p className="text-lg font-medium text-[#1a1a1a]">
                    &laquo; J&apos;ai toujours été fascinée par le pouvoir de l&apos;alimentation
                    sur notre corps et notre esprit. &raquo;
                  </p>
                  <p>
                    Après l&apos;obtention de mon Diplôme d&apos;État en Diététique, j&apos;ai
                    voulu aller plus loin. La naturopathie m&apos;a permis de comprendre
                    le corps dans sa globalité — pas seulement ce qu&apos;on mange,
                    mais comment on vit, comment on dort, comment on gère le stress.
                  </p>
                  <p>
                    Formée à l&apos;Académie Européenne des Médecines Naturelles (AEMN),
                    je combine la rigueur clinique de la diététique avec une vision
                    holistique de la santé : micronutrition, phytothérapie,
                    gestion du stress, hygiène de vie et longévité.
                  </p>
                  <p>
                    Basée en Guadeloupe, je consulte en visio dans toutes les
                    Antilles et en France métropolitaine. Mon objectif : vous donner
                    les clés pour reprendre le contrôle de votre santé, durablement.
                  </p>
                </div>
              </div>
            </div>

            {/* Spécialités (was below gallery, now directly here) */}

            {/* Spécialités */}
            <div className="bg-[#F9F6F1] rounded-2xl p-8 sm:p-10">
              <h3 className="text-lg font-bold text-[#1a1a1a] text-center mb-8">Mes domaines d&apos;expertise</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { icon: Utensils, label: "Rééquilibrage alimentaire" },
                  { icon: Leaf, label: "Naturopathie & Phytothérapie" },
                  { icon: Dna, label: "Longévité & Biohacking" },
                  { icon: Heart, label: "Santé hormonale féminine" },
                  { icon: BarChart3, label: "Micronutrition" },
                  { icon: Sparkles, label: "Gestion du stress & Sommeil" },
                  { icon: ShieldCheck, label: "Inflammation & Terrain" },
                  { icon: BookOpen, label: "Éducation nutritionnelle" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
                    <div className="w-9 h-9 rounded-lg bg-[#6B9E6B]/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4.5 h-4.5 text-[#6B9E6B]" />
                    </div>
                    <span className="text-xs font-medium text-[#1a1a1a]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== OFFRES ===== */}
        <section className="py-24 sm:py-32 bg-[#F9F6F1]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <p className="text-[#6B9E6B] text-sm font-semibold uppercase tracking-wider mb-3">
                Nos accompagnements
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">
                Choisissez votre parcours
              </h2>
              <p className="text-muted-foreground">
                Chaque parcours commence par le bilan gratuit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pré-bilan */}
              <div className="bg-white rounded-2xl border border-border/50 p-8 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-[#6B9E6B]/10 flex items-center justify-center mb-4">
                  <ClipboardList className="w-5 h-5 text-[#6B9E6B]" />
                </div>
                <p className="text-[#6B9E6B] text-xs font-semibold uppercase tracking-wider mb-2">Étape 1</p>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-1">Pré-bilan</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-[#1a1a1a]">Gratuit</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Questionnaire clinique complet + analyse automatisée de votre terrain sur 6 axes de santé.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {["Questionnaire professionnel", "Analyse 6 axes cliniques", "Détection de patterns", "Rapport personnalisé"].map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-[#444]">
                      <CheckCircle2 className="w-4 h-4 text-[#6B9E6B] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/questionnaire" className="block text-center bg-[#6B9E6B] hover:bg-[#5A8A5A] text-white font-semibold py-3.5 rounded-full transition-all">
                  Commencer
                </Link>
              </div>

              {/* Consultation */}
              <div className="bg-white rounded-2xl border-2 border-[#6B9E6B] p-8 shadow-lg relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6B9E6B] text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Recommandé
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#6B9E6B]/10 flex items-center justify-center mb-4">
                  <Video className="w-5 h-5 text-[#6B9E6B]" />
                </div>
                <p className="text-[#6B9E6B] text-xs font-semibold uppercase tracking-wider mb-2">Étape 2</p>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-1">Consultation</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-[#1a1a1a]">69&euro;</span>
                  <span className="text-sm text-muted-foreground">/ 60 min</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Appel visio personnalisé avec Mélissa pour approfondir votre bilan et définir votre plan d&apos;action.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {["60 min en visio avec Mélissa", "Analyse approfondie du bilan", "Premières recommandations", "Feuille de route personnalisée"].map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-[#444]">
                      <CheckCircle2 className="w-4 h-4 text-[#6B9E6B] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/questionnaire" className="block text-center bg-[#6B9E6B] hover:bg-[#5A8A5A] text-white font-semibold py-3.5 rounded-full transition-all">
                  Commencer par le bilan
                </Link>
              </div>

              {/* Programme 90 jours — SANS PRIX */}
              <div className="bg-white rounded-2xl border border-border/50 p-8 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-[#6B9E6B]/10 flex items-center justify-center mb-4">
                  <Heart className="w-5 h-5 text-[#6B9E6B]" />
                </div>
                <p className="text-[#6B9E6B] text-xs font-semibold uppercase tracking-wider mb-2">Étape 3</p>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-1">Programme 90 jours</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-lg font-semibold text-[#1a1a1a]">Sur mesure</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  La transformation complète : 3 mois d&apos;accompagnement intensif pour ancrer de nouvelles habitudes durablement.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {[
                    "Plan alimentaire 100% personnalisé",
                    "Recettes filmées + listes de courses",
                    "Suivi hebdomadaire en visio",
                    "Ajustements en continu selon vos résultats",
                    "Support par messagerie illimité",
                    "Guide micronutrition personnalisé",
                    "Protocole longévité & anti-inflammation",
                    "Accès à la communauté NutriByMeli",
                  ].map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-[#444]">
                      <CheckCircle2 className="w-4 h-4 text-[#6B9E6B] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/questionnaire" className="block text-center border-2 border-[#6B9E6B] text-[#6B9E6B] hover:bg-[#6B9E6B] hover:text-white font-semibold py-3.5 rounded-full transition-all">
                  Commencer par le bilan
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== GARANTIES ===== */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {[
                { icon: ShieldCheck, title: "Secret professionnel", desc: "Vos données sont protégées par le cadre déontologique des diététiciens Diplômés d'État." },
                { icon: GraduationCap, title: "Expertise certifiée", desc: "Diplôme d'État en diététique + formation en naturopathie. Pas d'improvisation." },
                { icon: Leaf, title: "Approche naturelle", desc: "Alimentation, micronutrition et hygiène de vie. Sans promesses miracles." },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#F9F6F1] flex items-center justify-center mx-auto mb-5">
                    <item.icon className="w-7 h-7 text-[#6B9E6B]" />
                  </div>
                  <h4 className="font-semibold text-[#1a1a1a] mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="py-24 sm:py-32 bg-[#F9F6F1]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-[#6B9E6B] text-sm font-semibold uppercase tracking-wider mb-3">
                FAQ
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
                Questions fréquentes
              </h2>
            </div>
            <div className="space-y-3">
              {[
                { q: "Le bilan en ligne est-il vraiment gratuit ?", a: "Oui, 100% gratuit et sans engagement. Le questionnaire clinique et le pré-bilan personnalisé sont offerts. Ils vous permettent de découvrir votre terrain de santé avant toute consultation." },
                { q: "Mes données de santé sont-elles protégées ?", a: "Absolument. Vos réponses sont protégées par le secret professionnel inhérent au statut de Diététicienne Diplômée d'État, et traitées conformément au RGPD. Aucune donnée n'est partagée avec des tiers." },
                { q: "Comment se déroule la consultation en visio ?", a: "Après paiement (69\u20AC), vous recevez un lien de réservation pour choisir votre créneau. La consultation dure 60 minutes en visio. Mélissa analyse votre bilan en détail et définit avec vous une feuille de route personnalisée." },
                { q: "Que comprend le programme 90 jours ?", a: "Un plan alimentaire entièrement personnalisé, des recettes filmées avec listes de courses, un suivi hebdomadaire avec Mélissa, des ajustements en continu, un guide micronutrition personnalisé, un protocole longévité et anti-inflammation, et un support par messagerie illimité." },
                { q: "Consultez-vous uniquement en Guadeloupe ?", a: "Non. Les consultations se font en visio, donc accessibles partout : Guadeloupe, Martinique, Guyane, métropole et même international francophone." },
                { q: "Quelle est la différence avec un nutritionniste classique ?", a: "Mélissa combine un Diplôme d'État en diététique (approche clinique basée sur les preuves), une formation en naturopathie certifiée AEMN (vision globale du terrain) et une expertise en longévité et biohacking. Cette triple expertise permet une prise en charge bien plus complète que l'approche conventionnelle." },
                { q: "Qu'est-ce que l'approche longévité / biohacking ?", a: "C'est une approche préventive et proactive de la santé, basée sur les dernières recherches scientifiques : optimisation du métabolisme, gestion de l'inflammation chronique, exposition au froid, jeûne intermittent raisonné, micronutrition ciblée. L'objectif : non seulement vivre plus longtemps, mais surtout vivre mieux." },
                { q: "Je ne suis pas malade, est-ce que ça vaut le coup ?", a: "Absolument. La majorité de mes patients ne sont pas malades — ils veulent simplement se sentir mieux, avoir plus d'énergie, mieux dormir ou optimiser leur alimentation. La prévention est le meilleur investissement santé que vous puissiez faire." },
                { q: "Combien de temps faut-il pour voir des résultats ?", a: "Les premiers changements (énergie, digestion, sommeil) apparaissent généralement dans les 2 à 3 premières semaines. Les résultats durables sur le poids, l'inflammation et l'équilibre hormonal se consolident sur les 90 jours du programme." },
                { q: "Proposez-vous des régimes restrictifs ?", a: "Jamais. Mon approche est anti-régime. Je travaille sur le rééquilibrage alimentaire, l'écoute du corps et le plaisir de manger. Pas de privation, pas de frustration — des habitudes saines et durables." },
              ].map((faq) => (
                <details key={faq.q} className="group bg-white rounded-xl shadow-sm">
                  <summary className="cursor-pointer px-6 py-5 text-sm font-semibold text-[#1a1a1a] list-none flex items-center justify-between gap-4">
                    {faq.q}
                    <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="relative py-24 sm:py-32 overflow-hidden bg-[#2D5A3D]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #6B9E6B 0%, transparent 50%), radial-gradient(circle at 80% 50%, #A8C5A0 0%, transparent 50%)" }} />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
            <p className="text-[#A8C5A0] text-sm font-medium mb-4">
              Prêt(e) à prendre soin de vous ?
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Votre bilan personnalisé vous attend
            </h2>
            <p className="text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
              10 minutes pour découvrir votre terrain de santé. Un pré-bilan
              clinique complet, gratuit et confidentiel — le premier pas vers
              une alimentation qui vous ressemble.
            </p>
            <Link
              href="/questionnaire"
              className="inline-flex items-center gap-2 bg-white text-[#2D5A3D] font-semibold px-8 py-4 rounded-full text-lg transition-all hover:shadow-xl hover:bg-[#F9F6F1]"
            >
              Faire mon bilan gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-4 text-white/50 text-xs">
              10 minutes &middot; Confidentiel &middot; Sans engagement
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function hexagonPoints(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return points.join(" ");
}
