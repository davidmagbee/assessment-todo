# Assessment Todo

TanStack Start React/TypeScript scaffold for the Senior Software Engineer assessment. Feature implementation and hosting are pending architecture review.

## Local development

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open http://localhost:3000. The current page is the generated starter.

## Validation

```sh
npm run typecheck
npm run build
```

Node 24.21.0 and npm 11.19.0 were used for setup. Direct dependencies are pinned; commit package-lock.json and use npm ci for reproducibility.

## Requirements and planning

See plan.md for the acceptance criteria, sequence, unresolved questions, and amendments; noted.md for preferences; chat.md for the labeled conversation log; outputs.md for validation evidence and learnings.

Requested skills are installed under .agents/skills; provenance hashes are in skills-lock.json. Installation command: `npx --yes skills@latest add mattpocock/skills --agent codex --skill '*' --yes`.

## Delivery status

- Local scaffold: type checks and production build verified.
- Persistent CRUD, search, status filtering, command palette, streaming scenario: pending.
- Hosting URL, GitHub URL, shareable planning URL: pending.
- Database, ownership model, deployment adapter: pending architecture decisions.

## Sources

- https://tanstack.com/start/latest/docs/framework/react/getting-started
- https://github.com/mattpocock/skills
- https://github.com/vercel-labs/skills
- https://nodejs.org/en/about/previous-releases
