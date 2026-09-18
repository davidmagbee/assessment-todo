# Implementation notes and learnings

## 2026-09-17 — Initial inspection

### Proven facts [local command evidence]

- Workspace contained only empty work/ and outputs/ directories; `git status` reported no repository.
- Shell resolves Node under v23.6.0; v22.13.0 also exists locally.
- `rg` is unavailable in this shell. Git, npm, npx, and gh resolve.
- `npm view @tanstack/cli version engines`: version 0.71.0; Node >=20.
- `npm view skills version engines`: version 1.7.0; Node >=22.20.0.
- `npx --yes @tanstack/cli@0.71.0 create --help` succeeded. Advertises `--blank`, `--target-dir`, `--no-git`, `--no-intent`, package-manager and deployment options.
- These observations establish availability/help output only, not app compatibility or authentication.

### Verified external references

- [TanStack Start setup](https://tanstack.com/start/latest/docs/framework/react/getting-started)
- [Matt Pocock skills repository](https://github.com/mattpocock/skills)
- [Skills CLI](https://github.com/vercel-labs/skills): project-local installation is default; global installation is explicit.
- [AIHero skills](https://www.aihero.dev/skills)

### Inferences / proposed process

- Treat installation and actual skill application as separate steps; do not claim efficiency gains without evidence.
- Keep current decisions in plan.md and historical discussion in chat.md to avoid repeatedly loading the entire conversation.
- Record validation commands and results alongside changes. Never equate a successful build with verified user behavior.

### Unknown / pending

Repository destination, deadline, runtime selection, GitHub authentication, deployment access, database strategy, and sharing preferences remain unresolved. No app scaffold, tests, deployment, or skills installation has been completed.

## 2026-09-17 — Setup evidence [proven facts: tool output]

- Project: /Users/interface/code/assessment-todo; Git main initialized, no commits or remote created.
- nvm installed Node 24.21.0 with npm 11.19.0; download checksum matched. .nvmrc pins project version. Existing Node installations retained.
- Fixed exactly one `$(opt/homebrew/bin/brew shellenv)` occurrence to `$(/opt/homebrew/bin/brew shellenv)` in ~/.zprofile. Backup: ~/.zprofile.before-assessment-setup. Subsequent login-shell commands showed no prior missing-path error.
- Scaffold CLI: @tanstack/cli@0.71.0, blank React template, npm, no deployment adapter, no Intent setup.
- Skills command: npx --yes skills@latest add mattpocock/skills --agent codex --skill '*' --yes. Installed 38 skills; skills-lock.json records per-skill sources and hashes. Engineering tracker configuration remains pending.
- npm run typecheck: PASS. npm run build: PASS, client and SSR bundles.
- HTTP GET http://127.0.0.1:3000/: PASS; complete HTML, server-rendered starter heading, and scripts present. Browser interaction and feature behavior not yet tested.
- npm install --package-lock-only audit reported zero vulnerabilities at execution time; this is not a comprehensive security assessment.
- Scaffolding emitted a router CLI circular-dependency warning; route generation/build succeeded. npm noted an unapproved optional fsevents install script; no blanket script approval applied.
- Development server started on 127.0.0.1:3000 for the smoke check.

[Inference] This establishes a working framework baseline, not assessment completion.

[Proven fact: user choice] Markdown-first work tracking recorded. No tracker integration configured.

## Atomic baseline checkpoint

[Proven fact: local inspection] The initial repository had no commits; all setup files were untracked. No application code changed in this documentation update. Prior typecheck/build/HTTP SSR checks apply to the scaffold.

[Process decision] Split baseline into application scaffold, vendored skills, and project workflow/requirements commits. Commit coherent validated changes going forward; do not mix unrelated features. No remote push authorized in this step.

[Unknown] No test suite or coverage report exists yet; 100% coverage is a requested target, not a current result.

## Commit and GitHub checkpoint [local evidence]

- 2c33c45: chore(app): scaffold TanStack Start with pinned toolchain
- 10e3e6f: chore(skills): install project-local Matt Pocock skills
- a43f809: docs(project): define assessment scope and atomic delivery workflow
- Removed trailing blank line in starter CSS when staged whitespace check caught it.
- All staged whitespace checks passed before those commits; working tree clean after commits.
- gh auth status failed for davidmagbee: stored keyring token invalid. Device login initiated; remote creation and push not completed.

## GitHub and design checkpoint

[Proven facts: CLI] gh authentication succeeded; gh repo create davidmagbee/assessment-todo --private --source=. --remote=origin --push succeeded. Repository visibility verified PRIVATE; main tracks origin/main.

[Proven fact: direct browser observation] Blue Agilis homepage dark view uses black background, bold white type, blue branding, and violet/blue hero glow: https://blueagilis.com/. Observation is limited to the viewed theme/viewport.

[Verified capabilities, not selected dependencies] Better Auth documents email OTP with an application-provided email sender and GitHub OAuth:
- https://better-auth.com/docs/plugins/email-otp
- https://better-auth.com/docs/authentication/github

[Unknown] Auth provider choice/email delivery access; final visual approval; later architecture decisions. No authentication, import, or coverage implementation exists yet.

## Documented grilling and cost verification

[Verified sources, 2026-09-17]
- Better Auth is free/open source under MIT: https://github.com/better-auth/better-auth/blob/main/LICENSE.md (GitHub license API also returned MIT).
- OTP sender is application supplied: https://better-auth.com/docs/plugins/email-otp
- Resend free tier currently lists 3,000 emails/month and 100/day: https://resend.com/pricing
- Resend sending-domain verification: https://resend.com/docs/dashboard/domains/introduction

Created CONTEXT.md as a glossary, not an implementation spec. Updated current design tree. Documentation-only change; no app code/test changes. Auth, schema, email delivery, and coverage remain unimplemented.

## Architecture clarification

Documentation-only changes: import removed from release scope, confirmed task behavior recorded, ownership/schema/SSR/test proposals added. No application behavior implemented.

Verified official documentation:
- https://better-auth.com/docs/integrations/tanstack
- https://resend.com/docs/dashboard/domains/introduction (sending verification and optional inbound setup)

Local inspection: vercel and neonctl do not resolve on current PATH. This does not establish whether the user has accounts. Domain/DNS and account inventory questions are pending.

Read-only research verified documented Start/Vercel Node, Better Auth/Drizzle PostgreSQL, and Drizzle/Neon integration. Adapter import paths differ between some current docs; implementation must verify installed exports. Sources recorded in plan.md.

## Infrastructure inventory checkpoint

Documentation-only update based on user-provided account references. Netlify DNS: https://app.netlify.com/teams/macuser413/dns/davidmagbee.com ; Vercel: https://vercel.com/davidmagbees-projects ; Neon: https://console.neon.tech/app/org-cool-block-43114340/projects . These links were provided by the user, not authenticated/inspected in this checkpoint.

Added concrete setup sequence to plan.md. No provider resources, credentials, or DNS records created/changed. Verification: staged whitespace check; app tests not rerun for documentation-only edits.

## Validation foundations

- Task input first failed due to missing implementation; after implementation, valid/default/invalid/limit cases passed. URL-search test likewise failed before its schema existed, then passed.
- 16 tests cover validation and the scaffold's server-rendered document. Coverage reports 100% for current authored source; zero application branches currently exist (0/0), so branch percentage is vacuous at this stage.
- Negative coverage probe: temporary untested branch-bearing source caused all four thresholds to fail. Probe removed.
- Resend in-app browser redirected to login; no onboarding/DNS change performed.
- Installed stable drizzle-orm 0.45.2 and drizzle-kit 0.31.10, Better Auth/adapter 1.7.5; resolved node-postgres, adapter, plugin, and TanStack integration exports.
- npm audit reports four moderate dependency findings along drizzle-kit → esm-loader → core-utils → esbuild. This also appears with --omit=dev because Better Auth references drizzle-kit. Advisory: https://github.com/advisories/GHSA-67mh-4wv8-2f99 . Suggested automatic fix downgrades Drizzle Kit incompatibly; not applied. No affected esbuild development server intentionally started.
- Schema, database connection, auth behavior, app UI, and deployed acceptance remain incomplete.

## Repository and DNS checkpoint

Verified 22 tests passing, all authored coverage metrics 100%, typecheck/build pass. Generated auth schema excluded under approved generated-code exclusion; migrations executed against isolated PGlite. Tests cover account/guest isolation, unauthorized update/delete, literal search, status filtering, validation and ownership constraints.

Resend domain ID: 0677dbaa-e874-4e94-8877-eb19b51b4d6a. DNS added with approval: TXT resend._domainkey.auth (issued key), TXT send.auth (v=spf1 include:amazonses.com ~all), MX send.auth (feedback-smtp.us-east-1.amazonses.com, priority 10), TTL 60. Vercel warned about auth-subdomain wildcard override; scoped exception confirmed. Existing explicit root/www portfolio configuration untouched. Public DNS confirms records. Resend DKIM verified; sending pending at observation. No API key created or test email sent.

## Guest identity verification

Five guest-session tests run against PGlite with real migrations. They verify resume, unchanged expiry, exact expiry boundary and rejected credentials through the resolver interface. Token generation uses node:crypto; only SHA-256 hashes are persisted. Combined current suite passes; HTTP cookie integration remains unimplemented.

## Authentication verification

30 tests pass; coverage statements 43/43, branches 17/17, functions 19/19, lines 41/41. Typecheck and client/server production build pass. Actual Better Auth handler and PGlite execute sign-in/replay, wrong-code exhaustion, and cookie-bearing untrusted-origin rejection; delivery callback is captured locally, not sent. Initial origin test failed because Better Auth disables origin checking in test environments by default and cookie-less requests do not exercise its cookie-based CSRF check. Explicitly enabled protections and corrected the test to model cookie-bearing CSRF. Source evidence: installed better-auth/dist/context/create-context.mjs and api/middlewares/origin-check.mjs (1.7.5).

Resend domain UI reports Verified (domain ID 0677dbaa-e874-4e94-8877-eb19b51b4d6a); DNS independently resolves DKIM/SPF/MX. API key and Neon connection setup remain pending. No secrets printed or committed. UI is still the scaffold; current coverage does not imply finished acceptance.

## Neon CLI setup — 2026-09-17

User explicitly requested Neon CLI installation/login, skills, global MCP, project link, empty neon.ts policy and deployment; confirmed repository directory ~/code/assessment-todo. Installed neon 4.21.1. Linked falling-fog-34559809 / production (br-aged-truth-auv8cnig). neon deploy succeeded: no changes required; utilized service Postgres. Pulled DATABASE_URL, DATABASE_URL_UNPOOLED and NEON_BRANCH into ignored .env; .neon ignored. No application deployment or SQL migration performed in this step.

Seven Neon skills installed project-locally. Exact neon mcp -y default installed globally for Codex, Cursor, VS Code and Windsurf, minting an account-wide API key (not project-scoped). Credentials remain outside Git. Added empty documented policy and pinned @neon/config 1.7.1 / @neon/env 1.4.2.

Validation after Neon setup: npm run typecheck, npm run test:coverage and npm run build pass. 30 tests; statements/branches/functions/lines each 100% for current authored src. Existing four moderate dependency audit findings remain. Neon setup does not host the frontend or execute Drizzle migrations.

## Local execution evidence

`npm run dev` running on port 3000. HTTP smoke returned 200 with full document and scaffold heading. `npm run db:migrate` completed successfully against configured Neon DATABASE_URL. Driver warned that future pg major versions change sslmode=require semantics; current pinned driver treats it as verify-full. No application data seeded and no real OTP sent.

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

## Public repository and editor completion — 2026-09-18

User requested public repository, collapse after successful save, direct command shortcuts with an outside-palette toggle, priority, due dates and searchable tags. GitHub visibility is verified PUBLIC. Successful edits now collapse and return focus to their summary; failed edits remain open. Regression demonstrated red before green. Validation: 56 tests; statements/branches/functions/lines 100%; typecheck passes. Remaining enhancements follow as separate commits.

## Direct keyboard commands — 2026-09-18

Added Alt/Option+N (new task), F (search), and 0/1/2/3 (all/to-do/in-progress/done). Available in the palette, optionally outside via an off-by-default persisted browser toggle. Outside shortcuts ignore editable fields; repeated/composing/already-handled events are ignored. Blocked storage falls back to a visible session-only preference. Callbacks use current URL filters. Validation: 61 tests; all four coverage metrics 100%; typecheck passes. User confirmed defaults; tags will be user-defined, not fixed categories.

## Task priority — 2026-09-18

Added None/Low/Medium/High priority to validation, PostgreSQL, create/edit forms and compact task summaries. Additive migration defaults existing tasks to None and preserves newest-first ordering. Real PostgreSQL tests cover defaults, round-trip updates and invalid values; UI tests cover choosing and displaying priority. Validation: 63 tests; four coverage metrics 100%; typecheck passes.
