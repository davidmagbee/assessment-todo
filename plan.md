# Execution plan

Status: draft; architecture review pending. Source of requirements: user-provided assessment, 2026-09-17.

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
