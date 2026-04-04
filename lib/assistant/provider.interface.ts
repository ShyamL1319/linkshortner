import type { ChatMessage, AssistantFunctionCall } from "./types";

export interface IAiProvider {
  /**
   * Send conversation history and get back either a text reply
   * or a function call the provider wants to make.
   */
  chat(messages: ChatMessage[]): Promise<ChatReply>;

  /**
   * After the function has been executed, send the result back
   * and get the final natural-language reply.
   */
  submitFunctionResult(functionName: string, result: unknown): Promise<string>;
}

export type ChatReply =
  | { type: "text"; content: string }
  | { type: "function_call"; call: AssistantFunctionCall };