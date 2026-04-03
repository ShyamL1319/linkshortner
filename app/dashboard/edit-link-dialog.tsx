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
import { updateLink } from "./actions";
import { Pencil } from "lucide-react";
import type { Link } from "@/db/schema";
import { ShortLinkActions } from "@/components/short-link-actions";

interface EditLinkDialogProps {
  link: Pick<Link, "id" | "originalUrl" | "shortCode">;
}

export function EditLinkDialog({ link }: EditLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(link.originalUrl);
  const [customSlug, setCustomSlug] = useState(link.shortCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [updatedShortCode, setUpdatedShortCode] = useState(link.shortCode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const result = await updateLink({ linkId: link.id, url, customSlug });

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(true);
        setUpdatedShortCode(result.shortCode ?? (customSlug || link.shortCode));
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
      setUrl(link.originalUrl);
      setCustomSlug(link.shortCode);
      setError("");
      setSuccess(false);
      setUpdatedShortCode(link.shortCode);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] rounded-3xl border bg-background/95 shadow-2xl backdrop-blur">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update the URL or custom slug for this shortened link.
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
              <Label htmlFor="customSlug">Custom Slug</Label>
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
                Letters, numbers, hyphens, and underscores only
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
                  Link updated successfully!
                </div>
                <ShortLinkActions shortCode={updatedShortCode} />
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
                {loading ? "Updating..." : "Update Link"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
