# Agent Instructions for Link Shortener Project

This document provides comprehensive instructions for Large Language Models (LLMs) working on this Next.js link shortener project. These guidelines ensure consistency, best practices, and adherence to the project's coding standards.

## ⚠️ Critical: Next.js 16 Breaking Changes

This project uses Next.js 16, which has significant breaking changes from previous versions. **DO NOT** assume knowledge from older Next.js versions.

**MANDATORY ACTION**: Before writing any Next.js code, read the relevant sections in `node_modules/next/dist/docs/`. Heed all deprecation notices and breaking change warnings.

## Project Overview

This is a modern link shortener built with:
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Database**: Drizzle ORM with Neon PostgreSQL
- **Authentication**: Clerk
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **UI Library**: @base-ui/react primitives

## Core Principles

1. **Type Safety First**: All code must be fully typed with TypeScript
2. **Server Components Default**: Prefer server components over client components
3. **Performance Optimized**: Leverage Next.js 16 performance features
4. **Accessible**: Ensure all components meet accessibility standards
5. **Consistent**: Follow established patterns throughout the codebase

## Instruction Files

Detailed instructions are organized in separate files in the `/docs` directory.
ALWAYS refer to the relevant .md file BEFORE generating any code.

⚠️ **MANDATORY**: When implementing authentication, ALWAYS read `docs/clerk-authentication-standards.md` first. Clerk is the ONLY authentication solution for this project.

⚠️ **MANDATORY**: When implementing UI components, ALWAYS read `docs/shadcn-ui-standards.md` first. shadcn/ui is the ONLY UI component library for this project. NO custom components.

## Before Starting Work

1. **Read the Docs**: Review all relevant instruction files for your task
2. **Check Next.js Docs**: Consult `node_modules/next/dist/docs/` for API changes
3. **Examine Codebase**: Look at existing code for patterns to follow
4. **Run Checks**: Execute `npm run lint` and tests before committing

## Use Cases & Workflows

Understanding the key workflows is essential for implementing features correctly. This section outlines the main use cases for the link shortener application.

### 1. User Authentication Workflow

**Actors**: New user, returning user, system

**Workflows:**

- **User Registration**
  - User fills registration form (email, password, name)
  - System validates input (email format, password strength)
  - Clerk creates user account
  - User is logged in automatically
  - User redirected to dashboard

- **User Login**
  - User enters email and password
  - Clerk authenticates credentials
  - Session is created
  - User redirected to dashboard

- **User Logout**
  - User clicks logout button
  - Session is cleared
  - User redirected to home page

- **Profile Management**
  - User views/edits profile information
  - User can change name, profile picture
  - User can change password
  - User can manage connected apps/integrations

**Related Files**: `app/layout.tsx`, `app/api/auth/*`, `docs/authentication-patterns.md`, `docs/clerk-authentication-standards.md` ⚠️ **MANDATORY**

### 2. Link Creation & Management Workflow

**Actors**: Authenticated user, system

**Workflows:**

- **Create Short Link**
  - User provides original URL
  - (Optional) User provides custom short code
  - User optionally sets expiration date
  - User optionally adds description/tags
  - System validates URL format
  - System generates unique short code (if not provided)
  - System stores link in database
  - System displays short link with copy button
  - User can share or copy the link

- **View All Links**
  - User navigates to "My Links" page
  - System fetches all user's links from database
  - Display links in table/card format
  - Show original URL, short code, creation date, click count
  - Pagination for large link counts

- **Edit Link**
  - User selects link to edit
  - User can update:
    - Description/title
    - Expiration date
    - Custom short code
  - System validates changes
  - System updates database
  - Confirmation message displayed

- **Delete Link**
  - User selects link to delete
  - Confirmation dialog appears
  - User confirms deletion
  - System deletes link and associated analytics
  - List is refreshed

- **Copy to Clipboard**
  - User clicks copy button
  - Short link URL is copied to clipboard
  - Visual feedback (toast notification)
  - Provides social share options

**Related Files**: `db/schema.ts`, `db/database-guidelines.md`, `docs/component-patterns.md`, `docs/shadcn-ui-standards.md`

### 3. Link Analytics & Statistics Workflow

**Actors**: Authenticated user, system

**Workflows:**

- **View Link Statistics**
  - User clicks on link from list
  - Dashboard displays:
    - Total click count
    - Click timeline (chart/graph)
    - Geographic distribution of clicks
    - Referrer sources
    - Device types (mobile/desktop/tablet)
    - Browser information
    - Operating system distribution
  - Data is real-time or near real-time

- **Export Analytics**
  - User requests export
  - System generates CSV or PDF report
  - Download is provided to user

- **Filter/Sort Analytics**
  - User can filter by date range
  - User can sort by different metrics
  - Data is updated dynamically

**Related Files**: `app/api/analytics/*`, `db/schema.ts`

### 4. Public Short Link Access Workflow

**Actors**: Anonymous user, system, analytics system

**Workflows:**

- **Access Short Link**
  - User (or bot) accesses short URL (e.g., `example.com/abc123`)
  - System retrieves short code from URL
  - System looks up link in database
  - System checks if link is expired
  - System increments click counter
  - System logs analytics data:
    - Timestamp
    - Referrer
    - User agent (device, browser)
    - IP address (for geo-location)
  - System redirects to original URL with HTTP 301/302

- **Invalid/Expired Link Access**
  - User accesses non-existent or expired link
  - System displays friendly error page
  - Suggests browsing other content or going home

- **Link Deactivation**
  - User deactivates link (soft delete)
  - Link is no longer redirected
  - Shows "link is no longer available" message

**Related Files**: `app/api/[shortCode]/route.ts`, `db/schema.ts`

### 5. Dashboard & Overview Workflow

**Actors**: Authenticated user, system

**Workflows:**

- **View Dashboard**
  - User lands on dashboard after login
  - System displays:
    - Quick summary stats (total links, total clicks)
    - Recent links created
    - Top performing links
    - Quick action buttons (new link, export data)

- **Search Links**
  - User enters search term
  - System searches through short codes and descriptions
  - Results update in real-time

- **Filter Links**
  - Filter by date range
  - Filter by custom tags
  - Filter by status (active/expired/paused)

**Related Files**: `app/dashboard/*`, `components/dashboard/*`

### 6. Admin/System Workflow (Future)

**Actors**: Admin user, system

**Workflows:**

- **System Statistics**
  - View total users
  - View total links created
  - View total clicks
  - Server health and performance metrics

- **User Management**
  - View all users
  - Suspend/deactivate user accounts
  - View user activity

- **Link Management**
  - View all system links
  - Remove inappropriate links
  - Force expire links

**Related Files**: `app/admin/*`

### 7. Email & Notification Workflow

**Actors**: User, system, email service

**Workflows:**

- **Registration Confirmation Email**
  - User receives welcome email
  - Email contains verification link
  - Email contains getting started guide

- **Link Activity Notifications** (Future)
  - User receives email when link reaches milestone (e.g., 1000 clicks)
  - Daily/weekly summary of link performance
  - Alerts for suspicious activity

**Related Files**: `lib/email.ts`, `app/api/email/*`

## Key Implementation Areas by Workflow

| Use Case | Technology | Key Files | Considerations |
|----------|------------|-----------|-----------------|
| Authentication | Clerk | `app/layout.tsx`, `middleware.ts` | Protected routes, session management |
| Link CRUD | Next.js API, Drizzle | `app/api/links/*`, `db/schema.ts` | Input validation, unique constraints |
| Short Code Resolution | Next.js Dynamic Routes | `app/[shortCode]/page.tsx` | Redirect status codes, performance |
| Analytics | Drizzle, Database | `db/schema.ts`, `app/api/analytics/*` | Data accuracy, performance at scale |
| UI Components | React, Tailwind, shadcn/ui | `components/*` | Accessibility, responsiveness |

## Development Workflow

### 1. Understanding the Task
- Read the user request carefully
- Identify which instruction files are relevant
- Check existing similar implementations

### 2. Planning
- Break down the task into smaller components
- Identify required files and changes
- Consider database schema changes if needed

### 3. Implementation
- Follow the patterns from instruction files
- Use TypeScript strictly
- Implement server components when possible
- Ensure accessibility and performance

### 4. Testing and Validation
- Run `npm run lint` to check code quality
- Test functionality manually
- Ensure type safety
- Check responsive design

### 5. Documentation
- Update any relevant documentation
- Add JSDoc comments for complex functions
- Ensure code is self-documenting

## Key Technologies

### Next.js 16 Features to Use
- App Router with layouts and loading states
- Server Components for data fetching
- Streaming and Suspense for performance
- Image optimization with `next/image`
- Font optimization

### Database Operations
- Use Drizzle ORM for type-safe queries
- Leverage Neon for serverless PostgreSQL
- Implement proper error handling
- Use transactions for related operations

### Authentication
- Clerk for user management
- Server-side auth checks
- Protected API routes
- User session management

### Styling
- Tailwind CSS v4 for utility classes
- shadcn/ui for component consistency
- CSS variables for theming
- Dark mode support

## Code Quality Standards

### TypeScript
- Strict mode enabled - no `any` types
- Proper interface definitions
- Generic constraints where appropriate
- Type guards for runtime checks

### Performance
- Server components by default
- Optimized images and fonts
- Minimal client-side JavaScript
- Efficient database queries

### Security
- Input validation on all user inputs
- Proper authentication checks
- HTTPS for all external requests
- Secure environment variable handling

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility

## Error Handling

### API Routes
```typescript
try {
  // Operation
  return NextResponse.json({ success: true });
} catch (error) {
  console.error("Operation failed:", error);
  return NextResponse.json(
    { error: "Operation failed" },
    { status: 500 }
  );
}
```

### Client Components
```typescript
const [error, setError] = useState<string | null>(null);

try {
  // Operation
} catch (err) {
  setError(err instanceof Error ? err.message : "Unknown error");
}
```

## File Structure Reminder

```
app/                    # Next.js App Router
├── globals.css        # Global styles
├── layout.tsx         # Root layout
├── page.tsx           # Home page
├── api/               # API routes
└── (features)/        # Route groups

components/            # Reusable components
├── ui/               # shadcn/ui components
└── (features)/       # Feature components

db/                   # Database
├── index.ts          # Drizzle instance
└── schema.ts         # Database schema

lib/                  # Utilities
└── utils.ts          # Common utilities

docs/                 # These instructions
```

## Questions and Clarification

If anything is unclear:
1. Check the relevant instruction files in `/docs`
2. Look at existing code implementations
3. Consult Next.js documentation
4. Ask for clarification if needed

## Final Notes

- **Next.js 16 First**: Always verify current APIs in the documentation
- **Type Safety**: Never compromise on TypeScript strictness
- **Consistency**: Follow established patterns
- **Quality**: Code must pass linting and be well-tested
- **Documentation**: Keep these instructions updated as the project evolves

Remember: This is a professional codebase. Every change should improve maintainability, performance, and user experience.
