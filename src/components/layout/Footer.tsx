import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Image
              src="/logo.png"
              alt="NutriByMeli"
              width={160}
              height={56}
              className="h-12 w-auto mb-4"
            />
            <p className="text-sm leading-relaxed">
              Mélissa P. — Diététicienne Diplômée d&apos;État & Naturopathe.
              Basée en Guadeloupe, consultations en visio partout dans les
              Antilles et en France.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/questionnaire" className="hover:text-white transition-colors">
                  Bilan nutrition gratuit
                </Link>
              </li>
              <li>
                <a href="#methode" className="hover:text-white transition-colors">
                  Notre méthode
                </a>
              </li>
              <li>
                <a href="#a-propos" className="hover:text-white transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Questions fréquentes
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Légal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mentions-legales" className="hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="hover:text-white transition-colors">
                  CGV
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-white/40">
          <p>
            &copy; {new Date().getFullYear()} NutriByMeli — Mélissa P. Tous
            droits réservés.
          </p>
          <p className="mt-1">
            Les informations fournies sur ce site ne se substituent pas à un
            avis médical.
          </p>
        </div>
      </div>
    </footer>
  );
}
