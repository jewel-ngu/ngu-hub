import assert from "node:assert/strict";
import test from "node:test";
import { navItems } from "./site-data.ts";

test("main navigation excludes Principal Access", () => {
  assert.equal(navItems.some((item) => item.label.includes("Principal Access")), false);
});
