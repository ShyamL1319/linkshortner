---
agent: ask
---

Audit the requested library or dependency upgrade for this codebase.

Check the affected files, identify breaking changes, and report:
- what changed in the library
- which files in this repo need updates
- whether any config, typing, or runtime behavior changed
- what validation should run after the update

Pay special attention to these stack-specific areas when relevant:
- Next.js: `app/`, `proxy.ts`, `next.config.ts`
- Clerk: auth helpers, route protection, and server actions
- Drizzle/Neon: `db/`, `data/`, and `drizzle/`
- Tailwind/UI: `app/globals.css`, `components/ui/`, and shared wrappers

Return a concise markdown table with columns:
- File Path
- Change Needed
- Risk
- Validation

If no code change is needed, say so and explain why.
