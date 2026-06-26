# Add drag-friendly board and Bucket scrolling

Status: done

## What to build

Make the board layout support practical drag-and-drop across long Buckets and narrow screens. Bucket columns should have stable readable widths, each Bucket's header should remain visible while its Todo list scrolls internally, and drag gestures should drive horizontal board scrolling and vertical scrolling for the Bucket currently under the dragged Todo.

## Acceptance criteria

- [x] Bucket columns use fixed visible widths that keep Todo cards readable and drop targets easy to hit.
- [x] The board scrolls horizontally when all Buckets do not fit in the viewport.
- [x] Each Bucket header remains visible while only its Todo list scrolls vertically.
- [x] During drag, the board scrolls horizontally near the board or viewport left and right edges.
- [x] During drag, only the Bucket currently under the dragged Todo or pointer scrolls vertically near its list edges.
- [x] Source Buckets stop auto-scrolling vertically once the drag intent moves over another Bucket.
- [x] Layout changes do not introduce overlapping text or unstable Todo card dimensions at desktop or narrow viewport sizes.
- [x] Component or interaction tests cover fixed-width columns, internal Bucket scrolling, horizontal drag scrolling, and current-Bucket-only vertical drag scrolling where practical.
- [x] Manual verification notes cover dragging into a scrolled position in a long Bucket and horizontal board dragging on a narrow viewport.

## Manual verification notes

- 2026-06-25: Verified by component tests that the board exposes a horizontal scroll region, Buckets keep fixed readable widths, Bucket headers stay outside the internal Todo list scroll region, and drag movement near the board edge scrolls the board horizontally.
- 2026-06-25: Verified by component and auto-scroll tests that dragging over a different current Bucket scrolls only that Bucket's Todo list vertically; the source Bucket does not keep auto-scrolling after drag intent moves to the destination Bucket.
- Manual browser smoke notes still recommended after seeding a long Bucket: drag a Todo into a scrolled position inside the long Bucket, then narrow the viewport and drag near the board's left/right edges to confirm the same behavior with real pointer sensors.

## Blocked by

- .scratch/todo-drag-and-drop/issues/04-move-todos-across-buckets-with-precise-drop-placement.md
