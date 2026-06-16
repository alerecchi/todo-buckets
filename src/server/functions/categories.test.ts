import { describe, expect, it, vi } from 'vitest'

import { CreateCategoryInput, createCategoryForUser, listCategoriesForUser } from './categories.core'
import type { CategoryRepository } from './categories.core'

const existingCategory = {
  colorKey: 'blue',
  id: 4,
  name: 'home admin',
  userId: 'user-1',
} as const

const createRepository = (overrides: Partial<CategoryRepository> = {}): CategoryRepository => ({
  createCategory: vi.fn((categoryToCreate) => Promise.resolve({ id: 8, ...categoryToCreate })),
  listCategoriesForUser: vi.fn(() => Promise.resolve([])),
  ...overrides,
})

describe('category server behavior', () => {
  it('creates a user-owned Category with a normalized reusable name', async () => {
    const repository = createRepository()

    const category = await createCategoryForUser({
      data: CreateCategoryInput.parse({
        colorKey: 'green',
        name: '  Home   Admin  ',
      }),
      repository,
      userId: existingCategory.userId,
    })

    expect(repository.createCategory).toHaveBeenCalledWith({
      colorKey: 'green',
      name: 'home admin',
      userId: existingCategory.userId,
    })
    expect(category).toMatchObject({
      colorKey: 'green',
      name: 'home admin',
      userId: existingCategory.userId,
    })
  })

  it('returns an existing matching Category on duplicate create without recoloring it', async () => {
    const repository = createRepository({
      createCategory: vi.fn(() => Promise.resolve(existingCategory)),
    })

    const category = await createCategoryForUser({
      data: CreateCategoryInput.parse({
        colorKey: 'rose',
        name: 'HOME ADMIN',
      }),
      repository,
      userId: existingCategory.userId,
    })

    expect(category).toBe(existingCategory)
    expect(repository.createCategory).toHaveBeenCalledWith({
      colorKey: 'rose',
      name: 'home admin',
      userId: existingCategory.userId,
    })
  })

  it('rejects invalid Category create input at the validation boundary', () => {
    expect(
      CreateCategoryInput.safeParse({
        colorKey: 'legacy-color',
        name: 'Home admin',
      }).success,
    ).toBe(false)
    expect(
      CreateCategoryInput.safeParse({
        colorKey: 'blue',
        name: '',
      }).success,
    ).toBe(false)
  })

  it('lists Categories for the current user only', async () => {
    const repository = createRepository({
      listCategoriesForUser: vi.fn(() => Promise.resolve([existingCategory])),
    })

    const categories = await listCategoriesForUser({
      repository,
      userId: existingCategory.userId,
    })

    expect(repository.listCategoriesForUser).toHaveBeenCalledWith(existingCategory.userId)
    expect(categories).toEqual([existingCategory])
  })
})
