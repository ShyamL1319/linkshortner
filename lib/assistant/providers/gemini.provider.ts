import {
  GoogleGenerativeAI,
  SchemaType,
  type ChatSession,
  type GenerateContentResult,
  type Content,
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

    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({
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
    const firstUserIndex = messages.findIndex(m => m.role === 'user');
    
    // 2. If no user message exists or it's the last message, start with empty history
    // Otherwise, slice from the first user message up to the last one (exclusive)
    const historyMessages = firstUserIndex !== -1 && firstUserIndex < messages.length - 1
        ? messages.slice(firstUserIndex, -1)
        : [];

    const history = historyMessages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;
    const model = this.getModel();
  
  // Now history is guaranteed to either be empty or start with a 'user' role
    this.chatSession = model.startChat({ history });

    const result: GenerateContentResult =
      await this.chatSession.sendMessage(lastMessage);
    const response = result.response;

    // Check for function calls in the first candidate
    const functionCall = response.candidates?.[0]?.content?.parts?.find(
      (part) => !!part.functionCall,
    )?.functionCall;

    if (functionCall) {
      return {
        type: "function_call",
        call: {
          name: functionCall.name,
          args: functionCall.args as Record<string, string>,
        },
      };
    }

    return {
      type: "text",
      content: response.text() || "I could not generate a response.",
    };
  }

  async submitFunctionResult(
    functionName: string,
    result: unknown,
  ): Promise<string> {
    if (!this.chatSession) throw new Error("No active chat session");

    // Use unknown first, then cast to object for the SDK requirement
    const functionResponse = {
      functionResponse: {
        name: functionName,
        response: (result as object) || {},
      },
    };

    const secondResult: GenerateContentResult =
      await this.chatSession.sendMessage([functionResponse]);

    return secondResult.response.text() || "I could not generate a response.";
  }
}
