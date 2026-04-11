import crypto from "crypto";
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
  return crypto.randomBytes(8).toString("base64url").slice(0, 8);
}

export async function createShortLinkService(originalUrl: string, userId: string) {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      const shortCode = generateShortCode();
      return await createLinkInDb({
        originalUrl,
        shortCode,
        userId,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {

      if (error.code === "23505") {
        attempts++;
        if (attempts === maxAttempts) {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }
}