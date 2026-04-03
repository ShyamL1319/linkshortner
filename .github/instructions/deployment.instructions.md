description: Read this before changing deployment, CI/CD, runtime configuration, or production environment settings.

# Deployment and Configuration Guidelines

This project is a Next.js App Router application deployed from GitHub. The production stack is:

- **Frontend / app runtime:** Next.js on Vercel
- **Database:** Neon PostgreSQL
- **Auth:** Clerk
- **CI/CD:** GitHub Actions

Use this document as the source of truth for deployment decisions, environment configuration, and production safety.

## 1. Deployment Model

- Deploy from the `main` branch only.
- Treat pull requests as validation-only unless a separate preview deployment is explicitly configured.
- Keep the app and database managed services aligned with the same environment naming:
  - `development` for local work
  - `preview` for validation and branch testing
  - `production` for live traffic

## 2. Required Environment Variables

Store secrets in GitHub Environments or repository secrets, never in the repo.

### Application runtime

- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### Deployment tooling

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 3. Neon Database Rules

- Use Neon for managed Postgres storage.
- Prefer pooled connections for the serverless runtime to avoid connection exhaustion under burst traffic.
- Keep database access in server-only code paths.
- Use Drizzle migrations or schema tooling as the source of truth for schema changes.
- Review schema changes before applying them to production.

### Connection and concurrency guidance

- Runtime reads and writes should use the pooled Neon connection.
- Long-lived or high-privilege maintenance tasks should use the direct connection only when needed.
- Do not open ad hoc database clients from client components.
- Avoid patterns that create a new DB pool per request.

## 4. Clerk and Auth Rules

- Protect `/dashboard` and all authenticated routes on the server.
- Never trust client-side auth state for authorization.
- Keep Clerk secrets in production-only secret storage.
- Use modal sign-in and sign-up flows rather than custom auth forms.

## 5. Security Constraints

- Do not commit secrets, connection strings, or deployment tokens.
- Never expose database credentials in client bundles.
- Use least-privilege access for deployment and database tooling.
- Prefer environment-scoped secrets over shared global secrets when possible.
- Fail closed on auth and deployment checks.

## 6. Scalability and System Design Constraints

- Assume bursty serverless traffic and short-lived execution contexts.
- Keep route handlers, server actions, and database helpers stateless.
- Avoid expensive work during request handling unless it is necessary.
- Favor caching, pagination, or partial reads for any future analytics or list views.
- Keep deployment changes compatible with zero-downtime rollouts.

## 7. GitHub Actions Workflow Expectations

- Run lint and build checks on every pull request.
- Deploy production only after validation passes on `main`.
- Cancel in-progress runs for the same branch when a newer commit lands.
- Keep the workflow readable so another engineer can update it without reverse-engineering the pipeline.

## 8. Release Checklist

Before merging or deploying:

1. Verify env vars are configured in GitHub and Vercel.
2. Verify schema changes are committed and reviewed.
3. Run lint and build locally or in CI.
4. Confirm auth-protected routes still redirect correctly.
5. Confirm database queries succeed against Neon.
6. Deploy to production only after the checks above pass.

## 9. Operational Notes

- If a deploy fails, stop and inspect the workflow logs before retrying.
- If a schema change is required, apply it deliberately and separately from app-only changes.
- If production traffic grows, consider adding read replicas or caching before scaling application complexity.
- If you need request interception logic, use `proxy.ts` rather than `middleware.ts`.

## 10. What Not To Do

- Do not hard-code secrets into source files.
- Do not fetch database data from client components.
- Do not bypass the helper functions in `/data` for routine database access.
- Do not add deployment automation that mutates the schema implicitly on every push.
- Do not use custom authentication systems outside Clerk.
