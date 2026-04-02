# Clerk Authentication Standards

## Overview

This project uses **Clerk** as the exclusive authentication solution. No other authentication methods, libraries, or approaches should be implemented.

## Required Rules

### 1. Clerk-Only Implementation

- **Requirement**: All authentication functionality must use Clerk exclusively
- **Restriction**: Do NOT implement alternative auth solutions (custom auth, other services, middleware auth)
- **Scope**: All users, sessions, and authentication state must flow through Clerk
- **Related Docs**: See [authentication-patterns.md](./authentication-patterns.md) for Clerk integration patterns

### 2. Protected Routes

#### Dashboard Route Protection
- **Path**: `/dashboard` is a protected route
- **Requirement**: Users must be logged in to access any page under `/dashboard`
- **Implementation**: Use Clerk's `auth()` or `useAuth()` to verify user session
- **Unauthenticated Behavior**: Redirect to sign-in modal or home page

#### Protecting Other Routes
- Any route that requires user authentication must verify session using Clerk utilities
- Use middleware or component-level auth checks consistently across the application
- Document protected routes clearly in the route handler or page component

### 3. Authentication Modal Behavior

#### Sign In & Sign Up Components
- **Requirement**: Sign in and sign up must ALWAYS use modal mode
- **Configuration**: Use `mode="modal"` when implementing Clerk components
- **Scope**: Applies to all sign-in and sign-up UI in the application

#### Modal Implementation Examples
```typescript
// Sign In Modal
import { SignInButton } from "@clerk/nextjs";

export function SignInModal() {
  return (
    <SignInButton mode="modal">
      <button>Sign In</button>
    </SignInButton>
  );
}

// Sign Up Modal
import { SignUpButton } from "@clerk/nextjs";

export function SignUpModal() {
  return (
    <SignUpButton mode="modal">
      <button>Sign Up</button>
    </SignUpButton>
  );
}
```

## Implementation Checklist

- [ ] All Clerk environment variables are configured in `.env.local`
- [ ] ClerkProvider wraps the application in the root layout
- [ ] `/dashboard` route enforces authentication checks
- [ ] All sign-in/sign-up components use `mode="modal"`
- [ ] Protected API routes check for authenticated session
- [ ] No alternative authentication solutions are present in the codebase
- [ ] Clerk utilities are imported from `@clerk/nextjs`

## Common Patterns

### Protecting a Page Component
```typescript
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/"); // Redirect to home or sign-in page
  }

  return (
    <div>
      {/* Dashboard content */}
    </div>
  );
}
```

### Protecting an API Route
```typescript
// app/api/protected-route/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Protected operation
  return NextResponse.json({ success: true });
}
```

## References

- [Clerk Documentation](https://clerk.com/docs)
- [authentication-patterns.md](./authentication-patterns.md) - Clerk integration patterns
- [AGENTS.md](../AGENTS.md) - General project guidelines

## Summary

- ✅ Use Clerk exclusively for all authentication
- ✅ Protect `/dashboard` and other user-specific routes
- ✅ Always use modal mode for sign-in/sign-up components
- ✅ Verify authentication in pages and API routes
- ❌ Never use alternative auth methods
- ❌ Never implement custom authentication
