import {
  integer,
  pgTable,
  varchar,
  pgEnum,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
})

export const BucketStatus = pgEnum('bucket_status', ['active', 'archived'])
export const BucketTypeEnum = pgEnum('bucket_type', [
  'inbox',
  'yearly',
  'monthly',
  'weekly',
  'daily',
])

export const buckets = pgTable('buckets', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  period: varchar({ length: 20 }).notNull(),
  type: BucketTypeEnum().notNull(),
  status: BucketStatus().notNull(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
})

export const todos = pgTable('todos', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  completed: boolean().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  bucketId: integer('bucket_id')
    .references(() => buckets.id, { onDelete: 'cascade' })
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
})
