"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createLink as createLinkHelper,
  updateLink as updateLinkHelper,
  deleteLink as deleteLinkHelper,
} from "@/data/links";

const customSlugSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9_-]*$/,
    "Only letters, numbers, hyphens, and underscores allowed"
  )
  .min(3, "Custom slug must be at least 3 characters")
  .max(20, "Custom slug must be at most 20 characters")
  .optional()
  .or(z.literal(""));

const urlSchema = z.string().url("Please enter a valid URL");

const linkPayloadSchema = {
  url: urlSchema,
  customSlug: customSlugSchema,
} as const;

const createLinkSchema = z.object(linkPayloadSchema);

export interface CreateLinkInput {
  url: string;
  customSlug?: string;
}

export interface CreateLinkResult {
  success?: boolean;
  error?: string;
  shortCode?: string;
}

async function requireAuthUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

function normalizeCustomSlug(customSlug?: string): string | undefined {
  return customSlug === "" ? undefined : customSlug;
}

function parseActionError(error: unknown, fallbackMessage: string): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? fallbackMessage;
  }

  if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
    return "This custom slug is already taken";
  }

  return fallbackMessage;
}

/**
 * Server action to create a new shortened link
 */
export async function createLink(
  input: CreateLinkInput
): Promise<CreateLinkResult> {
  const userId = await requireAuthUserId();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const validated = createLinkSchema.parse(input);
    const customSlug = normalizeCustomSlug(validated.customSlug);
    const link = await createLinkHelper(userId, validated.url, customSlug);

    revalidatePath("/dashboard");
    return { success: true, shortCode: link.shortCode };
  } catch (error) {
    console.error("Error creating link:", error);
    return {
      error: parseActionError(error, "Failed to create link. Please try again."),
    };
  }
}

const updateLinkSchema = z.object({
  linkId: z.number(),
  ...linkPayloadSchema,
});

export interface UpdateLinkInput {
  linkId: number;
  url: string;
  customSlug?: string;
}

export interface UpdateLinkResult {
  success?: boolean;
  error?: string;
}

/**
 * Server action to update an existing link
 */
export async function updateLink(
  input: UpdateLinkInput
): Promise<UpdateLinkResult> {
  const userId = await requireAuthUserId();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const validated = updateLinkSchema.parse(input);
    const customSlug = normalizeCustomSlug(validated.customSlug);
    const updatedLink = await updateLinkHelper(
      validated.linkId,
      userId,
      validated.url,
      customSlug
    );

    if (!updatedLink) {
      return { error: "Link not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating link:", error);
    return {
      error: parseActionError(error, "Failed to update link. Please try again."),
    };
  }
}

const deleteLinkSchema = z.object({
  linkId: z.number(),
});

export interface DeleteLinkInput {
  linkId: number;
}

export interface DeleteLinkResult {
  success?: boolean;
  error?: string;
}

/**
 * Server action to delete a link
 */
export async function deleteLink(
  input: DeleteLinkInput
): Promise<DeleteLinkResult> {
  const userId = await requireAuthUserId();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const validated = deleteLinkSchema.parse(input);
    const deleted = await deleteLinkHelper(validated.linkId, userId);

    if (!deleted) {
      return { error: "Link not found or unauthorized" };
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting link:", error);
    return {
      error: parseActionError(error, "Failed to delete link. Please try again."),
    };
  }
}
