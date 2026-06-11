# Delete Tags and remove Todo associations

Status: ready-for-agent

## What to build

Let a signed-in user delete their own Tags from inside the Todo dialog after confirmation. Deleting a Tag must remove Tag associations from Todos rather than deleting Todos. If the deleted Tag is selected in the currently open dialog, the unsaved Todo form removes it from the selected Tag set. Existing Todo cards should remove the Tag badge through punctual cache patching.

## Acceptance criteria

- [ ] Tag delete server functions enforce current-user ownership and remove Tag associations globally without deleting Todos.
- [ ] The Tag picker allows deleting a Tag after confirmation, including a currently selected Tag.
- [ ] Successful Tag deletion removes it from the Tag list cache and removes matching nested Tags from currently cached Todo lists.
- [ ] If the deleted Tag was selected in the open dialog, the unsaved form selection removes that Tag without submitting the Todo.
- [ ] Picker-local errors are shown when Tag deletion fails.
- [ ] Server-function tests cover successful delete, ownership rejection, and association cleanup.
- [ ] UI/cache behavior tests cover confirmation, selected-Tag deletion, badge removal, and failed delete feedback.
- [ ] `pnpm run format`, `pnpm test`, and `cr --agent` have been run; actionable CodeRabbit comments are addressed or unavailability is stated.

## Blocked by

- .scratch/comprehensive-todo-dialog/issues/05-create-select-render-tags.md
