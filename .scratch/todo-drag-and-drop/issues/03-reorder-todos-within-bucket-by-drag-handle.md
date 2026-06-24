# Reorder Todos within a Bucket by drag handle

Status: done

## What to build

Enable signed-in users to reorder Todos within a Bucket directly on the board by dragging a dedicated handle on each Todo card. The card body should keep opening edit mode, the completion checkbox should keep toggling completion, and the saved Todo Position should match the visible horizontal insertion line.

## Acceptance criteria

- [x] `@dnd-kit/react` is installed for drag-and-drop mechanics and added to the documented tech stack.
- [x] Each Todo card exposes a dedicated drag handle while preserving card-click edit behavior.
- [x] The completion checkbox toggles completion without starting a drag.
- [x] Same-Bucket dragging shows a horizontal insertion line before the first Todo, between Todos, and after the last Todo.
- [x] The horizontal insertion line is the only drop-position indicator; no placeholder-card drop indicator is introduced.
- [x] Dropping within the same Bucket calls the anchor-based move operation with anchors matching the visible insertion line.
- [x] The board updates optimistically enough that reordering feels immediate.
- [x] Completed Todos remain draggable with the same placement rules as incomplete Todos.
- [x] Keyboard drag support is wired through the DnD library's handle behavior where reasonably available.
- [x] No separate move-up or move-down buttons are added.
- [x] Component tests cover drag handle presence, same-Bucket insertion-line placement, same-Bucket drop destination, card click edit preservation, and checkbox behavior preservation.

## Blocked by

- .scratch/todo-drag-and-drop/issues/02-move-todos-by-server-owned-anchors.md
