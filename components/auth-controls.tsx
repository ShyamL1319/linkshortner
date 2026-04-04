"use client";

import { useEffect, useState } from "react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export function AuthControls() {
  const { isLoaded, isSignedIn } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!isMounted || !isLoaded) {
    return null;
  }

  return (
    <>
      {!isSignedIn ? (
        <div className="flex items-center gap-2">
          <SignInButton mode="modal">
            <button className="inline-flex items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors border-border/70 bg-card/75 text-muted-foreground hover:border-primary/20 hover:bg-primary/10 hover:text-foreground">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="inline-flex items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors border-primary/20 bg-primary/12 text-foreground shadow-sm shadow-primary/10">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      ) : (
        <UserButton />
      )}
    </>
  );
}
