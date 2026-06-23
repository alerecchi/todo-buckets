# Add drag-friendly board and Bucket scrolling

Status: ready-for-agent

## What to build

Make the board layout support practical drag-and-drop across long Buckets and narrow screens. Bucket columns should have stable readable widths, each Bucket's header should remain visible while its Todo list scrolls internally, and drag gestures should drive horizontal board scrolling and vertical scrolling for the Bucket currently under the dragged Todo.

## Acceptance criteria

- [ ] Bucket columns use fixed visible widths that keep Todo cards readable and drop targets easy to hit.
- [ ] The board scrolls horizontally when all Buckets do not fit in the viewport.
- [ ] Each Bucket header remains visible while only its Todo list scrolls vertically.
- [ ] During drag, the board scrolls horizontally near the board or viewport left and right edges.
- [ ] During drag, only the Bucket currently under the dragged Todo or pointer scrolls vertically near its list edges.
- [ ] Source Buckets stop auto-scrolling vertically once the drag intent moves over another Bucket.
- [ ] Layout changes do not introduce overlapping text or unstable Todo card dimensions at desktop or narrow viewport sizes.
- [ ] Component or interaction tests cover fixed-width columns, internal Bucket scrolling, horizontal drag scrolling, and current-Bucket-only vertical drag scrolling where practical.
- [ ] Manual verification notes cover dragging into a scrolled position in a long Bucket and horizontal board dragging on a narrow viewport.

## Blocked by

- .scratch/todo-drag-and-drop/issues/04-move-todos-across-buckets-with-precise-drop-placement.md
