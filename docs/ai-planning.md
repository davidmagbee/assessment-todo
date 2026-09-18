# Small Wins: planning with Codex

This is a sanitized, retrospective summary of the actual planning conversation and implementation checkpoints on September 17–18, 2026. It was prepared with Codex. It is **not a verbatim transcript or a native conversation share**. Account details, credentials, local paths and authentication setup logs are omitted.

## Assessment requirements [provided by the user]

Build a TanStack Start to-do application supporting create, list, update, delete, search, three status filters (To-do, In progress, Done), and keyboard shortcuts with a command palette. Deliver a hosted URL, a GitHub repository with README, and a shareable account of AI-assisted planning.

The technical prompt additionally calls for file-based routing, validated search parameters, route loaders, typed server functions, full-document SSR, streaming, explicit server-only boundaries and a deliberate deployment runtime.

## Planning process [conversation summary]

1. Establish deadline, repository location, visibility and tracking. Choose private GitHub development, atomic semantic commits and markdown-first tracking.
2. Scaffold and verify TanStack Start before feature work. Install the requested Matt Pocock skills project-locally, retaining provenance.
3. Conduct the requested documented architecture grilling. Resolve ownership, guest persistence, authentication, task fields, search behavior, deletion semantics, hosting and test expectations before building the database.
4. Reduce initial scope. The user initially explored public/team boards, tags and guest imports. Agree to deliver acceptance criteria plus optional email authentication first; defer extras until deployment succeeds. Explicitly remove imports from initial release.
5. Implement independently reviewable slices: validation → persistence → guest/auth identities → request boundaries → UI/keyboard controls → hosted verification.

## Decisions and rationale [agreed decisions plus engineering reasoning]

| Question | Decision | Reason |
| --- | --- | --- |
| Who owns tasks? | One implicit list per private guest or account | Isolation is useful immediately; team membership and board permissions can follow later |
| What happens at sign-in? | Switch to account list; no implicit imports | Avoid ambiguous transfer, duplicate handling and accidental ownership changes |
| What happens at sign-out? | Restore the still-valid guest list | Preserve guest work without mixing ownership contexts |
| Guest lifetime? | Fixed 30 days from creation | Predictable lifecycle; access does not silently renew |
| Authentication? | Better Auth email OTP with Resend | Email accessibility without requiring a particular social account |
| Database? | Neon PostgreSQL, Drizzle and node-postgres | Relational constraints and transaction-capable server persistence |
| Runtime? | TanStack Start on Vercel Node through Nitro | Follow the documented adapter without changing the app model |
| Search? | Case-insensitive literal title/description substring, combined with URL status | Predictable matching, shareable filters, back/forward navigation |
| Delete? | Confirmed permanent delete initially | Clear first-release behavior; undo/trash needs its own lifecycle design |
| Design? | Crisp monochrome with restrained violet accents | Clean and efficient, with small playful details that do not compete with tasks |
| Tests? | 100% statements/branches/functions/lines for authored source, plus behavioral checks | User-required coverage gate; acknowledge that coverage is not exhaustive correctness |

## Implementation model [implemented]

- Validate task input and URL search with Zod. Bound title, description and query lengths.
- Store exactly one task owner, enforced by a database constraint. Scope every read and mutation to the identity resolved by the server.
- Use opaque guest credentials and store only hashes. Set HttpOnly/SameSite cookies, with Secure on HTTPS.
- Resolve identity before returning the page's task promise. Render the full-document shell and stream tasks through an Await boundary without artificial delay.
- Keep database, environment and request code behind `.server.ts` boundaries. Expose typed GET/POST server functions to the UI.
- Let Better Auth own OTP/session mechanics; keep email delivery at an explicit external boundary. Enable database-backed rate limits, hashed OTPs and bounded verification attempts.
- Use native forms, details and a modal dialog for editing and commands. Preserve failed input, confirm deletion, and avoid displaying raw server errors.
- Apply SOLID through concrete responsibility boundaries and dependency injection, without speculative abstraction layers.

## Verification strategy [implemented]

Tests exercise public validation, repository, identity, HTTP-handler, UI and router boundaries. PGlite runs committed PostgreSQL migrations in isolated test databases. Auth logic executes for real; email delivery is captured at the provider boundary in automated tests. Route tests use a transport shim because Vitest does not run Start's RPC compiler, so real browser and hosted RPC checks supplement them.

The current automated checkpoint is 72 passing tests with all four authored-source coverage metrics at 100%. Exclusions are generated route/schema files and declarations. Typecheck and production build pass. Live checks separately verified creation, reload persistence, edits, owner-scoped deletion, command palette navigation and private HTTPS cookie/cache behavior. The user verified email delivery locally; production inbox/account acceptance still needs its own check.

## Changes prompted by evidence [observed]

- Origin-protection testing initially failed. Inspection showed that Better Auth relaxed its test-environment defaults and cookie-less requests did not exercise cookie-based CSRF validation. Explicit protections and a realistic cookie-bearing test corrected the mismatch.
- Generated scaffold search/SSR tests were replaced with real route behavior tests as the page became functional.
- Provider runtime output revealed an older Node 24 patch than local development. The compatibility declaration was adjusted to the successfully exercised hosted runtime, while retaining the local version pin.
- Coverage and a successful build were never treated as proof of live delivery or deployment. Separate checks were recorded.

## Deferred work and limits [explicit]

Teams, public boards, imports, subtasks and recoverable deletion remain deferred. Priority, due dates and tags were added after the initial deployment, at the user’s request. Expired guest records currently lose access but are not automatically purged. Existing dependency audit findings remain documented in the repository. A native AI conversation link can supplement this summary if the reviewer requires one.

Primary references consulted: [TanStack server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions), [TanStack hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting), [Better Auth/TanStack integration](https://better-auth.com/docs/integrations/tanstack), [email OTP](https://better-auth.com/docs/plugins/email-otp), [Drizzle PostgreSQL](https://orm.drizzle.team/docs/get-started/postgresql-new).


## Post-deployment amendment — September 18 [user-requested and verified]

The user requested a public repository, collapsed editors after successful saves, direct command keystrokes with an outside-palette toggle, priorities, due dates and searchable user-defined tags. Delivered each feature in an atomic semantic commit after behavioral checks. Repository is now public.

- Priority: None/Low/Medium/High, defaulting existing tasks to None; newest-first ordering retained.
- Due dates: optional calendar strings backed by PostgreSQL DATE; no timezone conversion or reminders.
- Tags: up to ten comma-separated entries, 32 characters each, trimmed/lowercased/deduplicated. Bounded arrays belong to individual private tasks. Text search matches tag substrings; exact-tag, status and text filters combine in URL state.
- Commands: Alt/Option+N/F/0/1/2/3; outside-palette access defaults off and persists per browser, with session fallback when storage is unavailable. Editable fields are protected outside the palette.
- Successful edits close and restore focus to the summary, or search when the task leaves the active filter. Keyboard listeners detach while streamed controls are hidden.

Three additive migrations applied before release. Automated validation: 72 tests; 100% statements, branches, functions and lines; typecheck/build pass. Browser checks cover metadata, editing, combined filters and keyboard operation. Real production RPC checks additionally cover metadata clearing and cross-owner update/delete rejection. Only temporary assistant-created QA rows were removed. Hosted inbox/account acceptance remains a separate pending check.
