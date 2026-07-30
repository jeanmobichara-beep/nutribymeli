import Link from "next/link";
import "./home.css";
import { RevealInit } from "@/components/home/RevealInit";

/* eslint-disable @next/next/no-img-element */

const MENU = [
  {
    img: "/home/plat-saumon.jpg",
    alt: "Saumon laqué miso-érable, riz noir, brocolis rôtis au sésame",
    tags: ["Sans gluten", "Oméga-3"],
    title: "Saumon laqué miso-érable",
    comp: "Riz noir, brocolis rôtis au sésame.",
    macros: [
      { v: "38 g", u: "Protéines" },
      { v: "620", u: "Kcal" },
      { v: "470 g", u: "L'assiette" },
    ],
  },
  {
    img: "/home/plat-poulet.jpg",
    alt: "Poulet curcuma et citron confit, boulgour aux herbes, houmous de betterave",
    tags: ["Signature", "Super protéiné"],
    title: "Poulet curcuma & citron confit",
    comp: "Boulgour aux herbes, grenade, houmous de betterave.",
    macros: [
      { v: "42 g", u: "Protéines" },
      { v: "590", u: "Kcal" },
      { v: "480 g", u: "L'assiette" },
    ],
  },
  {
    img: "/home/plat-dahl.jpg",
    alt: "Dahl de lentilles corail coco, riz basmati, épinards, oignons frits",
    tags: ["Végé", "Riche en fibres"],
    title: "Dahl de lentilles corail coco",
    comp: "Riz basmati, épinards, coriandre, oignons frits maison.",
    macros: [
      { v: "24 g", u: "Protéines" },
      { v: "540", u: "Kcal" },
      { v: "460 g", u: "L'assiette" },
    ],
  },
];

const QUALITY = [
  ["Fruits & légumes bio.", "Achetés en magasin bio, jamais du tout-venant."],
  ["Protéines de qualité.", "Poisson, volaille, légumineuses — variées, jamais transformées."],
  ["Zéro ultra-transformé, zéro sucre caché.", "Tu sais exactement ce que tu manges."],
  ["Cuisiné frais, jamais congelé.", "Préparé pour toi, pas produit en série."],
  ["Pesé au gramme par une diététicienne.", "La bonne quantité de protéines, de fibres, de tout."],
];

export default function HomePage() {
  return (
    <div className="nb-home">
      <RevealInit />

      {/* ===== Nav ===== */}
      <header className="nb-nav">
        <div className="wrap nav-in">
          <Link href="/">
            <img className="nav-logo" src="/home/logo.svg" alt="Nutri by Meli" />
          </Link>
          <nav className="nav-links">
            <a className="txt" href="#apropos">À propos</a>
            <Link className="txt" href="/questionnaire">Bilan nutritionnel</Link>
            <Link className="btn btn-accent btn-sm" href="/questionnaire-repas">Composer mon menu</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ===== Hero ===== */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <span className="eyebrow reveal">N°1 aux Antilles — par une diététicienne D.E.</span>
              <h1 className="reveal">Mange sain.<br />Sans te prendre la tête.</h1>
              <p className="lead reveal">
                Chaque semaine, des déjeuners frais, pesés et dosés pour ton corps par une
                diététicienne diplômée. On cuisine, on livre. Fini les courses, fini la
                question «&nbsp;qu&apos;est-ce que je mange&nbsp;?&nbsp;».
              </p>
              <div className="hero-cta reveal">
                <Link className="btn btn-accent btn-arrow" href="/questionnaire-repas">
                  Composer mon menu — 2 min
                </Link>
                <Link className="btn btn-ghost" href="/questionnaire">
                  Mon bilan nutritionnel offert
                </Link>
              </div>
              <div className="chips reveal">
                <span className="chip">Diététicienne D.E.</span>
                <span className="chip">Frais &amp; bio</span>
                <span className="chip">Livraison offerte</span>
                <span className="chip">Places limitées</span>
              </div>
            </div>
            <div className="hero-media reveal">
              <img
                src="/home/hero.jpg"
                alt="Un déjeuner NutriByMeli : steaks de poisson, légumes sautés et quinoa dans une gamelle en verre"
              />
              <div className="hero-badge">
                <div className="k">38 g</div>
                <div className="l">de protéines · pesé pour toi</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Comment ça marche ===== */}
        <section id="menu">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Comment ça marche</span>
              <h2>Trois étapes. Zéro prise de tête.</h2>
            </div>
            <div className="steps">
              <div className="stepc reveal">
                <img src="/home/quiz.jpg" alt="Le quiz NutriByMeli sur téléphone" />
                <div className="body">
                  <span className="n">01</span>
                  <h3>Ton profil en 2 min</h3>
                  <p>Objectif, allergies, goûts. On apprend à te connaître — un vrai quiz, pas un formulaire.</p>
                </div>
              </div>
              <div className="stepc reveal">
                <img src="/home/semaine.jpg" alt="Une semaine de repas différents, prêts en gamelles" />
                <div className="body">
                  <span className="n">02</span>
                  <h3>Ton menu, composé pour toi</h3>
                  <p>Chaque semaine, Mélissa compose ton menu, pesé selon tes besoins. Un plat ne te tente pas&nbsp;? Tu l&apos;échanges.</p>
                </div>
              </div>
              <div className="stepc reveal">
                <img src="/home/cuisine.jpg" alt="Cuisine propre, gamelles prêtes à être livrées" />
                <div className="body">
                  <span className="n">03</span>
                  <h3>On cuisine, tu profites</h3>
                  <p>Tu coches tes jours, on cuisine frais et on livre. Tu n&apos;as plus qu&apos;à te régaler.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Menu de la semaine ===== */}
        <section>
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Le menu de la semaine</span>
              <h2>Chaque plat, pesé au gramme.</h2>
              <p className="lead">Un aperçu. Le tien sera composé selon ton profil.</p>
            </div>
            <div className="menu-cards">
              {MENU.map((m) => (
                <article className="mcard reveal" key={m.title}>
                  <img className="ph" src={m.img} alt={m.alt} />
                  <div className="tags">
                    {m.tags.map((t) => (
                      <span className="tag" key={t}>{t}</span>
                    ))}
                  </div>
                  <h3>{m.title}</h3>
                  <p className="comp">{m.comp}</p>
                  <div className="macros">
                    {m.macros.map((x) => (
                      <span className="m" key={x.u}>
                        <span className="v">{x.v}</span>
                        <span className="u">{x.u}</span>
                      </span>
                    ))}
                  </div>
                  <span className="perso">Personnalisé pour toi</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Ce que tu gagnes ===== */}
        <section>
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Ce que tu gagnes</span>
              <h2>Fais tes comptes.</h2>
            </div>
            <div className="stats">
              <div className="stat reveal">
                <div className="big">~3 h</div>
                <div className="desc">gagnées chaque semaine — fini les courses et la cuisine du midi.</div>
              </div>
              <div className="stat reveal">
                <div className="big">0</div>
                <div className="desc">gaspillage — tu paies exactement ce que tu manges, rien de plus.</div>
              </div>
              <div className="stat reveal">
                <div className="big">0 €</div>
                <div className="desc">de livraison — offerte sur ton menu de la semaine.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Que du vrai ===== */}
        <section>
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Que du vrai</span>
              <h2>Frais, bio, pesé. Rien d&apos;autre.</h2>
            </div>
            <div className="qlist">
              {QUALITY.map(([t, d]) => (
                <div className="qitem reveal" key={t}>
                  <span className="mk">✓</span>
                  <div>
                    <span className="t">{t}</span> <span className="d">{d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== À propos ===== */}
        <section id="apropos">
          <div className="wrap about-grid">
            <div className="ab-media reveal">
              <img
                src="/home/melissa.jpg"
                alt="Mélissa, Diététicienne Diplômée d'État et Naturopathe, dans sa cuisine"
              />
            </div>
            <div className="ab-copy reveal">
              <span className="eyebrow">À propos</span>
              <h2>Derrière chaque assiette, Mélissa.</h2>
              <p>
                Diététicienne Diplômée d&apos;État &amp; Naturopathe, installée en Guadeloupe.
                Passionnée de cuisine autant que de nutrition, elle a un principe simple&nbsp;:
                manger sain doit être un plaisir, pas une contrainte.
              </p>
              <p>
                C&apos;est elle — pas une usine, pas un algorithme — qui étudie ton profil,
                compose ton menu, pèse chaque portion et cuisine chaque plat. C&apos;est ça,
                le sur-mesure.
              </p>
              <div className="chips">
                <span className="chip">Diététicienne D.E.</span>
                <span className="chip">Naturopathe</span>
                <span className="chip">Guadeloupe</span>
              </div>
              <Link className="btn btn-ghost btn-arrow" href="/questionnaire">
                Faire connaissance — bilan offert
              </Link>
            </div>
          </div>
        </section>

        {/* ===== La différence ===== */}
        <section>
          <div className="invert reveal">
            <div className="wrap invert-grid">
              <div>
                <span className="eyebrow">La différence</span>
                <h2>Pas un algorithme.<br />Une vraie diététicienne.</h2>
                <p>
                  Les autres te vendent un menu générique. Mélissa — Diététicienne Diplômée
                  d&apos;État &amp; Naturopathe — conçoit <em>le tien</em>, en fonction de ton
                  corps, tes objectifs et tes allergies. Du sur-mesure, pas du prêt-à-manger.
                </p>
                <p className="member">
                  On cuisine tout à la main, pour un cercle restreint. Les premières places
                  aux Antilles s&apos;ouvrent maintenant.
                </p>
                <Link className="btn btn-accent btn-arrow" href="/questionnaire-repas">
                  Rejoindre la liste
                </Link>
              </div>
              <div className="im">
                <img
                  src="/home/pesee.jpg"
                  alt="Portion pesée au gramme sur une balance de cuisine, à côté d'une gamelle en verre"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== Cross-sell bilan ===== */}
        <section id="bilan" className="cross">
          <div className="wrap inner">
            <div>
              <span className="eyebrow">Pour aller plus loin</span>
              <h2 style={{ marginTop: 12 }}>
                Tes repas s&apos;occupent d&apos;aujourd&apos;hui.<br />Et si on s&apos;occupait de la suite&nbsp;?
              </h2>
              <p className="lead" style={{ marginTop: 14, maxWidth: "46ch" }}>
                En plus de tes repas, Mélissa t&apos;accompagne en profondeur&nbsp;: commence par
                ton bilan nutritionnel offert (2&nbsp;min), puis une consultation ou le programme
                90&nbsp;jours si tu veux transformer tes habitudes pour de bon.
              </p>
            </div>
            <Link className="btn btn-ghost btn-arrow" href="/questionnaire">
              Mon bilan nutritionnel offert
            </Link>
          </div>
        </section>

        {/* ===== CTA final ===== */}
        <section className="final">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Places limitées</span>
              <h2>Prêt à ne plus te poser la question&nbsp;?</h2>
            </div>
            <p className="lead">Compose ton menu en 2 minutes. Livraison offerte — places limitées.</p>
            <Link className="btn btn-accent btn-arrow" href="/questionnaire-repas">
              Composer mon menu
            </Link>
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="nb-footer">
        <div className="wrap">
          <img className="flogo" src="/home/logo.svg" alt="Nutri by Meli" />
          <div style={{ marginTop: 12 }}>
            Mélissa P. · Diététicienne Diplômée d&apos;État &amp; Naturopathe · Guadeloupe
          </div>
          <div className="flinks">
            <Link href="/questionnaire">Bilan nutritionnel</Link>
            <Link href="/questionnaire-repas">Composer mon menu</Link>
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/politique-confidentialite">Confidentialité</Link>
            <Link href="/cgv">CGV</Link>
          </div>
          <div className="fsmall">© {new Date().getFullYear()} NutriByMeli — nutri-meli.com</div>
        </div>
      </footer>
    </div>
  );
}
