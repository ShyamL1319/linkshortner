"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getShortLink } from "@/lib/short-link";
import { cn } from "@/lib/utils";

interface ShortLinkActionsProps {
  shortCode: string;
  className?: string;
}

export function ShortLinkActions({
  shortCode,
  className,
}: ShortLinkActionsProps) {
  const shortLink = getShortLink(shortCode);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shortLink);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shortLink;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setStatus("Copied to clipboard");

      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }

      resetTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        setStatus("");
        resetTimerRef.current = null;
      }, 1800);
    } catch {
      setCopied(false);
      setStatus("Copy failed");
    }
  };

  return (
    <div className={cn("rounded-2xl border bg-muted/25 p-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Short link
          </p>
          <a
            href={shortLink}
            target="_blank"
            rel="noreferrer"
            className="mt-1 flex items-center gap-2 break-all text-sm font-medium text-primary hover:underline"
          >
            <span>{shortLink}</span>
            <ExternalLink className="h-4 w-4 shrink-0" />
          </a>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="sm:shrink-0"
        >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
        {status || "Share this URL with anyone you want to send to the link."}
      </p>
    </div>
  );
}
