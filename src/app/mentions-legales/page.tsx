import Link from "next/link";

export const metadata = {
  title: "Mentions légales - NutriByMeli",
};

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <header className="bg-white/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <Link href="/" className="text-[#2D5A3D] font-bold text-lg hover:opacity-80 transition">
            NutriByMeli
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-[#2D5A3D] mb-8">Mentions légales</h1>

        <div className="prose prose-gray max-w-none space-y-8 text-[#1a1a1a]/80">
          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mt-0">1. Éditeur du site</h2>
            <p>
              Le site <strong>nutri-meli.com</strong> est édité par :<br />
              <strong>MELIMO SARL</strong><br />
              Société à responsabilité limitée au capital de 1 000 euros<br />
              Siège social : Route de Blonzac, 97128 Goyave, Guadeloupe<br />
              RCS Basse-Terre : 987 946 449<br />
              Co-gérants : Jean-Maurice Bichara-Jabour & Mélissa Pommez
            </p>
            <p>
              Email : <a href="mailto:contact@nutri-meli.com" className="text-[#2D5A3D] underline">contact@nutri-meli.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">2. Responsable de la publication</h2>
            <p>
              Mélissa Pommez, Diététicienne Diplômée d&apos;État & Naturopathe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">3. Hébergement</h2>
            <p>
              Le site est hébergé par :<br />
              <strong>Vercel Inc.</strong><br />
              440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis<br />
              Site : <a href="https://vercel.com" className="text-[#2D5A3D] underline" target="_blank" rel="noopener noreferrer">vercel.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">4. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu du site nutri-meli.com (textes, images, graphismes, logo, icônes, etc.) est la propriété exclusive de MELIMO SARL, sauf mention contraire. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l&apos;autorisation écrite préalable de MELIMO SARL.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">5. Données personnelles</h2>
            <p>
              Les données personnelles collectées via le questionnaire nutritionnel et les formulaires du site sont traitées conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée. Pour plus d&apos;informations, consultez notre{" "}
              <Link href="/politique-confidentialite" className="text-[#2D5A3D] underline">
                Politique de confidentialité
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">6. Limitation de responsabilité</h2>
            <p>
              Les informations fournies sur le site nutri-meli.com sont à titre informatif et ne constituent en aucun cas un avis médical. Elles ne se substituent pas à une consultation médicale. Mélissa Pommez, en tant que Diététicienne Diplômée d&apos;État, propose un accompagnement nutritionnel personnalisé qui ne remplace pas le suivi de votre médecin traitant.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">7. Cookies</h2>
            <p>
              Le site utilise des cookies strictement nécessaires à son fonctionnement. Aucun cookie publicitaire ou de tracking n&apos;est utilisé.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2D5A3D]/10 text-sm text-[#1a1a1a]/50">
          Dernière mise à jour : avril 2026
        </div>
      </main>
    </div>
  );
}
