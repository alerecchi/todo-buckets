import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'
import type { TodoDbInsert } from '@/features/shared/db/types'
import { db } from '@/features/shared/db/client'
import { todos } from '@/features/shared/db/schema'

const AddTodoInput = z.object({
  title: z.string().min(1),
  bucketId: z.number(),
  // TODO add user
})

const GetTodosInput = z.object({
  bucketId: z.int(),
})

const UpdateTodoInput = z.object({
  id: z.int(),
  title: z.string().optional(),
  bucketId: z.int().optional(),
  completed: z.boolean().optional(),
  createdAt: z.date().optional(),
  userId: z.int().optional(), // TODO Not optional when adding auth or maybe remove it because it can be taken from session
})

const DeleteTodoInput = z.object({
  id: z.int(),
})

export const createTodo = createServerFn({ method: 'POST' })
  .inputValidator(AddTodoInput)
  .handler(async ({ data }) => {
    const newTodo: TodoDbInsert = {
      title: data.title,
      bucketId: data.bucketId,
      completed: false,
      createdAt: new Date(),
      userId: 4, // TODO change with actual user id
    }
    //TODO Before inserting a new todo, verify that The target bucket exists and The bucket belongs to the authenticated user (when auth is implemented)
    return (await db.insert(todos).values(newTodo).returning())[0]
  })

export const getTodos = createServerFn()
  .inputValidator(GetTodosInput)
  .handler(async ({ data }) => {
    return db.select().from(todos).where(eq(todos.bucketId, data.bucketId)) // TODO add user check
  })

export const updateTodo = createServerFn({ method: 'POST' })
  .inputValidator(UpdateTodoInput)
  .handler(async ({ data }) => {
    // TODO possible extra checks
    // 1. Verify todo exists and belongs to user
    // 2. If moving to a different bucket, validate target bucket
    // 3. Business rule: Cannot move to archived or pending transition buckets

    // TODO Update/delete operations return undefined for non-existent IDs.

    const { id, ...updates } = data
    return (
      await db
        .update(todos)
        .set({ ...updates })
        .where(eq(todos.id, id))
        .returning()
    )[0]
  })

export const deleteTodo = createServerFn({ method: 'POST' })
  .inputValidator(DeleteTodoInput)
  .handler(async ({ data }) => {
    // TODO Add ownership validation before deletion.
    // TODO Update/delete operations return undefined for non-existent IDs.
    return (
      await db
        .delete(todos)
        .where(eq(todos.id, data.id))
        .returning({ todoId: todos.id, bucketId: todos.bucketId })
    )[0]
  })
