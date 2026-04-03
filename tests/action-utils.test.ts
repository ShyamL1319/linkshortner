import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";
import {
  normalizeCustomSlug,
  parseActionError,
} from "../app/dashboard/action-utils";

test("normalizeCustomSlug converts empty strings to undefined", () => {
  assert.equal(normalizeCustomSlug(""), undefined);
  assert.equal(normalizeCustomSlug("my-link"), "my-link");
});

test("parseActionError prefers zod validation messages", () => {
  const schema = z.object({
    url: z.string().url("Please enter a valid URL"),
  });

  const result = schema.safeParse({ url: "not-a-url" });
  assert.equal(result.success, false);

  if (!result.success) {
    assert.equal(
      parseActionError(result.error, "Failed to create link"),
      "Please enter a valid URL",
    );
  }
});

test("parseActionError maps unique constraint errors to a friendly message", () => {
  assert.equal(
    parseActionError(
      new Error("duplicate key value violates unique constraint"),
      "Failed to create link",
    ),
    "This custom slug is already taken",
  );
});

test("parseActionError falls back for unknown errors", () => {
  assert.equal(
    parseActionError(new Error("boom"), "Failed to create link"),
    "Failed to create link",
  );
});
