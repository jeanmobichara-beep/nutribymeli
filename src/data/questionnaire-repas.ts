// ============================================================================
// QUESTIONNAIRE REPAS — NutriByMeli
// Court (~2 min). Sert UNIQUEMENT à personnaliser le dosage des repas.
// Distinct du bilan nutrition complet (@/data/questionnaire).
// ============================================================================

import type { Section } from "@/data/questionnaire";

export const REPAS_SECTIONS: Section[] = [
  {
    id: "toi",
    title: "Toi",
    subtitle: "Juste ce qu'il faut pour calculer tes portions. Tout reste confidentiel.",
    icon: "Target",
    color: "amber",
    questions: [
      { id: "prenom", label: "Ton prénom", type: "text", required: true, placeholder: "Prénom" },
      { id: "email", label: "Ton email", type: "email", required: true, placeholder: "email@exemple.com", helpText: "Pour te confirmer ta commande." },
      { id: "age", label: "Ton âge", type: "number", placeholder: "Ex. 34" },
      { id: "sexe", label: "Tu es…", type: "radio", options: [
        { value: "femme", label: "Une femme" },
        { value: "homme", label: "Un homme" },
      ] },
      { id: "taille", label: "Ta taille (en cm)", type: "number", required: true, placeholder: "Ex. 170" },
      { id: "poids", label: "Ton poids (en kg)", type: "number", required: true, placeholder: "Ex. 68", helpText: "Sert uniquement au calcul des portions." },
    ],
  },
  {
    id: "objectif",
    title: "Ton objectif & ton rythme",
    subtitle: "Pour caler le bon dosage et les bons jours.",
    icon: "UtensilsCrossed",
    color: "green",
    questions: [
      { id: "objectif", label: "Ton objectif principal", type: "radio", required: true, options: [
        { value: "perte_poids", label: "Perte de poids" },
        { value: "maintien", label: "Maintien / manger mieux" },
        { value: "prise_muscle", label: "Prise de muscle" },
        { value: "energie", label: "Plus d'énergie" },
      ] },
      { id: "activite", label: "Ton activité physique", type: "radio", options: [
        { value: "sedentaire", label: "Sédentaire" },
        { value: "moderee", label: "Modérée (1-3 séances / sem.)" },
        { value: "sportive", label: "Sportive (4+ séances / sem.)" },
      ] },
      { id: "jours", label: "Quels jours veux-tu tes déjeuners ?", type: "checkbox", required: true, maxChoices: 5, helpText: "Places limitées — de 1 à 5 jours (du lundi au vendredi).", options: [
        { value: "lundi", label: "Lundi" },
        { value: "mardi", label: "Mardi" },
        { value: "mercredi", label: "Mercredi" },
        { value: "jeudi", label: "Jeudi" },
        { value: "vendredi", label: "Vendredi" },
      ] },
    ],
  },
  {
    id: "preferences",
    title: "Tes préférences",
    subtitle: "Rien n'est laissé au hasard : c'est toi qui composes.",
    icon: "Apple",
    color: "green",
    questions: [
      { id: "proteines", label: "Tes protéines préférées", type: "radio", options: [
        { value: "viande", label: "Viande (poulet, dinde, bœuf maigre)" },
        { value: "poisson", label: "Poisson (dont sardines)" },
        { value: "vegetarien", label: "Végétarien / végétal" },
        { value: "peu_importe", label: "Peu importe, surprends-moi" },
      ] },
      { id: "densite", label: "Tu veux plutôt…", type: "radio", options: [
        { value: "plus_proteines", label: "Plus de protéines" },
        { value: "equilibre", label: "Équilibré" },
        { value: "plus_leger", label: "Plus léger" },
        { value: "plus_feculents", label: "Plus de féculents" },
      ] },
      { id: "appetit", label: "Ton appétit", type: "radio", options: [
        { value: "petite", label: "Petite faim" },
        { value: "normale", label: "Normal" },
        { value: "grosse", label: "Grosse faim" },
      ] },
      { id: "epices", label: "Épices", type: "radio", options: [
        { value: "doux", label: "Doux" },
        { value: "releve", label: "Relevé / créole" },
      ] },
      { id: "allergies", label: "Allergies ou intolérances ?", type: "checkbox", options: [
        { value: "gluten", label: "Gluten" },
        { value: "lactose", label: "Lactose" },
        { value: "fruits_de_mer", label: "Fruits de mer / poisson" },
        { value: "fruits_a_coque", label: "Fruits à coque" },
        { value: "aucune", label: "Aucune" },
      ] },
      { id: "allergies_autre", label: "Autre allergie / précision", type: "text", placeholder: "Facultatif" },
      { id: "aliments_detestes", label: "Des aliments que tu ne manges pas / détestes ?", type: "textarea", placeholder: "Ex. coriandre, foie, olives…" },
    ],
  },
];
