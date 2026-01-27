import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { users } from "./auth-schema"

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
  period: text().notNull(),
  type: BucketTypeEnum().notNull(),
  status: BucketStatus().notNull(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
})

export const todos = pgTable('todos', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  completed: boolean().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  bucketId: integer('bucket_id')
    .references(() => buckets.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
})
