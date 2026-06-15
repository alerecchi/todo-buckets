import { z } from 'zod'

import type { CategoryDisplay } from '@/lib/types/Category'
import type { TagDisplay } from '@/lib/types/Tag'
import type { BucketDb, CategoryDbSelect, TagDbSelect, TodoDbInsert, TodoDbSelect } from '@/server/db/types'
import { errorResponse } from '@/server/utils'

export const CreateTodoInput = z
  .object({
    bucketId: z.int(),
    categoryId: z.int().nullable().optional(),
    description: z.string().optional(),
    tagIds: z.array(z.int()).optional(),
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
    tagIds: z.array(z.int()).optional(),
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
  tags: Array<TagDisplay>
}

export type DeletedTodo = {
  bucketId: number
  todoId: number
}

export type TodoWithCategoryDisplay = TodoDbSelect & {
  category: CategoryDisplay | null
  tags: Array<TagDisplay>
}

export type TodoRepository = {
  createTodo: (todo: TodoDbInsert) => Promise<TodoDbSelect>
  deleteTodo: (todoId: number, userId: string) => Promise<DeletedTodo | undefined>
  findOwnedActiveBucket: (userId: string, bucketId: number) => Promise<BucketDb | undefined>
  findOwnedCategory: (userId: string, categoryId: number) => Promise<CategoryDbSelect | undefined>
  findOwnedTags: (userId: string, tagIds: Array<number>) => Promise<Array<TagDbSelect>>
  findOwnedTodoWithBucket: (userId: string, todoId: number) => Promise<TodoWithBucket | undefined>
  getTodosByBucketForUser: (userId: string, bucketId: number) => Promise<Array<TodoWithCategoryDisplay>>
  replaceTodoTags: (todoId: number, userId: string, tagIds: Array<number>) => Promise<void>
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
  const tagIds = getUniqueTagIds(data.tagIds ?? [])
  const tags = await requireOwnedTags(repository, userId, tagIds)

  const todo = await repository.createTodo({
    bucketId: data.bucketId,
    categoryId: data.categoryId ?? null,
    completed: false,
    createdAt: now(),
    description: data.description?.trim() ?? '',
    title: data.title,
    userId,
  })
  await repository.replaceTodoTags(todo.id, userId, tagIds)

  return withDisplayData(todo, category, tags)
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
  const tags =
    data.tagIds === undefined
      ? existingTodo.tags.map(toTagDisplay)
      : await requireOwnedTags(repository, userId, getUniqueTagIds(data.tagIds))

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

  if (data.tagIds !== undefined) {
    await repository.replaceTodoTags(data.id, userId, getUniqueTagIds(data.tagIds))
  }

  return withDisplayData(updatedTodo, category, tags)
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

async function requireOwnedTags(repository: TodoRepository, userId: string, tagIds: Array<number>) {
  if (tagIds.length === 0) {
    return []
  }

  const tags = await repository.findOwnedTags(userId, tagIds)

  if (tags.length !== tagIds.length) {
    throw errorResponse(404, 'Tag not found or unauthorized')
  }

  const tagsById = new Map(tags.map((tag) => [tag.id, tag]))

  return tagIds.map((tagId) => toTagDisplay(tagsById.get(tagId)!))
}

function withDisplayData(
  todo: TodoDbSelect,
  category: CategoryDisplay | null,
  tags: Array<TagDisplay>,
): TodoWithCategoryDisplay {
  return {
    ...todo,
    category,
    tags,
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

function toTagDisplay(tag: TagDisplay): TagDisplay {
  return {
    colorKey: tag.colorKey,
    id: tag.id,
    name: tag.name,
  }
}

function removeUndefinedValues<T extends Record<string, unknown>>(values: T) {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined)) as Partial<T>
}

function getUniqueTagIds(tagIds: Array<number>) {
  return [...new Set(tagIds)]
}
