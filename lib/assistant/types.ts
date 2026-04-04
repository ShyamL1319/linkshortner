import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1),
  provider: z.enum(["gemini", "openai"]).optional(),
});

export const createLinkArgsSchema = z.object({
  url: z.string().min(1),
  customSlug: z.string().min(1).optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type CreateLinkArgs = z.infer<typeof createLinkArgsSchema>;

export interface CreatedLinkSummary {
  shortCode: string;
  shortUrl: string;
}

export interface AssistantResponse {
  reply: string;
  createdLink?: CreatedLinkSummary;
}

export interface AssistantFunctionCall {
  name: string;
  args: Record<string, string>;
}
