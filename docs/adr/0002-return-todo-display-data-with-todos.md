# Return Todo Display Data with Todos

Todo queries return the category and tags needed to render each todo, rather than returning only relationship IDs and requiring board components to join against separate caches. This keeps card rendering simple while still allowing mutation hooks to patch cached todo lists precisely when tags or categories are renamed, recolored, deleted, added, or removed.
