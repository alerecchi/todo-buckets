# Create, select, and render Categories

Status: done

## What to build

Add the first usable Category path through the comprehensive Todo dialog. A signed-in user can list their Categories, create a normalized reusable Category from inside the dialog, have a newly created Category selected automatically, save a Todo with either no Category or one owned Category, and see that Category rendered on Todo cards as a colored left border. Todo query results should include nested Category display data so cards do not join against separate caches at render time.

This slice should introduce the shared color palette and `colorKey` validation needed for Category creation and rendering, while keeping rename, recolor, and delete flows for later slices.

## Acceptance criteria

- [ ] User-owned Categories are represented in schema code with normalized unique names per user and a nullable Category reference from Todos.
- [ ] Category create/list server functions enforce current-user ownership, normalize names to lowercase, collapse internal whitespace, validate length and `colorKey`, and return an existing matching Category on duplicate create without recoloring it.
- [ ] Todo create/update accepts a Category ID only when it belongs to the current user, and allows no Category.
- [ ] Todo query results include nested Category display data needed by cards.
- [ ] Shared client-facing Todo types match the nested Category display data returned by Todo server functions.
- [ ] Existing per-Bucket Todo fetching remains in place.
- [ ] The dialog can list Categories, choose no Category, create a Category from the picker, and auto-select the newly created or duplicate existing Category.
- [ ] Todo cards render a Category color as a left border, with completed Todos muting Category color styling.
- [ ] Unknown Category `colorKey` values render with the default fallback color preset.
- [ ] Server-function tests cover Category normalization, duplicate create behavior, ownership checks, and attaching another user's Category rejection.
- [ ] Dialog/card behavior tests cover no Category, create-and-select Category, Category rendering, and completed styling.
- [ ] `pnpm run format`, `pnpm test`, and `cr --agent` have been run; actionable CodeRabbit comments are addressed or unavailability is stated.

## Blocked by

- .scratch/comprehensive-todo-dialog/issues/01-create-rich-todos-from-bucket.md
