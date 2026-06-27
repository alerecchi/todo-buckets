# Handle move failures and stale-order conflicts

Status: done

## What to build

Harden Todo move mutations so optimistic drag-and-drop never leaves the board inconsistent. Move attempts should snapshot affected Bucket caches, restore them on failure or stale-anchor conflict, refresh affected Buckets, and show a global toast explaining what happened.

## Acceptance criteria

- [x] shadcn Sonner is installed/configured as the app's global toast system and added to the documented tech stack.
- [x] A root-level `Toaster` is available to board mutations.
- [x] Todo move mutations snapshot all affected Bucket caches before applying an optimistic move.
- [x] Successful moves patch affected Bucket caches from server-returned data without refetching unrelated board data.
- [x] Generic move failures restore the previous cache snapshots, refresh or invalidate affected Buckets, and show a global error toast.
- [x] Stale-anchor conflicts restore the previous cache snapshots, refetch affected Buckets, and show a toast explaining that the board was refreshed.
- [x] Conflict handling distinguishes stale ordering from generic mutation failure.
- [x] Cache behavior tests cover optimistic movement, successful cache patching, rollback on failure, affected-Bucket refresh or invalidation, and toast triggering.
- [x] Manual verification notes cover at least one failed or conflicted move.

## Blocked by

- .scratch/todo-drag-and-drop/issues/04-move-todos-across-buckets-with-precise-drop-placement.md

## Verification notes

- Failed move path: simulated a rejected cross-Bucket drag move through `TodoDragDropProvider`; verified affected Bucket caches restore to their snapshots, affected Bucket todo queries invalidate, and a global error toast is triggered.
- Stale ordering conflict path: simulated a 409 `Todo move conflict; refresh and retry` response through the same drag surface; verified affected Bucket caches restore, affected Bucket todo queries refetch, generic invalidation is skipped, and a refreshed-board toast is triggered.
