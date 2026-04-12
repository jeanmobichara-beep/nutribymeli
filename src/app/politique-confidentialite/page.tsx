import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité - NutriByMeli",
};

export default function PolitiqueConfidentialite() {
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
        <h1 className="text-3xl font-bold text-[#2D5A3D] mb-8">Politique de confidentialité</h1>

        <div className="prose prose-gray max-w-none space-y-8 text-[#1a1a1a]/80">
          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mt-0">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles est :<br />
              <strong>MELIMO SARL</strong><br />
              Route de Blonzac, 97128 Goyave, Guadeloupe<br />
              Email : <a href="mailto:contact@nutri-meli.com" className="text-[#2D5A3D] underline">contact@nutri-meli.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">2. Données collectées</h2>
            <p>Dans le cadre de nos services, nous collectons les données suivantes :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Données d&apos;identification</strong> : prénom, nom, adresse email, âge, sexe.</li>
              <li><strong>Données de santé</strong> : poids, taille, antécédents médicaux, habitudes alimentaires, troubles digestifs, sommeil, stress, activité physique — collectées via le questionnaire nutritionnel.</li>
              <li><strong>Données de paiement</strong> : traitées directement par Stripe, nous n&apos;avons pas accès à vos informations bancaires.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">3. Finalités du traitement</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Générer votre pré-bilan nutritionnel personnalisé.</li>
              <li>Préparer et personnaliser votre consultation avec Mélissa Pommez.</li>
              <li>Assurer le suivi nutritionnel dans le cadre du programme 90 jours.</li>
              <li>Vous envoyer les emails liés à votre consultation (confirmation, résultats).</li>
            </ul>
            <p>
              <strong>Nous ne vendons, ne louons et ne partageons jamais vos données avec des tiers à des fins commerciales.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">4. Base légale du traitement</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Exécution du contrat</strong> : le traitement des données est nécessaire à la réalisation de la prestation de consultation nutritionnelle.</li>
              <li><strong>Consentement</strong> : en remplissant le questionnaire, vous consentez au traitement de vos données de santé aux fins décrites ci-dessus.</li>
              <li><strong>Intérêt légitime</strong> : amélioration de nos services et communication avec nos patients.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">5. Durée de conservation</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Données du questionnaire</strong> : les données sont transmises par email à la diététicienne et ne sont pas stockées sur nos serveurs. Aucune base de données patients n&apos;est conservée côté site web.</li>
              <li><strong>Dossiers de consultation</strong> : conservés par Mélissa Pommez conformément aux obligations professionnelles des Diététiciens DE, pendant la durée légale applicable.</li>
              <li><strong>Données de facturation</strong> : conservées pendant 10 ans conformément aux obligations comptables.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">6. Sous-traitants</h2>
            <p>Nous faisons appel aux sous-traitants suivants pour le fonctionnement du site :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Vercel Inc.</strong> (hébergement du site) — États-Unis</li>
              <li><strong>Resend</strong> (envoi d&apos;emails transactionnels) — États-Unis</li>
              <li><strong>Stripe</strong> (traitement des paiements) — États-Unis</li>
              <li><strong>Calendly</strong> (prise de rendez-vous) — États-Unis</li>
            </ul>
            <p>
              Ces sous-traitants sont conformes au RGPD et offrent des garanties appropriées pour la protection de vos données.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">7. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Droit d&apos;accès</strong> : obtenir la confirmation que vos données sont traitées et en obtenir une copie.</li>
              <li><strong>Droit de rectification</strong> : corriger des données inexactes ou incomplètes.</li>
              <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données.</li>
              <li><strong>Droit à la limitation</strong> : restreindre le traitement de vos données.</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré.</li>
              <li><strong>Droit d&apos;opposition</strong> : vous opposer au traitement de vos données.</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:contact@nutri-meli.com" className="text-[#2D5A3D] underline">contact@nutri-meli.com</a>.
              Nous répondrons dans un délai de 30 jours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">8. Cookies</h2>
            <p>
              Le site nutri-meli.com utilise uniquement des cookies strictement nécessaires au fonctionnement du site (cookies de session, préférences). Aucun cookie publicitaire, analytique ou de suivi n&apos;est utilisé.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">9. Sécurité</h2>
            <p>
              Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction. Le site utilise le protocole HTTPS pour chiffrer les communications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a]">10. Réclamation</h2>
            <p>
              Si vous estimez que le traitement de vos données n&apos;est pas conforme à la réglementation, vous pouvez adresser une réclamation à la CNIL :{" "}
              <a href="https://www.cnil.fr" className="text-[#2D5A3D] underline" target="_blank" rel="noopener noreferrer">
                www.cnil.fr
              </a>.
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
