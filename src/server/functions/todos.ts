import { createServerFn } from '@tanstack/react-start'
import { eq, and } from 'drizzle-orm'
import z from 'zod'

import { db } from '@/server/db/client'
import { buckets, todos } from '@/server/db/schema/schema'
import type { TodoDbInsert } from '@/server/db/types'
import { authRequiredMiddleware } from '@/server/middlewares/auth-middleware'
import { errorResponse } from '@/server/utils'

const AddTodoInput = z.object({
  title: z.string().min(1),
  bucketId: z.number(),
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
})

const DeleteTodoInput = z.object({
  id: z.int(),
})

export const createTodo = createServerFn({ method: 'POST' })
  .middleware([authRequiredMiddleware])
  .inputValidator(AddTodoInput)
  .handler(async ({ data, context }) => {
    const user = context.session.user

    const bucket = await db.query.buckets.findFirst({ where: eq(buckets.userId, user.id) })
    if (!bucket) {
      throw errorResponse(500, "Bucket doesn't belong to this user")
    }
    if (bucket.status == 'archived') {
      throw errorResponse(500, 'Bucket is archived')
    }

    const todoToAdd: TodoDbInsert = {
      title: data.title,
      bucketId: data.bucketId,
      completed: false,
      createdAt: new Date(),
      userId: user.id,
    }
    const [newTodo] = await db.insert(todos).values(todoToAdd).returning()
    return newTodo
  })

export const getTodos = createServerFn()
  .middleware([authRequiredMiddleware])
  .inputValidator(GetTodosInput)
  .handler(async ({ data, context }) => {
    const user = context.session.user
    const bucket = db.query.buckets.findFirst({
      where: and(eq(buckets.id, data.bucketId), eq(buckets.userId, user.id)),
    })
    if (!bucket) {
      throw errorResponse(500, 'Bucket does not exist or does not belong to this user')
    }
    return db.select().from(todos).where(eq(todos.bucketId, data.bucketId))
  })

export const updateTodo = createServerFn({ method: 'POST' })
  .middleware([authRequiredMiddleware])
  .inputValidator(UpdateTodoInput)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id
    const { id: todoId, ...updates } = data

    // Verify todo exists and belongs to user
    const existingTodo = await db.query.todos.findFirst({
      where: and(eq(todos.id, data.id), eq(todos.userId, userId)),
      with: { bucket: true },
    })

    if (!existingTodo) {
      throw errorResponse(500, 'Todo not found or unauthorized change')
    }

    if (existingTodo.bucket.status === 'archived') {
      throw errorResponse(500, 'Attempting to update a Todo in an archived bucket')
    }

    // If changing buckets, verify the new bucket exists
    if (data.bucketId && data.bucketId !== existingTodo.bucketId) {
      const newBucket = await db.query.buckets.findFirst({ where: eq(buckets.id, data.bucketId) })
      if (!newBucket || newBucket.status === 'archived') {
        throw errorResponse(500, 'Attempting to move Todo to a bucket that does not exist or is archived')
      }
    }

    const [updatedTodo] = await db
      .update(todos)
      .set({ ...updates })
      .where(eq(todos.id, todoId))
      .returning()

    return updatedTodo
  })

export const deleteTodo = createServerFn({ method: 'POST' })
  .middleware([authRequiredMiddleware])
  .inputValidator(DeleteTodoInput)
  .handler(async ({ data }) => {
    // TODO: Add ownership validation before deletion.
    // TODO: Update/delete operations return undefined for non-existent IDs.
    return (
      await db.delete(todos).where(eq(todos.id, data.id)).returning({ todoId: todos.id, bucketId: todos.bucketId })
    )[0]
  })
