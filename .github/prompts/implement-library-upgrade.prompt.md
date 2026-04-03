---
agent: ask
---

Implement the requested library upgrade in this codebase.

Requirements:
- follow the repo's current conventions and project instructions
- keep the change set minimal
- update code, config, or types as needed for the new library version
- add or adjust unit tests only when they materially reduce risk
- run the most relevant validation commands after editing, including unit tests and any security-focused checks that apply

When the upgrade touches stack-specific areas, prioritize these files:
- Next.js: `app/`, `next.config.ts`, `proxy.ts`
- Clerk: auth-aware pages and server actions
- Drizzle/Neon: `db/`, `data/`, `drizzle/`
- Tailwind/UI: `app/globals.css`, `components/ui/`

Before finishing, explicitly verify:
- auth boundaries are intact
- data access still respects ownership and visibility rules
- secrets and environment variables are not exposed
- public routes behave as expected after the upgrade

When finished, summarize:
- files changed
- compatibility risks addressed
- validation performed
- any follow-up work that still remains
