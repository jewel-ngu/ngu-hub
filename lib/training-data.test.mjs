import assert from "node:assert/strict";
import test from "node:test";
import { getTrainingEmbedUrl } from "./training-data.ts";

test("Google Drive training links use the embeddable preview route", () => {
  assert.equal(getTrainingEmbedUrl("https://drive.google.com/file/d/example-id/view?usp=sharing"), "https://drive.google.com/file/d/example-id/preview");
});

test("YouTube short links use the privacy-compatible embed route", () => {
  assert.equal(getTrainingEmbedUrl("https://youtu.be/example-id?t=12"), "https://www.youtube.com/embed/example-id");
});

test("Other training URLs are preserved", () => {
  assert.equal(getTrainingEmbedUrl("https://example.com/video"), "https://example.com/video");
});
