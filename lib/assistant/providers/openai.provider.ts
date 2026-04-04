import {
  ASSISTANT_INSTRUCTIONS,
  CREATE_LINK_TOOL,
  DEFAULT_OPENAI_MODEL,
} from "../constants";
import type { IAiProvider, ChatReply } from "../provider.interface";
import type { ChatMessage } from "../types";

interface OpenAIOutput {
  id: string;
  output: Array<
    | { type: "message"; role: "assistant"; content: Array<{ type: "output_text"; text: string }> }
    | { type: "function_call"; name: string; call_id: string; arguments: string }>;
  error?: { message?: string };
}

export class OpenAiProvider implements IAiProvider {
  private readonly model: string;
  private lastResponseId: string | null = null;

  constructor(model = process.env.OPENAI_LINK_ASSISTANT_MODEL || DEFAULT_OPENAI_MODEL) {
    this.model = model;
  }

  private async call(body: Record<string, unknown>): Promise<OpenAIOutput> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const payload = (await response.json()) as OpenAIOutput;
    if (!response.ok) {
      throw new Error(payload.error?.message || "OpenAI Responses API error");
    }

    this.lastResponseId = payload.id;
    return payload;
  }

  async chat(messages: ChatMessage[]): Promise<ChatReply> {
    const input = messages.map((m) => ({
      role: m.role,
      content: [
        {
          type: m.role === "assistant" ? "output_text" : "input_text",
          text: m.content,
        },
      ],
    }));

    const response = await this.call({
      model: this.model,
      instructions: ASSISTANT_INSTRUCTIONS,
      input,
      tools: [{ type: "function", ...CREATE_LINK_TOOL }],
      tool_choice: "auto",
      temperature: 0.2,
      max_output_tokens: 300,
    });

    const functionCall = response.output.find((o) => o.type === "function_call");
    if (functionCall && functionCall.type === "function_call") {
      return {
        type: "function_call",
        call: {
          name: functionCall.name,
          args: JSON.parse(functionCall.arguments),
        },
      };
    }

    return { type: "text", content: this.extractText(response) };
  }

  async submitFunctionResult(functionName: string, result: unknown): Promise<string> {
    if (!this.lastResponseId) throw new Error("No previous response to continue");

    const response = await this.call({
      model: this.model,
      instructions: ASSISTANT_INSTRUCTIONS,
      previous_response_id: this.lastResponseId,
      input: [
        {
          type: "function_call_output",
          call_id: functionName,
          output: JSON.stringify(result),
        },
      ],
      temperature: 0.2,
      max_output_tokens: 300,
    });

    return this.extractText(response);
  }

  private extractText(response: OpenAIOutput): string {
    const message = response.output.find((o) => o.type === "message");
    if (message?.type !== "message") return "I could not generate a response.";

    return (
      message.content
        .filter((c) => c.type === "output_text")
        .map((c) => c.text)
        .join("")
        .trim() || "I could not generate a response."
    );
  }
}