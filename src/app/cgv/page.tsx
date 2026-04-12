import Link from "next/link";

export const metadata = {
  title: "Conditions Générales de Vente - NutriByMeli",
};

export default function CGV() {
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
        <h1 className="text-3xl font-bold text-[#2D5A3D] mb-8">Conditions Générales de Vente</h1>

        <div className="prose prose-gray max-w-none space-y-8 text-[#1a1a1a]/80">
          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mt-0">Article 1 — Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations entre MELIMO SARL et toute personne effectuant un achat de prestation via le site nutri-meli.com. Toute réservation implique l&apos;acceptation sans réserve des présentes CGV.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Article 2 — Prestations proposées</h2>
            <p>NutriByMeli propose les prestations suivantes :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Pré-bilan nutritionnel en ligne</strong> : questionnaire gratuit avec résultats personnalisés.</li>
              <li><strong>Consultation nutritionnelle en visio</strong> (60 minutes) : 69 € TTC — analyse approfondie du bilan, plan d&apos;action personnalisé, recommandations.</li>
              <li><strong>Programme d&apos;accompagnement 90 jours</strong> : 790 € TTC (ou 3 x 263 € sans frais) — plan alimentaire personnalisé, consultations de suivi, messagerie illimitée, fiches et guides.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Article 3 — Tarifs et paiement</h2>
            <p>
              Les prix sont indiqués en euros TTC. Le paiement s&apos;effectue en ligne par carte bancaire via la plateforme sécurisée Stripe au moment de la réservation. Pour le programme 90 jours, un paiement en 3 fois sans frais est disponible.
            </p>
            <p>
              MELIMO SARL se réserve le droit de modifier ses tarifs à tout moment. Les prestations seront facturées au tarif en vigueur au moment de la réservation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Article 4 — Réservation et rendez-vous</h2>
            <p>
              Les consultations sont réservées via la plateforme Calendly. La réservation est confirmée après le paiement. Un email de confirmation contenant le lien de visio est envoyé automatiquement.
            </p>
            <p>
              Les consultations se déroulent en visio (Google Meet ou Zoom). Le patient doit se présenter à l&apos;heure convenue avec une connexion internet stable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Article 5 — Annulation et report</h2>
            <p>
              Toute annulation ou demande de report doit être effectuée au moins <strong>24 heures avant</strong> le rendez-vous prévu, par email à contact@nutri-meli.com. En cas de report dans les délais, un nouveau créneau sera proposé sans frais supplémentaires.
            </p>
            <p>
              En cas d&apos;absence non signalée ou d&apos;annulation tardive (moins de 24h), la consultation est considérée comme due et ne sera pas remboursée.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Article 6 — Droit de rétractation</h2>
            <p>
              Conformément à l&apos;article L.221-28 du Code de la consommation, le droit de rétractation ne s&apos;applique pas aux prestations de services pleinement exécutées avant la fin du délai de rétractation et dont l&apos;exécution a commencé avec l&apos;accord du consommateur.
            </p>
            <p>
              Pour les prestations non encore exécutées, le client dispose d&apos;un délai de 14 jours à compter de la réservation pour exercer son droit de rétractation, en adressant sa demande par email à contact@nutri-meli.com. Le remboursement sera effectué dans un délai de 14 jours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Article 7 — Responsabilité</h2>
            <p>
              Les conseils nutritionnels délivrés par Mélissa Pommez, Diététicienne Diplômée d&apos;État, sont personnalisés et basés sur les informations fournies par le patient. Ils ne se substituent en aucun cas à un avis ou un traitement médical.
            </p>
            <p>
              Le patient reste responsable de la véracité des informations transmises et de l&apos;application des recommandations. MELIMO SARL ne pourra être tenue responsable en cas de non-respect des conseils prodigués ou d&apos;omission d&apos;informations médicales importantes par le patient.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Article 8 — Confidentialité</h2>
            <p>
              Toutes les informations échangées lors des consultations sont strictement confidentielles, conformément au secret professionnel applicable aux Diététiciens Diplômés d&apos;État. Pour le traitement des données personnelles, consultez notre{" "}
              <Link href="/politique-confidentialite" className="text-[#2D5A3D] underline">
                Politique de confidentialité
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Article 9 — Droit applicable et litiges</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige, les parties s&apos;engagent à rechercher une solution amiable. À défaut, le litige sera porté devant les tribunaux compétents du ressort du siège social de MELIMO SARL.
            </p>
            <p>
              Conformément aux dispositions du Code de la consommation, le client peut recourir gratuitement au service de médiation proposé par MELIMO SARL. Le médiateur peut être saisi via la plateforme européenne de règlement en ligne des litiges :{" "}
              <a href="https://ec.europa.eu/consumers/odr" className="text-[#2D5A3D] underline" target="_blank" rel="noopener noreferrer">
                ec.europa.eu/consumers/odr
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Article 10 — Identification du prestataire</h2>
            <p>
              <strong>MELIMO SARL</strong><br />
              Capital social : 1 000 €<br />
              Siège social : Route de Blonzac, 97128 Goyave, Guadeloupe<br />
              RCS Basse-Terre : 987 946 449<br />
              Email : <a href="mailto:contact@nutri-meli.com" className="text-[#2D5A3D] underline">contact@nutri-meli.com</a>
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
