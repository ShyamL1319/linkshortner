export const DEFAULT_LINK_ASSISTANT_MODEL_OPENAI = "gpt-4o-mini";
export const DEFAULT_LINK_ASSISTANT_MODEL_GEMINI = "gemini-2.0-flash";
export const LINK_ASSISTANT_INSTRUCTIONS = [
  "You are the Link Assistant for Link Shortener.",
  "Your only job is to help authenticated users create one short URL at a time.",
  "If the user has not provided a destination URL, ask a short follow-up question.",
  "If the user has provided a URL without a scheme, prefer https:// and ask for confirmation only if the destination is ambiguous.",
  "If the user mentions a custom slug, keep it short and valid for the app's rules.",
  "Do not invent URLs, slugs, or business details.",
  "Do not edit or delete links.",
  "When the link is created, respond with a concise confirmation and the final short URL if available.",
].join(" ");

export type LinkAssistantRole = "user" | "assistant";

export interface LinkAssistantMessage {
  role: LinkAssistantRole;
  content: string;
}

export interface LinkAssistantRequest {
  messages: LinkAssistantMessage[];
}

export interface CreatedLinkSummary {
  shortCode: string;
  shortUrl: string;
}

export interface LinkAssistantResponse {
  reply: string;
  createdLink?: CreatedLinkSummary;
}

export interface OpenAITextItem {
  type: "output_text";
  text: string;
}

export interface OpenAIMessageOutput {
  type: "message";
  role: "assistant";
  content: OpenAITextItem[];
}

export interface OpenAIFunctionCallOutput {
  type: "function_call";
  name: string;
  call_id: string;
  arguments: string;
}

export interface OpenAIResponse {
  id: string;
  output: Array<OpenAIMessageOutput | OpenAIFunctionCallOutput>;
}

export function buildShortUrl(origin: string, shortCode: string): string {
  return new URL(`/l/${encodeURIComponent(shortCode)}`, origin).toString();
}

export function normalizeAssistantUrl(url: string): string {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return trimmedUrl;
  }

  try {
    return new URL(trimmedUrl).toString();
  } catch {
    return `https://${trimmedUrl}`;
  }
}

export function getAssistantReply(response: OpenAIResponse): string {
  const message = response.output.find(
    (item): item is OpenAIMessageOutput =>
      item.type === "message" && item.role === "assistant",
  );

  const text = message?.content
    .filter((item): item is OpenAITextItem => item.type === "output_text")
    .map((item) => item.text)
    .join("")
    .trim();

  return text || "I could not generate a response.";
}

export function getFunctionCall(
  response: OpenAIResponse,
): OpenAIFunctionCallOutput | undefined {
  return response.output.find(
    (item): item is OpenAIFunctionCallOutput => item.type === "function_call",
  );
}
