# Upgrade Flow Reference

Use this file to keep durable learnings from dependency and framework upgrades.
Keep it short and practical. Add new notes only when they change future behavior or decisions.

## Standard Sequence

1. Identify the exact dependency and version change.
2. Read the repo instructions and the relevant release notes.
3. Inspect the files that sit in the upgrade blast radius.
4. Apply the smallest compatibility fix.
5. Validate with lint, tests, and any build or smoke checks that matter.
6. Perform a security pass for auth, data access, secrets, and public routes.
7. Record the durable lesson and any follow-up work.

## Recurring Checks

- Next.js: routing, metadata, runtime boundaries, and build output.
- Clerk: auth helpers, protected routes, server actions, and ownership checks.
- Drizzle and Neon: schema shape, query helpers, and migration impact.
- Tailwind and UI: class names, tokens, shared wrappers, and visual regressions.

## Learning Log

Add a short entry after each completed upgrade:

- Library:
- Version change:
- Files changed:
- Validation run:
- Risk addressed:
- Follow-up:
