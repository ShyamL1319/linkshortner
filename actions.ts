"use server";

import { auth } from "@clerk/nextjs/server";
import { createShortLinkService } from "./services";
import { revalidatePath } from "next/cache";

/**
 * ACTION: Handles HTTP boundary, Next.js specifics, and authentication.
 * Delegates the actual execution to the Service layer.
 */
export async function createShortLinkAction(formData: FormData) {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("Unauthorized: You must be logged in to create a link.");
  }

  const originalUrl = formData.get("url") as string;
  if (!originalUrl) {
    throw new Error("Bad Request: URL is required.");
  }

  await createShortLinkService(originalUrl, userId);
  revalidatePath("/dashboard");
}