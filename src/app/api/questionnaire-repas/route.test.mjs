import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("./route.ts", import.meta.url), "utf8");
const dataSource = readFileSync(new URL("../../../data/questionnaire-repas.ts", import.meta.url), "utf8");
const compile = (text) => ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const dataModule = { exports: {} };
vm.runInNewContext(compile(dataSource), { exports: dataModule.exports, module: dataModule });
const localRequire = createRequire(import.meta.url);

function harness({ configured = true, internalFailure = false } = {}) {
  const sent = [];
  const stubImports = {
    "next/server": { NextResponse: { json: (body, options) => Response.json(body, options) } },
    resend: { Resend: class {
      emails = { send: async (message) => {
        sent.push(message);
        return { error: internalFailure && sent.length === 1 ? { name: "provider_error" } : null };
      } };
    } },
    "@/data/questionnaire-repas": dataModule.exports,
    "@/lib/menu/engine": { genererMenu: async () => { throw new Error("Human review required"); } },
    "@/lib/email/brand": { brandEmail: (html) => html },
    "@/lib/menu/token": { encodeMenuToken: () => "not-used-in-review-flow" },
  };
  const mod = { exports: {} };
  vm.runInNewContext(compile(source), {
    exports: mod.exports, module: mod,
    require: (id) => id in stubImports ? stubImports[id] : localRequire(id),
    process: { env: configured ? { RESEND_API_KEY: "test-only-not-a-secret", MELISSA_EMAIL: "dietitian@example.test" } : {} },
    console: { error: () => {} },
  });
  return { post: mod.exports.POST, sent };
}

const request = () => new Request("https://example.test/api/questionnaire-repas", {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ answers: {
    prenom: "Test", email: "client@example.test", jours: ["mardi"],
    livraison_secteur: "jarry", lieu_livraison: "Bureau test", collations: "salee",
    allergies: ["lactose"],
  } }),
});

test("missing delivery configuration is an error, not a false receipt", async () => {
  const h = harness({ configured: false });
  assert.equal((await h.post(request())).status, 503);
  assert.equal(h.sent.length, 0);
});

test("a provider rejection does not confirm a request or notify the client", async () => {
  const h = harness({ internalFailure: true });
  assert.equal((await h.post(request())).status, 502);
  assert.equal(h.sent.length, 1);
});

test("manual review forwards the actual snack and location choices without an automatic menu", async () => {
  const h = harness();
  const response = await h.post(request());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).menu, null);
  assert.equal(h.sent.length, 2);
  assert.match(h.sent[0].html, /Oui, plutôt salée/);
  assert.match(h.sent[0].html, /À Jarry/);
  assert.match(h.sent[0].html, /Bureau test/);
  assert.match(h.sent[0].html, /Lactose/);
  assert.doesNotMatch(h.sent[1].html, /menu\?d=/);
  assert.match(h.sent[1].html, /contraintes alimentaires/);
});
