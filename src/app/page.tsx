import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MapPin, Plus } from "lucide-react";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import "./home.css";
import "./home-v3.css";

const ASSIETTES = [
  { image: "/home/plat-saumon.jpg", title: "Saumon laqué miso-érable", detail: "Riz noir, brocolis rôtis au sésame.", note: "Le plaisir des beaux ingrédients", alt: "Saumon laqué accompagné de riz noir et de brocolis" },
  { image: "/home/plat-poulet.jpg", title: "Poulet curcuma & citron confit", detail: "Boulgour aux herbes, grenade, houmous de betterave.", note: "Des saveurs qui réveillent le déjeuner", alt: "Poulet au curcuma avec boulgour et houmous de betterave" },
  { image: "/home/plat-dahl.jpg", title: "Dahl de lentilles corail coco", detail: "Riz basmati, épinards, coriandre, oignons frits.", note: "Toute la gourmandise du végétal", alt: "Dahl de lentilles corail au lait de coco, riz et épinards" },
];

const FAQ = [
  { question: "Qu’est-ce qui est personnalisé pour moi ?", answer: "Tes portions et la composition de ton assiette sont pensées à partir de ton profil, de ton activité, de ton appétit et de tes objectifs. Mélissa s’appuie sur le menu de la semaine pour adapter les quantités et les associations. Tu échanges avec elle pour préciser ce qui te correspond." },
  { question: "Pourquoi remplir un questionnaire ?", answer: "Pour que Mélissa puisse comprendre ton quotidien, tes goûts et tes besoins avant de te proposer des repas. Il sert à préparer une première proposition et un échange avec elle. Remplir ton profil ne t’engage pas à commander." },
  { question: "Et les collations salées ou sucrées ?", answer: "Tu peux indiquer ton intérêt dans le questionnaire. Selon ton profil et ton alimentation sur le reste de la journée, Mélissa pourra te proposer une collation en complément du déjeuner. Son contenu et son tarif sont précisés avec toi avant toute commande." },
  { question: "Où sont prévus les premiers repas ?", answer: "Le lancement se concentre sur Jarry, à Baie-Mahault. Indique ton lieu de livraison et les jours qui t’intéressent dans le questionnaire : Mélissa te confirme les possibilités et les modalités avant la commande." },
  { question: "Quel est le prix ?", answer: "Le tarif dépend de la formule retenue : nombre de déjeuners et éventuelles collations. Tu reçois une proposition avec les repas, le prix et les modalités de livraison avant de décider. Aucun paiement n’est demandé pour remplir ton profil." },
  { question: "J’ai une allergie ou une contrainte alimentaire.", answer: "Précise-la dans le questionnaire, même si elle ne figure pas dans les choix proposés. Mélissa examine ta demande avant de confirmer ce qui est possible en cuisine. Une demande avec une allergie ou une intolérance nécessite sa validation ; le questionnaire ne garantit pas à lui seul la compatibilité des repas." },
];

function ProfileLink({ children = "Créer mon profil", className = "" }: { children?: React.ReactNode; className?: string }) {
  return <Link href="/questionnaire-repas" className={"btn btn-accent v3-cta " + className}>{children}<ArrowUpRight size={19} aria-hidden="true" /></Link>;
}

export default function HomePage() {
  return (
    <div className="nb-home nb-v3">
      <a className="v3-skip" href="#contenu">Aller au contenu</a>
      <div className="v3-location-bar"><MapPin size={14} aria-hidden="true" /><span>Les premières assiettes se préparent à Jarry, en Guadeloupe.</span><a href="#questions">En savoir plus</a></div>
      <header className="v3-nav">
        <div className="v3-container v3-nav-inner">
          <Link href="/" aria-label="NutriByMeli, accueil"><Image src="/home/logo.svg" alt="Nutri by Meli" width={138} height={64} className="v3-logo" preload /></Link>
          <nav aria-label="Navigation principale" className="v3-nav-links">
            <a href="#approche">L’approche</a><a href="#assiettes">Les assiettes</a><a href="#melissa">Mélissa</a>
          </nav>
          <ProfileLink className="v3-nav-cta" />
        </div>
      </header>

      <main id="contenu">
        <section className="v3-hero" aria-labelledby="hero-title">
          <div className="v3-container v3-hero-grid">
            <div className="v3-hero-copy">
              <p className="v3-kicker"><span className="v3-dot" />La cuisine d’une diététicienne. Pour toi.</p>
              <h1 id="hero-title">Bien manger,<br />à ta mesure.</h1>
              <p className="v3-hero-description">Des plats qui donnent envie. Des portions pensées pour toi. Mélissa, diététicienne diplômée d’État, met son expertise et sa cuisine dans ton quotidien.</p>
              <div className="v3-hero-actions"><ProfileLink /><a className="v3-text-link" href="#approche">Découvrir l’approche</a></div>
              <p className="v3-reassurance">Quelques minutes pour parler de toi. Sans engagement.</p>
              <div className="v3-hero-person">
                <Image src="/home/melissa.jpg" alt="" width={52} height={52} />
                <div><strong>Mélissa, derrière chaque assiette.</strong><span>Diététicienne D.E. & naturopathe</span></div>
              </div>
            </div>
            <div className="v3-hero-visual">
              <div className="v3-hero-photo"><Image src="/home/hero.jpg" alt="Une assiette NutriByMeli : galettes de poisson, légumes et quinoa, dans un contenant en verre" fill sizes="(max-width: 760px) 100vw, 52vw" preload /></div>
              <div className="v3-photo-note"><span className="v3-note-mark"><Check size={20} aria-hidden="true" /></span><div><strong>Pensé. Pesé. Cuisiné.</strong><span>Avec du soin dans chaque portion.</span></div></div>
              <span className="v3-photo-caption">Le plaisir de bien manger, au quotidien.</span>
            </div>
          </div>
        </section>

        <div className="v3-principles"><div className="v3-container"><span>Une vraie diététicienne</span><span>Une cuisine pleine de goût</span><span>Des portions qui te correspondent</span></div></div>

        <section id="approche" className="v3-section v3-approach" aria-labelledby="approach-title">
          <div className="v3-container v3-approach-grid">
            <div className="v3-section-intro"><p className="v3-kicker">Le sur-mesure, concrètement</p><h2 id="approach-title">Ton quotidien.<br />Tes besoins.<br />Ton assiette.</h2><p>Tu ne manges pas comme ton voisin. Ton déjeuner mérite qu’on s’intéresse à toi.</p><a href="/questionnaire-repas" className="v3-text-link">Tout commence par ton profil <ArrowUpRight size={17} aria-hidden="true" /></a></div>
            <div className="v3-personalisation">
              <article><span className="v3-detail-label">Te comprendre</span><h3>Ce qui compte pour toi.</h3><p>Ton rythme, ton activité, tes goûts, ton appétit. Le questionnaire donne à Mélissa les premiers repères pour te proposer une assiette adaptée.</p></article>
              <article><span className="v3-detail-label">Ajuster l’assiette</span><h3>Les bonnes portions. Le même plaisir.</h3><p>Protéines, accompagnements, légumes : les quantités et les associations se travaillent selon ton profil, à partir des préparations du menu.</p></article>
              <article><span className="v3-detail-label">Voir la journée dans son ensemble</span><h3>Et parfois, une collation en plus.</h3><p>Salée ou sucrée, elle peut compléter ton déjeuner si cela correspond à tes besoins. Mélissa en discute avec toi.</p></article>
            </div>
          </div>
        </section>

        <section id="assiettes" className="v3-section v3-food" aria-labelledby="food-title">
          <div className="v3-container">
            <div className="v3-section-heading"><div><p className="v3-kicker">Le goût a toute sa place</p><h2 id="food-title">L’équilibre, oui.<br />L’envie d’y revenir, aussi.</h2></div><p>Des associations généreuses, des textures, des épices. Voici un aperçu de l’univers culinaire NutriByMeli.</p></div>
            <div className="v3-meal-grid">{ASSIETTES.map((meal) => <article className="v3-meal" key={meal.title}><div className="v3-meal-image"><Image src={meal.image} alt={meal.alt} fill sizes="(max-width: 760px) 100vw, 33vw" /></div><div className="v3-meal-copy"><span>{meal.note}</span><h3>{meal.title}</h3><p>{meal.detail}</p></div></article>)}</div>
            <p className="v3-menu-note">Exemples de plats. Le menu et tes portions sont précisés dans ta proposition.</p>
          </div>
        </section>

        <section id="melissa" className="v3-section v3-melissa" aria-labelledby="melissa-title">
          <div className="v3-container v3-melissa-grid">
            <div className="v3-portrait"><Image src="/home/melissa.jpg" alt="Mélissa, diététicienne diplômée d’État et créatrice de NutriByMeli" fill sizes="(max-width: 760px) 100vw, 45vw" /><div className="v3-portrait-label"><strong>Mélissa</strong><span>Diététicienne diplômée d’État</span></div></div>
            <div className="v3-melissa-copy"><p className="v3-kicker">Une professionnelle. Une passion pour la cuisine.</p><h2 id="melissa-title">La nutrition,<br />avec un vrai<br />goût de cuisine.</h2><p>Diététicienne diplômée d’État et également naturopathe, Mélissa réunit deux savoir-faire : comprendre tes besoins et cuisiner des plats que tu as plaisir à manger.</p><p>Elle pense les associations, ajuste les portions et prépare les repas. Son expertise se retrouve dans le contenu de ton assiette, autant que dans l’attention qu’elle te porte.</p><div className="v3-credentials"><span>Diététicienne D.E.</span><span>Naturopathe</span><span>En Guadeloupe</span></div><ProfileLink>Parler de mes besoins</ProfileLink></div>
          </div>
        </section>

        <section className="v3-section v3-snacks" aria-labelledby="snack-title"><div className="v3-container"><div className="v3-snack-panel"><div><p className="v3-kicker">L’attention continue après le déjeuner</p><h2 id="snack-title">Une petite faim,<br />une vraie attention.</h2><p>Ton équilibre se construit sur la journée. Selon tes besoins, une collation peut trouver sa place à côté de tes repas : une option à étudier avec Mélissa, dès ton questionnaire.</p><a className="v3-text-link" href="/questionnaire-repas">Indiquer mes envies <ArrowUpRight size={17} aria-hidden="true" /></a></div><div className="v3-snack-options"><div><span>Plutôt salé</span><p>Une pause gourmande, adaptée à ton rythme.</p></div><span className="v3-snack-or">ou</span><div><span>Plutôt sucré</span><p>Du plaisir, avec une composition pensée pour toi.</p></div><p className="v3-snack-footnote">En complément, selon la proposition de Mélissa.</p></div></div></div></section>

        <section className="v3-section v3-how" aria-labelledby="how-title"><div className="v3-container"><div className="v3-section-heading"><div><p className="v3-kicker">Simple pour toi. Soigné en cuisine.</p><h2 id="how-title">De ton profil<br />à ta pause déjeuner.</h2></div><p>On prend le temps de te connaître, puis on organise la suite avec toi.</p></div><div className="v3-steps">
          <article><div className="v3-step-image"><Image src="/home/quiz.jpg" alt="Ingrédients préparés et pesés pour composer les repas" fill sizes="(max-width: 760px) 100vw, 33vw" /><span>01</span></div><h3>Tu parles de toi.</h3><p>Quelques questions sur tes besoins, tes goûts, tes jours et ton lieu de livraison.</p></article>
          <article><div className="v3-step-image"><Image src="/home/pesee.jpg" alt="Une portion sur une balance de cuisine" fill sizes="(max-width: 760px) 100vw, 33vw" /><span>02</span></div><h3>Mélissa affine avec toi.</h3><p>Les repas, les portions, les éventuelles collations et le tarif sont précisés avant ta commande.</p></article>
          <article><div className="v3-step-image"><Image src="/home/cuisine.jpg" alt="Repas préparés et conditionnés en cuisine" fill sizes="(max-width: 760px) 100vw, 33vw" /><span>03</span></div><h3>Cuisiné, pesé, livré.</h3><p>Ta livraison est organisée sur Jarry, selon les jours et les modalités convenus.</p></article>
        </div></div></section>

        <section id="questions" className="v3-section v3-faq" aria-labelledby="faq-title"><div className="v3-container v3-faq-grid"><div><p className="v3-kicker">Avant de te lancer</p><h2 id="faq-title">Tu te demandes<br />peut-être…</h2><p>Quelques réponses pour te projeter.</p></div><div className="v3-faq-items">{FAQ.map((item) => <details key={item.question}><summary>{item.question}<Plus size={20} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></div></section>

        <section className="v3-final" aria-labelledby="final-title"><div className="v3-container v3-final-inner"><div><p className="v3-kicker">NutriByMeli, à Jarry</p><h2 id="final-title">Et si on commençait<br />par toi ?</h2><p>Raconte ton quotidien à Mélissa.<br />La suite se prépare ensemble.</p></div><div className="v3-final-action"><ProfileLink /><span>Sans engagement. À ton rythme.</span></div></div></section>
      </main>

      <footer className="v3-footer"><div className="v3-container"><div className="v3-footer-top"><div><Image src="/home/logo.svg" alt="Nutri by Meli" width={145} height={72} /><p>La cuisine d’une diététicienne.<br />Des assiettes à ta mesure.</p><span>Jarry, Baie-Mahault · Guadeloupe</span></div><NewsletterForm /></div><div className="v3-footer-bottom"><span>© {new Date().getFullYear()} NutriByMeli</span><nav aria-label="Liens de pied de page"><Link href="/questionnaire">Bilan nutritionnel</Link><Link href="/mentions-legales">Mentions légales</Link><Link href="/politique-confidentialite">Confidentialité</Link><Link href="/cgv">CGV</Link></nav></div></div></footer>
    </div>
  );
}
