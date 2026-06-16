# Delete Todos from edit mode

Status: ready-for-agent

## What to build

Add edit-mode Todo deletion. A signed-in user can delete an existing Todo from the edit dialog after confirmation. Successful deletion removes the card from the board and closes the dialog; failures keep the dialog open with clear feedback.

## Acceptance criteria

- [ ] Edit mode shows a destructive delete action in the dialog footer and asks for confirmation before deleting.
- [ ] Todo deletion verifies the Todo belongs to the current user before deleting it.
- [ ] Successful deletion returns enough data to remove the Todo from its Bucket cache and close the dialog.
- [ ] Failed deletion keeps the dialog open and shows a main Todo operation error.
- [ ] Todo deletion is not exposed outside edit mode in this scope.
- [ ] Server-function tests cover successful delete, nonexistent Todo behavior, and another user's Todo rejection.
- [ ] Dialog/cache behavior tests cover confirmation, successful card removal, close-on-success, and failed-delete feedback.
- [ ] `pnpm run format`, `pnpm test`, and `cr --agent` have been run; actionable CodeRabbit comments are addressed or unavailability is stated.

## Blocked by

- .scratch/comprehensive-todo-dialog/issues/08-edit-existing-todos-from-cards.md
