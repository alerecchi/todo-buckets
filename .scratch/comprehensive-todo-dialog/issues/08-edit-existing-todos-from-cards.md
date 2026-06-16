# Edit existing Todos from cards

Status: ready-for-agent

## What to build

Turn the comprehensive Todo dialog into a reusable create/edit dialog by opening it in edit mode when a user clicks a Todo card. Edit mode initializes from the existing Todo values, lets the user change title, description, Category, and Tags, discards unsaved Todo changes on cancel, keeps the completion checkbox as the dedicated completion interaction, and closes after a successful save.

This slice should remove creation time from Todo update input, keep completed status out of the dialog, and preserve the existing checkbox completion behavior without accidentally opening edit mode.

## Acceptance criteria

- [ ] Clicking a Todo card opens `TodoDialog` in edit mode with title copy "Edit Task" and primary action labelled "Save changes".
- [ ] Clicking the completion checkbox toggles completion and does not open edit mode.
- [ ] Edit mode initializes title, description, Bucket, Category, and Tags from the existing Todo; the Todo's current Bucket wins over any passed Bucket default.
- [ ] Cancelling edit mode discards unsaved Todo changes while preserving independently saved Tag/Category management changes.
- [ ] Saving updates title, description, Category, and Tags for the owned Todo and closes the dialog on success.
- [ ] Save failures keep the dialog open and show an error near the main Todo operation.
- [ ] Server functions verify Todo ownership and same-user Category/Tag relationships for every update.
- [ ] Successful non-Bucket edits replace the Todo in place in the current Bucket cache.
- [ ] Server-function tests cover ownership rejection, another user's Category/Tag rejection, and update input validation.
- [ ] Card/dialog behavior tests cover card click edit, checkbox isolation, initial values, cancel reset, successful save, and failed-save feedback.

## Blocked by

- .scratch/comprehensive-todo-dialog/issues/01-create-rich-todos-from-bucket.md
- .scratch/comprehensive-todo-dialog/issues/02-create-select-render-categories.md
- .scratch/comprehensive-todo-dialog/issues/03-rename-recolor-categories.md
- .scratch/comprehensive-todo-dialog/issues/04-delete-categories-clear-todo-references.md
- .scratch/comprehensive-todo-dialog/issues/05-create-select-render-tags.md
- .scratch/comprehensive-todo-dialog/issues/06-rename-recolor-tags.md
- .scratch/comprehensive-todo-dialog/issues/07-delete-tags-remove-todo-associations.md
