import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/assistant/types";
import { executeLinkCreation } from "@/lib/assistant/link-service";
import { GeminiProvider, } from "@/lib/assistant/providers/gemini.provider"; // Use your specific provider
import { OpenAiProvider } from "@/lib/assistant/providers/openai.provider"; // Use your specific provider
import type { AssistantResponse } from "@/lib/assistant/types";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to create links with the assistant." },
      { status: 401 },
    );
  }

  const json = await request.json();
  const parsedBody = chatRequestSchema.safeParse(json);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid chat payload." },
      { status: 400 },
    );
  }

  const origin = new URL(request.url).origin;
  // Initialize the provider (Gemini or OpenAI) here
    // Differentiate here
    const providerType = parsedBody.data?.provider || "gemini"; // Default to Gemini if not specified
  const provider =
    providerType === "openai" ? new OpenAiProvider() : new GeminiProvider();

  try {
    const reply = await provider.chat(parsedBody.data.messages);

    if (reply.type === "text") {
      return NextResponse.json<AssistantResponse>({ reply: reply.content });
    }

    // Execute the function call (Link Creation)
    const linkResult = await executeLinkCreation(userId, origin, reply.call);

    // Send the tool result back to the AI for a natural language confirmation
    const finalReply = await provider.submitFunctionResult(
      reply.call.name,
      linkResult,
    );

    if (!linkResult.success) {
      return NextResponse.json<AssistantResponse>({ reply: finalReply });
    }

    return NextResponse.json<AssistantResponse>({
      reply: finalReply,
      createdLink: {
        shortCode: linkResult.shortCode,
        shortUrl: linkResult.shortUrl,
      },
    });
  } catch (error) {
    console.error("Assistant error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
