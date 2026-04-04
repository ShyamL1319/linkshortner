import { createLink } from "@/data/links";
import { createLinkArgsSchema } from "./types";
import type { AssistantFunctionCall } from "./types";

function buildShortUrl(origin: string, shortCode: string): string {
  return new URL(`/l/${encodeURIComponent(shortCode)}`, origin).toString();
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  try {
    return new URL(trimmed).toString();
  } catch {
    return `https://${trimmed}`;
  }
}

export type LinkResult =
  | { success: true; shortCode: string; shortUrl: string; originalUrl: string }
  | { success: false; error: string };

export async function executeLinkCreation(
  userId: string,
  origin: string,
  call: AssistantFunctionCall,
): Promise<LinkResult> {
  try {
    const parsed = createLinkArgsSchema.parse(call.args);
    const normalizedUrl = normalizeUrl(parsed.url);
    const customSlug = parsed.customSlug?.trim() || undefined;

    const link = await createLink(userId, normalizedUrl, customSlug);

    return {
      success: true,
      shortCode: link.shortCode,
      shortUrl: buildShortUrl(origin, link.shortCode),
      originalUrl: link.originalUrl,
    };
  } catch (error) {
    const isSlugConflict =
      error instanceof Error && error.message.toLowerCase().includes("unique");

    return {
      success: false,
      error: isSlugConflict
        ? "That custom slug is already taken. Try another one."
        : "I could not create that link. Please check the URL and slug.",
    };
  }
}
