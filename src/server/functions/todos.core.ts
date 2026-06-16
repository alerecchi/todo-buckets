import { z } from 'zod'

import type { CategoryDisplay } from '@/lib/types/Category'
import type { BucketDb, CategoryDbSelect, TodoDbInsert, TodoDbSelect } from '@/server/db/types'
import { errorResponse } from '@/server/utils'

export const CreateTodoInput = z
  .object({
    bucketId: z.int(),
    categoryId: z.int().nullable().optional(),
    description: z.string().optional(),
    title: z.string().trim().min(1),
  })
  .strict()

export const GetTodosInput = z
  .object({
    bucketId: z.int(),
  })
  .strict()

export const UpdateTodoInput = z
  .object({
    bucketId: z.int().optional(),
    categoryId: z.int().nullable().optional(),
    completed: z.boolean().optional(),
    description: z.string().optional(),
    id: z.int(),
    title: z.string().trim().min(1).optional(),
  })
  .strict()

export const DeleteTodoInput = z
  .object({
    id: z.int(),
  })
  .strict()

type TodoWithBucket = TodoDbSelect & {
  bucket: BucketDb
  category: CategoryDbSelect | null
}

export type DeletedTodo = {
  bucketId: number
  todoId: number
}

export type TodoWithCategoryDisplay = TodoDbSelect & {
  category: CategoryDisplay | null
}

export type TodoRepository = {
  createTodo: (todo: TodoDbInsert) => Promise<TodoDbSelect>
  deleteTodo: (todoId: number, userId: string) => Promise<DeletedTodo | undefined>
  findOwnedActiveBucket: (userId: string, bucketId: number) => Promise<BucketDb | undefined>
  findOwnedCategory: (userId: string, categoryId: number) => Promise<CategoryDbSelect | undefined>
  findOwnedTodoWithBucket: (userId: string, todoId: number) => Promise<TodoWithBucket | undefined>
  getTodosByBucketForUser: (userId: string, bucketId: number) => Promise<Array<TodoWithCategoryDisplay>>
  updateTodo: (todoId: number, userId: string, updates: Partial<TodoDbInsert>) => Promise<TodoDbSelect | undefined>
}

type OperationDependencies = {
  repository: TodoRepository
  userId: string
}

type CreateTodoDependencies = OperationDependencies & {
  data: z.output<typeof CreateTodoInput>
  now?: () => Date
}

type GetTodosDependencies = OperationDependencies & {
  data: z.output<typeof GetTodosInput>
}

type UpdateTodoDependencies = OperationDependencies & {
  data: z.output<typeof UpdateTodoInput>
}

type DeleteTodoDependencies = OperationDependencies & {
  data: z.output<typeof DeleteTodoInput>
}

export async function createTodoForUser({ data, now = () => new Date(), repository, userId }: CreateTodoDependencies) {
  await requireOwnedActiveBucket(repository, userId, data.bucketId)
  const category = await requireOwnedCategoryIfPresent(repository, userId, data.categoryId)

  const todo = await repository.createTodo({
    bucketId: data.bucketId,
    categoryId: data.categoryId ?? null,
    completed: false,
    createdAt: now(),
    description: data.description?.trim() ?? '',
    title: data.title,
    userId,
  })

  return withCategoryDisplay(todo, category)
}

export async function getTodosForUser({ data, repository, userId }: GetTodosDependencies) {
  await requireOwnedActiveBucket(repository, userId, data.bucketId)

  return repository.getTodosByBucketForUser(userId, data.bucketId)
}

export async function updateTodoForUser({ data, repository, userId }: UpdateTodoDependencies) {
  const existingTodo = await repository.findOwnedTodoWithBucket(userId, data.id)

  if (!existingTodo) {
    throw errorResponse(404, 'Todo not found or unauthorized')
  }

  if (existingTodo.bucket.status === 'archived') {
    throw errorResponse(409, 'Cannot update a Todo in an archived Bucket')
  }

  if (data.bucketId !== undefined && data.bucketId !== existingTodo.bucketId) {
    await requireOwnedActiveBucket(repository, userId, data.bucketId)
  }
  const category =
    data.categoryId === undefined
      ? toCategoryDisplay(existingTodo.category)
      : await requireOwnedCategoryIfPresent(repository, userId, data.categoryId)

  const updates = {
    bucketId: data.bucketId,
    categoryId: data.categoryId,
    completed: data.completed,
    description: data.description?.trim(),
    title: data.title,
  }
  const updatedTodo = await repository.updateTodo(data.id, userId, removeUndefinedValues(updates))

  if (!updatedTodo) {
    throw errorResponse(404, 'Todo not found or unauthorized')
  }

  return withCategoryDisplay(updatedTodo, category)
}

export async function deleteTodoForUser({ data, repository, userId }: DeleteTodoDependencies) {
  const deletedTodo = await repository.deleteTodo(data.id, userId)

  if (!deletedTodo) {
    throw errorResponse(404, 'Todo not found or unauthorized')
  }

  return deletedTodo
}

async function requireOwnedActiveBucket(repository: TodoRepository, userId: string, bucketId: number) {
  const bucket = await repository.findOwnedActiveBucket(userId, bucketId)

  if (!bucket) {
    throw errorResponse(404, 'Bucket not found, archived, or unauthorized')
  }

  return bucket
}

async function requireOwnedCategoryIfPresent(
  repository: TodoRepository,
  userId: string,
  categoryId: number | null | undefined,
) {
  if (categoryId === undefined || categoryId === null) {
    return null
  }

  const category = await repository.findOwnedCategory(userId, categoryId)

  if (!category) {
    throw errorResponse(404, 'Category not found or unauthorized')
  }

  return toCategoryDisplay(category)
}

function withCategoryDisplay(todo: TodoDbSelect, category: CategoryDisplay | null): TodoWithCategoryDisplay {
  return {
    ...todo,
    category,
  }
}

function toCategoryDisplay(category: CategoryDbSelect | null): CategoryDisplay | null {
  if (!category) {
    return null
  }

  return {
    colorKey: category.colorKey,
    id: category.id,
    name: category.name,
  }
}

function removeUndefinedValues<T extends Record<string, unknown>>(values: T) {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined)) as Partial<T>
}
