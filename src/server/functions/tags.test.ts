import { describe, expect, it, vi } from 'vitest'

import { CreateTagInput, createTagForUser, listTagsForUser } from './tags.core'
import type { TagRepository } from './tags.core'

const existingTag = {
  colorKey: 'blue',
  id: 4,
  name: 'urgent_now',
  userId: 'user-1',
} as const

const createRepository = (overrides: Partial<TagRepository> = {}): TagRepository => ({
  createTag: vi.fn((tagToCreate) => Promise.resolve({ id: 8, ...tagToCreate })),
  listTagsForUser: vi.fn(() => Promise.resolve([])),
  ...overrides,
})

describe('tag server behavior', () => {
  it('creates a user-owned Tag with a normalized compact handle', async () => {
    const repository = createRepository()

    const tag = await createTagForUser({
      data: CreateTagInput.parse({
        colorKey: 'green',
        name: '  URGENT_Now  ',
      }),
      repository,
      userId: existingTag.userId,
    })

    expect(repository.createTag).toHaveBeenCalledWith({
      colorKey: 'green',
      name: 'urgent_now',
      userId: existingTag.userId,
    })
    expect(tag).toMatchObject({
      colorKey: 'green',
      name: 'urgent_now',
    })
  })

  it('returns an existing matching Tag on duplicate create without recoloring it', async () => {
    const repository = createRepository({
      createTag: vi.fn(() => Promise.resolve(existingTag)),
    })

    const tag = await createTagForUser({
      data: CreateTagInput.parse({
        colorKey: 'rose',
        name: 'URGENT_NOW',
      }),
      repository,
      userId: existingTag.userId,
    })

    expect(tag).toEqual({
      colorKey: existingTag.colorKey,
      id: existingTag.id,
      name: existingTag.name,
    })
    expect(repository.createTag).toHaveBeenCalledWith({
      colorKey: 'rose',
      name: 'urgent_now',
      userId: existingTag.userId,
    })
  })

  it('rejects spaces, invalid characters, invalid length, and invalid Tag colors at the validation boundary', () => {
    expect(CreateTagInput.safeParse({ colorKey: 'blue', name: 'urgent now' }).success).toBe(false)
    expect(CreateTagInput.safeParse({ colorKey: 'blue', name: 'urgent.now' }).success).toBe(false)
    expect(CreateTagInput.safeParse({ colorKey: 'blue', name: '' }).success).toBe(false)
    expect(CreateTagInput.safeParse({ colorKey: 'blue', name: 'a'.repeat(33) }).success).toBe(false)
    expect(CreateTagInput.safeParse({ colorKey: 'legacy-color', name: 'urgent' }).success).toBe(false)
  })

  it('lists Tags for the current user only', async () => {
    const repository = createRepository({
      listTagsForUser: vi.fn(() => Promise.resolve([existingTag])),
    })

    const tags = await listTagsForUser({
      repository,
      userId: existingTag.userId,
    })

    expect(repository.listTagsForUser).toHaveBeenCalledWith(existingTag.userId)
    expect(tags).toEqual([
      {
        colorKey: existingTag.colorKey,
        id: existingTag.id,
        name: existingTag.name,
      },
    ])
  })
})
