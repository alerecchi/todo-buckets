import { relations } from 'drizzle-orm'
import { boolean, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

import { CATEGORY_COLOR_KEYS } from '../../../lib/types/Category'
import { users } from './auth-schema'

export const BucketStatus = pgEnum('bucket_status', ['active', 'archived'])
export const BucketTypeEnum = pgEnum('bucket_type', ['inbox', 'yearly', 'monthly', 'weekly', 'daily'])
export const CategoryColorKeyEnum = pgEnum('category_color_key', CATEGORY_COLOR_KEYS)

export const buckets = pgTable('buckets', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  period: text().notNull(),
  type: BucketTypeEnum().notNull(),
  status: BucketStatus().notNull(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
})

export const categories = pgTable(
  'categories',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    colorKey: CategoryColorKeyEnum('color_key').notNull(),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [uniqueIndex('categories_user_id_name_unique').on(table.userId, table.name)],
)

export const todos = pgTable('todos', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  description: text().notNull(),
  completed: boolean().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  bucketId: integer('bucket_id')
    .references(() => buckets.id, { onDelete: 'cascade' })
    .notNull(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
})

export const todosRelations = relations(todos, ({ one }) => ({
  bucket: one(buckets, {
    fields: [todos.bucketId],
    references: [buckets.id],
  }),
  category: one(categories, {
    fields: [todos.categoryId],
    references: [categories.id],
  }),
}))

export const bucketsRelations = relations(buckets, ({ many }) => ({
  todos: many(todos),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  todos: many(todos),
}))
