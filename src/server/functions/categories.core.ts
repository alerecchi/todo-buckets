import { z } from 'zod'

import { CategoryColorKeySchema } from '@/lib/types/Category'
import type { CategoryDbInsert, CategoryDbSelect } from '@/server/db/types'
import { errorResponse } from '@/server/utils'

export const CreateCategoryInput = z
  .object({
    colorKey: CategoryColorKeySchema,
    name: z.string().trim().min(1).max(64),
  })
  .strict()

export const UpdateCategoryInput = z
  .object({
    colorKey: CategoryColorKeySchema,
    id: z.number().int(),
    name: z.string().trim().min(1).max(64),
  })
  .strict()

export type CategoryRepository = {
  createCategory: (category: CategoryDbInsert) => Promise<CategoryDbSelect>
  findCategoryByName: (userId: string, name: string) => Promise<CategoryDbSelect | undefined>
  listCategoriesForUser: (userId: string) => Promise<Array<CategoryDbSelect>>
  updateCategory: (
    categoryId: number,
    userId: string,
    updates: Pick<CategoryDbInsert, 'colorKey' | 'name'>,
  ) => Promise<CategoryDbSelect | undefined>
}

type CreateCategoryDependencies = {
  data: z.output<typeof CreateCategoryInput>
  repository: CategoryRepository
  userId: string
}

type ListCategoriesDependencies = {
  repository: CategoryRepository
  userId: string
}

type UpdateCategoryDependencies = {
  data: z.output<typeof UpdateCategoryInput>
  repository: CategoryRepository
  userId: string
}

export async function createCategoryForUser({ data, repository, userId }: CreateCategoryDependencies) {
  const name = normalizeCategoryName(data.name)

  return repository.createCategory({
    colorKey: data.colorKey,
    name,
    userId,
  })
}

export function listCategoriesForUser({ repository, userId }: ListCategoriesDependencies) {
  return repository.listCategoriesForUser(userId)
}

export async function updateCategoryForUser({ data, repository, userId }: UpdateCategoryDependencies) {
  const name = normalizeCategoryName(data.name)
  const categoryWithName = await repository.findCategoryByName(userId, name)

  if (categoryWithName && categoryWithName.id !== data.id) {
    throw errorResponse(409, 'Category name already exists')
  }

  const category = await repository.updateCategory(data.id, userId, {
    colorKey: data.colorKey,
    name,
  })

  if (!category) {
    throw errorResponse(404, 'Category not found or unauthorized')
  }

  return category
}

export function normalizeCategoryName(name: string) {
  return name.trim().replace(/\s+/g, ' ').toLowerCase()
}
