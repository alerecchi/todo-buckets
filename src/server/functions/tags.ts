import { createServerFn } from '@tanstack/react-start'
import { and, asc, eq } from 'drizzle-orm'

import { db } from '@/server/db/client'
import { tags } from '@/server/db/schema/schema'
import type { TagDbInsert } from '@/server/db/types'
import type { TagRepository } from '@/server/functions/tags.core'
import { CreateTagInput, createTagForUser, listTagsForUser } from '@/server/functions/tags.core'
import { authRequiredMiddleware } from '@/server/middlewares/auth-middleware'

export const createTag = createServerFn({ method: 'POST' })
  .middleware([authRequiredMiddleware])
  .inputValidator(CreateTagInput)
  .handler(async ({ data, context }) => {
    return createTagForUser({
      data,
      repository: tagRepository,
      userId: context.session.user.id,
    })
  })

export const listTags = createServerFn()
  .middleware([authRequiredMiddleware])
  .handler(async ({ context }) => {
    return listTagsForUser({
      repository: tagRepository,
      userId: context.session.user.id,
    })
  })

const tagRepository: TagRepository = {
  async createTag(tagToAdd: TagDbInsert) {
    const insertedTags = await db
      .insert(tags)
      .values(tagToAdd)
      .onConflictDoNothing({
        target: [tags.userId, tags.name],
      })
      .returning()
    const insertedTag = insertedTags.at(0)

    if (insertedTag) {
      return insertedTag
    }

    const tag = await db.query.tags.findFirst({
      where: and(eq(tags.userId, tagToAdd.userId), eq(tags.name, tagToAdd.name)),
    })

    if (!tag) {
      throw new Error('Could not create or find Tag')
    }

    return tag
  },
  listTagsForUser(userId: string) {
    return db.query.tags.findMany({
      orderBy: [asc(tags.name)],
      where: eq(tags.userId, userId),
    })
  },
}
