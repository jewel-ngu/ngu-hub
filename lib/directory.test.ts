import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping test runner loads the TypeScript source file directly.
import { preparePeopleDirectoryRows, prepareSupplierDirectoryRows } from "./directory.ts";

test("people directory uses row one as its heading and removes structural rows", () => {
  const rows = [
    ["Office address", "STATUS", "DIRECTORS", "POSITION", "MOBILE", "EMAIL"],
    ["", "", "Emil Juresic", "Chairman", "0481 601 793", "emil@example.com"],
    ["", "", "PRESTIGE FINANCE", "POSITION", "MOBILE", "EMAIL"],
    ["", "", "Zesem Dashaa", "Finance Broker", "0481 255 556", "zesem@example.com"],
    ["", "", "ADMINISTRATORS", "POSITION", "MOBILE", "EMAIL"],
  ];

  assert.deepEqual(preparePeopleDirectoryRows(rows), {
    heading: "Office address",
    rows: [
      ["Emil Juresic", "Chairman", "0481 601 793", "emil@example.com"],
      ["Zesem Dashaa", "Finance Broker", "0481 255 556", "zesem@example.com"],
    ],
  });
});

test("supplier directory uses row one as its heading and hides the first column", () => {
  const rows = [
    ["NGU SUPPLIER LIST", "", "", ""],
    ["Category label", "", "", ""],
    ["Do not show", "Example Co", "Photography", "hello@example.com"],
  ];

  assert.deepEqual(prepareSupplierDirectoryRows(rows), {
    heading: "NGU SUPPLIER LIST",
    rows: [["Example Co", "Photography", "hello@example.com"]],
  });
});
