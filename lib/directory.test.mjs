import assert from "node:assert/strict";
import test from "node:test";
import { parseCsv, parseDirectoryTabs, restoreSheetLinks, redactAccessDetails } from "./directory.ts";

test("CSV preserves quoted commas, escaped quotes and multiline values", () => {
  assert.deepEqual(parseCsv('"Name","Address"\r\n"A ""Team""","1 Street, City\nLevel 2"\n'), [["Name", "Address"], ['A "Team"', "1 Street, City\nLevel 2"]]);
});
test("CSV excludes empty rows and rejects incomplete responses", () => {
  assert.deepEqual(parseCsv(',,\n"A",,"B"'), [["A", "", "B"]]);
  assert.throws(() => parseCsv('"unfinished'));
});
test("Sheet tabs are parsed as data without executing source scripts", () => {
  assert.deepEqual(parseDirectoryTabs('items.push({name: "Media\\/Gifting", pageUrl: "https://example.com", gid: "123",initialSheet: false});'), [{ name: "Media/Gifting", gid: "123" }]);
  assert.deepEqual(parseDirectoryTabs("unavailable"), []);
});
test("Supplier links retain ordering and reject unsafe schemes", () => {
  assert.deepEqual(restoreSheetLinks([["Website", "Website", "Bad"]], '<a href="https://www.google.com/url?q=https%3A%2F%2Fexample.com">Website</a><a href="https://example.org">Website</a><a href="javascript:alert(1)">Bad</a>'), [["https://example.com/", "https://example.org/", "Bad"]]);
});
test("Access credentials are excluded from the website response", () => {
  assert.deepEqual(redactAccessDetails([["Price list\nPassword: sample", "Contact"]]), [["Price list\nAccess details: open the source sheet", "Contact"]]);
});
