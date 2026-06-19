# Todo Drag and Drop

Status: ready-for-agent

## Problem Statement

Todo Buckets is organized around moving Todos from broader Buckets toward narrower Buckets, but the current board does not let users directly reorder Todos or move them between Buckets through the board itself. Users can move a Todo by editing it, but that workflow is heavier than the visual planning action the board suggests.

The current data model also lacks a durable Todo Position, so any visual ordering would be temporary or derived from incidental data such as creation time. Users need the board order to persist after refresh, across sessions, and after moving Todos between Buckets.

## Solution

Add drag-and-drop to the board so a signed-in user can drag a Todo by a dedicated handle, see a horizontal insertion line at the exact destination, and drop the Todo either within its current Bucket or into another Bucket. Dropping a Todo updates its durable Todo Position, and cross-Bucket drops atomically update both the Todo's Bucket and its position in that Bucket.

Buckets use fixed visible widths so the board can scroll horizontally on narrower screens. Each Bucket keeps its header visible while its Todo list scrolls internally. During drag, the board scrolls horizontally near board edges, and the Bucket currently under the dragged Todo scrolls vertically near its list edges.

Todo moves use optimistic TanStack Query updates for immediate feedback. If the server rejects a move because the client's anchors are stale or the mutation fails, the client rolls back to the previous cache snapshot, refetches affected Buckets, and shows a global toast. The first implementation uses `@dnd-kit/react` for drag mechanics and shadcn Sonner for global toasts.

## User Stories

1. As a signed-in user, I want to drag a Todo within its Bucket, so that I can decide the order of work in that planning horizon.
2. As a signed-in user, I want to drag a Todo from one Bucket to another, so that I can move work from a broader horizon toward a narrower horizon.
3. As a signed-in user, I want the Todo to land exactly where the insertion indicator shows, so that the board feels predictable.
4. As a signed-in user, I want the Todo's new Bucket to persist after I drop it, so that the board remains accurate after refresh.
5. As a signed-in user, I want the Todo's new position to persist after I drop it, so that my planning order is durable.
6. As a signed-in user, I want to reorder Todos without opening the edit dialog, so that planning the board stays fast.
7. As a signed-in user, I want a dedicated drag handle on each Todo card, so that clicking the card can still open edit mode.
8. As a signed-in user, I want the completion checkbox to keep toggling completion without starting a drag, so that card interactions stay distinct.
9. As a signed-in user, I want completed Todos to be draggable just like incomplete Todos, so that completion does not change placement rules.
10. As a signed-in user, I want a horizontal line to show the drop position between cards, so that I can place a Todo precisely.
11. As a signed-in user, I want the insertion line to appear before the first Todo, between Todos, and after the last Todo, so that every valid drop position is represented.
12. As a signed-in user, I want an empty Bucket to show a valid insertion line near the top of its Todo list, so that I can drop into empty Buckets confidently.
13. As a signed-in user, I want long Buckets to scroll internally during drag, so that I can drop a Todo into a position that is not visible at drag start.
14. As a signed-in user, I want only the Bucket currently under the dragged Todo to scroll vertically, so that scroll behavior follows my current drop intent.
15. As a signed-in user, I want the board to scroll horizontally while dragging near its left or right edge, so that I can move Todos across Buckets on narrower screens.
16. As a signed-in user, I want Bucket columns to keep stable widths, so that Todo cards stay readable and drop targets stay easy to hit.
17. As a signed-in user, I want each Bucket header to remain visible while its Todo list scrolls, so that I can keep orientation in long Buckets.
18. As a signed-in user, I want drag-and-drop to feel immediate, so that the board does not wait awkwardly for a server response after drop.
19. As a signed-in user, I want failed moves to snap back and refresh the affected Buckets, so that the board does not remain inconsistent.
20. As a signed-in user, I want a toast when a move cannot be saved, so that I understand why the board changed back.
21. As a signed-in user, I want stale-order conflicts to refresh the board, so that another change does not silently corrupt my Todo ordering.
22. As a signed-in user, I want newly created Todos to appear at the bottom of their Bucket, so that creation behavior remains simple and predictable.
23. As a signed-in user, I want the Bucket to scroll to a newly created Todo when needed, so that a Todo created in a long Bucket does not feel lost.
24. As a keyboard user, I want the drag handle to support the DnD library's keyboard interaction when reasonably available, so that reordering is not pointer-only.
25. As a keyboard user, I do not want extra move-up or move-down buttons in the first version, so that the Todo card stays focused and uncluttered.
26. As a developer, I want Todo ordering to be part of the domain model, so that UI order, server order, and database order do not drift.
27. As a developer, I want Todo Position stored as a sparse integer, so that most moves only update the moved Todo.
28. As a developer, I want occasional position rebalancing to happen server-side, so that sparse integer gaps remain usable over time.
29. As a developer, I want the client to send neighboring Todo anchors instead of raw positions, so that the server owns ordering correctness.
30. As a developer, I want anchor validation to reject stale or invalid moves, so that concurrent changes do not produce surprising order.
31. As a developer, I want ownership checks on dragged Todo, target Bucket, and anchor Todos, so that users cannot move or infer another user's data.
32. As a developer, I want Todo queries to return Todos in durable position order, so that every board render respects the persisted plan.
33. As a developer, I want optimistic cache updates to snapshot and restore affected Buckets, so that failure handling is reliable.
34. As a developer, I want the move server function to return enough data to patch affected Bucket caches, so that the board avoids unrelated refetches on success.
35. As a developer, I want conflict responses to be explicit, so that the client can distinguish stale ordering from generic failure.
36. As a developer, I want a global toast system available to board mutations, so that warnings and errors have one consistent presentation.
37. As a maintainer, I want the DnD implementation to use a library rather than custom pointer handling, so that touch, keyboard, collision, and scrolling behavior are maintainable.
38. As a maintainer, I want the implementation to respect the existing Board, Bucket, Todo, Category, and Tag domain vocabulary, so that the feature stays aligned with the glossary.

## Implementation Decisions

- Use `Todo` as the domain and code term. User-facing copy may continue to say "task" where that already reads naturally.
- Treat Todo Position as core domain behavior, not a board-only convenience. A Todo has one durable position within its current Bucket.
- Store Todo Position as a sparse integer named `position`, following the accepted ordering ADR.
- Create new Todos at the bottom of the selected Bucket by assigning a position after the current maximum position in that Bucket.
- Query Todos ordered by position so every board render and cache state reflects durable order.
- Add a dedicated server operation for moving a Todo by anchors. The operation accepts the moved Todo, the target Bucket, and optional before/after Todo anchors.
- The client does not send raw numeric positions. The server verifies ownership, verifies the target Bucket is active and owned by the user, verifies anchors belong to the target Bucket, and computes the new position.
- Same-Bucket reorders and cross-Bucket moves use the same domain operation. Cross-Bucket moves atomically update both Bucket and position.
- If anchors are stale or not adjacent in the server's current ordering, the server returns a conflict rather than guessing a new destination.
- Use sparse-position rebalancing when there is no integer gap between neighboring anchors. Rebalancing happens server-side and within the same correctness boundary as the move.
- Use `@dnd-kit/react` for drag-and-drop mechanics, following the accepted DnD library ADR.
- Add `@dnd-kit/react` to the tech stack list when the dependency is installed.
- Use a dedicated drag handle on the Todo card. The card body remains the edit affordance and the completion checkbox remains the completion affordance.
- Use a horizontal insertion line as the drop indicator. Do not use a placeholder card in the first version.
- The insertion line should support before-first, between-cards, after-last, and empty-Bucket positions.
- Use exact visible drop position semantics. The saved position must match the insertion line shown before drop.
- Make Bucket columns fixed-width enough for readable cards. The board scrolls horizontally when all Buckets do not fit.
- Make Bucket Todo lists internally scrollable, with the Bucket header outside the vertical scroll region.
- During drag, horizontal board scrolling is driven by proximity to the board or viewport edges.
- During drag, vertical scrolling is driven by the Bucket currently under the dragged Todo or pointer. Source Buckets do not keep scrolling after the drag moves over another Bucket.
- Use optimistic TanStack Query updates on drop. Snapshot affected Bucket caches before the optimistic move.
- On successful move, patch the affected Bucket caches using server-returned data or order.
- On failed move, restore the snapshots, invalidate or refetch affected Buckets, and show a toast.
- On stale-anchor conflict, restore the snapshots, refetch affected Buckets, and show a toast explaining that the board was refreshed.
- Add shadcn Sonner as the global toast system when implementing notifications, and add its `Toaster` at the root shell level.
- Add Sonner to the tech stack list when the dependency is installed.
- Newly created Todos append to the bottom of the selected Bucket and the Bucket list scrolls to reveal the new Todo when the list is scrollable.
- Completed Todos follow the same movement and ordering rules as incomplete Todos.
- Keyboard drag support should be included if the chosen DnD library makes it straightforward through the drag handle. Do not add separate move buttons in the first implementation.
- Realtime or reactive backend synchronization is a future direction. This PRD should keep the API conflict-aware so realtime invalidation can be added later.

## Testing Decisions

- Prefer testing external behavior rather than implementation details. Good tests should assert durable ordering, visible board behavior, cache consistency after mutations, and user-facing failure feedback.
- Use the existing server core behavior seam for Todo ordering rules. This should cover create-at-bottom, same-Bucket moves, cross-Bucket moves, sparse position calculation, no-gap rebalancing, stale-anchor conflicts, archived Bucket rejection, and cross-user ownership rejection.
- Use existing component test patterns for board behavior. Tests should cover drag handles, insertion-line visibility, exact drop destinations, cross-Bucket movement, and preservation of card click/edit and checkbox/complete behavior.
- Use TanStack Query cache behavior tests for optimistic move flows. Tests should verify optimistic movement, successful cache patching, rollback on failure, affected-Bucket refetch or invalidation, and toast triggering.
- Add a pure cache-helper seam only if optimistic move logic becomes complex enough to justify extraction. If the behavior remains readable at the board/mutation level, keep it covered through component tests.
- Use prior art from existing Todo server-function tests for ownership, validation, and mutation behavior.
- Use prior art from existing Todo card, edit dialog, and create button component tests for user-facing board interactions.
- Include tests for create-at-bottom behavior and scroll-to-new-Todo behavior where practical. If browser scroll behavior is hard to assert in unit tests, leave focused manual verification notes for that detail.
- Manual verification should include dragging within a Bucket, dragging between Buckets, dropping into an empty Bucket, dragging into a scrolled position in a long Bucket, horizontal board dragging on a narrow viewport, a failed/conflicted move, creating a Todo in a long Bucket, card click edit, checkbox completion, and completed Todo movement.

## Out of Scope

- Realtime or reactive backend synchronization between multiple active clients.
- Multi-select drag or moving multiple Todos at once.
- Separate move-up and move-down buttons.
- Placeholder-card drop indicators.
- Board-wide Todo fetching unless it becomes necessary for implementation correctness.
- Changing Category or Tag behavior.
- Changing the edit dialog's existing Bucket selection behavior beyond keeping it compatible with ordered Buckets.
- Todo deletion outside the existing edit-mode flow.
- Advanced mobile-specific gestures beyond what the DnD library provides.
- User-customizable Bucket widths.

## Further Notes

- The glossary defines Todo Position as durable planning state within a Bucket.
- The accepted sparse-position ADR records the decision to store positions as sparse integers and compute positions server-side from anchors.
- The accepted DnD ADR records the decision to use `@dnd-kit/react` rather than custom drag-and-drop, `@hello-pangea/dnd`, or Atlassian Pragmatic Drag and Drop.
- The server move API should be conflict-aware now so a future realtime invalidation or reactive backend layer can be added without changing the domain model.
- Dependencies discussed and approved during planning: `@dnd-kit/react` for drag-and-drop mechanics and shadcn Sonner for global toasts.
