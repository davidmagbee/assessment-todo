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
