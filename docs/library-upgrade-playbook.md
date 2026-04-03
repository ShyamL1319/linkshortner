# Library Upgrade Playbook

This project changes quickly as dependencies move. Use this playbook when updating or reviewing library changes so upgrades stay safe, consistent, and easy to verify.

## Goals

- Keep the app working with the latest compatible library versions.
- Avoid regressions in auth, data access, UI behavior, and build tooling.
- Prefer small, reviewable upgrades over broad, risky rewrites.

## Upgrade Workflow

1. Identify the library change and read the upstream release notes or migration guide.
2. Classify the impact:
   - `patch` or `minor` with no breaking changes
   - `major` or API shape changes
   - tooling-only updates such as ESLint, TypeScript, Tailwind, Next.js, Drizzle, Clerk, or Neon
3. Inspect the affected files in this repo before editing.
4. Update code in the smallest possible scope.
5. Run targeted validation first, then broader checks.
6. Document any follow-up work, especially when a change is intentionally deferred.

## Review Checklist

- Update imports, types, and config files for the new API.
- Check for deprecated patterns and replace them with the current recommended approach.
- Verify server actions, auth flows, database helpers, and route handlers still compile.
- Re-run lint, unit tests, and the relevant integration or smoke tests.
- Perform a security check for auth, data access, secrets handling, and route exposure.
- If build tooling changes, confirm the Next.js and Tailwind config still match the new version.

## Good Practices

- Prefer compatibility shims only when they are short-lived and clearly documented.
- Keep upgrade-related changes isolated from product features.
- When a library change affects project standards, update the matching instruction file in `.github/instructions/`.

## Common Risk Areas

- Next.js routing, server actions, and app-router conventions
- Clerk auth helpers and session handling
- Drizzle schema/query typing
- Neon/serverless connection behavior
- Tailwind class and config changes
- UI component APIs from Radix or shadcn-based wrappers

## Stack-Specific Checks

### Next.js

- Check `app/`, `proxy.ts`, and `next.config.ts` for route, runtime, and build changes.
- Watch for App Router conventions, server component boundaries, and metadata behavior.

### Clerk

- Verify `auth()`, `ClerkProvider`, and route protection logic still match the current SDK.
- Confirm any auth-related redirects or server actions still gate access correctly.

### Drizzle and Neon

- Review `db/schema.ts`, `db/index.ts`, `data/`, and `drizzle/` for schema or query changes.
- Validate query return shapes and migration output before shipping.

### Tailwind and UI Libraries

- Check `app/globals.css`, shared UI components in `components/ui/`, and custom wrappers.
- Verify utility class changes, component APIs, and any theme tokens that affect rendering.
