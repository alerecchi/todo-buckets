# Move Todos by server-owned anchors

Status: ready-for-agent

## What to build

Add a dedicated move operation for changing a Todo's Bucket and Todo Position from neighboring Todo anchors. The client sends the moved Todo, target Bucket, and optional before/after Todo anchors; the server owns validation, conflict detection, sparse position calculation, and any rebalancing needed to preserve durable ordering.

## Acceptance criteria

- [ ] A server operation accepts moved Todo id, target Bucket id, and optional before/after Todo anchor ids.
- [ ] The operation supports same-Bucket reorders and cross-Bucket moves through the same domain behavior.
- [ ] Cross-Bucket moves atomically update both the Todo's Bucket and its Todo Position.
- [ ] The server verifies ownership for the moved Todo, target Bucket, and anchor Todos.
- [ ] The server rejects archived or unauthorized target Buckets.
- [ ] The server rejects anchors that are stale, invalid, not adjacent, or not in the target Bucket with an explicit conflict response.
- [ ] The server computes sparse positions without accepting raw client-provided positions.
- [ ] The server rebalances positions within the same correctness boundary when neighboring anchors leave no usable integer gap.
- [ ] The operation returns enough Todo and Bucket information for affected client caches to be patched on success.
- [ ] Server behavior tests cover same-Bucket moves, cross-Bucket moves, sparse position calculation between valid neighboring anchors, no-gap rebalancing, stale-anchor conflicts, archived Bucket rejection, and cross-user ownership rejection.

## Blocked by

- .scratch/todo-drag-and-drop/issues/01-persist-todo-position-and-render-ordered-buckets.md
