/** A recipe catalogue is not an allergen audit of ingredients and kitchen processes.
 * Any declared allergy/intolerance must be reviewed by Mélissa before a proposal.
 */
export function needsDietitianReview(answers: Record<string, string | string[]>): boolean {
  const declared = ([] as string[]).concat(answers.allergies || []);
  return declared.some((value) => value.trim() !== "" && value.trim() !== "aucune")
    || String(answers.allergies_autre || "").trim().length > 0;
}

export function requireCompatibleRecipes(recipeCount: number): void {
  if (recipeCount === 0) {
    throw new Error("Aucune recette compatible : validation de Mélissa nécessaire.");
  }
}
