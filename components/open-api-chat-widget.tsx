"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { Bot, Sparkles, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShortLinkActions } from "@/components/short-link-actions";
import type {
  CreatedLinkSummary,
  LinkAssistantMessage,
  LinkAssistantResponse,
} from "@/lib/open-api/link-assistant";

type ChatBubble = LinkAssistantMessage & {
  createdLink?: CreatedLinkSummary;
};

const starterMessages: ChatBubble[] = [
  {
    role: "assistant",
    content:
      "Tell me the destination URL in plain language, and I’ll create a short link for you. You can also add a custom slug.",
  },
];

export function OpenApiChatWidget() {
  const { isLoaded, isSignedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatBubble[]>(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const canSubmit = useMemo(
    () => isLoaded && isSignedIn && input.trim().length > 0 && !loading,
    [isLoaded, isSignedIn, input, loading],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const resetConversation = () => {
    setMessages(starterMessages);
    setInput("");
    setError("");
    setLoading(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetConversation();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || loading || !isSignedIn) {
      return;
    }

    const nextMessages: ChatBubble[] = [
      ...messages,
      { role: "user", content: trimmedInput },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      const data = (await response.json()) as LinkAssistantResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "The assistant could not create the link.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: data.reply,
          createdLink: data.createdLink,
        },
      ]);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "The assistant could not create the link.";
      setError(message);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="icon-lg"
          className="fixed right-4 bottom-4 z-40 rounded-full shadow-[0_18px_50px_-20px_rgba(59,130,246,0.7)] sm:right-6 sm:bottom-6"
        >
          <Sparkles className="h-4 w-4" />
          <span className="sr-only">Open link assistant</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="fixed right-4 bottom-20 top-auto left-auto translate-x-0 translate-y-0 w-[calc(100vw-2rem)] max-w-[420px] gap-0 overflow-hidden rounded-[1.75rem] border-border/70 p-0 shadow-[0_28px_80px_-36px_rgba(59,130,246,0.65)] sm:right-6 sm:bottom-24 sm:w-[420px]"
      >
        <DialogHeader className="flex-row items-center justify-between border-b border-border/70 bg-[linear-gradient(135deg,rgba(99,102,241,0.14),rgba(236,72,153,0.1),rgba(34,211,238,0.08))] px-4 py-4 text-left sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base">Link Assistant</DialogTitle>
              <DialogDescription className="text-xs">
                Ask in plain English and I’ll create the short URL.
              </DialogDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenChange(false)}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close assistant</span>
          </Button>
        </DialogHeader>

        <div className="flex h-[min(70vh,560px)] flex-col bg-background/95">
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                className={[
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                ].join(" ")}
              >
                <div
                  className={[
                    "max-w-[88%] rounded-2xl border px-4 py-3 text-sm shadow-sm",
                    message.role === "user"
                      ? "border-primary/20 bg-primary text-primary-foreground"
                      : "border-border/70 bg-card/90 text-foreground",
                  ].join(" ")}
                >
                  <p className="whitespace-pre-wrap leading-6">
                    {message.content}
                  </p>
                  {message.createdLink && (
                    <div className="mt-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-3 text-emerald-950">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                        Created
                      </p>
                      <p className="mt-1 break-all text-sm">
                        {message.createdLink.shortUrl}
                      </p>
                      <div className="mt-3">
                        <ShortLinkActions
                          shortCode={message.createdLink.shortCode}
                          shortUrl={message.createdLink.shortUrl}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-border/70 bg-card/90 px-4 py-3 text-sm text-muted-foreground shadow-sm">
                  Creating your link...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border/70 bg-card/80 p-4 backdrop-blur-sm">
            {isLoaded && !isSignedIn ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Sign in to let the assistant create links for you.
                </p>
                <SignInButton mode="modal">
                  <Button className="w-full">Sign In</Button>
                </SignInButton>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubmit}>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Shorten https://example.com and call it spring-sale"
                  className="min-h-[88px] w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                  disabled={loading || !isSignedIn}
                />
                {error && (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                )}
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Keep it simple. The assistant will ask if it needs more info.
                  </p>
                  <Button type="submit" disabled={!canSubmit}>
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
