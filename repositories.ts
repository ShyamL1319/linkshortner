import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * REPOSITORY: Handles pure data access. 
 * Isolates Drizzle ORM dependencies from the rest of the application.
 */

type InsertLink = typeof links.$inferInsert;

export async function createLinkInDb(data: InsertLink) {
  const [newLink] = await db
    .insert(links)
    .values(data)
    .returning();
    
  return newLink;
}

export async function getLinksByUserId(userId: string) {
  return db.select().from(links).where(eq(links.userId, userId));
}