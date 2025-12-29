import { integer, pgTable, varchar, pgEnum, boolean } from 'drizzle-orm/pg-core'

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
  userId: integer()
    .references(() => usersTable.id)
    .notNull(),
})

export const todosTable = pgTable('todos', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  completed: boolean().notNull(),
  bucketId: integer()
    .references(() => bucketsTable.id)
    .notNull(),
  userId: integer()
    .references(() => usersTable.id)
    .notNull(),
})
