'use client';

import React, { useState, useRef } from 'react';
import { Copy, Check, Mail, MessageCircle, Share2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

interface ShareModalProps {
  url: string;
  title: string;
}

export function ShareModal({ url, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isSharing = useRef(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleNativeShare = async () => {
    if (isSharing.current) return;

    if (typeof navigator !== 'undefined' && navigator.share) {
      isSharing.current = true;
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError' && error.name !== 'InvalidStateError') {
          console.error('Error sharing natively:', error);
        }
      } finally {
        isSharing.current = false;
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleInstagramShare = async () => {
    // Instagram doesn't support web share intents for links.
    await handleCopy();
    window.open('https://instagram.com', '_blank', 'noopener,noreferrer');
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  };

  const openLink = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          handleNativeShare();
        }}
        aria-label="Share Link"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline-block ml-2">Share</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm rounded-xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-900">
            Share this link
          </DialogTitle>
          <DialogDescription className="sr-only">
            Share your shortened link via WhatsApp, X (Twitter), Facebook, or Email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between mb-6 mt-2">
          <button onClick={() => openLink(shareLinks.whatsapp)} className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors" aria-label="Share on WhatsApp"><MessageCircle className="h-5 w-5" /></button>
          <button onClick={() => openLink(shareLinks.twitter)} className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-500 hover:bg-sky-200 transition-colors" aria-label="Share on X"><TwitterIcon className="h-5 w-5" /></button>
          <button onClick={() => openLink(shareLinks.facebook)} className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors" aria-label="Share on Facebook"><FacebookIcon className="h-5 w-5" /></button>
          <button onClick={handleInstagramShare} className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors" aria-label="Share on Instagram"><InstagramIcon className="h-5 w-5" /></button>
          <button onClick={() => openLink(shareLinks.email)} className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors" aria-label="Share via Email"><Mail className="h-5 w-5" /></button>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-1.5">
          <input type="text" readOnly value={url} className="flex-1 bg-transparent px-2 text-sm text-zinc-600 outline-none" aria-label="Shortened URL" />
          <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 shadow-sm border border-zinc-200 hover:bg-zinc-50 transition-colors" aria-label="Copy to clipboard">
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        </DialogContent>
      </Dialog>
    </>
  );
}