---
name: library-upgrade-flow
description: Workflow for auditing, implementing, validating, and learning from dependency or framework upgrades in this repo. Use when a library, framework, build tool, or shared UI/auth/data dependency changes and you need the smallest safe update plus a reusable lesson for future upgrades.
---

# Library Upgrade Flow

## Overview

This skill turns a one-off upgrade into a repeatable flow.
Use it to keep the change set small, preserve project conventions, and carry forward any durable lessons so the next upgrade starts with better context.

## Workflow

### 1. Scope the upgrade

- Identify the exact package, framework, or tool version change.
- Read the repo instructions first, then the affected files.
- Prefer official migration notes and primary docs when behavior may have changed.
- Separate must-fix breakages from optional cleanup.

### 2. Map the blast radius

- Check the repo hotspots that are most likely to shift:
  - `app/`, `next.config.ts`, `proxy.ts`
  - auth-aware pages, server actions, and route protection
  - `db/`, `data/`, and `drizzle/`
  - `app/globals.css`, `components/ui/`, and shared UI wrappers
- Verify whether types, runtime behavior, config, or generated code changed.
- Treat auth boundaries, data access, secrets, and public routes as high risk.

### 3. Make the smallest safe change

- Keep edits focused on compatibility.
- Avoid unrelated refactors.
- Preserve existing conventions and server/client boundaries.
- If the upgrade needs a follow-up migration or manual step, record it clearly.

### 4. Validate the result

- Run the most relevant checks after editing:
  - lint
  - unit tests
  - targeted smoke or integration checks
  - production build when rendering or build behavior changed
- Re-check security-sensitive behavior:
  - auth rules still hold
  - ownership and visibility logic still work
  - secrets and environment variables are not exposed
  - public routes still behave as expected

### 5. Learn and carry forward

- Record durable lessons in [references/upgrade-flow.md](references/upgrade-flow.md).
- Capture:
  - what changed
  - what files were affected
  - what validation mattered
  - what to do differently next time
- Keep `SKILL.md` focused on the reusable process; move detailed notes into references.

## Operating Rules

- Prefer minimal diffs over broad cleanup.
- Do not widen auth or data access unless required by the upgrade.
- Update shared docs or prompts only when the new version changes the standard flow.
- If a recurring pattern emerges, add it to the reference file instead of bloating this skill body.
