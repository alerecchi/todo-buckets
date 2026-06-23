# Move Todos across Buckets with precise drop placement

Status: ready-for-agent

## What to build

Extend board drag-and-drop so a signed-in user can drag a Todo from one Bucket to another and drop it at the exact visible insertion line. Cross-Bucket drops should persist both the new Bucket and Todo Position, including when dropping into an empty Bucket.

## Acceptance criteria

- [ ] Dragging a Todo over another Bucket shows the horizontal insertion line at the exact target position.
- [ ] The insertion line supports before-first, between-Todos, after-last, and empty-Bucket positions.
- [ ] Empty Buckets show the horizontal insertion line near the top of the Todo list drop zone, and dropping there persists the Todo into that empty Bucket.
- [ ] The horizontal insertion line is the only drop-position indicator; no placeholder-card drop indicator is introduced.
- [ ] Dropping into another Bucket calls the anchor-based move operation with the target Bucket and anchors matching the visible insertion line.
- [ ] Successful cross-Bucket moves remove the Todo from the source Bucket cache and insert or replace it in the destination Bucket cache in position order.
- [ ] Completed Todos can be moved across Buckets with the same placement rules as incomplete Todos.
- [ ] Existing edit-dialog Bucket movement remains compatible with ordered Buckets.
- [ ] Category and Tag behavior is unchanged by drag-and-drop movement.
- [ ] Component tests cover cross-Bucket movement, empty-Bucket drop placement, exact destination persistence, completed Todo movement, and affected cache patching on success.

## Blocked by

- .scratch/todo-drag-and-drop/issues/03-reorder-todos-within-bucket-by-drag-handle.md
