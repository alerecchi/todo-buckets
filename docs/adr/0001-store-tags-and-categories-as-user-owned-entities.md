# Store Tags and Categories as User-Owned Entities

Tags and categories are reusable user-owned concepts, so they are stored as entities rather than free-text todo fields. Tags use a many-to-many relationship with todos because a todo can have multiple tags, while categories use a nullable `category_id` on todos with `ON DELETE SET NULL` because a todo can have at most one category and deleting a category should not delete or rewrite todos in application code.
