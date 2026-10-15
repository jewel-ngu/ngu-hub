import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping test runner loads the TypeScript source file directly.
import { preparePeopleDirectoryRows } from "./directory.ts";

test("people directory keeps its first row and removes later structural headings", () => {
  const rows = [
    ["Office address", "STATUS", "DIRECTORS", "POSITION", "MOBILE", "EMAIL"],
    ["", "", "Emil Juresic", "Chairman", "0481 601 793", "emil@example.com"],
    ["", "", "PRESTIGE FINANCE", "POSITION", "MOBILE", "EMAIL"],
    ["", "", "Zesem Dashaa", "Finance Broker", "0481 255 556", "zesem@example.com"],
    ["", "", "ADMINISTRATORS", "POSITION", "MOBILE", "EMAIL"],
  ];

  assert.deepEqual(preparePeopleDirectoryRows(rows), [
    ["DIRECTORS", "POSITION", "MOBILE", "EMAIL"],
    ["Emil Juresic", "Chairman", "0481 601 793", "emil@example.com"],
    ["Zesem Dashaa", "Finance Broker", "0481 255 556", "zesem@example.com"],
  ]);
});
