# Move Todos between Buckets from edit mode

Status: ready-for-agent

## What to build

Complete the edit-mode Bucket movement path. A signed-in user can change the selected Bucket while editing an existing Todo, save the change, and see the Todo move from the old Bucket column to the new Bucket column without refetching unrelated board data.

## Acceptance criteria

- [x] Edit mode lets the user choose a different active Bucket owned by the current user.
- [x] Moving a Todo to another Bucket requires the target Bucket to be active and owned by the current user.
- [x] Successful Bucket move removes the Todo from the old Bucket cache and adds or replaces it in the new Bucket cache using the returned Todo display data.
- [x] Failed Bucket moves keep the dialog open and show a main Todo operation error.
- [x] Server-function tests cover successful Bucket moves, archived target rejection, and another user's Bucket rejection.
- [x] Dialog/cache behavior tests cover Bucket move save, old-column removal, new-column add/replace, and failed-move feedback.

## Blocked by

- .scratch/comprehensive-todo-dialog/issues/08-edit-existing-todos-from-cards.md
