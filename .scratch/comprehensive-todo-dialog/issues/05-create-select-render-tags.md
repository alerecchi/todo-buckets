# Create, select, and render Tags

Status: done

## What to build

Add the first usable Tag path through the comprehensive Todo dialog. A signed-in user can list their Tags, create normalized reusable Tags from inside the dialog, have newly created Tags selected automatically, save a Todo with zero or more owned Tags, and see selected Tags rendered as colored badges on Todo cards. Todo query results should include nested Tag display data so cards do not join against separate caches at render time.

This slice should reuse the shared color palette and `colorKey` validation introduced for Categories, while keeping Tag rename, recolor, and delete flows for later slices.

## Acceptance criteria

- [x] User-owned Tags are represented in schema code with normalized unique names per user and a many-to-many relationship with Todos.
- [x] Tag create/list server functions enforce current-user ownership, normalize names to lowercase compact handles, reject spaces and invalid characters, validate length and `colorKey`, and return an existing matching Tag on duplicate create without recoloring it.
- [x] Todo create/update accepts Tag IDs only when they all belong to the current user, and allows an empty Tag set.
- [x] Todo update replaces the full submitted Tag set.
- [x] Todo query results include nested Tag display data needed by cards.
- [x] Shared client-facing Todo types match the nested Tag display data returned by Todo server functions.
- [x] Existing per-Bucket Todo fetching remains in place.
- [x] The dialog can list Tags, choose zero or more Tags, create a Tag from the picker, and auto-select the newly created or duplicate existing Tag.
- [x] Todo cards render Tags as colored badges near the top of the card, with completed Todos muting Tag color styling.
- [x] Unknown Tag `colorKey` values render with the default fallback color preset.
- [x] Server-function tests cover Tag normalization, duplicate create behavior, ownership checks, another user's Tag rejection, and full-set replacement.
- [x] Dialog/card behavior tests cover zero Tags, create-and-select Tag, multiple selected Tags, Tag badge rendering, and completed styling.
- [x] `pnpm run format`, `pnpm test`, and `cr --agent` have been run; actionable CodeRabbit comments are addressed or unavailability is stated.

## Blocked by

- .scratch/comprehensive-todo-dialog/issues/01-create-rich-todos-from-bucket.md
