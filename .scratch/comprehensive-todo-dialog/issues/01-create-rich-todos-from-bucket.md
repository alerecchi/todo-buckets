# Create rich Todos from a Bucket

Status: ready-for-agent

## What to build

Replace the dummy add flow with `TodoDialog` create mode so a signed-in user can create a Todo from any Bucket, keep the opened Bucket preselected, change the selected Bucket before saving, and capture an optional plain-text description. Title and Bucket are required, descriptions are stored as non-null text where an empty string means no description, successful creates close the dialog and patch only the selected Bucket's todo cache, and save failures keep the dialog open with clear feedback.

This slice should also harden the baseline Todo server behavior so create, read, update, move, and delete operations all respect signed-in user ownership. Todos must only be created in, read from, or moved into active Buckets owned by the current user, and update/delete operations must verify that the Todo belongs to the current user before mutating data.

## Acceptance criteria

- [ ] The add button opens `TodoDialog` in create mode with title copy "Add New Task" and a primary action labelled "Add task".
- [ ] The dialog uses the opened Bucket as the default, lets the user choose another active owned Bucket, and rejects missing title or missing Bucket.
- [ ] Creating a Todo persists title, description, Bucket, completed=false, server-owned creation time, and current user ownership.
- [ ] Todo persistence includes a non-null description value, and blank or whitespace-only descriptions are normalized to an empty string.
- [ ] Reading Todos for a Bucket only succeeds for active Buckets owned by the signed-in user.
- [ ] Updating a Todo only succeeds when the Todo belongs to the signed-in user, and creation time is not exposed as client-editable update input.
- [ ] Moving a Todo to another Bucket requires the target Bucket to be active and owned by the signed-in user.
- [ ] Deleting a Todo only succeeds when the Todo belongs to the signed-in user.
- [ ] Unauthorized or invalid ownership paths fail clearly instead of silently mutating data.
- [ ] Successful create closes the dialog and patches only the destination Bucket todo query cache with the returned Todo.
- [ ] Save errors keep the dialog open and show an error near the main Todo operation.
- [ ] Server-function tests cover title validation, active owned Bucket checks, update/delete ownership, move target ownership, and rejection of another user's Bucket.
- [ ] Dialog behavior tests cover default Bucket selection, Bucket changes, required fields, successful close, and failed-save behavior.
- [ ] `pnpm run format`, `pnpm test`, and `cr --agent` have been run; actionable CodeRabbit comments are addressed or unavailability is stated.

## Blocked by

None - can start immediately
