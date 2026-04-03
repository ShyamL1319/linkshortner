---
description: Read this file before updating or reviewing library and dependency changes in the project.
---

# Library Upgrade Instructions

## Scope

Use these instructions for changes involving Next.js, React, TypeScript, Tailwind, Clerk, Drizzle, Neon, shadcn, Radix, or build tooling updates.

## Project Hotspots

- `app/` for App Router pages, layouts, metadata, and route handlers
- `app/dashboard/` for server actions and client dialogs
- `data/` for Drizzle-backed helpers
- `db/` and `drizzle/` for schema and migrations
- `components/` and `components/ui/` for shared UI primitives
- `next.config.ts` and `proxy.ts` for framework/runtime behavior

## Review Steps

1. Read the relevant release notes or migration guide.
2. Inspect the files that use the affected library.
3. Check whether the new version changes runtime behavior, types, or configuration.
4. Make the smallest possible code change.
5. Run lint, unit tests, and any targeted smoke or integration tests.
6. Perform a security pass for auth, data access, secrets, and route exposure.
7. If the upgrade touches rendering or build behavior, also verify a production build.

## Code Standards

- Keep TypeScript strict and avoid `any`.
- Prefer shared helpers in `data/` for database work.
- Keep server actions in colocated `actions.ts` files.
- Preserve existing auth and routing conventions.
- Update shared docs when a library change introduces a new standard.

## Escalation Triggers

- Breaking API changes
- Security-sensitive auth or data-access updates
- Database schema or migration changes
- Build or runtime changes that affect deployment
- Dependency changes that require a coordinated codebase-wide migration
- Any upgrade that changes auth boundaries, public routes, or data exposure
