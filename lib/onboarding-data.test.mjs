import assert from "node:assert/strict";
import test from "node:test";
import { firstWeekStages, generalOnboardingGroups, salesAdminGroups, salesAgentGroups } from "./onboarding-data.ts";

test("first-week checklist contains the complete seven-day flow", () => {
  assert.equal(firstWeekStages.length, 4);
  assert.equal(firstWeekStages.flatMap((stage) => stage.items).length, 12);
});

test("core office setup excludes the removed training and fob tasks", () => {
  const officeItems = generalOnboardingGroups.find((group) => group.title === "Office Set-Up")?.items ?? [];
  assert.equal(officeItems.includes("Basecamp Training"), false);
  assert.equal(officeItems.includes("Social Media Training"), false);
  assert.equal(officeItems.includes("Request Fob (if needed)"), false);
});

test("role pathways expose the requested software lists", () => {
  assert.deepEqual(salesAgentGroups[0].items, ["REA", "Domain", "DocuSign", "Rex", "Homepass", "Realworks", "PriceFinder", "RP Data", "RealHub", "Basecamp"]);
  assert.deepEqual(salesAdminGroups[0].items, ["RealHub", "Basecamp"]);
  assert.equal(salesAgentGroups.length, 5);
  assert.equal(salesAdminGroups.length, 4);
});
