# Reveal newly created Todos in long Buckets

Status: done

## What to build

Polish the create flow for ordered Buckets so a newly created Todo appears at the bottom of its Bucket and is revealed when the Todo list is scrollable. A user should not feel that a successfully created Todo disappeared into a long Bucket.

## Acceptance criteria

- [ ] Newly created Todos continue to append to the bottom of the selected Bucket according to durable Todo Position.
- [ ] When creating a Todo in a scrollable Bucket list, the Bucket scrolls to reveal the new Todo when needed.
- [ ] The behavior works whether the Todo was created from its original Bucket or from another selected Bucket in the create dialog.
- [ ] Existing create success cache patching remains scoped to the destination Bucket.
- [ ] Create behavior tests cover create-at-bottom and destination-Bucket cache patching.
- [ ] Scroll-to-new-Todo behavior is covered by a focused component test where practical; otherwise manual verification notes explain the limitation.

## Blocked by

- .scratch/todo-drag-and-drop/issues/01-persist-todo-position-and-render-ordered-buckets.md
