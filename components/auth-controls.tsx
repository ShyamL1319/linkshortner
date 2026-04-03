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
        <>
        <SignInButton mode="modal">Sign In</SignInButton>
        <SignUpButton mode="modal">Sign Up</SignUpButton>
        </>
      ) : (
        <UserButton />
      )}
    </>
  );
}
