# Comprehensive Todo Dialog

Status: ready-for-agent

## Problem Statement

The current add todo dialog is a dummy implementation that only captures a title and assumes the bucket from the entry point. It does not persist or edit a description, does not allow choosing a different bucket, does not support reusable tags or categories, and cannot edit or delete existing todos.

The current model is also inconsistent: the shared todo type mentions description and category, while the database and server functions only persist title, completion, creation time, bucket, and user ownership. The server functions need stronger ownership checks before the app exposes richer todo editing and bucket movement.

Users need a complete "Add New Task" dialog that can also become the edit dialog for existing todos, while preserving Todo Buckets' performance-oriented cache updates and the project's domain language.

## Solution

Replace the dummy add todo dialog with a comprehensive `TodoDialog` that supports both create and edit mode. In create mode, the dialog title is "Add New Task" and the primary button is "Add task". In edit mode, the dialog title is "Edit Task" and the primary button is "Save changes".

The dialog captures title, description, bucket, category, and tags. Title and bucket are required. Description, category, and tags are optional. When opened from a bucket, that bucket is preselected but still editable. When opened for an existing todo, the todo's current bucket wins over any passed bucket default.

Tags and categories are reusable user-owned entities. Tags are compact handles that can be associated with many todos, while a todo can have at most one category. The dialog lets users create, edit, recolor, and delete tags and categories directly from the picker UI. These reusable entity changes save immediately, independently of whether the todo dialog itself is submitted or cancelled.

Todo cards render the new metadata. Category is represented by a left colored border using the category color. Tags are rendered as colored badges near the top of the card. Completed todos retain their metadata but tag/category color styling loses opacity.

## User Stories

1. As a user, I want to open an "Add New Task" dialog from an existing bucket, so that I can create a todo from the board.
2. As a user, I want the add dialog to preselect the bucket I opened it from, so that quick entry stays fast.
3. As a user, I want to change the selected bucket in the add dialog, so that I can correct the destination without closing the dialog.
4. As a user, I want to enter a required title, so that every todo has a clear name.
5. As a user, I want the submit action disabled or rejected when the title is blank, so that empty todos are not created.
6. As a user, I want to enter an optional plain-text description, so that I can capture details without needing a separate note.
7. As a user, I want an empty description to behave as no description, so that I do not have to manage null-like states.
8. As a user, I want to choose no category, so that quick-capture todos do not require classification.
9. As a user, I want to choose one category for a todo, so that I can assign a macro area such as work or private life.
10. As a user, I want to create a category from inside the todo dialog, so that I can classify a todo without leaving the flow.
11. As a user, I want newly created categories to be selected automatically, so that the dialog matches my likely intent.
12. As a user, I want to rename a category from inside the todo dialog, so that I can correct reusable category names in context.
13. As a user, I want to recolor a category from inside the todo dialog, so that category accents stay meaningful.
14. As a user, I want to delete a category from inside the todo dialog after confirmation, so that I can clean up unused or unwanted categories.
15. As a user, I want deleting a category to clear it from todos rather than deleting todos, so that cleanup is not destructive.
16. As a user, I want category changes to be global, so that all todos using that category reflect the current name and color.
17. As a user, I want to choose zero or more tags for a todo, so that I can mark todos with multiple reusable handles.
18. As a user, I want to create a tag from inside the todo dialog, so that I can label a todo without leaving the flow.
19. As a user, I want newly created tags to be selected automatically, so that the current todo receives the tag I just created.
20. As a user, I want to rename a tag from inside the todo dialog, so that reusable tag names can be corrected in context.
21. As a user, I want to recolor a tag from inside the todo dialog, so that tag badges remain visually useful.
22. As a user, I want to delete a tag from inside the todo dialog after confirmation, so that I can clean up unwanted tags.
23. As a user, I want deleting a tag to remove it from todos rather than deleting todos, so that cleanup is not destructive.
24. As a user, I want tag changes to be global, so that all todos using that tag reflect the current name and color.
25. As a user, I want duplicate tag creation to select the existing tag instead of creating another one, so that my tag list stays clean.
26. As a user, I want duplicate category creation to select the existing category instead of creating another one, so that my category list stays clean.
27. As a user, I want duplicate create attempts to avoid recoloring existing tags or categories, so that a quick create action does not unexpectedly change other todos.
28. As a user, I want tag names normalized to lowercase compact handles with no spaces, so that tags remain consistent and easy to scan.
29. As a user, I want category names normalized to lowercase while allowing spaces, so that categories can be readable macro areas.
30. As a user, I want color choices to come from curated swatches, so that tags and categories look consistent and readable.
31. As a user, I want the same 20-color palette for tags and categories, so that color selection feels coherent.
32. As a user, I want existing todos to show their tags as badges on cards, so that I can scan labels from the board.
33. As a user, I want existing todos to show their category as a left border on cards, so that I can scan macro areas from the board.
34. As a user, I want completed todos to visually mute tag and category colors, so that completion state remains clear.
35. As a user, I want to click a todo card to edit it, so that editing an existing todo is easy to discover.
36. As a user, I want the completion checkbox click to complete the todo without opening edit mode, so that the card has distinct interactions.
37. As a user, I want the edit dialog to initialize from the existing todo values, so that I can make focused changes.
38. As a user, I want cancelling the dialog to discard unsaved todo changes, so that accidental edits do not persist.
39. As a user, I want successful create and edit actions to close the dialog, so that I return to the board after saving.
40. As a user, I want save failures to keep the dialog open and show an error, so that I can correct the problem.
41. As a user, I want to delete a todo from edit mode after confirmation, so that I can remove todos without needing a separate card action.
42. As a user, I want successful todo deletion to remove the card from the board and close the dialog, so that the UI reflects the result.
43. As a user, I want bucket changes during edit to move the todo between bucket columns, so that the board remains accurate.
44. As a user, I want tag/category management errors to appear near the picker action, so that I understand which operation failed.
45. As a user, I want todo save/delete errors to appear in the dialog, so that the main todo operation has clear feedback.
46. As a signed-in user, I want my tags and categories to be private to me, so that other users cannot see or reuse them.
47. As a signed-in user, I want todos to only reference my own buckets, tags, and categories, so that ownership boundaries are reliable.
48. As a developer, I want the client-facing todo data to include category and tag display data, so that cards do not need to join multiple caches during render.
49. As a developer, I want cache updates to be punctual after successful mutations, so that the board does not refetch unrelated data.
50. As a developer, I want the dialog to use existing form patterns, so that field wiring stays consistent with the rest of the app.

## Implementation Decisions

- Use `Todo` as the domain and code term. UI copy may say "Task" where it reads naturally.
- Rename the dialog component to `TodoDialog` because it handles create, edit, and edit-mode deletion.
- Rename the add button to `AddTodoButton` for consistency with its user-facing action.
- Keep one reusable dialog component. Create mode is inferred when no existing todo is passed. Edit mode is inferred when an existing todo is passed.
- Add card-click edit entry in this scope. The completion checkbox remains the dedicated completion target and should not trigger edit.
- Use TanStack Form for the main todo form. Reuse existing custom form field patterns and add generic shared fields only when they are shared-safe.
- Keep domain-specific dialog controls close to the board dialog implementation rather than creating standalone tag/category feature folders.
- Create a dedicated todo-dialog component folder because the dialog now includes multiple helper components.
- Keep title and bucket mandatory. Description, category, and tags are optional.
- Store description as a non-null text value where an empty string means no description.
- Do not expose completed status in the dialog. Completion remains a card interaction.
- Remove creation time from todo update input. Creation time is server-owned.
- Keep completed in todo update input for the existing toggle behavior.
- Include todo deletion in edit mode only, with a destructive footer button and confirmation.
- Keep todos fetched per bucket for this scope. Do not introduce a board-wide todo query.
- Return category and tag display data nested in todo query results, following the accepted ADR.
- Use separate list queries for all user-owned tags and categories for dialog picker/management options.
- Let the dialog own its bucket, tag, and category queries through TanStack Query. If data is already cached, the query reads cache-first.
- Patch TanStack Query caches only after successful server responses. Do not add optimistic updates in this MVP.
- On successful create, add the returned todo to the selected bucket cache.
- On successful update, replace the todo in place if the bucket is unchanged.
- On successful bucket move, remove the todo from the old bucket cache and add or replace it in the new bucket cache.
- On successful delete, remove the todo from its bucket cache.
- On successful tag update, update the tag list cache and patch matching nested tags in currently cached todo lists.
- On successful tag delete, remove the tag from the tag list cache and remove matching nested tags from currently cached todo lists.
- On successful category update, update the category list cache and patch matching nested categories in currently cached todo lists.
- On successful category delete, remove the category from the category list cache and set matching nested categories to null in currently cached todo lists.
- Tags are user-owned entities with unique normalized names per user.
- Categories are user-owned entities with unique normalized names per user.
- Tags use a many-to-many relationship with todos.
- Categories use a nullable category reference on todos with database-level delete behavior that clears the reference.
- Do not generate Drizzle migrations in this pass. Update schema code only; database push and data inconsistency handling will be managed manually while the project is WIP.
- Add separate server function modules for tag and category CRUD.
- Todo create/update accepts tag and category IDs, not tag/category names.
- Todo update replaces the full submitted tag set.
- Tag/category create and edit actions save immediately, independently from todo submit/cancel.
- Newly created tags/categories are automatically selected in the current dialog.
- Deleting a selected tag removes it from the current unsaved form selection.
- Deleting a selected category switches the current unsaved form to no category.
- Allow deleting a tag/category even if selected, after confirmation.
- Deleting a tag removes tag associations globally without deleting todos.
- Deleting a category clears category references globally without deleting todos.
- Duplicate tag/category creation returns the existing entity, selects it in the current dialog, and does not recolor or rename the existing entity.
- Tag/category rename conflicts should show an error rather than merging automatically.
- Names are trimmed, lowercased, length-limited, and unique per user after normalization.
- Tag names allow letters, numbers, hyphens, and underscores; no spaces.
- Category names allow spaces, with internal whitespace collapsed.
- Casing-only edits are not meaningful because names are stored lowercase.
- Use a shared curated palette of 20 color presets.
- Store `colorKey` on tags and categories rather than raw color values.
- Validate `colorKey` in shared server/client code rather than using a database enum.
- Unknown color keys should render with a default fallback preset.
- Category cards use the category preset's background/accent color for the left border.
- Tag badges use the preset's background and text colors.
- All todo, tag, and category server functions must verify ownership and same-user relationships.
- Harden existing bucket ownership checks in todo create, get, update, and delete paths.
- Moving a todo to a bucket must require an active bucket owned by the current user.
- Do not add new libraries for this feature unless the user approves first.

## Testing Decisions

- The best tests exercise external behavior at the highest practical seam: server functions for persistence and authorization behavior, and dialog/card behavior for user-visible workflows.
- Server-function tests, should cover ownership boundaries: users cannot create todos in another user's bucket, move todos into another user's bucket, attach another user's tag/category, update another user's reusable entities, or delete another user's todo.
- Server-function tests, should cover normalization: tag names lowercase and reject spaces, category names lowercase and collapse internal whitespace, duplicate create returns existing entities, and rename conflicts fail.
- Server-function tests, should cover relationship semantics: todo update replaces tag sets, deleting tags removes associations, and deleting categories clears todo category references.
- Dialog behavior tests, should verify create mode defaults from the passed bucket, edit mode initializes from the existing todo, title and bucket are required, submit calls the correct mutation, cancel resets unsaved values, and successful save closes the dialog.
- Card behavior tests, should verify card click opens edit, checkbox click toggles completion without opening edit, tags render as badges, category renders as a left border, and completed styling mutes metadata colors.
- Cache behavior should be checked through mutation hook behavior or integration-level assertions rather than by testing internal helper implementation details.
- Manual verification should include creating a todo with description, bucket, category, and tags; editing it; moving it between buckets; deleting a selected tag/category while the dialog is open; and deleting the todo from edit mode.
- `pnpm run format` and `pnpm test` must pass before code changes are considered complete.
- `cr --agent` must be invoked and actionable comments addressed before code changes are considered complete. If CodeRabbit is unavailable or unauthenticated, the implementer must state that clearly.

## Out of Scope

- Workspaces, teams, or shared tag/category ownership.
- Optimistic updates and rollback behavior.
- Reactive backend or live multi-client synchronization.
- Board-wide todo fetching.
- Free-form/custom color picking.
- Markdown or rich-text descriptions.
- Display-name casing separate from the normalized stored name.
- Todo deletion outside edit mode.
- Changing the completion interaction beyond preserving the existing checkbox behavior.
- Drag and drop behavior.
- Database migration generation for this WIP pass.
- Adding new third-party UI or data libraries.

## Further Notes

- The project glossary now defines Bucket, Todo, Category, and Tag. Use those terms in domain and code language.
- The UI may say "Task" for user-facing dialog copy, but the domain/code term remains Todo.
- ADRs exist for storing tags/categories as reusable user-owned entities and for returning todo display data with todos.
- The current implementation has known ownership gaps in todo server functions; hardening those gaps is part of this PRD, not a separate cleanup.
