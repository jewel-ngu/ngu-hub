import assert from "node:assert/strict";
import test from "node:test";
import { getCalendarMonthRange } from "./calendar-range.ts";

test("calendar month range includes the complete visible calendar grid", () => {
  const range = getCalendarMonthRange("2026-10");
  assert.equal(range?.start.toISOString(), "2026-09-27T00:00:00.000Z");
  assert.equal(range?.end.toISOString(), "2026-10-31T23:59:59.999Z");
});

test("calendar month range rejects invalid and unsafe values", () => {
  assert.equal(getCalendarMonthRange("2026-13"), undefined);
  assert.equal(getCalendarMonthRange("not-a-month"), undefined);
  assert.equal(getCalendarMonthRange("1999-12"), undefined);
});
