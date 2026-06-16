import { z } from 'zod'

import { CategoryColorKeySchema } from '@/lib/types/Category'
import type { CategoryDbInsert, CategoryDbSelect } from '@/server/db/types'

export const CreateCategoryInput = z
  .object({
    colorKey: CategoryColorKeySchema,
    name: z.string().trim().min(1).max(64),
  })
  .strict()

export type CategoryRepository = {
  createCategory: (category: CategoryDbInsert) => Promise<CategoryDbSelect>
  listCategoriesForUser: (userId: string) => Promise<Array<CategoryDbSelect>>
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

export function normalizeCategoryName(name: string) {
  return name.trim().replace(/\s+/g, ' ').toLowerCase()
}
