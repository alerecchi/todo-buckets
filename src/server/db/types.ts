import type { buckets, categories, tags, todos, users } from './schema'

export type BucketDb = typeof buckets.$inferSelect
export type CategoryDbSelect = typeof categories.$inferSelect
export type CategoryDbInsert = typeof categories.$inferInsert
export type TagDbSelect = typeof tags.$inferSelect
export type TagDbInsert = typeof tags.$inferInsert
export type TodoDbSelect = typeof todos.$inferSelect
export type TodoDbInsert = typeof todos.$inferInsert
export type UserDb = typeof users.$inferSelect
