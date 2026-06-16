# Delete Todos from edit mode

Status: done

## What to build

Add edit-mode Todo deletion. A signed-in user can delete an existing Todo from the edit dialog after confirmation. Successful deletion removes the card from the board and closes the dialog; failures keep the dialog open with clear feedback.

## Acceptance criteria

- [x] Edit mode shows a destructive delete action in the dialog footer and asks for confirmation before deleting.
- [x] Todo deletion verifies the Todo belongs to the current user before deleting it.
- [x] Successful deletion returns enough data to remove the Todo from its Bucket cache and close the dialog.
- [x] Failed deletion keeps the dialog open and shows a main Todo operation error.
- [x] Todo deletion is not exposed outside edit mode in this scope.
- [x] Server-function tests cover successful delete, nonexistent Todo behavior, and another user's Todo rejection.
- [x] Dialog/cache behavior tests cover confirmation, successful card removal, close-on-success, and failed-delete feedback.

## Blocked by

- .scratch/comprehensive-todo-dialog/issues/08-edit-existing-todos-from-cards.md
