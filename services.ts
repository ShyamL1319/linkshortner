import { createLinkInDb } from "./repositories";

/**
 * SERVICE: Handles core business logic and algorithms.
 * Does not contain Next.js specific code or direct DB queries.
 */

/**
 * Generates a random alphanumeric string for the short URL.
 * In a real app, you might use 'nanoid' or a custom base62 encoder.
 */
function generateShortCode(): string {
  return Math.random().toString(36).substring(2, 8);
}

export async function createShortLinkService(originalUrl: string, userId: string) {
  const shortCode = generateShortCode();
  
  return createLinkInDb({
    originalUrl,
    shortCode,
    userId,
  });
}