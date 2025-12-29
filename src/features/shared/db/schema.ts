import {
  integer,
  pgTable,
  varchar,
  pgEnum,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
})

export const bucketStatusEnum = pgEnum('bucket_status', ['active', 'archived'])
export const bucketTypeEnum = pgEnum('bucket_type', [
  'inbox',
  'yearly',
  'monthly',
  'weekly',
  'daily',
])

export const bucketsTable = pgTable('buckets', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  period: varchar({ length: 20 }).notNull(),
  type: bucketTypeEnum().notNull(),
  status: bucketStatusEnum().notNull(),
  userId: integer("user_id")
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
})

export const todosTable = pgTable('todos', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  completed: boolean().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  bucketId: integer("bucket_id")
    .references(() => bucketsTable.id, { onDelete: 'cascade' })
    .notNull(),
  userId: integer("user_id")
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
})
