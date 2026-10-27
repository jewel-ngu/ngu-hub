import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const cmsTypesSource = readFileSync(new URL("./cms-types.ts", import.meta.url), "utf8");

const checklistPages = [
  "info-hub/agent-listing-checklists",
  "info-hub/agent-listing-checklists/pre-appraisal",
  "info-hub/agent-listing-checklists/pre-launch",
  "info-hub/agent-listing-checklists/launch-open-home",
  "info-hub/agent-listing-checklists/post-open-home",
  "info-hub/agent-listing-checklists/auction",
  "info-hub/agent-listing-checklists/under-contract",
  "info-hub/agent-listing-checklists/settlement",
];

test("editor exposes onboarding and every agent checklist page", () => {
  assert.match(cmsTypesSource, /"new-to-ngu\/onboarding"/);

  for (const page of checklistPages) {
    const escapedPage = page.replaceAll("/", "\\/");
    assert.match(cmsTypesSource, new RegExp(`"${escapedPage}"`, "g"));
  }
});

test("Info Hub editor uses the consolidated Agent Checklists card", () => {
  const defaultCards = cmsTypesSource.slice(cmsTypesSource.indexOf("infoHub:"));
  assert.match(defaultCards, /id: "agent-listing-checklists"/);
  assert.doesNotMatch(defaultCards, /id: "pre-list"/);
  assert.doesNotMatch(defaultCards, /id: "pre-sale"/);
  assert.doesNotMatch(defaultCards, /id: "open-home"/);
});
