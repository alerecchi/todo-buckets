import { createServerFn } from '@tanstack/react-start'
import { and, asc, eq, sql } from 'drizzle-orm'

import { db } from '@/server/db/client'
import { categories } from '@/server/db/schema/schema'
import type { CategoryDbInsert } from '@/server/db/types'
import type { CategoryRepository } from '@/server/functions/categories.core'
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  createCategoryForUser,
  listCategoriesForUser,
  updateCategoryForUser,
} from '@/server/functions/categories.core'
import { authRequiredMiddleware } from '@/server/middlewares/auth-middleware'

export const createCategory = createServerFn({ method: 'POST' })
  .middleware([authRequiredMiddleware])
  .inputValidator(CreateCategoryInput)
  .handler(async ({ data, context }) => {
    return createCategoryForUser({
      data,
      repository: categoryRepository,
      userId: context.session.user.id,
    })
  })

export const listCategories = createServerFn()
  .middleware([authRequiredMiddleware])
  .handler(async ({ context }) => {
    return listCategoriesForUser({
      repository: categoryRepository,
      userId: context.session.user.id,
    })
  })

export const updateCategory = createServerFn({ method: 'POST' })
  .middleware([authRequiredMiddleware])
  .inputValidator(UpdateCategoryInput)
  .handler(async ({ data, context }) => {
    return updateCategoryForUser({
      data,
      repository: categoryRepository,
      userId: context.session.user.id,
    })
  })

const categoryRepository: CategoryRepository = {
  async createCategory(categoryToAdd: CategoryDbInsert) {
    const [category] = await db
      .insert(categories)
      .values(categoryToAdd)
      .onConflictDoUpdate({
        target: [categories.userId, categories.name],
        set: {
          colorKey: sql`${categories.colorKey}`,
        },
      })
      .returning()

    return category
  },
  findCategoryByName(userId: string, name: string) {
    return db.query.categories.findFirst({
      where: and(eq(categories.userId, userId), eq(categories.name, name)),
    })
  },
  listCategoriesForUser(userId: string) {
    return db.query.categories.findMany({
      orderBy: [asc(categories.name)],
      where: eq(categories.userId, userId),
    })
  },
  async updateCategory(categoryId, userId, updates) {
    const [category] = await db
      .update(categories)
      .set(updates)
      .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
      .returning()

    return category
  },
}
