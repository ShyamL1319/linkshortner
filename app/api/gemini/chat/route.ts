import { GeminiProvider } from "@/lib/assistant/providers/gemini.provider";
import { createAssistantHandler } from "@/app/api/chat/route";

export const POST = (req: Request) =>
  createAssistantHandler(req, new GeminiProvider());