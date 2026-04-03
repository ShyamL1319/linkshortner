import { db } from "@/db";
import { links, type Link, type NewLink } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

async function findLinkById(linkId: number): Promise<Link | undefined> {
  const [link] = await db.select().from(links).where(eq(links.id, linkId));
  return link;
}

async function findOwnedLink(
  linkId: number,
  userId: string,
): Promise<Link | null> {
  const link = await findLinkById(linkId);
  if (!link || link.userId !== userId) {
    return null;
  }

  return link;
}

/**
 * Fetches all links for a specific user
 * @param userId - The authenticated user's ID
 * @returns Array of links belonging to the user, ordered by updatedAt (latest first)
 */
export async function getUserLinks(userId: string): Promise<Link[]> {
  return await db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.updatedAt));
}

/**
 * Creates a new link for a user
 * @param userId - The authenticated user's ID
 * @param originalUrl - The URL to shorten
 * @param customSlug - Optional custom short code
 * @returns The created link
 */
export async function createLink(
  userId: string,
  originalUrl: string,
  customSlug?: string,
): Promise<Link> {
  const shortCode = customSlug || nanoid(8);

  const newLink: NewLink = {
    userId,
    originalUrl,
    shortCode,
  };

  const [createdLink] = await db.insert(links).values(newLink).returning();

  return createdLink;
}

/**
 * Updates an existing link
 * @param linkId - The ID of the link to update
 * @param userId - The authenticated user's ID (for ownership verification)
 * @param originalUrl - The new URL
 * @param customSlug - Optional new custom short code
 * @returns The updated link or null if not found or unauthorized
 */
export async function updateLink(
  linkId: number,
  userId: string,
  originalUrl: string,
  customSlug?: string,
): Promise<Link | null> {
  const existingLink = await findOwnedLink(linkId, userId);
  if (!existingLink) {
    return null;
  }

  const shortCode = customSlug || existingLink.shortCode;

  const [updatedLink] = await db
    .update(links)
    .set({
      originalUrl,
      shortCode,
      updatedAt: new Date(),
    })
    .where(eq(links.id, linkId))
    .returning();

  return updatedLink;
}

/**
 * Deletes a link
 * @param linkId - The ID of the link to delete
 * @param userId - The authenticated user's ID (for ownership verification)
 * @returns true if deleted, false if not found or unauthorized
 */
export async function deleteLink(
  linkId: number,
  userId: string,
): Promise<boolean> {
  const existingLink = await findOwnedLink(linkId, userId);
  if (!existingLink) {
    return false;
  }

  await db.delete(links).where(eq(links.id, linkId));

  return true;
}
