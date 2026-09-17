# Project instructions

- Source requirements and current execution status: plan.md. Read noted.md for user preferences.
- Deadline: September 18, 2026 at 16:00 America/New_York (user confirmed).
- Prioritize accuracy. Distinguish verified facts, inferences, assumptions, and unknowns. Cite external technical claims using verified primary sources.
- Keep communication concise. Clarify material ambiguity. Do not invent APIs or results.
- Apply SOLID proportionately. Document new or changed logic in code, explaining purpose and non-obvious constraints.
- Update noted.md for new user guidance; plan.md for decisions and amendments; chat.md for labeled conversation entries; outputs.md for implementation evidence and learnings.
- Read current plan and relevant notes first; consult conversation history only when needed. Do not claim measured token savings without measurement.
- Every code-change handoff: semantic commit message, staging groups/commands if multiple tasks, PR body and post-push delta, manual QA steps.
- Skill installation is project-local under .agents/skills with skills-lock.json. Read a skill before applying it. Installation does not authorize unrelated actions.
- Initial scaffold is complete. Architecture grilling must precede feature implementation. Vercel and Neon remain provisional.
- Keep secrets out of tracked files and shared planning material.

- Commit completed, validated work in atomic semantic commits. Separate unrelated tasks and record validation.
- User requires 100% test coverage; agree and record coverage dimensions/exclusions before implementing the gate. Never report a coverage target as achieved without a report.
- Design should be fun, clean, efficient, creative without distraction. Optional authentication belongs in initial scope; public/team boards and tagging need explicit release sequencing.

- Domain vocabulary: CONTEXT.md (glossary only). Capture consequential agreed tradeoffs in docs/adr/ when warranted. Current architecture interview is tracked in plan.md.
