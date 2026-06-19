# Todo Buckets

Todo Buckets is a todo management context organized around moving work from broader time horizons into narrower ones.

## Language

**Bucket**:
A time-based container that holds todos for a planning horizon, such as this year, this month, this week, or today. Todos are expected to flow from broader buckets toward narrower buckets as they become more immediate.
_Avoid_: Column, lane.

**Todo**:
An item of work that a user wants to remember, plan, or complete within a bucket. User-facing text may call this a task when that reads more naturally.
_Avoid_: Task in domain and code language.

**Todo Position**:
The placement of a todo relative to other todos in the same bucket. A todo's position is part of the board's durable planning state, so moving a todo within or between buckets changes where it belongs in that ordered bucket.
_Avoid_: Ephemeral UI order, sort order.

**User**:
A person who uses the app. A user may have an authenticated session before completing every account-verification step; verification affects access rules, not whether the person is signed in.
_Avoid_: Account when referring to the person.

**Category**:
A reusable user-owned macro area that can be assigned to todos, such as work, private life, or home admin. A todo can have at most one category.
_Avoid_: Label, tag.

**Tag**:
A reusable user-owned marker that can be associated with one or more todos. Tags are compact handles; a todo can have zero or more tags.
_Avoid_: Label, category.
