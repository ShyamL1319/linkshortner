// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { z } from "zod";
// import { createLink } from "@/data/links";
// import {
//   buildShortUrl,
//   DEFAULT_LINK_ASSISTANT_MODEL_OPENAI,
//   getAssistantReply,
//   getFunctionCall,
//   LINK_ASSISTANT_INSTRUCTIONS,
//   normalizeAssistantUrl,
//   type LinkAssistantRequest,
//   type LinkAssistantResponse,
//   type OpenAIResponse,
// } from "@/lib/open-api/link-assistant";
// import {
//   GoogleGenerativeAI,
//   type FunctionDeclaration,
//   type Tool,
//   SchemaType,
// } from "@google/generative-ai";

// const chatMessageSchema = z.object({
//   role: z.enum(["user", "assistant"]),
//   content: z.string().min(1),
// });

// const chatRequestSchema = z.object({
//   messages: z.array(chatMessageSchema).min(1),
// });

// const createLinkArgumentsSchema = z.object({
//   url: z.string().min(1),
//   customSlug: z.string().min(1).optional(),
// });

// function getOpenAIModel(): string {
//   return (
//     process.env.OPENAI_LINK_ASSISTANT_MODEL ||
//     DEFAULT_LINK_ASSISTANT_MODEL_OPENAI
//   );
// }

// async function callOpenAIResponses(
//   body: Record<string, unknown>,
// ): Promise<OpenAIResponse> {
//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) {
//     throw new Error("OPENAI_API_KEY is not configured");
//   }

//   console.log("Calling OpenAI API with body:", JSON.stringify(body, null, 2));

//   const response = await fetch("https://api.openai.com/v1/responses", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${apiKey}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });

//   // ✅ FIX 1: Read body ONCE, then log — never call response.json() twice
//   const payload = (await response.json()) as OpenAIResponse & {
//     error?: { message?: string };
//   };

//   console.log("OpenAI API response status:", response.status);
//   console.log("OpenAI API response body:", JSON.stringify(payload, null, 2));

//   if (!response.ok) {
//     throw new Error(
//       payload.error?.message || "Failed to contact the OpenAI Responses API",
//     );
//   }

//   return payload;
// }

// async function createLinkFromAssistantCall(
//   userId: string,
//   origin: string,
//   callArguments: string,
// ) {
//   try {
//     const parsedArguments = createLinkArgumentsSchema.parse(
//       JSON.parse(callArguments),
//     );
//     const normalizedUrl = normalizeAssistantUrl(parsedArguments.url);
//     const customSlug = parsedArguments.customSlug?.trim() || undefined;

//     const link = await createLink(userId, normalizedUrl, customSlug);

//     return {
//       success: true as const,
//       shortCode: link.shortCode,
//       shortUrl: buildShortUrl(origin, link.shortCode),
//       originalUrl: link.originalUrl,
//     };
//   } catch (error) {

//     const message =
//       error instanceof Error && error.message.toLowerCase().includes("unique")
//         ? "That custom slug is already taken. Try another one."
//         : "I could not create that link. Please check the URL and slug.";

//     return {
//       success: false as const,
//       error: message,
//     };
//   }
// }

// export async function POST(request: Request) {
//   const { userId } = await auth();
//   if (!userId) {
//     return NextResponse.json(
//       { error: "Sign in to create links with the assistant." },
//       { status: 401 },
//     );
//   }

//   const parsedBody = chatRequestSchema.safeParse(
//     (await request.json()) as LinkAssistantRequest,
//   );
//   if (!parsedBody.success) {
//     return NextResponse.json(
//       { error: "Invalid chat payload." },
//       { status: 400 },
//     );
//   }

//   const origin = new URL(request.url).origin;
//   const model = getOpenAIModel();

//   // ✅ FIX 2: Use correct content type per role
//   // - user messages     → input_text
//   // - assistant messages → output_text  (input_text causes 400 error)
//   const input = parsedBody.data.messages.map((message) => ({
//     role: message.role,
//     content: [
//       {
//         type: message.role === "assistant" ? "output_text" : "input_text",
//         text: message.content,
//       },
//     ],
//   }));

//   try {
//     const firstResponse = await callOpenAIResponses({
//       model,
//       instructions: LINK_ASSISTANT_INSTRUCTIONS,
//       input,
//       tools: [
//         {
//           type: "function",
//           name: "create_short_link",
//           description:
//             "Create one short link for the authenticated user using a destination URL and optional custom slug.",
//           parameters: {
//             type: "object",
//             additionalProperties: false,
//             properties: {
//               url: {
//                 type: "string",
//                 description: "The destination URL to shorten.",
//               },
//               customSlug: {
//                 type: "string",
//                 description: "Optional custom slug for the short link.",
//               },
//             },
//             required: ["url"],
//           },
//         },
//       ],
//       tool_choice: "auto",
//       temperature: 0.2,
//       max_output_tokens: 300,
//     });

//     const functionCall = getFunctionCall(firstResponse);
//     if (!functionCall) {
//       return NextResponse.json<LinkAssistantResponse>({
//         reply: getAssistantReply(firstResponse),
//       });
//     }

//     const createdLink = await createLinkFromAssistantCall(
//       userId,
//       origin,
//       functionCall.arguments,
//     );

//     const secondResponse = await callOpenAIResponses({
//       model,
//       instructions: LINK_ASSISTANT_INSTRUCTIONS,
//       previous_response_id: firstResponse.id,
//       input: [
//         {
//           type: "function_call_output",
//           call_id: functionCall.call_id,
//           output: JSON.stringify(createdLink),
//         },
//       ],
//       temperature: 0.2,
//       max_output_tokens: 300,
//     });

//     if (!createdLink.success) {
//       return NextResponse.json<LinkAssistantResponse>({
//         reply: getAssistantReply(secondResponse),
//       });
//     }

//     return NextResponse.json<LinkAssistantResponse>({
//       reply: getAssistantReply(secondResponse),
//       createdLink: {
//         shortCode: createdLink.shortCode,
//         shortUrl: createdLink.shortUrl,
//       },
//     });
//   } catch (error) {
//     console.error("OpenAI link assistant error:", error);

//     const message =
//       error instanceof Error
//         ? error.message
//         : "Something went wrong while creating the link.";

//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }
import { OpenAiProvider } from "@/lib/assistant/providers/openai.provider";
import { createAssistantHandler } from "@/app/api/chat/route";

export const POST = (req: Request) =>
  createAssistantHandler(req, new OpenAiProvider());