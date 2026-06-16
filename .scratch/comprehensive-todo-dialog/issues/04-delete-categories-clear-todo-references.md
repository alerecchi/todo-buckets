# Delete Categories and clear Todo references

Status: done

## What to build

Let a signed-in user delete their own Categories from inside the Todo dialog after confirmation. Deleting a Category must clear Category references from Todos rather than deleting Todos. If the deleted Category is selected in the currently open dialog, the unsaved Todo form switches to no Category. Existing Todo cards should remove the Category border through punctual cache patching.

## Acceptance criteria

- [ ] Category delete server functions enforce current-user ownership and use the schema relationship behavior that clears Todo Category references.
- [ ] The Category picker allows deleting a Category after confirmation, including the currently selected Category.
- [ ] Successful Category deletion removes it from the Category list cache and sets matching nested Categories to null in currently cached Todo lists.
- [ ] If the deleted Category was selected in the open dialog, the unsaved form selection changes to no Category without submitting the Todo.
- [ ] Picker-local errors are shown when Category deletion fails.
- [ ] Server-function tests cover successful delete, ownership rejection, and Todo reference clearing.
- [ ] UI/cache behavior tests cover confirmation, selected-Category deletion, card border removal, and failed delete feedback.
- [ ] `pnpm run format`, `pnpm test`, and `cr --agent` have been run; actionable CodeRabbit comments are addressed or unavailability is stated.

## Blocked by

- .scratch/comprehensive-todo-dialog/issues/02-create-select-render-categories.md
