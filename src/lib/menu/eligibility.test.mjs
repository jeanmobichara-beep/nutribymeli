import { test } from "node:test";
import assert from "node:assert/strict";
import { needsDietitianReview, requireCompatibleRecipes } from "./eligibility.ts";

test("ordinary profiles can receive an initial proposal", () => {
  assert.equal(needsDietitianReview({}), false);
  assert.equal(needsDietitianReview({ allergies: ["aucune"], allergies_autre: "  " }), false);
});

test("every declared constraint requires human review, even alongside 'none'", () => {
  for (const allergy of ["gluten", "lactose", "fruits_de_mer", "fruits_a_coque", "other"]) {
    assert.equal(needsDietitianReview({ allergies: [allergy] }), true);
    assert.equal(needsDietitianReview({ allergies: ["aucune", allergy] }), true);
  }
});

test("free-text constraints and a single-value API payload are not missed", () => {
  assert.equal(needsDietitianReview({ allergies: "lactose" }), true);
  assert.equal(needsDietitianReview({ allergies: ["aucune"], allergies_autre: "Œufs" }), true);
});

test("an empty compatible catalogue must never fall back to unfiltered recipes", () => {
  assert.throws(() => requireCompatibleRecipes(0), /validation de Mélissa/);
  assert.doesNotThrow(() => requireCompatibleRecipes(1));
});
