import { buckets, todos, users } from './schema'

export type BucketDb = typeof buckets.$inferSelect
export type TodoDbSelect = typeof todos.$inferSelect
export type TodoDbInsert = typeof todos.$inferInsert
export type UserDb = typeof users.$inferSelect
