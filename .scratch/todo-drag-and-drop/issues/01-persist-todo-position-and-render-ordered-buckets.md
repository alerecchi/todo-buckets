# Persist Todo Position and render ordered Buckets

Status: ready-for-agent

## What to build

Make Todo Position part of the durable Todo domain model. A signed-in user's Todos should have a sparse integer position within their current Bucket, new Todos should be appended to the bottom of the selected Bucket, and every board render should use persisted Todo Position rather than incidental creation order.

## Acceptance criteria

- [ ] Todos persist a non-null sparse integer `position` within their current Bucket.
- [ ] Existing Todo creation assigns a position after the current maximum position in the selected active owned Bucket.
- [ ] Todo reads for a Bucket return Todos in durable Todo Position order.
- [ ] Existing Todo display data includes the persisted position needed by client cache and board behavior.
- [ ] Existing create and edit flows continue to work without changing Category, Tag, completion, or edit-dialog behavior.
- [ ] Server behavior tests cover create-at-bottom and ordered reads.
- [ ] Relevant migration/schema changes are included and generated consistently with the project's Drizzle setup.
- [ ] `pnpm run format`, `pnpm test`, and `cr --agent` have been run; actionable CodeRabbit comments are addressed or unavailability is stated.

## Blocked by

None - can start immediately
