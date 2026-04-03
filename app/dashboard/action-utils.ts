import { z } from "zod";

export function normalizeCustomSlug(customSlug?: string): string | undefined {
  return customSlug === "" ? undefined : customSlug;
}

export function parseActionError(
  error: unknown,
  fallbackMessage: string,
): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? fallbackMessage;
  }

  if (
    error instanceof Error &&
    error.message.toLowerCase().includes("unique")
  ) {
    return "This custom slug is already taken";
  }

  return fallbackMessage;
}
