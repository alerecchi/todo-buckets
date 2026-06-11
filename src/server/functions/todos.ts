import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'

import { db } from '@/server/db/client'
import { buckets, todos } from '@/server/db/schema/schema'
import type { TodoDbInsert } from '@/server/db/types'
import type { TodoRepository } from '@/server/functions/todos.core'
import {
  CreateTodoInput,
  DeleteTodoInput,
  GetTodosInput,
  UpdateTodoInput,
  createTodoForUser,
  deleteTodoForUser,
  getTodosForUser,
  updateTodoForUser,
} from '@/server/functions/todos.core'
import { authRequiredMiddleware } from '@/server/middlewares/auth-middleware'

export const createTodo = createServerFn({ method: 'POST' })
  .middleware([authRequiredMiddleware])
  .inputValidator(CreateTodoInput)
  .handler(async ({ data, context }) => {
    return createTodoForUser({
      data,
      repository: todoRepository,
      userId: context.session.user.id,
    })
  })

export const getTodos = createServerFn()
  .middleware([authRequiredMiddleware])
  .inputValidator(GetTodosInput)
  .handler(async ({ data, context }) => {
    return getTodosForUser({
      data,
      repository: todoRepository,
      userId: context.session.user.id,
    })
  })

export const updateTodo = createServerFn({ method: 'POST' })
  .middleware([authRequiredMiddleware])
  .inputValidator(UpdateTodoInput)
  .handler(async ({ data, context }) => {
    return updateTodoForUser({
      data,
      repository: todoRepository,
      userId: context.session.user.id,
    })
  })

export const deleteTodo = createServerFn({ method: 'POST' })
  .middleware([authRequiredMiddleware])
  .inputValidator(DeleteTodoInput)
  .handler(async ({ data, context }) => {
    return deleteTodoForUser({
      data,
      repository: todoRepository,
      userId: context.session.user.id,
    })
  })

const todoRepository: TodoRepository = {
  async createTodo(todoToAdd: TodoDbInsert) {
    const [newTodo] = await db.insert(todos).values(todoToAdd).returning()
    return newTodo
  },
  async deleteTodo(todoId: number, userId: string) {
    const [deletedTodo] = await db
      .delete(todos)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .returning({ bucketId: todos.bucketId, todoId: todos.id })
    return deletedTodo
  },
  findOwnedActiveBucket(userId: string, bucketId: number) {
    return db.query.buckets.findFirst({
      where: and(eq(buckets.id, bucketId), eq(buckets.userId, userId), eq(buckets.status, 'active')),
    })
  },
  findOwnedTodoWithBucket(userId: string, todoId: number) {
    return db.query.todos.findFirst({
      where: and(eq(todos.id, todoId), eq(todos.userId, userId)),
      with: { bucket: true },
    })
  },
  getTodosByBucketForUser(userId: string, bucketId: number) {
    return db
      .select()
      .from(todos)
      .where(and(eq(todos.bucketId, bucketId), eq(todos.userId, userId)))
  },
  async updateTodo(todoId: number, userId: string, updates: Partial<TodoDbInsert>) {
    const [updatedTodo] = await db
      .update(todos)
      .set(updates)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .returning()
    return updatedTodo
  },
}
