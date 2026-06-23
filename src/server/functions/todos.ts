import { createServerFn } from '@tanstack/react-start'
import { and, asc, eq, inArray, max } from 'drizzle-orm'

import { db } from '@/server/db/client'
import { buckets, categories, tags, todoTags, todos } from '@/server/db/schema/schema'
import type { TagDbSelect, TodoDbInsert } from '@/server/db/types'
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
  findOwnedCategory(userId: string, categoryId: number) {
    return db.query.categories.findFirst({
      where: and(eq(categories.id, categoryId), eq(categories.userId, userId)),
    })
  },
  findOwnedTags(userId: string, tagIds: Array<number>) {
    return db.query.tags.findMany({
      where: and(eq(tags.userId, userId), inArray(tags.id, tagIds)),
    })
  },
  async findOwnedTodoWithBucket(userId: string, todoId: number) {
    const todo = await db.query.todos.findFirst({
      where: and(eq(todos.id, todoId), eq(todos.userId, userId)),
      with: {
        bucket: true,
        category: true,
        todoTags: {
          with: {
            tag: true,
          },
        },
      },
    })

    return todo ? withTags(todo) : undefined
  },
  async getMaxTodoPosition(userId: string, bucketId: number) {
    const [row] = await db
      .select({ position: max(todos.position) })
      .from(todos)
      .where(and(eq(todos.userId, userId), eq(todos.bucketId, bucketId)))

    return row.position ?? null
  },
  async getTodosByBucketForUser(userId: string, bucketId: number) {
    const bucketTodos = await db.query.todos.findMany({
      orderBy: [asc(todos.position), asc(todos.id)],
      where: and(eq(todos.bucketId, bucketId), eq(todos.userId, userId)),
      with: {
        category: {
          columns: {
            colorKey: true,
            id: true,
            name: true,
          },
        },
        todoTags: {
          with: {
            tag: {
              columns: {
                colorKey: true,
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return bucketTodos.map(withTags)
  },
  async replaceTodoTags(todoId: number, userId: string, tagIds: Array<number>) {
    const ownedTodo = await db.query.todos.findFirst({
      columns: {
        id: true,
      },
      where: and(eq(todos.id, todoId), eq(todos.userId, userId)),
    })

    if (!ownedTodo) {
      return
    }

    await db.delete(todoTags).where(eq(todoTags.todoId, todoId))

    if (tagIds.length === 0) {
      return
    }

    await db.insert(todoTags).values(tagIds.map((tagId) => ({ tagId, todoId })))
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

function withTags<T extends { todoTags: Array<{ tag: Pick<TagDbSelect, 'colorKey' | 'id' | 'name'> }> }>(todo: T) {
  const { todoTags: todoTagRows, ...todoWithoutJoinRows } = todo

  return {
    ...todoWithoutJoinRows,
    tags: todoTagRows.map((todoTag) => todoTag.tag),
  }
}
