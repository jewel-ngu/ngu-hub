import assert from "node:assert/strict";
import test from "node:test";
import { getListingChecklist, listingChecklists } from "./listing-checklists.ts";

const expectedSlugs = [
  "pre-appraisal",
  "pre-launch",
  "launch-open-home",
  "post-open-home",
  "auction",
  "under-contract",
  "settlement",
];

test("listing checklist library exposes all seven stages in order", () => {
  assert.deepEqual(listingChecklists.map((checklist) => checklist.slug), expectedSlugs);
  assert.equal(new Set(expectedSlugs).size, listingChecklists.length);
});

test("every listing checklist contains usable section content", () => {
  for (const checklist of listingChecklists) {
    assert.ok(checklist.title.length > 0);
    assert.ok(checklist.description.length > 0);
    assert.ok(checklist.instruction.length > 0);
    assert.ok(checklist.sections.length > 0);
    assert.ok(checklist.sections.every((section) => section.title.length > 0 && section.items.length > 0));
  }
});

test("listing checklist lookup returns known stages and rejects unknown ones", () => {
  assert.equal(getListingChecklist("auction")?.title, "Auction Checklist");
  assert.equal(getListingChecklist("does-not-exist"), undefined);
});
