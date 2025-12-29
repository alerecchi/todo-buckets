import { bucketsTable, todosTable, usersTable } from './schema'

export type BucketDb = typeof bucketsTable.$inferSelect
export type TodoDb = typeof todosTable.$inferSelect
export type UserDb = typeof usersTable.$inferSelect
