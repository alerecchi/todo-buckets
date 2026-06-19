# Store Todo Positions as Sparse Integers

Todos have a durable position within their bucket, so the board stores each todo's `position` as a sparse integer rather than deriving order from creation time or rewriting dense indexes on every move. Drag-and-drop moves send the moved todo, target bucket, and neighboring todo anchors to the server; the server verifies ownership and anchor placement, computes the new sparse position, and rebalances a bucket only when gaps are exhausted.

**Considered Options**

- Dense integer indexes: simpler to read, but common moves rewrite many todos.
- Client-computed positions: fewer server reads, but correctness depends on stale client state.
- Fractional or string ranks: more insertion headroom, but more complexity than this early board needs.
