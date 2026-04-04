import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/assistant/types";
import { executeLinkCreation } from "@/lib/assistant/link-service";
import type { IAiProvider } from "@/lib/assistant/provider.interface";
import type { AssistantResponse } from "@/lib/assistant/types";

export async function createAssistantHandler(
  request: Request,
  provider: IAiProvider,
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to create links with the assistant." },
      { status: 401 },
    );
  }

  const parsedBody = chatRequestSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid chat payload." },
      { status: 400 },
    );
  }

  const origin = new URL(request.url).origin;

  try {
    const reply = await provider.chat(parsedBody.data.messages);

    if (reply.type === "text") {
      return NextResponse.json<AssistantResponse>({ reply: reply.content });
    }

    // Execute the function call
    const linkResult = await executeLinkCreation(userId, origin, reply.call);

    // Send result back to provider for a natural confirmation
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
      error instanceof Error
        ? error.message
        : "Something went wrong while creating the link.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
