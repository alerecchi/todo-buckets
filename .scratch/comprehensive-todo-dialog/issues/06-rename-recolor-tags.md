# Rename and recolor Tags

Status: ready-for-agent

## What to build

Let a signed-in user rename and recolor their existing Tags from inside the Todo dialog's Tag picker. These Tag edits save immediately and globally, independent of whether the Todo dialog is submitted or cancelled. Existing Todo cards using the edited Tag should reflect the updated handle and color through punctual cache patching.

## Acceptance criteria

- [ ] Tag update server functions enforce current-user ownership, normalize names to lowercase compact handles, validate `colorKey`, and reject rename conflicts instead of merging Tags.
- [ ] The Tag picker exposes edit controls for Tag name and color using the shared curated palette.
- [ ] Tag edit actions save immediately and show picker-local errors when the operation fails.
- [ ] Successful Tag rename/recolor updates the Tag list cache and patches matching nested Tags in currently cached Todo lists.
- [ ] Casing-only edits are treated according to the normalized lowercase storage decision.
- [ ] Server-function tests cover successful rename/recolor, ownership rejection, validation, invalid handle rejection, and rename conflict failure.
- [ ] UI/cache behavior tests cover immediate picker save, global badge update, failed edit feedback, and no dependency on submitting the Todo form.
- [ ] `pnpm run format`, `pnpm test`, and `cr --agent` have been run; actionable CodeRabbit comments are addressed or unavailability is stated.

## Blocked by

- .scratch/comprehensive-todo-dialog/issues/05-create-select-render-tags.md
