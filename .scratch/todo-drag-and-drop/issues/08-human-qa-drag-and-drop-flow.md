# Human QA for drag-and-drop board flow

Status: human-in-the-loop

## What to build

Run a human-in-the-loop QA pass for the completed drag-and-drop board flow. This ticket should verify the user-visible workflow after the implementation tickets are complete, with special attention to behaviors that are hard to assert reliably in unit or component tests.

## Acceptance criteria

- [ ] Manual verification covers dragging a Todo within a Bucket.
- [ ] Manual verification covers dragging a Todo between Buckets.
- [ ] Manual verification covers dropping a Todo into an empty Bucket.
- [ ] Manual verification covers dragging into a scrolled position in a long Bucket.
- [ ] Manual verification covers horizontal board dragging on a narrow viewport.
- [ ] Manual verification covers at least one failed or conflicted move.
- [ ] Manual verification covers creating a Todo in a long Bucket and confirming the new Todo is revealed when needed.
- [ ] Manual verification covers card click opening edit mode after drag-and-drop is enabled.
- [ ] Manual verification covers the completion checkbox toggling completion without starting a drag.
- [ ] Manual verification covers completed Todo movement within and across Buckets.
- [ ] Manual verification results are recorded with any defects linked to follow-up tickets.

## Blocked by

- .scratch/todo-drag-and-drop/issues/03-reorder-todos-within-bucket-by-drag-handle.md
- .scratch/todo-drag-and-drop/issues/04-move-todos-across-buckets-with-precise-drop-placement.md
- .scratch/todo-drag-and-drop/issues/05-add-drag-friendly-board-and-bucket-scrolling.md
- .scratch/todo-drag-and-drop/issues/06-handle-move-failures-and-stale-order-conflicts.md
- .scratch/todo-drag-and-drop/issues/07-reveal-newly-created-todos-in-long-buckets.md
