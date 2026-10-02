import assert from "node:assert/strict";
import test from "node:test";
import { isAllowedEmail } from "./auth-policy.ts";

test("allows only the exact approved NGU email domains", () => {
  assert.equal(isAllowedEmail("agent@ngurealestate.com.au"), true);
  assert.equal(isAllowedEmail(" Agent@NGUREALESTATE.COM.AU "), true);
  assert.equal(isAllowedEmail("agent@nguteam.com"), true);
  assert.equal(isAllowedEmail("agent@ngugroup.com"), true);
  assert.equal(isAllowedEmail("agent@sub.ngurealestate.com.au"), false);
  assert.equal(isAllowedEmail("agent@sub.nguteam.com"), false);
  assert.equal(isAllowedEmail("agent@ngurealestate.com.au.example.com"), false);
  assert.equal(isAllowedEmail("agent@@ngurealestate.com.au"), false);
  assert.equal(isAllowedEmail(undefined), false);
});
