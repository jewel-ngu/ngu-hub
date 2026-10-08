import assert from "node:assert/strict";
import test from "node:test";
import { isLocalAccessEnabled } from "./local-access.ts";

test("enables local access only for an explicitly enabled development loopback URL", () => {
  assert.equal(isLocalAccessEnabled({
    BETTER_AUTH_URL: "http://localhost:3000",
    LOCAL_DEV_ACCESS: "true",
    NODE_ENV: "development",
  }), true);

  assert.equal(isLocalAccessEnabled({
    BETTER_AUTH_URL: "http://127.0.0.1:3000",
    LOCAL_DEV_ACCESS: "true",
    NODE_ENV: "development",
  }), true);
});

test("never enables local access for production or a non-loopback URL", () => {
  assert.equal(isLocalAccessEnabled({
    BETTER_AUTH_URL: "https://ngu-hub-lake.vercel.app",
    LOCAL_DEV_ACCESS: "true",
    NODE_ENV: "development",
  }), false);

  assert.equal(isLocalAccessEnabled({
    BETTER_AUTH_URL: "http://localhost:3000",
    LOCAL_DEV_ACCESS: "true",
    NODE_ENV: "production",
  }), false);

  assert.equal(isLocalAccessEnabled({
    BETTER_AUTH_URL: "http://localhost:3000",
    LOCAL_DEV_ACCESS: "false",
    NODE_ENV: "development",
  }), false);
});
