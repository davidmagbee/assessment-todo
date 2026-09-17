# Execution plan

Status: architecture agreed; implementation in progress. Historical checkpoints below are chronological; latest amendments supersede earlier proposals. Source of requirements: user-provided assessment, 2026-09-17.

## Required outcomes [proven facts: assessment text]

- Create, list, update, delete, and search to-dos.
- Filter status: to-do, in progress, done.
- Keyboard shortcuts and command palette.
- TanStack Start with server functions and a database.
- File-based routes, validated search parameters, route loaders, typed server functions, full-document SSR, streaming, explicit server-only boundaries, and deliberate per-route SSR/runtime choices.
- Hosted functioning URL, GitHub repository with README, shareable AI planning link.

## Sequence [proposed plan]

1. Confirm repository destination and deadline. Scaffold minimal TanStack Start React/TypeScript project; retain dependency lockfile and verify build/type checks.
2. Install requested Matt Pocock skills at project scope using the requested CLI. Record CLI version and skill provenance; inspect applicable instructions before use.
3. Grill architecture: demo audience and data isolation; persistence; search semantics; editing/deletion behavior; keyboard interactions; SSR/streaming purpose; hosting/database/runtime compatibility; time budget.
4. Amend this plan with decisions and rationale. Define thin end-to-end implementation slices and acceptance checks.
5. Build persistent CRUD through validated server functions, with explicit server-only database boundaries.
6. Add URL-driven search/status filters, command palette, keyboard behavior, and accessible loading/empty/error states.
7. Verify behavior, persistence, invalid inputs, keyboard-only operation, SSR, and production build. Add tests for meaningful behavior and failure paths.
8. Deploy and verify production; complete README and reviewer walkthrough; create planning share link after reviewing shareable content.

## Architecture review prompts [unknowns]

- Shared public board, per-browser isolation, or authenticated users? This determines ownership and mutation rules.
- Search fields, matching rules, and empty/invalid search parameter behavior?
- Required todo fields and deletion confirmation/undo expectations?
- What useful content should stream, and what must arrive in initial HTML?
- Vercel/Neon access, acceptable costs, runtime, and migration workflow?
- Assessment deadline and explicit exclusions?

## SOLID application [proposal]

- Single responsibility: separate routing/UI, input rules, and persistence responsibilities.
- Open/closed: introduce extension points only for actual variation.
- Liskov substitution: any alternative implementation must preserve observable contracts.
- Interface segregation: expose operations consumers need.
- Dependency inversion: keep domain rules independent of database vendor details where a boundary earns its cost.

## Change log

- 2026-09-17: Captured requirements; provider choices remain provisional as requested. No application scaffold or skills installation completed yet.

## Amendment — setup complete, 2026-09-17

[Proven facts: local execution] Scaffold created in /Users/interface/code/assessment-todo; Git initialized on main. Node 24.21.0 installed with nvm and pinned in .nvmrc; direct dependencies pinned and package lock retained. Matt Pocock skills installed locally after scaffolding. Type checks, client/server production builds, and HTTP SSR smoke check pass.

[Proven fact: user confirmation] Deadline is September 18, 2026 at 16:00 America/New_York.

[Proposed next step] Complete architecture grilling before feature implementation. Open first-round choices: data ownership, markdown versus GitHub issue tracking, and product direction. Provider choices remain provisional. Historical pending statements above describe the initial inspection, not current setup status.

## Decision — work tracking

User selected markdown first. Maintain the requested four files; no GitHub Issues workflow now. Ownership and product direction remain pending.

## Amendment — product scope and delivery discipline

Source: user's latest instructions.

[Decided] Atomic semantic commits; optional authentication from outset; personal lists; optional isolated guest sessions; clean, playful, accessible single-screen list; status filtering before tagging; extras after acceptance and deployment. Markdown-first tracking retained.

[Requested, scheduling unresolved] Public guest board, team-specific boards, and tags. Do not silently place these in initial release or silently discard them.

[Requested, measurement unresolved] 100% test coverage. Proposed gate: statements, branches, functions, and lines for authored application logic/UI, including untested source files; explicit exclusions only for generated files, declarations, build output, and configuration without application behavior. Add behavioral end-to-end checks independently. Coverage is not evidence of every possible input or interaction.

[Inference] Shared writes and team access introduce permission decisions that an isolated list does not require; resolving release boundaries now reduces rework risk under the fixed deadline.

[Next questions] Initial release boundary; guest default; initial sign-in method; guest-to-account migration; coverage contract; visual direction.

## GitHub publication checkpoint

User authorized CLI repository creation and push, with private visibility. Existing gh token is invalid; browser device re-authentication started. Remote creation/push remain pending login.

## Amendment — initial release boundary accepted

[Decided] Release assessment CRUD/search/status/palette with optional auth, private account lists, and private guest default. Public boards, teams, and tags are post-deployment work. Coverage contract accepted as proposed; coverage not yet measured.

[Proposed guest import] After sign-in, show guest task count and destination account; offer Import tasks or Not now. Transfer only tasks owned by the current verified guest session, preserve titles/status/timestamps, retain existing account tasks, and make retries idempotent. Revoke guest access to transferred tasks only after successful transaction; failure preserves guest tasks. Same-title tasks are not automatically deduplicated. Detailed implementation awaits architecture agreement.

[Proposed auth] Email one-time code for accessibility; optional GitHub sign-in if included deliberately. Email requires functioning delivery; provider/account-linking decisions remain open. Do not select providers for perceived impressiveness alone.

[Proposed design] Crisp neutral surfaces and typography, restrained blue/violet accents, visible keyboard focus and status labels, brief completion feedback with reduced-motion support. Original warm-paper proposal was a subjective approach to friendliness; company visual reference now supports revising it. No UI implemented.

[Proven fact: CLI] Private repository created and baseline pushed: https://github.com/davidmagbee/assessment-todo.

## Current design tree — documented grilling

- Settled: initial release boundary, private guest default, optional Better Auth email OTP, explicit import, monochrome/accent direction, coverage contract.
- Open now: one personal list versus named lists; imported-item ordering; task fields; search semantics; delete behavior; guest lifetime; sending-domain access.
- Downstream: schema/constraints and import transaction; provider/runtime decision; auth/abuse policies; route/streaming design; test matrix; final shared-understanding confirmation.
- Domain glossary started in CONTEXT.md. No database schema exists. Earlier interview used grilling but did not complete the exercise; grill-with-docs now explicitly invoked and applied.

[Proposal] One personal list initially; imports join that list with original task dates/status preserved and deterministic newest-created-first order. Import origin is provenance rather than a new user-visible category. Any sorting/grouping choice remains a user decision.

[Verified] Better Auth core is MIT-licensed. Email OTP requires an email sender. Resend is a candidate with a free tier, but a verified owned sending domain is needed for normal delivery. Hosting, database, domain, and provider costs remain separate; no guarantee of zero total operating cost.

## Amendment — remove initial import and settle task behavior

Supersedes earlier initial import proposals: no import in first release. New guest and account identities start empty; existing identities retain their own lists. Signing in switches ownership context; it must never expose guest tasks to the account implicitly or erase the account's existing tasks. Guest-list behavior after sign-out still needs explicit agreement.

Confirmed: one list; title/optional description/status; case-insensitive title/description substring search combined with status in URL; deletion confirmation; guest persistence and 30-day expiry. Sorting newest-created-first with stable ID tie-breaker remains proposed, not independently confirmed.

## Proposed implementation map (not implemented)

- Better Auth owns its user/session/account/verification schema; generate from the chosen version rather than inventing auth columns.
- Application guest identities have opaque credentials, stored as hashes server-side, with expiry. Browser cookie is HttpOnly, Secure in production, SameSite=Lax. Fixed 30-day expiry is proposed to make lifecycle predictable.
- Tasks: ID, title, optional description, status, created/updated timestamps, and exactly one owner: account user or guest. Database constraint enforces exclusive ownership; every server operation scopes access to the server-resolved owner.
- One implicit list per owner: no board/team/list-membership tables until collaboration is implemented. No import tables.
- Auth switch clears owner-specific client state to prevent cross-owner cache display. Existing account lists are loaded on return.
- First release deletion is confirmed hard delete. Later recoverable deletion needs a separate lifecycle design; archive and trash are not synonyms.
- Main route renders full-document SSR with validated URL filters. Resolve identity before querying tasks; stream the task result into a loading boundary without artificial delay. Do not cache private responses publicly.
- Tests: ownership isolation, guest expiry, CRUD/validation, combined search/status, delete cancellation, session switching, keyboard palette/focus, OTP failures, SSR and production deployment smoke. Enforce agreed coverage across authored code; real-provider smoke supplements deterministic tests.

Open: stack finalization after official compatibility verification; sending domain/DNS and account access; sign-out guest handling; fixed versus sliding expiry; final shared-understanding confirmation.

## Verified stack proposal

TanStack Start + Vercel Node runtime via documented Nitro integration; Neon PostgreSQL + Drizzle; Better Auth email OTP + Resend. No separate API service or browser database. Use transaction-capable PostgreSQL driver on Node; verify stable package versions and actual exports before adding dependencies. Account provisioning and secrets remain pending.

Sources: https://tanstack.com/start/latest/docs/framework/react/guide/hosting ; https://better-auth.com/docs/adapters/drizzle ; https://orm.drizzle.team/docs/connect-neon

Final behavior proposals: sign-out restores the still-valid private guest list; fixed guest expiry 30 days from creation; newest-created-first stable ordering. These are not yet confirmed.

## Infrastructure setup checklist

[User-provided inventory] davidmagbee.com on Netlify DNS; existing Vercel and Neon accounts.

1. Confirm pending stack/guest-lifecycle defaults and Resend availability.
2. Proposed sender: login@auth.davidmagbee.com. Verify the dedicated auth subdomain with the selected email service.
3. Obtain exact DNS records from that service; inspect existing Netlify DNS records and add only required nonconflicting records. Preserve existing website and mailbox records.
4. Verify sending-domain readiness. Create/use project-scoped sender credentials through secure local/environment configuration.
5. Create isolated app/database resources in the supplied Vercel/Neon accounts once stack is settled. Configure runtime, region, environment secrets, migrations, and callback/trusted origins.
6. Test real OTP delivery plus expiry/retry/failure behavior; never commit OTPs or secrets.

[Unknown] Resend account status, DNS write access, current DNS records, and authenticated provider access. No infrastructure resources or DNS records modified in this checkpoint.

## Architecture agreement and implementation start

User confirmed proposed stack and remaining guest/order defaults. Architecture round complete for initial implementation; unresolved provider access is setup work, not a reopened product decision. ADRs record private ownership and auth/persistence choices.

Initial slice: pinned dependencies, test/coverage tooling, public task-input and URL-filter validation, baseline SSR test. Next: database schema/migrations, owner-scoped repository and expiry, server functions, UI and OTP integration, deployment/production acceptance.

Implementation limits: title 200 characters, description 5000, URL query 200; trim surrounding whitespace, new status defaults to todo. Malformed URL values fall back to all/no search. These are implementation defaults, adjustable without changing core scope.

Coverage includes every authored src TS/TSX file, excludes only generated route tree and declarations. Current report covers the small scaffold/input slice; it is not proof of full app behavior or end-to-end coverage.

## Resume checkpoint

Interrupted push had completed; main matched GitHub at 66de197 with no pending process. Resend subdomain created and approved DKIM/SPF/MX records added in Vercel. Public DNS resolves all three; Resend DKIM verified, full sending status pending at this checkpoint.

Database schema and first SQL migration generated; task repository CRUD and combined search/status implemented and tested with isolated PGlite PostgreSQL. Guest identity/expiry, live DB, auth runtime, server functions, UI and deployment remain. Neon browser login requested.

## Guest identity checkpoint

Implemented hashed guest credentials with fixed 30-day expiry. Valid credentials resume the same identity without renewal; expired, absent, malformed, and unknown credentials create a fresh identity. HTTP cookie integration remains next.

## Authentication and provider checkpoint

Better Auth email OTP factory implemented with database-backed rate limits, hashed codes, three allowed attempts and five-minute expiry. Generated rate-limit schema and second migration. Explicit CSRF/origin settings keep tests aligned with production. Route/runtime integration still pending. Resend domain now Verified; public DNS resolves all approved records. Neon signed in; assessment-todo creation form prepared for AWS North Virginia, PostgreSQL only, free plan. User asked to finish credential creation and save DATABASE_URL/RESEND_API_KEY locally. No live database migration or email delivery claimed.

## Neon CLI setup — 2026-09-17

User explicitly requested Neon CLI installation/login, skills, global MCP, project link, empty neon.ts policy and deployment; confirmed repository directory ~/code/assessment-todo. Installed neon 4.21.1. Linked falling-fog-34559809 / production (br-aged-truth-auv8cnig). neon deploy succeeded: no changes required; utilized service Postgres. Pulled DATABASE_URL, DATABASE_URL_UNPOOLED and NEON_BRANCH into ignored .env; .neon ignored. No application deployment or SQL migration performed in this step.

Seven Neon skills installed project-locally. Exact neon mcp -y default installed globally for Codex, Cursor, VS Code and Windsurf, minting an account-wide API key (not project-scoped). Credentials remain outside Git. Added empty documented policy and pinned @neon/config 1.7.1 / @neon/env 1.4.2.

## Local preview and live schema checkpoint

Started Vite at http://localhost:3000 and opened the Codex browser panel. HTTP 200, complete HTML and starter heading verified. Applied both existing Drizzle migrations successfully to the linked Neon production branch. Next: request-scoped ownership, auth HTTP route, typed server functions and task UI. No frontend deployment yet.

## Request integration checkpoint

Connected request-scoped guest/account ownership, private cache headers, Resend delivery adapter, bounded PostgreSQL pool, typed task RPC and auth HTTP route. 41 tests pass; all four current-source coverage metrics 100%; typecheck/build pass. Tests use real application/auth code with PGlite, replacing only HTTP/database/email external boundaries. Generated a local auth secret without printing it. Task UI follows next; no live email sent.

## Functional local application checkpoint

Replaced scaffold with Small Wins: monochrome/violet responsive task UI, create/edit forms, confirmed deletion, URL search/status filters, native command palette (Cmd/Ctrl+K; Tab/Enter/Escape), email OTP controls and safe route recovery screens. Account switches remount the streamed list boundary. 56 tests pass; all four coverage metrics 100%; typecheck/build pass. Browser smoke created a task through RPC, verified reload persistence and updated its description; removed only that exact assistant-created fixture afterward. Live email delivery awaits user check. Vercel CLI authentication requested; hosted deployment remains pending.

## Hosting preparation checkpoint

Added the documented Nitro Vite adapter (pinned 3.0.260903-beta), explicit Vercel TanStack Start detection and iad1 region. Build/typecheck pass. Executed the production Node bundle locally on port 3001: HTTP 200, rendered task form, private/no-store and HttpOnly guest cookie verified. Public client JS contains none of the configured secret values. Build emits upstream use-client directive warnings; runtime smoke passes. Vercel CLI authentication remains pending. Updated README with setup, architecture, reviewer walkthrough, test boundaries and remaining limitations.

## User verification update

User confirmed live email is verified. This confirms delivery; no additional account-switching or production behavior inferred. Vercel browser is authenticated, but CLI whoami reports loggedIn=false/login_required. Started a fresh CLI device authorization and opened its page.

## Production release checkpoint

Created and Git-linked Vercel assessment-todo under the authorized account. Configured production-only server environment values; production uses a separately generated auth secret. Deployed successfully to https://assessment-todo.vercel.app . Public unauthenticated HTTP 200, private/no-store, Secure/HttpOnly/SameSite=Lax cookie verified. Browser confirmed create/reload/edit, combined description-search/status and Cmd+K → filtered command → keyboard status navigation. Real hosted RPC verified create/update, cross-owner delete rejection and own deletion. Removed exact smoke fixtures afterward. Hosted inbox/account switching awaits user confirmation; local email already user-verified.

Vercel runs Node 24.19.0; adjusted package engine minimum from 24.21.0 to that successfully exercised runtime while keeping local .nvmrc pin. Published sanitized Codex-assisted retrospective planning summary at https://gist.github.com/davidmagbee/230e378be4f265ddb51c6adc078e93aa after stating the recommended default; it is not a native conversation transcript. Repository remains private as requested.
