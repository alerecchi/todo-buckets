# Handle move failures and stale-order conflicts

Status: ready-for-agent

## What to build

Harden Todo move mutations so optimistic drag-and-drop never leaves the board inconsistent. Move attempts should snapshot affected Bucket caches, restore them on failure or stale-anchor conflict, refresh affected Buckets, and show a global toast explaining what happened.

## Acceptance criteria

- [ ] shadcn Sonner is installed/configured as the app's global toast system and added to the documented tech stack.
- [ ] A root-level `Toaster` is available to board mutations.
- [ ] Todo move mutations snapshot all affected Bucket caches before applying an optimistic move.
- [ ] Successful moves patch affected Bucket caches from server-returned data without refetching unrelated board data.
- [ ] Generic move failures restore the previous cache snapshots, refresh or invalidate affected Buckets, and show a global error toast.
- [ ] Stale-anchor conflicts restore the previous cache snapshots, refetch affected Buckets, and show a toast explaining that the board was refreshed.
- [ ] Conflict handling distinguishes stale ordering from generic mutation failure.
- [ ] Cache behavior tests cover optimistic movement, successful cache patching, rollback on failure, affected-Bucket refresh or invalidation, and toast triggering.
- [ ] Manual verification notes cover at least one failed or conflicted move.
- [ ] `pnpm run format`, `pnpm test`, and `cr --agent` have been run; actionable CodeRabbit comments are addressed or unavailability is stated.

## Blocked by

- .scratch/todo-drag-and-drop/issues/04-move-todos-across-buckets-with-precise-drop-placement.md
