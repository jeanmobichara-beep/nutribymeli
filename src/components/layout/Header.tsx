"use client";

import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="NutriByMeli"
            width={140}
            height={50}
            className="h-14 w-auto"
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#methode" className="hover:text-foreground transition-colors">
            Méthode
          </a>
          <a href="#a-propos" className="hover:text-foreground transition-colors">
            À propos
          </a>
          <a href="#faq" className="hover:text-foreground transition-colors">
            FAQ
          </a>
        </nav>
        <Link
          href="/questionnaire"
          className="bg-[#6B9E6B] hover:bg-[#5A8A5A] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:shadow-lg"
        >
          Bilan gratuit
        </Link>
      </div>
    </header>
  );
}
