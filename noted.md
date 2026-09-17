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
