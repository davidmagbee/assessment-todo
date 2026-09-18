# Project guidance

Source: user's assessment and project instructions, 2026-09-17.

- [Proven fact: stated preference] Prioritize accuracy, concise expert communication, explicit uncertainty, and verifiable sources.
- [Proven fact: stated requirement] Apply all five SOLID principles. Document new or changed code logic in code.
- [Proven fact: stated preference] Consider Vercel and Neon; neither is a final architecture decision.
- [Proven fact: stated sequence] Initial project setup → install `npx skills@latest add mattpocock/skills` → grill the architecture → implement.
- [Proven fact: stated goal] Improve AI-assisted development, token efficiency, work tracking, repeatable process, and user control across projects.
- [Proven fact: stated requirement] Maintain noted.md, plan.md, chat.md, and outputs.md at meaningful project steps.
- [Proven fact: stated requirement] Every code-change handoff includes semantic commit message, staging groups when multiple tasks, PR body (and delta after a push), and manual QA steps.
- [Inference / proposed constraint] Bound tooling work so it does not displace assessment delivery. Evaluate additions against a concrete workflow need.
- [Unknown] Deadline, repository location/name, additional assessment rules, data isolation expectations, and available deployment accounts.

References: [AIHero](https://www.aihero.dev/skills), [Matt Pocock skills](https://github.com/mattpocock/skills).

## 2026-09-17 update [proven facts: user messages]

- Deadline confirmed: Friday September 18, 2026, 4 p.m. Eastern.
- Create project in a new folder under ~/code. Selected local working name: assessment-todo.
- User expects local development technology updates may be needed.

[Proven fact: user choice] Work tracking: markdown first.

## User direction — atomic delivery and product scope

[Proven facts: user instructions]
- Commit completed work in atomic, semantic commits; keep project organization explicit.
- Design: fun, clean, efficient, creative without distraction; accessible single-screen list and excellent keyboard operation.
- Include optional authentication from the outset, with personal lists for authenticated users.
- Support isolated guest browser sessions as an option; user also wants a public guest board and eventual team-specific boards. Exact guest defaults and shared-board permissions remain unresolved.
- Add tagging for organization/filtering; implement status filtering first.
- Explore extra functionality immediately after acceptance criteria pass and initial deployment succeeds.
- Require 100% test coverage; coverage dimensions and legitimate exclusions need agreement.

[Proven fact: user decision] Create the GitHub repository through the CLI; keep it private during development.

## Confirmed release decisions

[Proven facts: user answers]
- Initial release: assessment criteria, optional authentication, private account and guest lists. Public boards, teams, tags follow successful deployment.
- Guest default is private; future public participation is explicit.
- Accept explicit guest import recommendation; user asked for detailed UX.
- Coverage contract accepted: 100% lines/branches/functions/statements for authored application code including UI and untested source; documented exclusions for generated/vendor/declaration/nonbehavioral config files; separate end-to-end acceptance tests.
- Authentication unresolved: user favors email accessibility, considers GitHub appropriate, and questions Google.
- Visual preference: crisp monochrome with playful accents, informed by https://blueagilis.com/. Final proposal pending discussion.

[Confirmed by user] Initial authentication: Better Auth email one-time codes. Design: crisp monochrome with blue/violet accents. Explicit task imports accepted; organization remains open. User explicitly invoked /grill-with-docs and asked whether grilling was complete.

## Confirmed simplification

[User decisions] No guest import in initial release. One list per guest/account; each new identity starts empty. Required title, optional plain-text description, status. Search is case-insensitive substring over title/description combined with status, reflected in URL. Confirm before deletion. Guests persist across browser restarts with proposed 30-day expiry accepted.

[Post-acceptance backlog] Add due dates, priorities, subtasks, tags, and undo or a recoverable deleted/archived list incrementally. Public/team boards remain later scope. Imports are deferred.

[User context] Owns multiple domains; one has email service and an unused mailbox. Sending domain/DNS provider not chosen.

## Infrastructure inventory [user-provided]

- Sending domain: davidmagbee.com; DNS managed in Netlify team macuser413.
- Existing Vercel account/team: davidmagbees-projects.
- Existing Neon organization: org-cool-block-43114340.
- Resend account existence not answered; do not assume none exists.
- Account existence does not establish authenticated CLI/API access.

[Confirmed user decisions] Proceed with Drizzle stack; user primarily knows Prisma. Sign-out restores valid guest list; fixed 30-day expiry and newest-created-first order accepted. Sender login@auth.davidmagbee.com accepted. Resend account created; onboarding incomplete.

[Verified correction] Public DNS and Vercel UI establish that Vercel, not Netlify, manages active davidmagbee.com DNS. User explicitly approved three Resend DNS additions.

[Implementation checkpoint] Guest lifetime follows confirmed fixed 30-day policy; resolving a valid token does not extend its expiry. No new user preference inferred.

[Verified infrastructure] Resend marks auth.davidmagbee.com Verified. Neon browser session authenticated. Sender remains login@auth.davidmagbee.com; no mailbox purchase needed for this configured sending domain.

## Neon CLI setup — 2026-09-17

User explicitly requested Neon CLI installation/login, skills, global MCP, project link, empty neon.ts policy and deployment; confirmed repository directory ~/code/assessment-todo. Installed neon 4.21.1. Linked falling-fog-34559809 / production (br-aged-truth-auv8cnig). neon deploy succeeded: no changes required; utilized service Postgres. Pulled DATABASE_URL, DATABASE_URL_UNPOOLED and NEON_BRANCH into ignored .env; .neon ignored. No application deployment or SQL migration performed in this step.

Seven Neon skills installed project-locally. Exact neon mcp -y default installed globally for Codex, Cursor, VS Code and Windsurf, minting an account-wide API key (not project-scoped). Credentials remain outside Git. Added empty documented policy and pinned @neon/config 1.7.1 / @neon/env 1.4.2.

[User request] Keep a local preview available so the user can see implementation progress. Started http://localhost:3000.

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
