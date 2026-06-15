import { z } from 'zod'

import type { TagDisplay } from '@/lib/types/Tag'
import { TagColorKeySchema } from '@/lib/types/Tag'
import type { TagDbInsert, TagDbSelect } from '@/server/db/types'

const tagNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(32)
  .transform((name) => normalizeTagName(name))
  .pipe(z.string().regex(/^[a-z0-9][a-z0-9_-]*$/))

export const CreateTagInput = z
  .object({
    colorKey: TagColorKeySchema,
    name: tagNameSchema,
  })
  .strict()

export type TagRepository = {
  createTag: (tag: TagDbInsert) => Promise<TagDbSelect>
  listTagsForUser: (userId: string) => Promise<Array<TagDbSelect>>
}

type CreateTagDependencies = {
  data: z.output<typeof CreateTagInput>
  repository: TagRepository
  userId: string
}

type ListTagsDependencies = {
  repository: TagRepository
  userId: string
}

export async function createTagForUser({ data, repository, userId }: CreateTagDependencies) {
  const tag = await repository.createTag({
    colorKey: data.colorKey,
    name: data.name,
    userId,
  })

  return toTagDisplay(tag)
}

export async function listTagsForUser({ repository, userId }: ListTagsDependencies) {
  const tags = await repository.listTagsForUser(userId)

  return tags.map(toTagDisplay)
}

export function normalizeTagName(name: string) {
  return name.trim().toLowerCase()
}

function toTagDisplay(tag: TagDbSelect): TagDisplay {
  return {
    colorKey: tag.colorKey,
    id: tag.id,
    name: tag.name,
  }
}
