"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLink } from "./actions";
import { Plus } from "lucide-react";
import { ShortLinkActions } from "@/components/short-link-actions";

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [createdShortCode, setCreatedShortCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const result = await createLink({ url, customSlug });

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(true);
        setCreatedShortCode(result.shortCode ?? "");
        // Reset form
        setUrl("");
        setCustomSlug("");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form state when closing
      setUrl("");
      setCustomSlug("");
      setError("");
      setSuccess(false);
      setCreatedShortCode("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] rounded-3xl border bg-background/95 shadow-2xl backdrop-blur">
        <DialogHeader>
          <DialogTitle>Create Shortened Link</DialogTitle>
          <DialogDescription>
            Enter a URL to shorten. You can optionally provide a custom slug.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customSlug">
                Custom Slug{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="customSlug"
                type="text"
                placeholder="my-custom-link"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                disabled={loading}
                pattern="[a-zA-Z0-9_\\-]*"
                minLength={3}
                maxLength={20}
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to auto-generate a short code
              </p>
            </div>
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="grid gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4 text-emerald-950 shadow-sm">
                <div className="text-sm font-medium">
                  Link created successfully!
                </div>
                {createdShortCode && (
                  <ShortLinkActions shortCode={createdShortCode} />
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {success ? "Close" : "Cancel"}
            </Button>
            {!success && (
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Link"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
