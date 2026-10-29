import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const contentSource = readFileSync(new URL("../components/content.tsx", import.meta.url), "utf8");

test("Info Hub team administration section has a stable deep-link anchor", () => {
  assert.match(contentSource, /id="team-member-administration"/);
});
