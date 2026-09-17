# Small Wins

A private to-do workspace built with TanStack Start, React, PostgreSQL and Better Auth. Crisp monochrome surfaces, restrained violet accents, and keyboard-accessible native controls.

**Delivery status:** functional locally; hosted URL pending; live email delivery verified by the user. [Repository](https://github.com/davidmagbee/assessment-todo). AI planning share link pending; [plan.md](plan.md) records decisions and amendments.

## Try it locally

```sh
nvm install
nvm use
npm ci
cp .env.example .env
# Fill the values below, then:
npm run db:migrate
npm run dev
```

Open http://localhost:3000. Use a dedicated PostgreSQL database; migrations create application and Better Auth tables. Do not overwrite an existing `.env` when following the setup steps.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string; use the pooled Neon endpoint for application traffic |
| `BETTER_AUTH_SECRET` | Random server-only secret, at least 32 characters |
| `BETTER_AUTH_URL` | Exact application origin, locally `http://localhost:3000` |
| `RESEND_API_KEY` | Sending API key for the verified domain |
| `EMAIL_FROM` | Verified sender address, configured as `login@auth.davidmagbee.com` |

Never prefix these values with `VITE_`. `.env` and `.neon` are ignored by Git and excluded from deployment uploads.

## Reviewer walkthrough

1. Add a title, optional description and status. Reload to verify persistence.
2. Expand a task to edit its fields or delete it. Cancel deletion to retain it.
3. Search title/description; combine with To-do, In progress or Done. Filters live in the URL, including browser history.
4. Press **Cmd+K / Ctrl+K** to open commands. Search actions; Tab between them, Enter to select, Escape to close. Commands focus creation/search or select a status.
5. Sign in with an email code to switch to a personal account list. Sign out to return to the still-valid guest list.
6. Use another browser profile to check that tasks remain isolated.

New identities start empty. Guest credentials expire **30 days after creation**, without sliding renewal. Signing in never imports guest tasks. Deletion is permanent after confirmation; undo/trash, teams, public boards, tags and imports are deferred.

## Architecture

- [File routes](src/routes): `/` uses full-document SSR. Identity resolves first; the task promise streams through `Await` without artificial delay. Search parameters are validated by Zod. Private responses use `Cache-Control: private, no-store`.
- [Typed server functions](src/tasks/functions.ts): GET loads the workspace; POST saves/deletes. Start compiles client RPC stubs; `.server.ts` modules hold request/environment boundaries.
- [Workspace](src/tasks/workspace.ts): server-verified Better Auth sessions select account ownership; otherwise an opaque guest token selects an isolated guest identity. Only token hashes are stored.
- [Repository](src/tasks/repository.ts): every query scopes by owner. Database constraints require exactly one owner. Search uses parameterized literal substrings, including literal `%` and `_`. Ordering is newest-created-first with ID tie-break.
- [Authentication](src/auth): Better Auth owns code/session mechanics. Codes are hashed, expire in five minutes and allow three verification attempts. Database-backed rate-limit configuration persists across server instances. Resend is the email boundary.
- [UI](src/ui): native forms, details and modal dialog; visible focus, loading/empty/error feedback and reduced-motion styling. Failed saves retain input.
- [Schema/migrations](drizzle): generated Better Auth schema plus application schema, committed SQL. Pinned node-postgres supplies transaction support; one bounded pool is reused per warm process.

SOLID is applied through these responsibility boundaries and injected external dependencies, without speculative classes or repository abstractions for hypothetical databases. See [ADRs](docs/adr) and [Drizzle orientation for Prisma users](docs/drizzle-for-prisma-users.md).

## Validation

```sh
npm run typecheck
npm run test:coverage
npm run build
```

Current checkpoint: **56 tests pass**; statements, branches, functions and lines each **100%** for authored `src` TypeScript/TSX. The gate includes unimported source. Exclusions: generated route tree, generated Better Auth schema and declarations. Configuration and dependency code are outside this application-source metric.

Tests execute migrations and application/auth logic against isolated PGlite PostgreSQL. They cover ownership, fixed expiry, CRUD, literal search, validation, OTP replay/attempts, cookie-bearing CSRF, route rendering, URL navigation, stale edits, keyboard commands and account controls. HTTP/database/email boundaries are replaced where needed; Vitest's route integration uses a transport shim because it does not run the Start RPC compiler. Live browser smoke separately verified compiled RPC creation, reload persistence and edits against Neon. Temporary smoke data was removed.

Coverage is not exhaustive correctness. User verified actual inbox delivery. Deployed-runtime acceptance and a full production keyboard/accessibility walkthrough are still required.

## Deployment

Vercel Node target via Nitro's Vite plugin; explicit `tanstack-start` framework detection and `iad1` region in [vercel.json](vercel.json). Configure server-only environment values before deploying. Run migrations deliberately; application startup does not mutate schema. Use separate databases/branches for previews before enabling preview writes.

Neon CLI linkage targets `falling-fog-34559809` / `production`. The requested empty [neon.ts](neon.ts) policy manages no extra services. `neon deploy` does not deploy this frontend or run Drizzle migrations.

## Known limitations and follow-up

- Live email delivery is user-verified; production deployment checks remain pending.
- Current npm audit reports four moderate findings in the Drizzle Kit → esbuild dependency chain ([advisory](https://github.com/advisories/GHSA-67mh-4wv8-2f99)). An incompatible automatic downgrade was not applied.
- Expired guest records remain stored; access expires, but scheduled data cleanup is not implemented.
- No shared boards, task imports, pagination, undo or team permissions in this release.
- Neon CLI's requested default MCP setup created account-wide access in local agent configuration; credentials are outside this repository.

## Planning and sources

[plan.md](plan.md), [noted.md](noted.md), [chat.md](chat.md) and [outputs.md](outputs.md) contain chronological checkpoints; newer amendments supersede older proposals. Chat entries are labeled summaries, not a verbatim transcript. Project skills and provenance are under `.agents/skills` and `skills-lock.json`.

Primary documentation: [Start server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions), [Start hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting), [Better Auth integration](https://better-auth.com/docs/integrations/tanstack), [email OTP](https://better-auth.com/docs/plugins/email-otp).
