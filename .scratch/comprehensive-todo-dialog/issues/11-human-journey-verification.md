# Human journey verification for comprehensive Todo dialog

Status: done

## What to build

Perform a human-in-the-loop verification pass over the completed comprehensive Todo dialog work. This is a manual product journey review, not another implementation slice. The goal is to confirm the integrated user experience matches the PRD across create, edit, Bucket movement, Category management, Tag management, completion styling, deletion, and error handling.

Use the recap below as the minimum journey list to test:

- Create a Todo from an existing Bucket with a title, description, changed Bucket, new Category, and multiple Tags.
- Confirm the opened Bucket is preselected for quick capture, and that changing the Bucket before create sends the Todo to the selected Bucket.
- Confirm blank titles are rejected or disabled, and blank descriptions behave as no description.
- Confirm Todo cards show Tag badges and a Category left border, and completed Todos mute metadata colors.
- Click a Todo card to edit it, then verify the dialog initializes from existing title, description, Bucket, Category, and Tags.
- Click the completion checkbox and verify it toggles completion without opening edit mode.
- Cancel edit mode after unsaved Todo edits and verify the Todo is unchanged.
- Rename and recolor a selected Category while the dialog is open, then verify the change saves immediately and updates all visible Todos using it.
- Delete a selected Category while the dialog is open, then verify the current form switches to no Category and existing Todos are not deleted.
- Create duplicate Categories and verify the existing Category is selected without unexpected recoloring.
- Rename and recolor a selected Tag while the dialog is open, then verify the change saves immediately and updates all visible Todo badges using it.
- Delete a selected Tag while the dialog is open, then verify the current form removes that Tag and existing Todos are not deleted.
- Create duplicate Tags and verify the existing Tag is selected without unexpected recoloring.
- Move an existing Todo between Buckets from edit mode and verify the old and new Bucket columns update without unrelated refetch behavior.
- Delete a Todo from edit mode and verify the card is removed and the dialog closes.
- Trigger representative Todo save/delete and Tag/Category management failures, then verify errors appear in the correct dialog or picker location.
- Confirm another signed-in user cannot see, reuse, attach, update, or delete this user's Todos, Tags, Categories, or Buckets.
- Review whether the create and edit dialog flows feel understandable for both quick capture and focused editing.
- Review whether Category and Tag create, rename, recolor, and delete controls are discoverable without making the dialog feel noisy.
- Review whether confirmation flows clearly distinguish deleting reusable Tags/Categories from deleting Todos.
- Review whether color swatches are readable and feel coherent for both Categories and Tags.
- Review whether card click, checkbox click, and edit-mode deletion interactions feel distinct and hard to trigger accidentally.

## Acceptance criteria

- [ ] The journey list above has been executed against the completed feature.
- [ ] Picker discoverability, confirmation clarity, color swatch readability, card/checkbox/delete interaction distinction, and error placement have been reviewed from a product UX perspective.
- [ ] Any behavioral mismatch, confusing UX, or missing error state has been filed as a follow-up issue with reproduction notes.
- [ ] The reviewer confirms whether the feature is ready to ship for the WIP project state.

## Blocked by

- .scratch/comprehensive-todo-dialog/issues/01-create-rich-todos-from-bucket.md
- .scratch/comprehensive-todo-dialog/issues/02-create-select-render-categories.md
- .scratch/comprehensive-todo-dialog/issues/03-rename-recolor-categories.md
- .scratch/comprehensive-todo-dialog/issues/04-delete-categories-clear-todo-references.md
- .scratch/comprehensive-todo-dialog/issues/05-create-select-render-tags.md
- .scratch/comprehensive-todo-dialog/issues/06-rename-recolor-tags.md
- .scratch/comprehensive-todo-dialog/issues/07-delete-tags-remove-todo-associations.md
- .scratch/comprehensive-todo-dialog/issues/08-edit-existing-todos-from-cards.md
- .scratch/comprehensive-todo-dialog/issues/09-move-todos-between-buckets-from-edit-mode.md
- .scratch/comprehensive-todo-dialog/issues/10-delete-todos-from-edit-mode.md
