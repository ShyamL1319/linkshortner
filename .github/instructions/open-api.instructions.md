---
description: Read this before implementing the OpenAI-powered chat assistant for creating short links from natural language.
---

# OpenAI Link Assistant Instructions

## Goal

Build a step-by-step, natural-language chat experience that creates short URLs for authenticated users.

## Stepwise Implementation

1. Confirm the assistant scope is create-only by default.
2. Reuse the existing `createLink` server action instead of creating a new write path.
3. Add a server-side OpenAI route that handles chat input and tool calling.
4. Keep the assistant instructions strict: extract `url` and optional `customSlug`, ask for missing details, and never guess.
5. Add the UI entry point in the app shell or dashboard depending on the task.
6. Return clear success and error messages that match the current product tone.
7. Validate auth, ownership, slug rules, and error handling before shipping.

## API Rules

- Use the OpenAI Responses API for agentic chat behavior.
- Keep the API key on the server only.
- Expose only the tool needed to create links.
- Return structured results so the UI can show a short code or a follow-up question.

## Prompt Rules

- Speak in plain human language.
- Be concise and direct.
- Ask follow-up questions when the URL or slug is missing.
- Do not invent URLs, slugs, or link settings.
- Do not perform updates or deletes unless the scope changes later.

## Verification

- Confirm authenticated users can create links through chat.
- Confirm unauthenticated users are blocked.
- Confirm invalid or duplicate slugs surface readable errors.
- Confirm the existing dashboard create flow still works.
