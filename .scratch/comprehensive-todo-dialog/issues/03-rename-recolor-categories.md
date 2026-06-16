# Rename and recolor Categories

Status: ready-for-agent

## What to build

Let a signed-in user rename and recolor their existing Categories from inside the Todo dialog's Category picker. These Category edits save immediately and globally, independent of whether the Todo dialog is submitted or cancelled. Existing Todo cards using the edited Category should reflect the updated display name and color through punctual cache patching.

## Acceptance criteria

- [ ] Category update server functions enforce current-user ownership, normalize names, validate `colorKey`, and reject rename conflicts instead of merging Categories.
- [ ] The Category picker exposes edit controls for Category name and color using the shared curated palette.
- [ ] Category edit actions save immediately and show picker-local errors when the operation fails.
- [ ] Successful Category rename/recolor updates the Category list cache and patches matching nested Categories in currently cached Todo lists.
- [ ] Casing-only edits are treated according to the normalized lowercase storage decision.
- [ ] Server-function tests cover successful rename/recolor, ownership rejection, validation, and rename conflict failure.
- [ ] UI/cache behavior tests cover immediate picker save, global card update, failed edit feedback, and no dependency on submitting the Todo form.
- [ ] `pnpm run format`, `pnpm test`, and `cr --agent` have been run; actionable CodeRabbit comments are addressed or unavailability is stated.

## Blocked by

- .scratch/comprehensive-todo-dialog/issues/02-create-select-render-categories.md
