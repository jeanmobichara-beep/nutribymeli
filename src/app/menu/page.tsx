import Link from "next/link";
import "../home.css";
import { decodeMenuToken } from "@/lib/menu/token";
import { RECETTES } from "@/lib/menu/recettes";
import { ConfirmMenu } from "@/components/home/ConfirmMenu";

/* eslint-disable @next/next/no-img-element */

export const metadata = {
  title: "Ton menu de la semaine — NutriByMeli",
  robots: { index: false },
};

const DISH_IMG: Record<string, string> = {
  "saumon-miso": "/home/plat-saumon.jpg",
  "poulet-curcuma": "/home/plat-poulet.jpg",
  "dahl-corail": "/home/plat-dahl.jpg",
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;
  const tok = d ? decodeMenuToken(d) : null;
  const byId = new Map(RECETTES.map((r) => [r.id, r]));

  if (!tok || tok.j.every((j) => !byId.has(j.r))) {
    return (
      <div className="nb-home" style={{ minHeight: "100vh" }}>
        <header className="nb-nav">
          <div className="wrap nav-in">
            <Link href="/"><img className="nav-logo" src="/home/logo.svg" alt="Nutri by Meli" /></Link>
            <nav className="nav-links">
              <Link className="btn btn-accent btn-sm" href="/questionnaire-repas">Composer mon menu</Link>
            </nav>
          </div>
        </header>
        <section>
          <div className="wrap" style={{ textAlign: "center", maxWidth: 560 }}>
            <span className="eyebrow">Lien invalide</span>
            <h2 style={{ marginTop: 12 }}>Ce menu n&apos;est plus disponible.</h2>
            <p className="lead" style={{ margin: "16px auto 24px" }}>
              Refais ton profil en 2 minutes et reçois un nouveau menu composé pour toi.
            </p>
            <Link className="btn btn-accent btn-arrow" href="/questionnaire-repas">Composer mon menu</Link>
          </div>
        </section>
      </div>
    );
  }

  const jours = tok.j.filter((j) => byId.has(j.r)).map((j) => ({ ...j, recette: byId.get(j.r)! }));

  return (
    <div className="nb-home" style={{ minHeight: "100vh" }}>
      <header className="nb-nav">
        <div className="wrap nav-in">
          <Link href="/"><img className="nav-logo" src="/home/logo.svg" alt="Nutri by Meli" /></Link>
          <nav className="nav-links">
            <span className="txt">Ton menu personnalisé</span>
          </nav>
        </div>
      </header>

      <section style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Composé pour toi</span>
            <h2>{tok.p ? `${tok.p}, voici ton menu.` : "Voici ton menu."}</h2>
            <p className="lead">
              Pesé et dosé selon ton profil. Mélissa peut l&apos;ajuster à la marge au moment de la confirmation.
            </p>
          </div>

          <div className="menu-cards">
            {jours.map((j) => {
              const prot = Math.round(j.recette.proteines * j.f);
              const kcal = Math.round(j.recette.kcal * j.f);
              const poids = Math.round(j.recette.poids * j.f);
              const img = DISH_IMG[j.recette.id];
              return (
                <article className="mcard" key={j.jour}>
                  {img && <img className="ph" src={img} alt={j.recette.nom} />}
                  <div className="tags">
                    <span className="tag" style={{ textTransform: "capitalize" }}>{j.jour}</span>
                  </div>
                  <h3>{j.recette.nom}</h3>
                  <p className="comp">{j.recette.composition}</p>
                  <div className="macros">
                    <span className="m"><span className="v">{prot} g</span><span className="u">Protéines</span></span>
                    <span className="m"><span className="v">{kcal}</span><span className="u">Kcal</span></span>
                    <span className="m"><span className="v">{poids} g</span><span className="u">L&apos;assiette</span></span>
                  </div>
                  <span className="perso">Personnalisé pour toi</span>
                </article>
              );
            })}
          </div>

          {tok.c && (
            <p
              className="lead"
              style={{
                maxWidth: "62ch", marginTop: 28, background: "var(--nb-surface)",
                borderRadius: 14, padding: "16px 20px", fontSize: "1rem",
              }}
            >
              <strong style={{ color: "var(--nb-brand)" }}>Le mot de Mélissa&nbsp;:</strong> {tok.c}
            </p>
          )}
        </div>
      </section>

      <section className="final" style={{ paddingTop: 12 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Dernière étape</span>
            <h2>On lance ta semaine&nbsp;?</h2>
          </div>
          <p className="lead">
            Confirme ton menu — Mélissa le valide et revient vers toi pour la mise en route. Livraison offerte.
          </p>
          <ConfirmMenu token={d!} />
          <p style={{ marginTop: 18, fontSize: "0.85rem", color: "var(--nb-muted)" }}>
            Un plat ne te tente pas&nbsp;? Écris à{" "}
            <a href="mailto:contact@nutri-meli.com" style={{ color: "var(--nb-brand)", fontWeight: 600 }}>
              contact@nutri-meli.com
            </a>{" "}
            — on l&apos;échange.
          </p>
        </div>
      </section>
    </div>
  );
}
