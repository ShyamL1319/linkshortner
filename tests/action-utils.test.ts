import { z } from "zod";
import {
  normalizeCustomSlug,
  parseActionError,
} from "../app/dashboard/action-utils";

describe("action-utils", () => {
  it("normalizeCustomSlug converts empty strings to undefined", () => {
    expect(normalizeCustomSlug("")).toBeUndefined();
    expect(normalizeCustomSlug("my-link")).toBe("my-link");
  });

  it("parseActionError prefers zod validation messages", () => {
    const schema = z.object({
      url: z.string().url("Please enter a valid URL"),
    });

    const result = schema.safeParse({ url: "not-a-url" });
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        parseActionError(result.error, "Failed to create link")
      ).toBe("Please enter a valid URL");
    }
  });

  it("parseActionError maps unique constraint errors to a friendly message", () => {
    expect(
      parseActionError(
        new Error("duplicate key value violates unique constraint"),
        "Failed to create link"
      )
    ).toBe("This custom slug is already taken");
  });

  it("parseActionError falls back for unknown errors", () => {
    expect(
      parseActionError(new Error("boom"), "Failed to create link")
    ).toBe("Failed to create link");
  });
});
