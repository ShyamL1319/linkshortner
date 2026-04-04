import {
  GoogleGenerativeAI,
  SchemaType,
  type ChatSession,
} from "@google/generative-ai";
import {
  ASSISTANT_INSTRUCTIONS,
  CREATE_LINK_TOOL,
  DEFAULT_GEMINI_MODEL,
} from "../constants";
import type { IAiProvider, ChatReply } from "../provider.interface";
import type { ChatMessage } from "../types";

export class GeminiProvider implements IAiProvider {
  private chatSession: ChatSession | null = null;
  private readonly modelName: string;

  constructor(
    model = process.env.GEMINI_LINK_ASSISTANT_MODEL || DEFAULT_GEMINI_MODEL,
  ) {
    this.modelName = model;
  }

  private getModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

    return new GoogleGenerativeAI(apiKey).getGenerativeModel({
      model: this.modelName,
      systemInstruction: ASSISTANT_INSTRUCTIONS,
      tools: [
        {
          functionDeclarations: [
            {
              name: CREATE_LINK_TOOL.name,
              description: CREATE_LINK_TOOL.description,
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  url: {
                    type: SchemaType.STRING,
                    description: "The destination URL to shorten.",
                  },
                  customSlug: {
                    type: SchemaType.STRING,
                    description: "Optional custom slug.",
                  },
                },
                required: ["url"],
              },
            },
          ],
        },
      ],
    });
  }

  async chat(messages: ChatMessage[]): Promise<ChatReply> {
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;
    const model = this.getModel();
    this.chatSession = model.startChat({ history });

    const result = await this.chatSession.sendMessage(lastMessage) as any;
    const response = result.response.toJSON() as {
      candidates: Array<{
        content: {
          parts: Array<{
            text?: string;
            functionCall?: { name: string; args: Record<string, string> };
          }>;
        };
      }>;
    };

    for (const candidate of response.candidates ?? []) {
      for (const part of candidate.content?.parts ?? []) {
        if (part.functionCall) {
          return {
            type: "function_call",
            call: {
              name: part.functionCall.name,
              args: part.functionCall.args,
            },
          };
        }
      }
    }

    return { type: "text", content: this.extractText(response) };
  }

  async submitFunctionResult(
    functionName: string,
    result: unknown,
  ): Promise<string> {
    if (!this.chatSession) throw new Error("No active chat session");

    const secondResult = await this.chatSession.sendMessage([
      { functionResponse: { name: functionName, response: result as object } },
    ]) as any;

    const response = secondResult.response.toJSON() as {
      candidates: Array<{ content: { parts: Array<{ text?: string }> } }>;
    };

    return this.extractText(response);
  }

  private extractText(response: {
    candidates: Array<{ content: { parts: Array<{ text?: string }> } }>;
  }): string {
    for (const candidate of response.candidates ?? []) {
      for (const part of candidate.content?.parts ?? []) {
        if (part.text?.trim()) return part.text.trim();
      }
    }
    return "I could not generate a response.";
  }
}
