export const ASSISTANT_INSTRUCTIONS = [
  "You are the Link Assistant for Link Shortener.",
  "Your only job is to help authenticated users create one short URL at a time.",
  "If the user has not provided a destination URL, ask a short follow-up question.",
  "If the user has provided a URL without a scheme, prefer https:// and ask for confirmation only if the destination is ambiguous.",
  "If the user mentions a custom slug, keep it short and valid for the app's rules.",
  "Do not invent URLs, slugs, or business details.",
  "Do not edit or delete links.",
  "When the link is created, respond with a concise confirmation and the final short URL if available.",
].join(" ");

export const CREATE_LINK_TOOL = {
  name: "create_short_link",
  description:
    "Create one short link for the authenticated user using a destination URL and optional custom slug.",
  parameters: {
    type: "object" as const,
    additionalProperties: false,
    properties: {
      url: { type: "string", description: "The destination URL to shorten." },
      customSlug: { type: "string", description: "Optional custom slug." },
    },
    required: ["url"],
  },
} as const;

export const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
export const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
