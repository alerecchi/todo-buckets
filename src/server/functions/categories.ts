import { createServerFn } from '@tanstack/react-start'
import { asc, eq, sql } from 'drizzle-orm'

import { db } from '@/server/db/client'
import { categories } from '@/server/db/schema/schema'
import type { CategoryDbInsert } from '@/server/db/types'
import type { CategoryRepository } from '@/server/functions/categories.core'
import { CreateCategoryInput, createCategoryForUser, listCategoriesForUser } from '@/server/functions/categories.core'
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
  listCategoriesForUser(userId: string) {
    return db.query.categories.findMany({
      orderBy: [asc(categories.name)],
      where: eq(categories.userId, userId),
    })
  },
}
