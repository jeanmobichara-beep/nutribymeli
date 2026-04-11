import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SECTIONS } from "@/data/questionnaire";
import {
  AXIS_LABELS,
  type BilanResult,
  type AxisScore,
} from "@/data/scoring";
import { generateDossierPDF, generateBriefingPDF, generateArgumentairePDF } from "@/lib/generate-pdfs";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const MELISSA_EMAIL = process.env.MELISSA_EMAIL || "contact@nutri-meli.com";

// ============================================================================
// Annotations cliniques automatiques pour préparer la visio
// ============================================================================

interface Annotation {
  icon: string;
  text: string;
}

function getAnnotations(
  questionId: string,
  answer: string | string[]
): Annotation[] {
  const annotations: Annotation[] = [];
  const val = Array.isArray(answer) ? answer : [answer];
  const v = val[0] || "";
  const numVal = parseInt(v);

  switch (questionId) {
    // ================================================================
    // SECTION: OBJECTIFS
    // ================================================================
    case "objectif": {
      const goals = val;
      if (goals.includes("perte_poids"))
        annotations.push({ icon: "💡", text: "VISIO : Objectif perte de poids → explorer l'historique pondéral, les régimes passés, les attentes réalistes. Approche non-restrictive." });
      if (goals.includes("prise_masse"))
        annotations.push({ icon: "💡", text: "VISIO : Objectif prise de masse → évaluer apports protéiques actuels, timing des repas autour de l'entraînement." });
      if (goals.includes("energie"))
        annotations.push({ icon: "💡", text: "Objectif énergie → croiser avec les scores énergie matin/après-midi, sommeil, stress. Souvent multifactoriel." });
      if (goals.includes("digestion"))
        annotations.push({ icon: "💡", text: "Objectif améliorer la digestion → croiser avec section digestif. Piste microbiote à explorer." });
      if (goals.includes("equilibre"))
        annotations.push({ icon: "✅", text: "Objectif rééquilibrage alimentaire → bon mindset, approche progressive. Bonne base de travail." });
      if (goals.includes("immunite"))
        annotations.push({ icon: "💡", text: "Objectif renforcer l'immunité → croiser avec score immunité, vitamine D, zinc, sommeil." });
      if (goals.includes("hormones"))
        annotations.push({ icon: "💡", text: "VISIO : Objectif équilibre hormonal → explorer section hormonale en détail, bilans sanguins récents ?" });
      if (goals.includes("peau"))
        annotations.push({ icon: "💡", text: "Objectif santé de la peau → croiser avec hydratation, oméga-3, zinc, ultra-transformés, stress." });
      if (goals.includes("stress_sommeil"))
        annotations.push({ icon: "💡", text: "Objectif gestion stress/sommeil → approche naturo complémentaire (magnésium, plantes adaptogènes)." });
      if (goals.length === 0)
        annotations.push({ icon: "💡", text: "VISIO : Aucun objectif sélectionné → clarifier les attentes dès le début de la consultation." });
      if (goals.length >= 4)
        annotations.push({ icon: "⚠️", text: `${goals.length} objectifs sélectionnés → VISIO : Prioriser ensemble. Trop d'objectifs simultanés = dispersion.` });
      break;
    }

    case "objectif_autre": {
      if (v.trim().length > 0) {
        annotations.push({ icon: "💡", text: "VISIO : Objectif personnalisé mentionné → reprendre verbatim en consultation pour personnaliser l'accompagnement." });
      }
      break;
    }

    // ================================================================
    // SECTION: HABITUDES ALIMENTAIRES
    // ================================================================
    case "regime_alimentaire": {
      if (val.includes("omnivore") && val.length === 1)
        annotations.push({ icon: "✅", text: "Régime omnivore classique → large palette d'aliments disponible. Bonne flexibilité pour le programme." });
      if (val.includes("flexitarien"))
        annotations.push({ icon: "✅", text: "Flexitarien → bon compromis. Vérifier la diversité des protéines et la fréquence de la viande rouge." });
      if (val.includes("vegetarien"))
        annotations.push({ icon: "💡", text: "Végétarien → VISIO : Vérifier fer, B12, zinc. Combinaisons protéiques végétales suffisantes ?" });
      if (val.includes("vegan"))
        annotations.push({ icon: "🔴", text: "Régime végan → VISIO : Vérifier B12, fer, zinc, oméga-3, calcium, vitamine D. Complémentation obligatoire." });
      if (val.includes("cetogene"))
        annotations.push({ icon: "⚠️", text: "Régime cétogène → VISIO : Depuis combien de temps ? Suivi médical ? Impact sur thyroïde et cortisol à long terme." });
      if (val.includes("jeune_intermittent"))
        annotations.push({ icon: "💡", text: "Jeûne intermittent → VISIO : Fenêtre horaire ? Apports suffisants sur les repas ? Impact sur énergie et hormones." });
      if (val.includes("sans_gluten"))
        annotations.push({ icon: "💡", text: "VISIO : Sans gluten → maladie coeliaque diagnostiquée ou choix personnel ? Si choix, explorer les raisons." });
      if (val.includes("sans_lactose"))
        annotations.push({ icon: "💡", text: "Sans lactose → intolérance diagnostiquée ? Vérifier apports calcium via autres sources (amandes, brocoli, sardines)." });
      if (val.includes("halal") || val.includes("casher"))
        annotations.push({ icon: "✅", text: "Régime religieux → adapter les recommandations en respectant le cadre alimentaire." });
      break;
    }

    case "petit_dejeuner": {
      if (v === "jamais")
        annotations.push({ icon: "💡", text: "VISIO : Explorer les raisons (manque de temps, pas faim, jeûne intentionnel ?). Proposer des options rapides adaptées." });
      else if (v === "rapide")
        annotations.push({ icon: "⚠️", text: "Petit-déjeuner rapide/sur le pouce → souvent insuffisant ou de mauvaise qualité. VISIO : Que prend-il/elle exactement ?" });
      else if (v === "sucre")
        annotations.push({ icon: "⚠️", text: "Petit-déjeuner sucré → pic glycémique matinal, coup de barre à 10h. À recadrer vers protéiné/gras." });
      else if (v === "sale")
        annotations.push({ icon: "✅", text: "Petit-déjeuner salé → bon profil glycémique matinal. Vérifier la qualité des protéines et lipides." });
      else if (v === "proteine")
        annotations.push({ icon: "✅", text: "Petit-déjeuner protéiné → excellent choix pour la satiété et la glycémie. Continuer." });
      else if (v === "variable")
        annotations.push({ icon: "💡", text: "Petit-déjeuner variable → VISIO : Identifier les jours « bons » vs « mauvais » et standardiser vers le meilleur." });
      break;
    }

    case "nb_repas": {
      if (v === "1")
        annotations.push({ icon: "🔴", text: "1 seul repas/jour → risque de carences, hypoglycémie, stockage. Investiguer TCA potentiel en visio." });
      else if (v === "2")
        annotations.push({ icon: "⚠️", text: "2 repas/jour → acceptable si bien composés. VISIO : Vérifier la couverture des besoins sur 2 repas." });
      else if (v === "3")
        annotations.push({ icon: "✅", text: "3 repas/jour → structure classique, bon rythme alimentaire. Vérifier la répartition calorique." });
      break;
    }

    case "grignotage": {
      if (v === "jamais")
        annotations.push({ icon: "✅", text: "Aucun grignotage → bonne maîtrise. Vérifier que les repas couvrent bien les besoins (pas de restriction excessive)." });
      else if (v === "parfois")
        annotations.push({ icon: "💡", text: "Grignotage occasionnel → VISIO : Identifier les déclencheurs (faim réelle, stress, ennui ?). Proposer des collations structurées si besoin." });
      else if (v === "souvent")
        annotations.push({ icon: "⚠️", text: "VISIO : Grignotage fréquent → identifier les moments et déclencheurs (stress, ennui, faim réelle ?). Lien avec faim émotionnelle ?" });
      break;
    }

    case "vitesse_repas": {
      if (numVal <= 2)
        annotations.push({ icon: "⚠️", text: "Mange trop vite → mastication insuffisante, surcharge digestive, satiété retardée. Point clé à travailler." });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Vitesse de repas moyenne → marge d'amélioration. Proposer des techniques de pleine conscience alimentaire." });
      else
        annotations.push({ icon: "✅", text: "Bon rythme alimentaire, prend le temps de manger. Favorable à une bonne digestion et satiété." });
      break;
    }

    case "mastication": {
      if (numVal <= 2)
        annotations.push({ icon: "⚠️", text: "Mastication insuffisante → digestion mécanique incomplète, ballonnements probables. Travailler la pleine conscience." });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Mastication moyenne → peut être améliorée. Objectif : 20-30 mastications par bouchée." });
      else
        annotations.push({ icon: "✅", text: "Bonne mastication → excellent réflexe digestif. Meilleure assimilation des nutriments." });
      break;
    }

    case "envie_sucre": {
      if (v === "oui")
        annotations.push({ icon: "⚠️", text: "VISIO : Envies de sucre fréquentes → vérifier apports en protéines et graisses aux repas. Possible dysbiose, hypoglycémie réactionnelle ou carence en chrome/magnésium." });
      else if (v === "parfois")
        annotations.push({ icon: "💡", text: "Envies de sucre occasionnelles → normal si ponctuel. VISIO : À quel moment de la journée ? Lien avec stress ou cycle ?" });
      else
        annotations.push({ icon: "✅", text: "Pas d'envie de sucre → bon signe d'équilibre glycémique et de satiété aux repas." });
      break;
    }

    case "fatigue_post_repas": {
      if (v === "oui")
        annotations.push({ icon: "⚠️", text: "Fatigue post-prandiale systématique → explorer composition des repas, charge glycémique, associations alimentaires." });
      else if (v === "parfois")
        annotations.push({ icon: "💡", text: "Fatigue post-prandiale occasionnelle → VISIO : Après quel type de repas ? Glucides simples ? Portions excessives ?" });
      else
        annotations.push({ icon: "✅", text: "Pas de fatigue après les repas → bonne gestion glycémique et bonne digestion." });
      break;
    }

    case "fatigue_post_repas_moment": {
      if (val.includes("midi"))
        annotations.push({ icon: "💡", text: "Fatigue après le déjeuner → VISIO : Analyser la composition du repas de midi. Charge glycémique ? Trop de glucides ?" });
      if (val.includes("soir"))
        annotations.push({ icon: "💡", text: "Fatigue après le dîner → vérifier la composition et l'heure du repas. Impact sur qualité du sommeil ?" });
      if (val.includes("matin"))
        annotations.push({ icon: "⚠️", text: "Fatigue après le petit-déjeuner → probablement trop sucré. Revoir la composition matinale." });
      if (val.includes("tous"))
        annotations.push({ icon: "🔴", text: "Fatigue après TOUS les repas → VISIO : Suspicion d'hypoglycémie réactionnelle, problème d'assimilation ou insulinorésistance. Bilan à envisager." });
      break;
    }

    case "hydratation": {
      if (v === "<1L")
        annotations.push({ icon: "🔴", text: "Hydratation critique (<1L). Impact direct sur transit, énergie, détox et concentration. Priorité absolue." });
      else if (v === "1-1.5L")
        annotations.push({ icon: "⚠️", text: "Hydratation limite (1-1.5L) → insuffisant pour la plupart des profils. Objectif minimum 1.5L, idéal 2L." });
      else if (v === "2L")
        annotations.push({ icon: "✅", text: "Bonne hydratation (~2L/jour). Continuer ainsi. Adapter si activité physique ou chaleur." });
      else if (v === "+2L")
        annotations.push({ icon: "✅", text: "Très bonne hydratation (+2L). Vérifier que ce n'est pas compensatoire (potomanie rare mais à garder en tête)." });
      break;
    }

    case "cafe": {
      if (v === "non")
        annotations.push({ icon: "✅", text: "Pas de café → pas de surstimulation surrénalienne. Bon point si c'est un choix naturel." });
      else if (v === "parfois")
        annotations.push({ icon: "✅", text: "Consommation de café occasionnelle → pas de souci. Antioxydants bénéfiques à dose modérée." });
      else if (v === "1-2")
        annotations.push({ icon: "✅", text: "1-2 cafés/jour → consommation modérée, acceptable. Éviter après 14h pour préserver le sommeil." });
      else if (v === "3-4")
        annotations.push({ icon: "⚠️", text: "3-4 cafés/jour → consommation élevée. Risque d'épuisement surrénalien, nervosité, impact sommeil. Réduire progressivement." });
      else if (v === "5+")
        annotations.push({ icon: "🔴", text: "5+ cafés/jour → surconsommation importante. VISIO : Proposer sevrage progressif, substituts (chicorée, matcha). Épuisement surrénalien probable." });
      break;
    }

    case "heure_dernier_repas": {
      if (v === "avant_19h")
        annotations.push({ icon: "✅", text: "Dernier repas avant 19h → excellent pour le rythme circadien et la digestion nocturne." });
      else if (v === "19h_20h")
        annotations.push({ icon: "✅", text: "Dernier repas entre 19h et 20h → créneau correct. Laisser 2-3h avant le coucher." });
      else if (v === "20h_21h")
        annotations.push({ icon: "💡", text: "Dernier repas entre 20h et 21h → acceptable mais limite. Privilégier un dîner léger et digeste." });
      else if (v === "apres_21h")
        annotations.push({ icon: "⚠️", text: "Repas tardif (après 21h) → perturbation du rythme circadien, digestion compromise, impact sommeil et métabolisme." });
      break;
    }

    case "sel": {
      if (v === "jamais")
        annotations.push({ icon: "✅", text: "Pas d'ajout de sel → bon réflexe. Vérifier que les apports en iode sont suffisants par ailleurs." });
      else if (v === "parfois")
        annotations.push({ icon: "✅", text: "Ajout de sel occasionnel → raisonnable. Privilégier le sel marin non raffiné ou fleur de sel." });
      else if (v === "souvent")
        annotations.push({ icon: "⚠️", text: "Ajout fréquent de sel → VISIO : Vérifier tension artérielle. Possible habituation gustative, rééduquer le palais." });
      else if (v === "systematique")
        annotations.push({ icon: "⚠️", text: "Ajout systématique de sel → VISIO : Vérifier tension artérielle. Rétention d'eau ? Éduquer au goût. Utiliser des épices et herbes." });
      break;
    }

    case "cuisson": {
      if (val.includes("frit"))
        annotations.push({ icon: "⚠️", text: "Fritures → VISIO : Fréquence exacte ? Huile utilisée ? Proposer des alternatives (four, air fryer)." });
      if (val.includes("vapeur"))
        annotations.push({ icon: "✅", text: "Cuisson vapeur → excellent choix, préserve les micronutriments." });
      if (val.includes("cru"))
        annotations.push({ icon: "✅", text: "Cru intégré → bon apport enzymatique. Vérifier la tolérance digestive." });
      if (val.includes("four"))
        annotations.push({ icon: "✅", text: "Cuisson au four → bon mode de cuisson, peu de matières grasses ajoutées." });
      if (val.includes("poele"))
        annotations.push({ icon: "💡", text: "Cuisson à la poêle → acceptable. VISIO : Quelle matière grasse ? Huile d'olive, coco, beurre clarifié = OK." });
      if (val.includes("mix"))
        annotations.push({ icon: "✅", text: "Modes de cuisson variés → bonne diversité. Équilibre entre cru et cuit." });
      if (val.length === 1 && val.includes("frit"))
        annotations.push({ icon: "🔴", text: "Uniquement des fritures → VISIO : Diversifier impérativement les modes de cuisson. Impact inflammatoire." });
      break;
    }

    // ================================================================
    // SECTION: FRÉQUENCES ALIMENTAIRES
    // ================================================================
    case "freq_legumes": {
      if (v === "jamais")
        annotations.push({ icon: "🔴", text: "Aucun légume → déficit critique en fibres, vitamines, minéraux, antioxydants. Axe PRIORITAIRE n°1 du programme." });
      else if (v === "occasionnel")
        annotations.push({ icon: "🔴", text: "Légumes occasionnels → très insuffisant. Objectif : au moins 1 portion à chaque repas. Introduction progressive." });
      else if (v === "1-2x")
        annotations.push({ icon: "⚠️", text: "Légumes 1-2x/semaine → largement insuffisant. Objectif minimum : quotidien. Fibres, micronutriments, transit." });
      else if (v === "3-5x")
        annotations.push({ icon: "💡", text: "Légumes 3-5x/semaine → correct mais insuffisant pour l'optimal. Viser quotidien, varier les couleurs." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "✅", text: "Légumes quotidiens → excellent. VISIO : Varier les couleurs (vert, orange, rouge, violet) pour diversifier les antioxydants." });
      break;
    }

    case "freq_fruits": {
      if (v === "jamais")
        annotations.push({ icon: "⚠️", text: "Aucun fruit → manque de vitamine C, antioxydants, fibres solubles. Introduire 1-2 fruits/jour." });
      else if (v === "occasionnel")
        annotations.push({ icon: "⚠️", text: "Fruits occasionnels → insuffisant. Objectif : 2-3 portions/jour. Privilégier les fruits entiers aux jus." });
      else if (v === "1-2x")
        annotations.push({ icon: "💡", text: "Fruits 1-2x/semaine → trop faible. Augmenter à 1-2 fruits/jour. Varier les saisons." });
      else if (v === "3-5x")
        annotations.push({ icon: "✅", text: "Fruits 3-5x/semaine → bon apport. Viser quotidien. Privilégier les fruits entiers, de saison." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "✅", text: "Fruits quotidiens → parfait. Varier les types. En cas d'objectif perte de poids, limiter à 2-3 portions." });
      break;
    }

    case "freq_cereales_completes": {
      if (v === "jamais")
        annotations.push({ icon: "⚠️", text: "Aucune céréale complète → manque de fibres insolubles, magnésium, vitamines B. Remplacer les raffinées par des complètes." });
      else if (v === "occasionnel")
        annotations.push({ icon: "💡", text: "Céréales complètes occasionnelles → insuffisant. Proposer : riz complet, quinoa, sarrasin, petit épeautre." });
      else if (v === "1-2x")
        annotations.push({ icon: "💡", text: "Céréales complètes 1-2x/semaine → à augmenter. Base énergétique importante, surtout si activité physique." });
      else if (v === "3-5x")
        annotations.push({ icon: "✅", text: "Céréales complètes 3-5x/semaine → bon apport. Varier les sources (riz, quinoa, sarrasin, avoine)." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "✅", text: "Céréales complètes quotidiennes → très bien. Attention au gluten si sensibilité, varier avec pseudo-céréales." });
      break;
    }

    case "freq_legumineuses": {
      if (v === "jamais")
        annotations.push({ icon: "⚠️", text: "Aucune légumineuse → manque protéines végétales, fer, fibres, prébiotiques. VISIO : Introduire progressivement (trempage, petites quantités)." });
      else if (v === "occasionnel")
        annotations.push({ icon: "💡", text: "Légumineuses occasionnelles → insuffisant. Objectif : 2-3x/semaine minimum. Lentilles, pois chiches, haricots." });
      else if (v === "1-2x")
        annotations.push({ icon: "✅", text: "Légumineuses 1-2x/semaine → correct. Viser 3x/semaine pour un apport optimal en fibres et protéines végétales." });
      else if (v === "3-5x")
        annotations.push({ icon: "✅", text: "Légumineuses 3-5x/semaine → excellent apport. Bon pour le microbiote, les protéines végétales et le transit." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "✅", text: "Légumineuses quotidiennes → très bien, surtout si régime végétarien. Attention à la tolérance digestive." });
      break;
    }

    case "freq_oeufs": {
      if (v === "jamais")
        annotations.push({ icon: "💡", text: "Aucun oeuf → manque de choline, vitamine D, protéines complètes. VISIO : Allergie ? Choix ? Proposer alternatives." });
      else if (v === "occasionnel")
        annotations.push({ icon: "💡", text: "Oeufs occasionnels → bon aliment à intégrer plus souvent. 4-6 oeufs/semaine est tout à fait sain." });
      else if (v === "1-2x")
        annotations.push({ icon: "✅", text: "Oeufs 1-2x/semaine → correct. Peuvent être augmentés sans souci (le cholestérol alimentaire n'est plus un problème)." });
      else if (v === "3-5x")
        annotations.push({ icon: "✅", text: "Oeufs 3-5x/semaine → très bon apport. Source de protéines complètes, choline, vitamine D." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "✅", text: "Oeufs quotidiens → excellent. Privilégier bio/plein air pour le profil oméga-3." });
      break;
    }

    case "freq_oleagineux": {
      if (v === "jamais")
        annotations.push({ icon: "⚠️", text: "Aucun oléagineux → manque de bons lipides, magnésium, sélénium, vitamine E. Introduire progressivement (poignée/jour)." });
      else if (v === "occasionnel")
        annotations.push({ icon: "💡", text: "Oléagineux occasionnels → à augmenter. Poignée quotidienne recommandée (amandes, noix, noisettes)." });
      else if (v === "1-2x")
        annotations.push({ icon: "💡", text: "Oléagineux 1-2x/semaine → insuffisant. Viser quotidien : magnésium, oméga-3 (noix), sélénium (noix du Brésil)." });
      else if (v === "3-5x")
        annotations.push({ icon: "✅", text: "Oléagineux 3-5x/semaine → bon apport. Viser quotidien pour un impact optimal sur le magnésium et les lipides." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "✅", text: "Oléagineux quotidiens → excellent. Vérifier les quantités (1 poignée = ~30g). Ne pas dépasser si objectif perte de poids." });
      break;
    }

    case "oleagineux_types": {
      if (v.trim().length > 0) {
        if (val.some((x) => x.toLowerCase().includes("noix")))
          annotations.push({ icon: "✅", text: "Noix mentionnées → excellente source d'oméga-3 végétaux (ALA)." });
        if (val.some((x) => x.toLowerCase().includes("bresil") || x.toLowerCase().includes("brésil")))
          annotations.push({ icon: "✅", text: "Noix du Brésil → source majeure de sélénium. 2-3/jour suffisent pour couvrir les besoins." });
        annotations.push({ icon: "💡", text: "VISIO : Vérifier la variété. Idéal = mix amandes + noix + noisettes + noix du Brésil." });
      }
      break;
    }

    case "oleagineux_quantite": {
      if (v.trim().length > 0) {
        annotations.push({ icon: "💡", text: "VISIO : Vérifier la quantité mentionnée. Recommandation : 1 poignée/jour (~30g). Ajuster si objectif perte ou prise de poids." });
      }
      break;
    }

    case "freq_poisson_gras": {
      if (v === "jamais")
        annotations.push({ icon: "🔴", text: "Aucun poisson gras → carence oméga-3 EPA/DHA probable. Envisager complémentation ou alternatives (algues, huile de lin)." });
      else if (v === "occasionnel")
        annotations.push({ icon: "⚠️", text: "Poisson gras occasionnel → insuffisant pour couvrir les besoins en oméga-3. Objectif : 2-3x/semaine." });
      else if (v === "1-2x")
        annotations.push({ icon: "✅", text: "Poisson gras 1-2x/semaine → bon début. Viser 2-3x pour un apport optimal en EPA/DHA." });
      else if (v === "3-5x")
        annotations.push({ icon: "✅", text: "Poisson gras 3-5x/semaine → excellent apport en oméga-3. Varier les espèces, privilégier les petits poissons (sardines, maquereaux)." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "✅", text: "Poisson gras quotidien → très bon apport oméga-3. Attention aux métaux lourds : alterner avec petits poissons." });
      break;
    }

    case "poisson_gras_types": {
      if (v.trim().length > 0) {
        annotations.push({ icon: "💡", text: "VISIO : Vérifier les espèces consommées. Privilégier sardines, maquereaux, harengs (petits poissons = moins de métaux lourds) vs saumon, thon." });
      }
      break;
    }

    case "freq_volaille": {
      if (v === "jamais")
        annotations.push({ icon: "💡", text: "Pas de volaille → vérifier les sources de protéines maigres alternatives (oeufs, poisson, légumineuses)." });
      else if (v === "occasionnel")
        annotations.push({ icon: "💡", text: "Volaille occasionnelle → bonne source de protéines maigres. Peut être augmentée si objectif protéique." });
      else if (v === "1-2x")
        annotations.push({ icon: "✅", text: "Volaille 1-2x/semaine → bon apport en protéines maigres. Privilégier bio/label rouge." });
      else if (v === "3-5x")
        annotations.push({ icon: "✅", text: "Volaille 3-5x/semaine → très bon apport protéique. Varier les morceaux et les préparations." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "✅", text: "Volaille quotidienne → apport protéique solide. Varier avec poisson et oeufs pour diversifier les nutriments." });
      break;
    }

    case "freq_viande_rouge": {
      if (v === "jamais")
        annotations.push({ icon: "✅", text: "Pas de viande rouge → OK si autres sources de fer héminique (volaille, poisson). Vérifier fer et B12 si végétarien." });
      else if (v === "occasionnel")
        annotations.push({ icon: "✅", text: "Viande rouge occasionnelle → bon équilibre. Source de fer, zinc, B12 sans excès." });
      else if (v === "1-2x")
        annotations.push({ icon: "✅", text: "Viande rouge 1-2x/semaine → fréquence recommandée. Privilégier la qualité (bio, élevage extensif)." });
      else if (v === "3-5x")
        annotations.push({ icon: "⚠️", text: "Viande rouge 3-5x/semaine → fréquence élevée. Risque inflammatoire, surcharge en fer. Réduire à 1-2x max." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "🔴", text: "Viande rouge quotidienne → excès. Risque inflammatoire, cardiovasculaire, colorectal. VISIO : Réduire et diversifier." });
      break;
    }

    case "freq_charcuterie": {
      if (v === "jamais")
        annotations.push({ icon: "✅", text: "Pas de charcuterie → excellent choix. Évitement d'un aliment classé cancérogène (groupe 1 CIRC)." });
      else if (v === "occasionnel")
        annotations.push({ icon: "💡", text: "Charcuterie occasionnelle → acceptable si c'est vraiment rare. Privilégier sans nitrites." });
      else if (v === "1-2x")
        annotations.push({ icon: "⚠️", text: "Charcuterie 1-2x/semaine → à limiter. Nitrites, sel, graisses saturées. Proposer des alternatives (rôti froid, filet de poulet)." });
      else if (v === "3-5x")
        annotations.push({ icon: "🔴", text: "Charcuterie 3-5x/semaine → consommation excessive. Risque colorectal avéré. VISIO : Réduire en priorité." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "🔴", text: "Charcuterie quotidienne → ALERTE. Cancérogène groupe 1 (CIRC). VISIO : Sevrage progressif, proposer alternatives." });
      break;
    }

    case "freq_laitiers": {
      if (v === "jamais")
        annotations.push({ icon: "💡", text: "Aucun produit laitier → VISIO : Vérifier les apports en calcium (amandes, brocoli, sardines, eaux minérales). Choix ou intolérance ?" });
      else if (v === "occasionnel")
        annotations.push({ icon: "💡", text: "Laitiers occasionnels → vérifier autres sources de calcium. Fromage de chèvre/brebis souvent mieux toléré." });
      else if (v === "1-2x")
        annotations.push({ icon: "✅", text: "Laitiers 1-2x/semaine → consommation modérée. Bon équilibre. Privilégier fermentés (yaourt, kéfir)." });
      else if (v === "3-5x")
        annotations.push({ icon: "✅", text: "Laitiers 3-5x/semaine → bon apport calcium. Privilégier fromages affinés et yaourts fermentés." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "💡", text: "Laitiers quotidiens → fréquent en France. VISIO : Tolérance digestive ? Si inflammation, tester réduction." });
      break;
    }

    case "freq_gluten": {
      if (v === "jamais")
        annotations.push({ icon: "💡", text: "Pas de gluten → VISIO : Coeliaque diagnostiqué(e) ? Sensibilité ? Si choix personnel, explorer les raisons." });
      else if (v === "occasionnel")
        annotations.push({ icon: "✅", text: "Gluten occasionnel → consommation modérée, peu de risque. Bonne tolérance probable." });
      else if (v === "1-2x")
        annotations.push({ icon: "✅", text: "Gluten 1-2x/semaine → fréquence raisonnable. Pas de souci sauf sensibilité avérée." });
      else if (v === "3-5x")
        annotations.push({ icon: "💡", text: "Gluten 3-5x/semaine → fréquence moyenne. Si troubles digestifs, tester une réduction sur 3 semaines." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "💡", text: "Gluten quotidien → fréquent (pain, pâtes). Si troubles digestifs ou inflammatoires, VISIO : envisager test d'éviction." });
      break;
    }

    case "freq_sucres_industriels": {
      if (v === "jamais")
        annotations.push({ icon: "✅", text: "Aucun sucre industriel → excellent. Pas de perturbation glycémique ni de nourrissage du microbiote pathogène." });
      else if (v === "occasionnel")
        annotations.push({ icon: "✅", text: "Sucres industriels occasionnels → acceptable. Pas de restriction absolue, l'équilibre prime." });
      else if (v === "1-2x")
        annotations.push({ icon: "💡", text: "Sucres industriels 1-2x/semaine → à surveiller. VISIO : Quels produits exactement ? Proposer des alternatives maison." });
      else if (v === "3-5x")
        annotations.push({ icon: "⚠️", text: "Sucres industriels 3-5x/semaine → fréquence élevée. Impact glycémique, inflammatoire, microbiote. Réduire progressivement." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "🔴", text: "Sucres industriels quotidiens → VISIO : Identifier les produits concernés. Addiction au sucre ? Dysbiose probable. Plan de sevrage progressif." });
      break;
    }

    case "freq_boissons_sucrees": {
      if (v === "jamais")
        annotations.push({ icon: "✅", text: "Aucune boisson sucrée → excellent choix. Hydratation par eau, thé, tisanes." });
      else if (v === "occasionnel")
        annotations.push({ icon: "✅", text: "Boissons sucrées occasionnelles → acceptable si vraiment ponctuel. Proposer eaux aromatisées maison." });
      else if (v === "1-2x")
        annotations.push({ icon: "⚠️", text: "Boissons sucrées 1-2x/semaine → calories vides, pic glycémique. Remplacer par eaux infusées, kombucha." });
      else if (v === "3-5x")
        annotations.push({ icon: "🔴", text: "Boissons sucrées 3-5x/semaine → apport sucré liquide excessif. Impact insulinique majeur. Réduire en priorité." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "🔴", text: "Boissons sucrées quotidiennes → VISIO : Lequel (soda, jus, thé glacé) ? Sevrage progressif indispensable. Impact glycémique + pondéral." });
      break;
    }

    case "freq_ultra_transformes": {
      if (v === "jamais")
        annotations.push({ icon: "✅", text: "Aucun ultra-transformé → profil alimentaire très propre. Féliciter et maintenir." });
      else if (v === "occasionnel")
        annotations.push({ icon: "✅", text: "Ultra-transformés occasionnels → acceptable dans un cadre globalement sain. Pas de culpabilisation." });
      else if (v === "1-2x")
        annotations.push({ icon: "💡", text: "Ultra-transformés 1-2x/semaine → modéré. VISIO : Identifier les produits pour proposer des alternatives simples." });
      else if (v === "3-5x")
        annotations.push({ icon: "⚠️", text: "Ultra-transformés 3-5x/semaine → fréquence préoccupante. Additifs, perturbateurs endocriniens, sel caché. VISIO : Identifier les produits." });
      else if (v === "tous_les_jours")
        annotations.push({ icon: "🔴", text: "Ultra-transformés quotidiens → VISIO : Identifier TOUS les produits concernés. Proposer des alternatives simples. Impact santé majeur." });
      break;
    }

    case "alcool": {
      if (v === "jamais")
        annotations.push({ icon: "✅", text: "Pas d'alcool → excellent pour le foie, les hormones et le sommeil." });
      else if (v === "occasionnel")
        annotations.push({ icon: "✅", text: "Alcool occasionnel → consommation sociale modérée. Pas d'action particulière." });
      else if (v === "1-2_semaine")
        annotations.push({ icon: "💡", text: "Alcool 1-2x/semaine → modéré mais à surveiller. VISIO : Quel type d'alcool ? Quantités exactes ?" });
      else if (v === "3-5_semaine")
        annotations.push({ icon: "🔴", text: "Alcool 3-5x/semaine → consommation significative. VISIO : Aborder avec tact. Impact hépatique, hormonal, sommeil, poids." });
      else if (v === "quotidien")
        annotations.push({ icon: "🔴", text: "Alcool quotidien → VISIO : Évaluer la dépendance avec tact. Priorité absolue. Impact foie, hormones, sommeil, prise de poids." });
      break;
    }

    case "tabac": {
      if (v === "jamais" || v === "non")
        annotations.push({ icon: "✅", text: "Non-fumeur → excellent. Pas de stress oxydatif tabagique." });
      else if (v === "occasionnel")
        annotations.push({ icon: "💡", text: "Tabac occasionnel → tout de même un stress oxydatif. Augmenter vitamine C et antioxydants." });
      else if (v === "quotidien")
        annotations.push({ icon: "⚠️", text: "Fumeur quotidien → stress oxydatif, inflammation chronique. Besoins accrus en vitamine C (+30%), antioxydants, zinc." });
      else if (v === "ancien_fumeur")
        annotations.push({ icon: "✅", text: "Ancien fumeur → bon choix d'arrêt. Soutenir la réparation avec antioxydants (vitamine C, E, sélénium)." });
      break;
    }

    // ================================================================
    // SECTION: COORDONNÉES / PROFIL
    // ================================================================
    case "age": {
      const age = parseInt(v);
      if (!isNaN(age)) {
        if (age < 18)
          annotations.push({ icon: "⚠️", text: "Patient mineur → adapter les recommandations à la croissance. Pas de restriction calorique." });
        else if (age >= 18 && age <= 30)
          annotations.push({ icon: "✅", text: "Tranche 18-30 ans → métabolisme encore favorable. Bon moment pour ancrer de bonnes habitudes." });
        else if (age >= 31 && age <= 45)
          annotations.push({ icon: "💡", text: "Tranche 31-45 ans → début de ralentissement métabolique. Prévention ++ en micronutrition." });
        else if (age >= 46 && age <= 55)
          annotations.push({ icon: "💡", text: "Tranche 46-55 ans → VISIO : Pré-ménopause/ménopause ? Bilan hormonal ? Densité osseuse ? Calcium, vitamine D." });
        else if (age > 55)
          annotations.push({ icon: "💡", text: "55+ ans → VISIO : Sarcopénie, densité osseuse, B12, vitamine D, protéines suffisantes. Prévention cognitive." });
      }
      break;
    }

    case "sexe": {
      if (v === "femme")
        annotations.push({ icon: "💡", text: "Femme → croiser avec section hormonale (cycle, SPM, contraception, ménopause). Besoins en fer accrus." });
      else if (v === "homme")
        annotations.push({ icon: "💡", text: "Homme → attention au fer (risque de surcharge si viande rouge ++). Prostate après 50 ans (zinc, lycopène)." });
      break;
    }

    case "taille":
    case "poids": {
      annotations.push({ icon: "💡", text: "VISIO : Vérifier le rapport taille/poids et calculer l'IMC. Tour de taille à demander pour le risque métabolique." });
      break;
    }

    case "evolution_poids": {
      if (v === "stable")
        annotations.push({ icon: "✅", text: "Poids stable → bon signe d'équilibre énergétique. Pas de signal d'alerte métabolique." });
      else if (v === "prise_legere")
        annotations.push({ icon: "💡", text: "Légère prise de poids → VISIO : Depuis quand ? Facteur déclencheur (stress, sédentarité, alimentation) ?" });
      else if (v === "prise_importante")
        annotations.push({ icon: "🔴", text: "Prise de poids importante sur 6 mois → VISIO : Événement déclencheur ? Changement de mode de vie ? Bilan hormonal ?" });
      else if (v === "perte_legere")
        annotations.push({ icon: "💡", text: "Légère perte de poids → VISIO : Volontaire ? Si oui, méthode utilisée ? Si non, investiguer." });
      else if (v === "perte_importante")
        annotations.push({ icon: "🔴", text: "Perte de poids importante → VISIO : Volontaire ou involontaire ? Si involontaire, orienter vers bilan médical urgent." });
      else if (v === "yoyo")
        annotations.push({ icon: "⚠️", text: "Effet yoyo → VISIO : Historique des régimes, relation à l'alimentation. Stabilisation métabolique avant toute restriction." });
      break;
    }

    case "profession": {
      if (v.trim().length > 0) {
        annotations.push({ icon: "💡", text: "VISIO : Adapter les recommandations au rythme professionnel (horaires, stress, repas sur le pouce, travail de nuit ?)." });
      }
      break;
    }

    case "prenom":
    case "nom":
    case "email": {
      // Coordonnées — pas d'annotation clinique nécessaire
      break;
    }

    // ================================================================
    // SECTION: MÉDICAL
    // ================================================================
    case "traitement_medical": {
      if (v === "oui")
        annotations.push({ icon: "🔴", text: "VISIO : Traitement médical en cours → vérifier les interactions avec l'alimentation et la micronutrition. Voir détail ci-dessous." });
      else if (v === "non")
        annotations.push({ icon: "✅", text: "Aucun traitement médical en cours → pas de contrainte d'interaction médicamenteuse." });
      break;
    }

    case "traitement_detail": {
      if (v.trim().length > 0) {
        annotations.push({ icon: "🔴", text: "VISIO : Analyser chaque traitement pour les interactions nutritionnelles (ex: IPP → magnésium/B12, metformine → B12, statines → CoQ10, lévothyrox → calcium/fer à distance)." });
      }
      break;
    }

    case "antecedents": {
      if (v.trim().length > 0 && v.toLowerCase() !== "aucun" && v.toLowerCase() !== "non" && v.toLowerCase() !== "ras") {
        annotations.push({ icon: "💡", text: "VISIO : Antécédents médicaux mentionnés → adapter le programme en conséquence. Vérifier les contre-indications." });
      } else {
        annotations.push({ icon: "✅", text: "Pas d'antécédents médicaux notables signalés." });
      }
      break;
    }

    case "antecedents_familiaux": {
      if (v.trim().length > 0 && v.toLowerCase() !== "aucun" && v.toLowerCase() !== "non" && v.toLowerCase() !== "ras") {
        annotations.push({ icon: "💡", text: "VISIO : Antécédents familiaux → adapter la prévention nutritionnelle (diabète → glycémie, cancer → antioxydants, cardiovasculaire → oméga-3, fibres)." });
      } else {
        annotations.push({ icon: "✅", text: "Pas d'antécédents familiaux notables. Prévention standard." });
      }
      break;
    }

    case "allergies": {
      if (v.trim().length > 0 && v.toLowerCase() !== "aucune" && v.toLowerCase() !== "non" && v.toLowerCase() !== "ras") {
        annotations.push({ icon: "🔴", text: "VISIO : Allergies signalées → IMPÉRATIF : adapter TOUTES les recommandations alimentaires. Vérifier les allergies croisées." });
      } else {
        annotations.push({ icon: "✅", text: "Pas d'allergie alimentaire signalée → pas de restriction liée." });
      }
      break;
    }

    case "complements": {
      if (v === "oui")
        annotations.push({ icon: "💡", text: "VISIO : Compléments en cours → vérifier pertinence, dosages, qualité des produits, interactions éventuelles." });
      else if (v === "non")
        annotations.push({ icon: "💡", text: "Aucun complément alimentaire → à évaluer selon le bilan. Des carences sont possibles." });
      break;
    }

    case "complements_detail": {
      if (v.trim().length > 0) {
        annotations.push({ icon: "💡", text: "VISIO : Vérifier les dosages, la forme des compléments (biodisponibilité), les synergies et antagonismes (ex: fer + vitamine C = OK, fer + calcium = NON)." });
      }
      break;
    }

    // ================================================================
    // SECTION: DIGESTIF
    // ================================================================
    case "troubles_digestifs": {
      if (val.length === 0 || (val.length === 1 && val[0] === "aucun"))
        annotations.push({ icon: "✅", text: "Aucun trouble digestif signalé → bonne santé intestinale apparente." });
      else if (val.length === 1)
        annotations.push({ icon: "💡", text: `1 trouble digestif (${val[0]}) → à surveiller. VISIO : Fréquence, facteurs déclencheurs.` });
      else if (val.length === 2)
        annotations.push({ icon: "⚠️", text: `2 troubles digestifs (${val.join(", ")}) → VISIO : Explorer les causes (alimentation, stress, dysbiose).` });
      else
        annotations.push({ icon: "🔴", text: `${val.length} troubles digestifs simultanés (${val.join(", ")}). VISIO : Investiguer en détail. Envisager exploration médicale si non faite.` });

      // Specific troubles
      if (val.includes("ballonnements"))
        annotations.push({ icon: "💡", text: "Ballonnements → piste SIBO, dysbiose, intolérance FODMAP, mastication insuffisante." });
      if (val.includes("reflux") || val.includes("rgo"))
        annotations.push({ icon: "💡", text: "Reflux/RGO → VISIO : IPP en cours ? Repas du soir, position, stress. Éviter café, tomate, agrumes à jeun." });
      if (val.includes("douleurs_abdominales"))
        annotations.push({ icon: "⚠️", text: "Douleurs abdominales → VISIO : Localisation, moment, lien avec alimentation. Bilan médical si non fait." });
      if (val.includes("nausees"))
        annotations.push({ icon: "⚠️", text: "Nausées → VISIO : À quel moment ? Grossesse à éliminer. Lien avec foie, vésicule, stress ?" });
      break;
    }

    case "troubles_digestifs_frequence": {
      if (v === "rarement")
        annotations.push({ icon: "✅", text: "Troubles digestifs rares → probablement situationnels. Pas d'inquiétude majeure." });
      else if (v === "parfois")
        annotations.push({ icon: "💡", text: "Troubles digestifs ponctuels → VISIO : Identifier les aliments ou situations déclencheuses." });
      else if (v === "souvent")
        annotations.push({ icon: "⚠️", text: "Troubles digestifs fréquents → piste fonctionnelle. VISIO : Journal alimentaire sur 1 semaine recommandé." });
      else if (v === "permanent")
        annotations.push({ icon: "🔴", text: "Troubles digestifs permanents → VISIO : Bilan médical fait ? Envisager test SIBO, coloscopie, bilan coeliaque si non fait." });
      break;
    }

    case "troubles_digestifs_moment": {
      if (v.trim().length > 0) {
        annotations.push({ icon: "💡", text: "VISIO : Le moment des troubles digestifs oriente le diagnostic : après repas = enzymatique/composition, matin = bile/jeûne, soir = fermentation." });
      }
      break;
    }

    case "transit": {
      if (v === "normal" || v === "regulier")
        annotations.push({ icon: "✅", text: "Transit normal → bonne santé intestinale. Fibres et hydratation adéquates." });
      else if (v === "constipe")
        annotations.push({ icon: "⚠️", text: "Constipation → VISIO : Fréquence exacte, consistance (Bristol). Vérifier fibres, hydratation, activité physique, magnésium." });
      else if (v === "diarrheique")
        annotations.push({ icon: "⚠️", text: "Transit diarrhéique → VISIO : Fréquence, consistance, aliments déclencheurs. Risque malabsorption. Bilan si chronique." });
      else if (v === "alterne" || v === "variable")
        annotations.push({ icon: "⚠️", text: "Transit alternant → typique du SII (syndrome intestin irritable). VISIO : Explorer FODMAP, stress, microbiote." });
      break;
    }

    // ================================================================
    // SECTION: ÉNERGIE & SYSTÈME NERVEUX
    // ================================================================
    case "energie_matin": {
      if (numVal <= 2)
        annotations.push({ icon: "⚠️", text: "Énergie matinale basse → VISIO : Qualité du sommeil ? Heure de coucher ? Cortisol matinal insuffisant ? Thyroïde ?" });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Énergie matinale moyenne → marge d'amélioration. Explorer sommeil, petit-déjeuner, hydratation au réveil." });
      else
        annotations.push({ icon: "✅", text: "Bonne énergie matinale → bon rythme circadien et récupération nocturne correcte." });
      break;
    }

    case "energie_aprem": {
      if (numVal <= 2)
        annotations.push({ icon: "⚠️", text: "Coup de barre après-midi → VISIO : Composition du déjeuner ? Charge glycémique ? Sieste compensatoire ? Microsieste de 20min peut aider." });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Énergie après-midi moyenne → croiser avec composition du déjeuner et fatigue post-prandiale." });
      else
        annotations.push({ icon: "✅", text: "Bonne énergie l'après-midi → repas de midi bien équilibré, bonne gestion glycémique." });
      break;
    }

    case "stress": {
      if (numVal <= 2)
        annotations.push({ icon: "✅", text: "Niveau de stress bas → bon terrain. Pas d'impact négatif sur cortisol et alimentation." });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Stress modéré → surveiller. VISIO : Techniques de gestion ? Impact sur alimentation (grignotage, repas sautés) ?" });
      else
        annotations.push({ icon: "⚠️", text: `VISIO : Stress élevé (${numVal}/5) → explorer les sources (travail, famille, santé). Impact sur cortisol, sommeil, alimentation. Magnésium, adaptogènes.` });
      break;
    }

    case "irritabilite": {
      if (numVal <= 2)
        annotations.push({ icon: "✅", text: "Irritabilité basse → bon équilibre nerveux." });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Irritabilité modérée → possible lien avec glycémie instable, manque de magnésium, ou fatigue." });
      else
        annotations.push({ icon: "⚠️", text: "Irritabilité élevée → VISIO : Lien avec glycémie (hypoglycémie réactionnelle ?), magnésium, sommeil, stress chronique." });
      break;
    }

    case "anxiete": {
      if (numVal <= 2)
        annotations.push({ icon: "✅", text: "Anxiété basse → bon état psycho-émotionnel." });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Anxiété modérée → VISIO : Explorer magnésium, oméga-3, vitamine B6, phytothérapie (passiflore, valériane)." });
      else
        annotations.push({ icon: "⚠️", text: "Anxiété élevée → VISIO : Impact sur alimentation et sommeil. Magnésium bisglycinate, L-théanine, ashwagandha. Suivi psy si besoin." });
      break;
    }

    case "faim_emotionnelle": {
      if (numVal <= 2)
        annotations.push({ icon: "✅", text: "Faim émotionnelle faible → bonne relation à l'alimentation. Mange par faim physiologique." });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Faim émotionnelle modérée → VISIO : Identifier les émotions déclencheuses. Journal alimentaire émotionnel ?" });
      else
        annotations.push({ icon: "⚠️", text: `Faim émotionnelle importante (${numVal}/5) → VISIO : Travailler les stratégies alternatives (respiration, marche, journal). Lien avec stress et grignotage.` });
      break;
    }

    case "sommeil": {
      if (numVal <= 2)
        annotations.push({ icon: "⚠️", text: "Qualité de sommeil mauvaise → VISIO : Routine du coucher, exposition écrans, dernier repas, magnésium, phytothérapie (passiflore, valériane, mélatonine)." });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Qualité de sommeil moyenne → marge d'amélioration. Explorer hygiène du sommeil, alimentation du soir, magnésium." });
      else
        annotations.push({ icon: "✅", text: "Bonne qualité de sommeil → favorable à la récupération, à l'équilibre hormonal et à la gestion du poids." });
      break;
    }

    case "sommeil_duree": {
      if (v === "<5h")
        annotations.push({ icon: "🔴", text: "Moins de 5h de sommeil → URGENT. Impact majeur : cortisol, résistance à l'insuline, inflammation, prise de poids. Priorité n°1." });
      else if (v === "5-6h")
        annotations.push({ icon: "⚠️", text: "Sommeil insuffisant (5-6h) → VISIO : Identifier les causes (écrans, stress, travail ?). Objectif 7h minimum." });
      else if (v === "6-7h")
        annotations.push({ icon: "💡", text: "Sommeil 6-7h → un peu juste pour la plupart. Viser 7-8h pour une récupération optimale." });
      else if (v === "7-8h")
        annotations.push({ icon: "✅", text: "Durée de sommeil optimale (7-8h) → récupération et régulation hormonale favorables." });
      else if (v === "+8h")
        annotations.push({ icon: "💡", text: "Plus de 8h de sommeil → VISIO : Se sent reposé(e) malgré tout ? Hypersomnie possible → thyroïde, dépression, apnée du sommeil ?" });
      break;
    }

    case "heure_coucher": {
      if (v === "avant_22h")
        annotations.push({ icon: "✅", text: "Coucher avant 22h → excellent rythme circadien. Pic de mélatonine et GH bien captés." });
      else if (v === "22h_23h")
        annotations.push({ icon: "✅", text: "Coucher entre 22h et 23h → bon créneau. Conforme au rythme circadien naturel." });
      else if (v === "23h_00h")
        annotations.push({ icon: "💡", text: "Coucher entre 23h et minuit → acceptable mais marge d'amélioration. Avancer de 30 min si possible." });
      else if (v === "apres_00h")
        annotations.push({ icon: "⚠️", text: "Coucher après minuit → décalage circadien. Impact cortisol, mélatonine, récupération. Recaler progressivement." });
      break;
    }

    case "heure_lever": {
      if (v.trim().length > 0) {
        annotations.push({ icon: "💡", text: "VISIO : Croiser heure de lever avec heure de coucher pour calculer la durée effective. Régularité du rythme veille/sommeil ?" });
      }
      break;
    }

    case "reveils_nocturnes": {
      if (numVal <= 2)
        annotations.push({ icon: "✅", text: "Peu ou pas de réveils nocturnes → sommeil continu, bonne qualité de récupération." });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Réveils nocturnes modérés → VISIO : À quelle heure ? Entre 1h-3h = foie/alcool. Entre 3h-5h = poumons/stress." });
      else
        annotations.push({ icon: "⚠️", text: "Réveils nocturnes fréquents → VISIO : Heure des réveils ? Durée ? Apnée du sommeil ? Stress ? Glycémie nocturne ? Magnésium au coucher." });
      break;
    }

    case "maux_tete": {
      if (numVal <= 2)
        annotations.push({ icon: "✅", text: "Peu ou pas de maux de tête → pas de signal d'alerte." });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Maux de tête occasionnels → VISIO : Hydratation ? Tension cervicale ? Migraines alimentaires (histamine, tyramine) ?" });
      else
        annotations.push({ icon: "⚠️", text: "Maux de tête fréquents → VISIO : Bilan ophtalmologique fait ? Hydratation ? Pistes : magnésium, CoQ10, éviction histamine. Bilan médical si chronique." });
      break;
    }

    case "immunite": {
      if (numVal <= 2)
        annotations.push({ icon: "⚠️", text: "Immunité fragile → infections fréquentes. VISIO : Zinc, vitamine D, vitamine C, probiotiques. Sommeil et stress à optimiser." });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Immunité moyenne → marge d'amélioration. Optimiser zinc, vitamine D, sommeil, microbiote." });
      else
        annotations.push({ icon: "✅", text: "Bonne immunité → terrain solide. Maintenir avec alimentation variée et sommeil de qualité." });
      break;
    }

    // ================================================================
    // SECTION: HORMONAL
    // ================================================================
    case "thyroide": {
      if (v === "oui")
        annotations.push({ icon: "💡", text: "VISIO : Problème thyroïdien signalé → demander les derniers bilans (TSH, T3, T4). Traitement en cours ? Dosage ?" });
      else if (v === "non")
        annotations.push({ icon: "✅", text: "Pas de problème thyroïdien connu → si fatigue + frilosité + prise de poids, envisager un bilan quand même." });
      break;
    }

    case "thyroide_type": {
      if (val.includes("hashimoto"))
        annotations.push({ icon: "🔴", text: "Hashimoto → VISIO : Bilan complet (anti-TPO, anti-TG). Alimentation anti-inflammatoire, éviter gluten ? Sélénium, zinc." });
      if (val.includes("hypothyroidie"))
        annotations.push({ icon: "💡", text: "Hypothyroïdie → VISIO : Traitement actuel ? Dosage TSH récent ? Aliments goitrogènes à modérer si crus." });
      if (val.includes("hyperthyroidie") || val.includes("basedow"))
        annotations.push({ icon: "💡", text: "Hyperthyroïdie/Basedow → VISIO : Besoins caloriques augmentés, perte de poids ? Risque cardiaque, anxiété." });
      break;
    }

    case "cholesterol_diabete_tension": {
      if (v.trim().length > 0 && v.toLowerCase() !== "aucun" && v.toLowerCase() !== "non" && v.toLowerCase() !== "ras") {
        if (v.toLowerCase().includes("cholesterol") || v.toLowerCase().includes("cholestérol"))
          annotations.push({ icon: "⚠️", text: "Cholestérol → VISIO : Bilan lipidique récent ? Statines ? Oméga-3, fibres solubles, phytostérols. Réduire sucres avant graisses." });
        if (v.toLowerCase().includes("diabete") || v.toLowerCase().includes("diabète"))
          annotations.push({ icon: "🔴", text: "Diabète → VISIO : Type 1 ou 2 ? HbA1c récente ? Traitement ? Adapter TOUT le programme glycémique." });
        if (v.toLowerCase().includes("tension") || v.toLowerCase().includes("hypertension"))
          annotations.push({ icon: "⚠️", text: "Hypertension → VISIO : Traitement ? Réduire sel, augmenter potassium (banane, avocat), magnésium, oméga-3." });
        annotations.push({ icon: "💡", text: "VISIO : Pathologie métabolique signalée → demander les derniers bilans sanguins et traitements actuels." });
      } else {
        annotations.push({ icon: "✅", text: "Pas de cholestérol, diabète ou HTA signalé → bon terrain métabolique apparent." });
      }
      break;
    }

    case "frilosite": {
      if (v === "oui")
        annotations.push({ icon: "💡", text: "Frilosité → VISIO : Piste thyroïdienne (hypothyroïdie ?), anémie ferriprive, circulation. Bilan thyroïde + ferritine à vérifier." });
      else if (v === "non")
        annotations.push({ icon: "✅", text: "Pas de frilosité → bonne thermorégulation, thyroïde probablement fonctionnelle." });
      break;
    }

    case "libido": {
      if (numVal <= 2)
        annotations.push({ icon: "💡", text: "Libido basse → VISIO : Lien hormonal (testostérone, oestrogènes), stress, fatigue, thyroïde. Zinc, maca, ashwagandha." });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Libido moyenne → peut être améliorée. Explorer fatigue, stress, qualité du sommeil, zinc." });
      else
        annotations.push({ icon: "✅", text: "Bonne libido → bon marqueur d'équilibre hormonal et d'énergie vitale." });
      break;
    }

    case "cycle_regulier": {
      if (v === "oui")
        annotations.push({ icon: "✅", text: "Cycles réguliers → bon signe d'équilibre hormonal. Axe oestrogènes/progestérone a priori correct." });
      else if (v === "non")
        annotations.push({ icon: "💡", text: "VISIO : Cycles irréguliers → durée des cycles ? Bilan hormonal récent ? Poids, stress, SOPK à investiguer." });
      else if (v === "na" || v === "non_concerne")
        annotations.push({ icon: "✅", text: "Non concerné(e) par les cycles → question non applicable." });
      break;
    }

    case "spm": {
      if (v === "oui")
        annotations.push({ icon: "💡", text: "SPM confirmé → VISIO : Symptômes précis ? Explorer magnésium bisglycinate, vitamine B6, oméga-3, gattilier. Timing dans le cycle." });
      else if (v === "non")
        annotations.push({ icon: "✅", text: "Pas de SPM → bon signe d'équilibre progestérone/oestrogènes en phase lutéale." });
      break;
    }

    case "contraception_menopause": {
      if (v.trim().length > 0) {
        if (v.toLowerCase().includes("pilule"))
          annotations.push({ icon: "💡", text: "Pilule contraceptive → VISIO : Depuis combien de temps ? Déplétion en B6, B9, B12, magnésium, zinc. Complémentation à envisager." });
        if (v.toLowerCase().includes("sterilet") || v.toLowerCase().includes("stérilet"))
          annotations.push({ icon: "💡", text: "Stérilet → VISIO : Hormonal ou cuivre ? Cuivre = risque de règles abondantes (fer). Hormonal = impact moindre." });
        if (v.toLowerCase().includes("menopause") || v.toLowerCase().includes("ménopause"))
          annotations.push({ icon: "💡", text: "VISIO : Ménopause → vitamine D, calcium, isoflavones ? Bouffées de chaleur ? Prise de poids abdominale ? Ostéoporose ?" });
        if (v.toLowerCase().includes("perimenopause") || v.toLowerCase().includes("préménopause") || v.toLowerCase().includes("periménopause"))
          annotations.push({ icon: "💡", text: "VISIO : Périménopause → phase de transition hormonale. Adapter nutrition (phyto-oestrogènes, magnésium, oméga-3)." });
        if (v.toLowerCase().includes("aucune") || v.toLowerCase().includes("rien"))
          annotations.push({ icon: "✅", text: "Pas de contraception hormonale → pas de déplétion médicamenteuse en micronutriments." });
      }
      break;
    }

    case "grossesse_allaitement": {
      if (v === "non" || v === "na" || v === "non_concerne")
        annotations.push({ icon: "✅", text: "Ni grossesse ni allaitement → pas de contrainte spécifique liée à la maternité." });
      else if (v === "enceinte" || val.includes("enceinte"))
        annotations.push({ icon: "🔴", text: "GROSSESSE EN COURS → Adapter TOUTES les recommandations. Pas de détox, pas de jeûne. Vérifier folates, fer, iode, DHA." });
      if (v === "allaitement" || val.includes("allaitement"))
        annotations.push({ icon: "⚠️", text: "Allaitement en cours → besoins caloriques (+500kcal) et hydriques accrus. Pas de restriction. Qualité nutritionnelle ++." });
      if (v === "enceinte_allaitement" || val.includes("enceinte_allaitement")) {
        // Already covered by individual checks above
      }
      break;
    }

    // ================================================================
    // SECTION: TERRAIN
    // ================================================================
    case "douleurs_articulaires": {
      if (v === "oui")
        annotations.push({ icon: "💡", text: "VISIO : Douleurs articulaires → localisation, ancienneté. Piste inflammatoire : oméga-3 haute dose, curcumine, réduire sucres et gluten." });
      else if (v === "non")
        annotations.push({ icon: "✅", text: "Pas de douleurs articulaires → bon terrain articulaire et probablement faible inflammation." });
      break;
    }

    case "jambes_lourdes": {
      if (v === "oui")
        annotations.push({ icon: "💡", text: "VISIO : Jambes lourdes → insuffisance veineuse ? Rétention d'eau ? Vigne rouge, fragon, marronnier d'Inde. Réduire sel, bouger ++." });
      else if (v === "non")
        annotations.push({ icon: "✅", text: "Pas de jambes lourdes → bonne circulation veineuse." });
      break;
    }

    case "problemes_peau": {
      if (v === "oui")
        annotations.push({ icon: "💡", text: "VISIO : Problèmes de peau → type (acné, eczéma, psoriasis, sécheresse ?), localisation, lien avec alimentation, stress, cycle hormonal." });
      else if (v === "non")
        annotations.push({ icon: "✅", text: "Pas de problème de peau → bonne santé cutanée. Hydratation et micronutriments probablement corrects." });
      break;
    }

    case "chute_cheveux_ongles": {
      if (v === "oui")
        annotations.push({ icon: "⚠️", text: "VISIO : Chute de cheveux/ongles fragiles → vérifier fer (ferritine), zinc, biotine, vitamine D, thyroïde. Bilan sanguin recommandé." });
      else if (v === "non")
        annotations.push({ icon: "✅", text: "Pas de problème capillaire/ongles → bon marqueur de statut nutritionnel (fer, zinc, biotine)." });
      break;
    }

    case "activite_physique_type": {
      if (v.trim().length > 0) {
        annotations.push({ icon: "💡", text: "VISIO : Adapter les recommandations nutritionnelles au type d'activité (endurance = glucides, force = protéines, yoga = équilibre global)." });
      } else {
        annotations.push({ icon: "💡", text: "Aucune activité physique précisée → VISIO : Explorer les possibilités et les freins." });
      }
      break;
    }

    case "activite_physique_freq": {
      if (v === "jamais")
        annotations.push({ icon: "⚠️", text: "Sédentarité totale → VISIO : Explorer les freins, proposer une activité douce et progressive (marche 30min/jour)." });
      else if (v === "1-2x")
        annotations.push({ icon: "💡", text: "Activité physique 1-2x/semaine → début encourageant. Objectif : 3-4 séances/semaine pour un impact métabolique réel." });
      else if (v === "3-4x")
        annotations.push({ icon: "✅", text: "Activité physique 3-4x/semaine → excellent rythme. Adapter la nutrition pré/post-entraînement." });
      else if (v === "5+" || v === "quotidien")
        annotations.push({ icon: "✅", text: "Activité physique quasi-quotidienne → sportif(ve) engagé(e). VISIO : Vérifier la récupération et les apports protéiques." });
      break;
    }

    case "temps_assis": {
      if (v === "<4h")
        annotations.push({ icon: "✅", text: "Moins de 4h assis/jour → bonne mobilité au quotidien. Profil non sédentaire." });
      else if (v === "4-6h")
        annotations.push({ icon: "💡", text: "4-6h assis/jour → modéré. Intégrer des pauses actives toutes les 45 minutes." });
      else if (v === "6-8h")
        annotations.push({ icon: "⚠️", text: "6-8h assis/jour → sédentarité significative. VISIO : Micro-pauses actives, bureau debout ? Compenser par l'activité physique." });
      else if (v === "+8h")
        annotations.push({ icon: "🔴", text: "+8h assis/jour → impact inflammatoire et métabolique majeur. Proposer des micro-pauses actives toutes les 30min." });
      break;
    }

    case "exposition_soleil": {
      if (numVal <= 2)
        annotations.push({ icon: "⚠️", text: "Faible exposition solaire → carence en vitamine D probable. Complémentation recommandée (1000-2000 UI/jour minimum)." });
      else if (numVal === 3)
        annotations.push({ icon: "💡", text: "Exposition solaire moyenne → vérifier le taux de vitamine D par bilan sanguin. Complémentation hivernale probable." });
      else
        annotations.push({ icon: "✅", text: "Bonne exposition solaire → synthèse de vitamine D probablement suffisante. Vérifier quand même par bilan si doute." });
      break;
    }

    case "contexte_repas_midi": {
      if (v.trim().length > 0) {
        if (v.toLowerCase().includes("bureau") || v.toLowerCase().includes("travail") || v.toLowerCase().includes("ecran") || v.toLowerCase().includes("écran"))
          annotations.push({ icon: "⚠️", text: "Repas de midi devant écran/au bureau → absence de pleine conscience alimentaire, digestion compromise. Proposer pause dédiée." });
        else if (v.toLowerCase().includes("seul"))
          annotations.push({ icon: "💡", text: "Repas de midi seul(e) → VISIO : Lien avec l'ambiance du repas ? Manger en pleine conscience ou distraitement ?" });
        else if (v.toLowerCase().includes("cantine") || v.toLowerCase().includes("restaurant"))
          annotations.push({ icon: "💡", text: "Repas de midi en collectivité → VISIO : Choix alimentaires disponibles ? Possibilité de préparer ses repas ?" });
        else
          annotations.push({ icon: "💡", text: "VISIO : Contexte du repas de midi noté → adapter les recommandations pratiques au cadre de vie." });
      }
      break;
    }

    case "contexte_repas_soir": {
      if (v.trim().length > 0) {
        if (v.toLowerCase().includes("famille") || v.toLowerCase().includes("enfants") || v.toLowerCase().includes("conjoint"))
          annotations.push({ icon: "✅", text: "Repas du soir en famille → cadre social positif. VISIO : Le programme doit convenir à toute la famille ?" });
        else if (v.toLowerCase().includes("seul"))
          annotations.push({ icon: "💡", text: "Repas du soir seul(e) → VISIO : Prépare-t-il/elle un vrai repas ou grignote ? Motivation à cuisiner seul(e) ?" });
        else if (v.toLowerCase().includes("ecran") || v.toLowerCase().includes("écran") || v.toLowerCase().includes("tv") || v.toLowerCase().includes("télé"))
          annotations.push({ icon: "⚠️", text: "Repas du soir devant écran → absence de satiété consciente, tendance à trop manger. Proposer repas « pleine conscience »." });
        else
          annotations.push({ icon: "💡", text: "VISIO : Contexte du repas du soir noté → adapter les recommandations au cadre de vie et aux contraintes." });
      }
      break;
    }

    // ================================================================
    // SECTION: MOTIVATION
    // ================================================================
    case "rappel_24h": {
      if (v.trim().length > 0) {
        annotations.push({ icon: "💡", text: "VISIO : Reprendre le rappel 24h point par point. Identifier les écarts entre la réalité et les recommandations. Base concrète de travail." });
      } else {
        annotations.push({ icon: "⚠️", text: "Rappel 24h non rempli → VISIO : Le demander oralement en début de consultation." });
      }
      break;
    }

    case "motivation_pourquoi": {
      if (v.trim().length > 0) {
        annotations.push({ icon: "💡", text: "VISIO : Utiliser cette motivation comme levier principal tout au long de l'accompagnement. Reformuler ses mots-clés." });
      } else {
        annotations.push({ icon: "💡", text: "VISIO : Motivation non détaillée → explorer en consultation les raisons profondes du changement souhaité." });
      }
      break;
    }

    case "motivation_niveau": {
      const level = parseInt(v || "5");
      if (level >= 8)
        annotations.push({ icon: "✅", text: `Motivation ${level}/10 — Très motivé(e). Profil idéal pour le programme 90 jours. Capitaliser sur cette énergie.` });
      else if (level >= 5)
        annotations.push({ icon: "💡", text: `Motivation ${level}/10 — Correcte. VISIO : Identifier les freins restants, fixer des micro-objectifs pour construire la confiance.` });
      else
        annotations.push({ icon: "⚠️", text: `Motivation ${level}/10 — Faible. VISIO : Comprendre les freins, ajuster les attentes, objectifs très réalistes. Prioriser les quick wins.` });
      break;
    }

    case "pret_90_jours": {
      if (v === "oui")
        annotations.push({ icon: "✅", text: "Prêt(e) pour le programme 90 jours → présenter l'offre en fin de visio." });
      else if (v === "pourquoi_pas")
        annotations.push({ icon: "💡", text: "Intéressé(e) mais hésitant(e) → VISIO : Répondre aux objections, montrer la valeur concrète, proposer un essai." });
      else if (v === "non")
        annotations.push({ icon: "💡", text: "Pas prêt(e) pour 90 jours → VISIO : Comprendre les freins (budget, temps, doute ?). Proposer un format plus court ou différent." });
      break;
    }

    default: {
      // Catch-all for any unmapped question
      break;
    }
  }

  return annotations;
}

// ============================================================================
// Génération du dossier patient (format texte structuré)
// ============================================================================

function generatePatientDossier(
  answers: Record<string, string | string[]>,
  result: BilanResult
): string {
  const prenom = (answers.prenom as string) || "Patient";
  const nom = (answers.nom as string) || "";
  const email = (answers.email as string) || "N/A";
  const age = (answers.age as string) || "N/A";
  const sexe = (answers.sexe as string) || "N/A";
  const taille = (answers.taille as string) || "N/A";
  const poids = (answers.poids as string) || "N/A";

  const imc = taille && poids ? (
    parseFloat(poids) / Math.pow(parseFloat(taille) / 100, 2)
  ).toFixed(1) : "N/A";

  let dossier = `
══════════════════════════════════════════════════════════
  DOSSIER PATIENT — PRÉPARATION VISIO
  NutriByMeli — Mélissa P., Diététicienne DE & Naturopathe
══════════════════════════════════════════════════════════

📋 INFORMATIONS PATIENT
───────────────────────
  Nom complet : ${prenom} ${nom}
  Email       : ${email}
  Âge         : ${age} ans
  Sexe        : ${sexe === "femme" ? "Femme" : "Homme"}
  Taille      : ${taille} cm
  Poids       : ${poids} kg
  IMC         : ${imc}${imc !== "N/A" ? ` (${parseFloat(imc) < 18.5 ? "insuffisance pondérale" : parseFloat(imc) < 25 ? "poids normal" : parseFloat(imc) < 30 ? "surpoids" : "obésité"})` : ""}

📊 SCORE GLOBAL : ${result.overallScore}/100
───────────────────────
${result.overallScore >= 80 ? "✅ Terrain globalement équilibré" : result.overallScore >= 55 ? "⚠️ Quelques axes à surveiller" : result.overallScore >= 30 ? "🟠 Plusieurs axes à travailler" : "🔴 Prise en charge recommandée"}

📈 SCORES PAR AXE
───────────────────────
${result.axes.map((a) => {
  const bar = "█".repeat(Math.round(a.score / 10)) + "░".repeat(10 - Math.round(a.score / 10));
  return `  ${bar} ${a.score}/100  ${a.label} (${a.level})`;
}).join("\n")}

`;

  // Red flags
  if (result.redFlags.length > 0) {
    dossier += `\n🚨 DRAPEAUX ROUGES — ATTENTION MÉDICALE
───────────────────────\n`;
    result.redFlags.forEach((flag) => {
      dossier += `  🔴 ${flag.message}\n     → ${flag.recommendation}\n\n`;
    });
  }

  // Patterns
  if (result.detectedPatterns.length > 0) {
    dossier += `\n🔍 PATTERNS CLINIQUES DÉTECTÉS
───────────────────────\n`;
    result.detectedPatterns.forEach((p) => {
      const icon = p.severity === "alert" ? "🟠" : p.severity === "warning" ? "⚠️" : "ℹ️";
      dossier += `  ${icon} ${p.name}\n     ${p.description}\n\n`;
    });
  }

  // Priorités
  if (result.topPriorities.length > 0) {
    dossier += `\n🎯 TOP PRIORITÉS
───────────────────────\n`;
    result.topPriorities.forEach((p, i) => {
      dossier += `  ${i + 1}. ${p}\n`;
    });
  }

  // Réponses détaillées avec annotations
  dossier += `\n\n══════════════════════════════════════════════════════════
  RÉPONSES DÉTAILLÉES + ANNOTATIONS VISIO
══════════════════════════════════════════════════════════\n`;

  for (const section of SECTIONS) {
    dossier += `\n\n📂 ${section.title.toUpperCase()}
───────────────────────\n`;

    for (const question of section.questions) {
      const answer = answers[question.id];
      if (answer === undefined || answer === "") continue;

      const displayAnswer = Array.isArray(answer) ? answer.join(", ") : answer;

      // Trouver le label de la réponse si c'est une option
      let answerLabel = displayAnswer;
      if (question.options) {
        if (Array.isArray(answer)) {
          answerLabel = answer
            .map((v) => question.options?.find((o) => o.value === v)?.label || v)
            .join(", ");
        } else {
          answerLabel = question.options.find((o) => o.value === answer)?.label || answer;
        }
      }

      dossier += `\n  Q: ${question.label}\n  R: ${answerLabel}\n`;

      // Annotations cliniques
      const annotations = getAnnotations(question.id, answer);
      if (annotations.length > 0) {
        annotations.forEach((a) => {
          dossier += `  ${a.icon} ${a.text}\n`;
        });
      }
    }
  }

  // Rappel 24h
  const rappel = answers.rappel_24h as string;
  if (rappel) {
    dossier += `\n\n📝 RAPPEL 24H (VERBATIM)
───────────────────────
${rappel}

💡 VISIO : Reprendre ce rappel point par point. Identifier les écarts entre la réalité et les recommandations.
`;
  }

  // Motivation
  const motivation = answers.motivation_pourquoi as string;
  if (motivation) {
    dossier += `\n\n💪 MOTIVATION DU PATIENT (VERBATIM)
───────────────────────
"${motivation}"

💡 VISIO : Utiliser cette motivation comme levier tout au long de l'accompagnement.
`;
  }

  dossier += `\n\n══════════════════════════════════════════════════════════
  FIN DU DOSSIER — Généré automatiquement par NutriByMeli
  Date : ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
══════════════════════════════════════════════════════════\n`;

  return dossier;
}

// ============================================================================
// API Route
// ============================================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers, result } = body as {
      answers: Record<string, string | string[]>;
      result: BilanResult;
    };

    if (!answers || !result) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    const prenom = (answers.prenom as string) || "Patient";
    const nom = (answers.nom as string) || "";
    const patientEmail = (answers.email as string) || "";

    // Générer le dossier patient annoté
    const dossier = generatePatientDossier(answers, result);

    // Générer les PDFs
    const dossierPDF = generateDossierPDF(answers, result, getAnnotations);
    const briefingPDF = generateBriefingPDF(answers, result, getAnnotations);
    const argumentairePDF = generateArgumentairePDF(answers, result);

    // Résumé rapide pour l'objet de l'email
    const worstAxes = result.axes
      .filter((a) => a.score < 55)
      .map((a) => a.label);
    const summary = worstAxes.length > 0
      ? `Axes à travailler : ${worstAxes.join(", ")}`
      : "Terrain globalement bon";

    // === EMAIL 1 : Notification à Mélissa (dossier + PDFs) ===
    if (resend) {
      await resend.emails.send({
        from: "NutriByMeli <notifications@nutri-meli.com>",
        to: [MELISSA_EMAIL],
        subject: `Nouveau bilan — ${prenom} ${nom} (${result.overallScore}/100) — ${summary}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#2D5A3D;">Nouveau bilan recu</h2>
          <p><strong>${prenom} ${nom}</strong> vient de completer son questionnaire.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Score global</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;font-size:18px;color:${result.overallScore >= 65 ? "#6B9E6B" : result.overallScore >= 45 ? "#E5A100" : "#D94343"};">${result.overallScore}/100</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${patientEmail}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Axes critiques</td><td style="padding:8px;border-bottom:1px solid #eee;">${worstAxes.length > 0 ? worstAxes.join(", ") : "Aucun"}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Red flags</td><td style="padding:8px;border-bottom:1px solid #eee;color:${result.redFlags.length > 0 ? "#D94343" : "#6B9E6B"};">${result.redFlags.length > 0 ? result.redFlags.length + " signal(aux)" : "Aucun"}</td></tr>
          </table>
          <p style="color:#888;font-size:13px;">3 PDFs en piece jointe :<br>- <strong>Dossier patient</strong> : recap complet du questionnaire avec annotations cliniques<br>- <strong>Briefing visio</strong> : notes de preparation pour ta consultation<br>- <strong>Argumentaire 90 jours</strong> : argumentaire de vente + objections/reponses</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <pre style="font-size:12px;color:#555;white-space:pre-wrap;line-height:1.6;">${dossier}</pre>
        </div>`,
        attachments: [
          {
            filename: `Dossier_${prenom}_${nom}_${new Date().toISOString().split("T")[0]}.pdf`,
            content: dossierPDF,
          },
          {
            filename: `Briefing_Visio_${prenom}_${nom}_${new Date().toISOString().split("T")[0]}.pdf`,
            content: briefingPDF,
          },
          {
            filename: `Argumentaire_90J_${prenom}_${nom}_${new Date().toISOString().split("T")[0]}.pdf`,
            content: argumentairePDF,
          },
        ],
      });

      // === EMAIL 2 : Confirmation au patient (HTML pro) ===
      if (patientEmail) {
        const scoreColor = result.overallScore >= 65 ? "#6B9E6B" : result.overallScore >= 45 ? "#E5A100" : result.overallScore >= 25 ? "#E07A3A" : "#D94343";
        const scoreLabel = result.overallScore >= 65 ? "Terrain globalement équilibré" : result.overallScore >= 45 ? "Quelques axes méritent attention" : result.overallScore >= 25 ? "Plusieurs axes à travailler" : "Prise en charge recommandée";

        const axesHtml = result.axes.map((a) => {
          const color = a.score >= 65 ? "#6B9E6B" : a.score >= 45 ? "#E5A100" : a.score >= 25 ? "#E07A3A" : "#D94343";
          const levelLabel = a.score >= 65 ? "Bon" : a.score >= 45 ? "À améliorer" : a.score >= 25 ? "Préoccupant" : "Critique";
          const pct = Math.max(a.score, 5);
          return `<tr>
            <td colspan="3" style="padding:10px 0 2px 0;font-size:13px;color:#333333;font-weight:500;">${a.label} <span style="float:right;color:${color};font-weight:700;">${a.score}/100 <span style="font-weight:400;font-size:11px;">${levelLabel}</span></span></td>
          </tr>
          <tr>
            <td colspan="3" style="padding:0 0 10px 0;border-bottom:1px solid #f0f0f0;">
              <!--[if mso]><table width="${pct}%" cellpadding="0" cellspacing="0"><tr><td style="background:${color};height:8px;font-size:1px;">&nbsp;</td></tr></table><![endif]-->
              <!--[if !mso]><!--><div style="background-color:#f0ede8;border-radius:4px;height:8px;width:100%;"><div style="background-color:${color};border-radius:4px;height:8px;width:${pct}%;"></div></div><!--<![endif]-->
            </td>
          </tr>`;
        }).join("");

        const alertsHtml: string[] = [];
        if (result.detectedPatterns.length > 0) {
          alertsHtml.push(`<p style="margin:12px 0 4px 0;font-size:13px;color:#E07A3A;font-weight:600;">${result.detectedPatterns.length} pattern(s) clinique(s) détecté(s)</p><p style="margin:0;font-size:13px;color:#666666;">Ces éléments seront analysés lors de votre consultation.</p>`);
        }
        if (result.redFlags.length > 0) {
          alertsHtml.push(`<p style="margin:12px 0 4px 0;font-size:13px;color:#D94343;font-weight:600;">${result.redFlags.length} signal(aux) d'alerte identifié(s)</p><p style="margin:0;font-size:13px;color:#666666;">Nous en parlerons en détail lors de la consultation.</p>`);
        }

        const prioritiesHtml = result.topPriorities.length > 0
          ? `<p style="margin:16px 0 8px 0;font-size:14px;font-weight:600;color:#333333;">Vos priorités :</p>` +
            result.topPriorities.map((p, i) => `<p style="margin:4px 0;font-size:13px;color:#555555;"><span style="color:#6B9E6B;font-weight:700;">${i + 1}.</span> ${p}</p>`).join("")
          : "";

        const patientHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Logo -->
<tr><td align="center" style="padding:30px 20px 10px 20px;">
<img src="https://nutri-meli.com/logo-email.png" alt="NutriByMeli" width="160" style="display:block;max-width:160px;height:auto;" />
</td></tr>

<!-- Contenu -->
<tr><td style="padding:0 24px;">

<p style="margin:0;font-size:1px;line-height:1px;height:20px;">&nbsp;</p>
<h1 style="margin:0 0 12px 0;font-size:22px;color:#1a1a1a;font-weight:700;">Bonjour ${prenom},</h1>
<p style="margin:0 0 10px 0;color:#555555;font-size:15px;line-height:1.7;">Je tenais à vous remercier personnellement d'avoir pris le temps de compléter ce bilan. C'est une belle première étape vers un meilleur équilibre, et je suis ravie de vous accompagner dans cette démarche.</p>
<p style="margin:0 0 24px 0;color:#555555;font-size:15px;line-height:1.7;">J'ai analysé vos réponses avec attention. Voici une synthèse de votre pré-bilan :</p>

<!-- Score -->
<table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e0e0e0;border-radius:10px;margin:0 0 24px 0;">
<tr><td align="center" style="padding:20px;">
<p style="margin:0 0 4px 0;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:1px;">Score global</p>
<p style="margin:0;font-size:44px;font-weight:700;color:${scoreColor};">${result.overallScore}<span style="font-size:18px;color:#aaaaaa;">/100</span></p>
<p style="margin:6px 0 0 0;font-size:14px;color:${scoreColor};">${scoreLabel}</p>
</td></tr>
</table>

<!-- Axes -->
<h2 style="margin:0 0 10px 0;font-size:16px;color:#1a1a1a;">Vos 6 axes de santé</h2>
<table width="100%" cellpadding="0" cellspacing="0">
${axesHtml}
</table>

<!-- Alertes -->
${alertsHtml.join("")}

<!-- Priorités -->
${prioritiesHtml}

<!-- CTA -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0 0;border-top:1px solid #eeeeee;">
<tr><td align="center" style="padding:24px 0;">
<h2 style="margin:0 0 8px 0;font-size:18px;color:#1a1a1a;">Prochaine étape</h2>
<p style="margin:0 0 16px 0;color:#666666;font-size:14px;line-height:1.6;">60 minutes en visio pour approfondir votre bilan et construire votre feuille de route personnalisée.</p>
<a href="https://nutri-meli.com" style="background-color:#6B9E6B;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:50px;font-weight:600;font-size:15px;display:inline-block;">Réserver ma consultation</a>
</td></tr>
</table>

<!-- Signature -->
<table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eeeeee;margin:8px 0 0 0;">
<tr>
<td width="56" style="padding:16px 12px 16px 0;vertical-align:top;">
<img src="https://nutri-meli.com/melissa-profil.jpg" alt="Mélissa Pommez" width="48" height="48" style="border-radius:50%;display:block;" />
</td>
<td style="padding:16px 0;vertical-align:top;">
<p style="margin:0 0 2px 0;font-size:14px;font-weight:600;color:#1a1a1a;">Mélissa Pommez</p>
<p style="margin:0 0 6px 0;font-size:12px;color:#6B9E6B;">Diététicienne Diplômée d'État &amp; Naturopathe</p>
<p style="margin:0 0 2px 0;font-size:11px;color:#888888;"><span style="color:#6B9E6B;font-weight:700;">&#10003;</span> Expertise certifiée &nbsp; <span style="color:#6B9E6B;font-weight:700;">&#10003;</span> Secret professionnel</p>
<p style="margin:0 0 4px 0;font-size:11px;color:#888888;">&#128205; Guadeloupe</p>
<p style="margin:0;font-size:11px;"><a href="https://nutri-meli.com" style="color:#6B9E6B;text-decoration:none;">nutri-meli.com</a> &nbsp;|&nbsp; <a href="mailto:contact@nutri-meli.com" style="color:#6B9E6B;text-decoration:none;">contact@nutri-meli.com</a></p>
</td>
</tr>
</table>

</td></tr>

<!-- Legal -->
<tr><td align="center" style="padding:16px 24px 24px 24px;">
<p style="margin:0;font-size:11px;color:#bbbbbb;line-height:1.5;">Cet email est envoyé automatiquement suite à votre bilan.<br>Vos données sont protégées par le secret professionnel.</p>
</td></tr>

</table>
</td></tr></table>
</body>
</html>`;

        await resend!.emails.send({
          from: "Mélissa P. — NutriByMeli <contact@nutri-meli.com>",
          to: [patientEmail],
          subject: `${prenom}, votre pré-bilan NutriByMeli est prêt`,
          html: patientHtml,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Bilan envoyé avec succès",
    });
  } catch (error) {
    console.error("Erreur API bilan:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du bilan" },
      { status: 500 }
    );
  }
}
