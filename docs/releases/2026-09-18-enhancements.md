# Enhancement release — September 18, 2026

## Result and evidence

All seven requested outcomes are delivered: public repository; automatic editor collapse after successful saves; direct command shortcuts; optional shortcuts outside the palette; priority; due dates; user-defined searchable tags; updated tests and documentation.

- Public repository: https://github.com/davidmagbee/assessment-todo (GitHub CLI reports PUBLIC).
- Live app: https://assessment-todo.vercel.app . Vercel reports Ready for the deployment of application commit `d46ffa2`.
- Local preview: http://localhost:3000/ . Existing account session retained; temporary QA task removed.
- Planning summary: https://gist.github.com/davidmagbee/230e378be4f265ddb51c6adc078e93aa . This is a labeled retrospective summary, not a verbatim transcript.
- Automated: 72 passing tests; statements 241/241, branches 107/107, functions 81/81, lines 192/192. `npm run test:coverage`, `npm run typecheck`, and `npm run build` passed. Coverage scope/exclusions remain unchanged.
- Database: three additive migrations applied to Neon before release. Existing tasks receive priority None, no due date, and empty tags.
- Live checks: browser creation/edit/reload, metadata presentation, combined tag/text/status filters, direct commands and outside shortcuts. Compiled production RPC independently verified metadata creation/update/clearing, tag matching, private caching and cross-owner update/delete rejection. Exact assistant-created QA fixtures removed.

## ① Atomic semantic commits

| Commit | Message |
| --- | --- |
| `92096e3` | `fix(tasks): collapse editor after successful save` |
| `083e282` | `feat(commands): add direct shortcuts and persistent opt-in` |
| `ebafb93` | `feat(tasks): add persistent task priority` |
| `1525851` | `feat(tasks): add optional calendar due dates` |
| `2c74306` | `feat(tasks): add custom tags and combined search filtering` |
| `d46ffa2` | `fix(a11y): preserve keyboard behavior through streamed refreshes` |

All six are pushed to `main`. Release evidence is recorded separately with `docs(release): record enhancement verification and handoff`.

## ② Staging groups and commands

These describe the completed commit boundaries; no staging or recommit is required. Commands assume repository root and the corresponding slice only. Each slice also staged `README.md plan.md noted.md chat.md outputs.md`.

```sh
# Editor behavior
 git add src/ui/task-board.tsx tests/task-board.test.tsx
# Direct commands and preference
 git add src/ui/commands.tsx src/styles.css tests/commands.test.tsx
# Priority (only migration 0002 existed at this checkpoint)
 git add src/db/schema.ts src/tasks/input.ts src/ui/task-board.tsx src/styles.css drizzle tests/task-input.test.ts tests/task-board.test.tsx tests/task-repository.test.ts
# Due dates (migration 0003 added)
 git add src/db/schema.ts src/tasks/input.ts src/ui/task-board.tsx drizzle tests/task-input.test.ts tests/task-board.test.tsx tests/task-repository.test.ts
# Tags and combined filtering (migration 0004 added)
 git add src/db/schema.ts src/tasks/input.ts src/tasks/repository.ts src/ui/task-board.tsx src/styles.css drizzle tests
# Keyboard lifecycle correction
 git add src/ui/commands.tsx src/ui/task-board.tsx tests/commands.test.tsx tests/task-board.test.tsx tests/ssr.test.tsx
# Documentation accompanying each slice
 git add README.md plan.md noted.md chat.md outputs.md
# Final release evidence
 git add docs/ai-planning.md docs/releases/2026-09-18-enhancements.md plan.md noted.md chat.md outputs.md
```

## ③ PR body (repository template)

No PR was opened: these authorized atomic changes were committed directly to main. Ready-to-use consolidated body:

### Problem and result

Tasks previously had only status and required manually closing the editor after saving. Palette actions required navigating buttons. Add optional priority, calendar due dates and user-defined tags to private tasks; successful saves close the editor and restore keyboard focus. Search now combines title/description/tag substrings with exact-tag and status filters in validated URL state.

Add Alt/Option+N/F/0–3 actions in the command palette and a persisted, off-by-default toggle for using them outside it. Outside shortcuts ignore editable fields; listeners detach during streamed refreshes. Make the repository public and update setup, planning and reviewer documentation.

### Validation

- `npm run test:coverage`: 72 passing tests; 100% statements/branches/functions/lines for authored application source under the existing gate.
- `npm run typecheck` and `npm run build`: passed.
- Three committed additive migrations executed against isolated PGlite in tests and applied successfully to Neon before deployment.
- Browser checks: metadata create/edit/reload, save-collapse, focus position, combined filters, direct palette and outside shortcuts.
- Hosted RPC: metadata create/update/clear, normalized tag search and exact matching, owner isolation for update/delete, private/no-store SSR. Temporary QA fixtures removed.
- Production application deployment reports Ready; canonical URL exposes the new controls.

### Limitations

Dates are calendar-only: no reminder scheduling. Priority does not change ordering. Tags belong to individual tasks, not a shared category catalog. Deletion remains permanent after confirmation; undo/trash, teams and public boards remain deferred. Coverage is not exhaustive correctness. Hosted inbox/account acceptance and a broader accessibility audit remain pending.

### Post-push PR body delta

After the first feature push (`2c74306`), add:

> Keyboard lifecycle follow-up (`d46ffa2`): restore post-save focus after the streamed list is revealed; focus search when the saved task no longer matches the filter. Remove command listeners while Suspense hides their controls. Add filtered-out focus and suspended-command regressions; extend router coverage for edit completion. Validation increases from 70 to 72 passing tests; coverage remains 100% across all four dimensions. Typecheck/build pass, and production verification succeeds.

## ④ Manual QA

1. Open the live app. Create a task with High priority, a date and `Work, errands, WORK`. Confirm closed row displays High priority, the same date, and exactly `#work` / `#errands`. Reload; confirm persistence.
2. Open the task, change its title and save. Confirm automatic collapse. Use Shift+Tab to verify focus moved to the control immediately before the task summary. Reopen and verify saved fields.
3. Clear its date/tags and choose None priority. Save/reload; confirm cleared metadata stays cleared.
4. Add a custom tag again. Search a substring found only in that tag. Combine with an exact tag and status; verify matching results, empty mismatches, and URL/browser-history restoration.
5. Open Cmd/Ctrl+K. Use Alt/Option+N (new task), F (search), or 0/1/2/3 (All/To-do/In progress/Done) directly. Confirm selected action executes without Tab/Enter.
6. Enable shortcuts outside the palette; close it and try the same keys. Reload; confirm preference persists. While typing in a task/search field, confirm outside shortcuts do not fire. Disable the toggle; confirm shortcuts require the palette again.
7. Under a To-do-only filter, edit a task to Done and save. Confirm it leaves the result list and focus moves to search. During a refresh, keyboard input must not produce errors.
8. Simulate a failed request in your normal developer tools. Save an edit; confirm editor/input remain available and failure feedback appears. Restore networking before retrying.

The implementation checks above were exercised as documented under Result and evidence; this list is also the reviewer’s repeatable acceptance path.
