# Use dnd kit for Todo Drag and Drop

Todo drag-and-drop uses `@dnd-kit/react` rather than custom pointer handling or a more opinionated Kanban library. The board needs sortable movement within and across buckets, a custom insertion-line indicator, internal bucket scrolling, horizontal board scrolling, and TanStack Query optimistic updates, so dnd kit gives the needed control without owning the domain move semantics.

**Considered Options**

- Custom drag-and-drop: avoids a dependency, but would make pointer, touch, keyboard, collision, scrolling, and accessibility behavior application code.
- `@hello-pangea/dnd`: strong list ergonomics, but more opinionated about placeholders and drag lifecycle than this custom board interaction needs.
- Atlassian Pragmatic Drag and Drop: performant and modular, but more imperative plumbing for this React feature.
