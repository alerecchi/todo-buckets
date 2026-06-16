import { describe, expect, it, vi } from 'vitest'

import {
  CreateTodoInput,
  UpdateTodoInput,
  createTodoForUser,
  deleteTodoForUser,
  getTodosForUser,
  updateTodoForUser,
} from './todos.core'
import type { TodoRepository } from './todos.core'

const ownedCategory = {
  colorKey: 'blue',
  id: 5,
  name: 'home admin',
  userId: 'user-1',
} as const

const urgentTag = {
  colorKey: 'rose',
  id: 11,
  name: 'urgent',
  userId: 'user-1',
} as const

const focusTag = {
  colorKey: 'teal',
  id: 12,
  name: 'focus',
  userId: 'user-1',
} as const

const activeBucket = {
  id: 2,
  period: '2026-06-11',
  status: 'active',
  type: 'daily',
  userId: 'user-1',
} as const

const otherActiveBucket = {
  ...activeBucket,
  id: 3,
  period: '2026-06',
  type: 'monthly',
} as const

const existingTodo = {
  bucket: activeBucket,
  bucketId: activeBucket.id,
  category: null,
  categoryId: null,
  completed: false,
  createdAt: new Date('2026-06-10T08:00:00.000Z'),
  description: '',
  id: 10,
  tags: [],
  title: 'Pay rent',
  userId: activeBucket.userId,
}

const createRepository = (overrides: Partial<TodoRepository> = {}): TodoRepository => ({
  createTodo: vi.fn((todoToCreate) => Promise.resolve({ id: 10, ...todoToCreate })),
  deleteTodo: vi.fn(),
  findOwnedActiveBucket: vi.fn(() => Promise.resolve(activeBucket)),
  findOwnedCategory: vi.fn(() => Promise.resolve(ownedCategory)),
  findOwnedTags: vi.fn((userId, tagIds) =>
    Promise.resolve([urgentTag, focusTag].filter((tag) => tag.userId === userId && tagIds.includes(tag.id))),
  ),
  findOwnedTodoWithBucket: vi.fn(),
  getTodosByBucketForUser: vi.fn(() => Promise.resolve([])),
  replaceTodoTags: vi.fn(() => Promise.resolve()),
  updateTodo: vi.fn(),
  ...overrides,
})

describe('todo server behavior', () => {
  it('creates todos in an active owned bucket with normalized description and server-owned fields', async () => {
    const repository = createRepository()
    const createdAt = new Date('2026-06-11T10:15:00.000Z')

    const createdTodo = await createTodoForUser({
      data: CreateTodoInput.parse({
        bucketId: activeBucket.id,
        description: '  Details to remember  ',
        title: '  Pay rent  ',
      }),
      now: () => createdAt,
      repository,
      userId: activeBucket.userId,
    })

    expect(repository.findOwnedActiveBucket).toHaveBeenCalledWith(activeBucket.userId, activeBucket.id)
    expect(repository.createTodo).toHaveBeenCalledWith({
      bucketId: activeBucket.id,
      categoryId: null,
      completed: false,
      createdAt,
      description: 'Details to remember',
      title: 'Pay rent',
      userId: activeBucket.userId,
    })
    expect(createdTodo).toMatchObject({
      bucketId: activeBucket.id,
      completed: false,
      description: 'Details to remember',
      tags: [],
      title: 'Pay rent',
      userId: activeBucket.userId,
    })
  })

  it('stores a whitespace-only description as an empty string', async () => {
    const repository = createRepository()

    await createTodoForUser({
      data: CreateTodoInput.parse({
        bucketId: activeBucket.id,
        description: '   ',
        title: 'Pay rent',
      }),
      repository,
      userId: activeBucket.userId,
    })

    expect(repository.createTodo).toHaveBeenCalledWith(expect.objectContaining({ description: '' }))
  })

  it('creates todos with an owned Category selected', async () => {
    const repository = createRepository()

    await createTodoForUser({
      data: CreateTodoInput.parse({
        bucketId: activeBucket.id,
        categoryId: ownedCategory.id,
        title: 'Pay rent',
      }),
      repository,
      userId: activeBucket.userId,
    })

    expect(repository.findOwnedCategory).toHaveBeenCalledWith(activeBucket.userId, ownedCategory.id)
    expect(repository.createTodo).toHaveBeenCalledWith(expect.objectContaining({ categoryId: ownedCategory.id }))
  })

  it('creates todos with an empty Tag set', async () => {
    const repository = createRepository()

    const createdTodo = await createTodoForUser({
      data: CreateTodoInput.parse({
        bucketId: activeBucket.id,
        tagIds: [],
        title: 'Pay rent',
      }),
      repository,
      userId: activeBucket.userId,
    })

    expect(repository.findOwnedTags).not.toHaveBeenCalled()
    expect(repository.replaceTodoTags).toHaveBeenCalledWith(existingTodo.id, activeBucket.userId, [])
    expect(createdTodo.tags).toEqual([])
  })

  it('creates todos with owned Tags selected', async () => {
    const repository = createRepository()

    const createdTodo = await createTodoForUser({
      data: CreateTodoInput.parse({
        bucketId: activeBucket.id,
        tagIds: [focusTag.id, urgentTag.id],
        title: 'Pay rent',
      }),
      repository,
      userId: activeBucket.userId,
    })

    expect(repository.findOwnedTags).toHaveBeenCalledWith(activeBucket.userId, [focusTag.id, urgentTag.id])
    expect(repository.replaceTodoTags).toHaveBeenCalledWith(existingTodo.id, activeBucket.userId, [
      focusTag.id,
      urgentTag.id,
    ])
    expect(createdTodo.tags).toEqual([
      {
        colorKey: focusTag.colorKey,
        id: focusTag.id,
        name: focusTag.name,
      },
      {
        colorKey: urgentTag.colorKey,
        id: urgentTag.id,
        name: urgentTag.name,
      },
    ])
  })

  it("rejects creating a Todo with another user's Tag", async () => {
    const repository = createRepository({
      findOwnedTags: vi.fn(() => Promise.resolve([urgentTag])),
    })

    await expect(
      createTodoForUser({
        data: {
          bucketId: activeBucket.id,
          tagIds: [urgentTag.id, focusTag.id],
          title: 'Pay rent',
        },
        repository,
        userId: activeBucket.userId,
      }),
    ).rejects.toHaveProperty('status', 404)

    expect(repository.findOwnedTags).toHaveBeenCalledWith(activeBucket.userId, [urgentTag.id, focusTag.id])
    expect(repository.createTodo).not.toHaveBeenCalled()
  })

  it("rejects creating a Todo with another user's Category", async () => {
    const repository = createRepository({
      findOwnedCategory: vi.fn(() => Promise.resolve(undefined)),
    })

    await expect(
      createTodoForUser({
        data: {
          bucketId: activeBucket.id,
          categoryId: ownedCategory.id,
          title: 'Pay rent',
        },
        repository,
        userId: activeBucket.userId,
      }),
    ).rejects.toHaveProperty('status', 404)

    expect(repository.findOwnedCategory).toHaveBeenCalledWith(activeBucket.userId, ownedCategory.id)
    expect(repository.createTodo).not.toHaveBeenCalled()
  })

  it("rejects updating a Todo to another user's Category", async () => {
    const repository = createRepository({
      findOwnedCategory: vi.fn(() => Promise.resolve(undefined)),
      findOwnedTodoWithBucket: vi.fn(() => Promise.resolve(existingTodo)),
    })

    await expect(
      updateTodoForUser({
        data: {
          categoryId: ownedCategory.id,
          id: existingTodo.id,
        },
        repository,
        userId: activeBucket.userId,
      }),
    ).rejects.toHaveProperty('status', 404)

    expect(repository.findOwnedCategory).toHaveBeenCalledWith(activeBucket.userId, ownedCategory.id)
    expect(repository.updateTodo).not.toHaveBeenCalled()
  })

  it("rejects updating a Todo to another user's Tag", async () => {
    const repository = createRepository({
      findOwnedTags: vi.fn(() => Promise.resolve([urgentTag])),
      findOwnedTodoWithBucket: vi.fn(() => Promise.resolve(existingTodo)),
    })

    await expect(
      updateTodoForUser({
        data: {
          id: existingTodo.id,
          tagIds: [urgentTag.id, focusTag.id],
        },
        repository,
        userId: activeBucket.userId,
      }),
    ).rejects.toHaveProperty('status', 404)

    expect(repository.findOwnedTags).toHaveBeenCalledWith(activeBucket.userId, [urgentTag.id, focusTag.id])
    expect(repository.updateTodo).not.toHaveBeenCalled()
    expect(repository.replaceTodoTags).not.toHaveBeenCalled()
  })

  it('rejects blank titles at the server function validation boundary', () => {
    expect(
      CreateTodoInput.safeParse({
        bucketId: activeBucket.id,
        title: '   ',
      }).success,
    ).toBe(false)
  })

  it('rejects create and read when the bucket is archived, missing, or owned by another user', async () => {
    const repository = createRepository({
      findOwnedActiveBucket: vi.fn(() => Promise.resolve(undefined)),
    })

    await expect(
      createTodoForUser({
        data: {
          bucketId: activeBucket.id,
          title: 'Pay rent',
        },
        repository,
        userId: activeBucket.userId,
      }),
    ).rejects.toHaveProperty('status', 404)
    await expect(
      getTodosForUser({
        data: { bucketId: activeBucket.id },
        repository,
        userId: activeBucket.userId,
      }),
    ).rejects.toHaveProperty('status', 404)

    expect(repository.createTodo).not.toHaveBeenCalled()
    expect(repository.getTodosByBucketForUser).not.toHaveBeenCalled()
  })

  it('reads todos only after verifying an active owned bucket', async () => {
    const repository = createRepository({
      getTodosByBucketForUser: vi.fn(() => Promise.resolve([existingTodo])),
    })

    const todos = await getTodosForUser({
      data: { bucketId: activeBucket.id },
      repository,
      userId: activeBucket.userId,
    })

    expect(repository.findOwnedActiveBucket).toHaveBeenCalledWith(activeBucket.userId, activeBucket.id)
    expect(repository.getTodosByBucketForUser).toHaveBeenCalledWith(activeBucket.userId, activeBucket.id)
    expect(todos).toEqual([existingTodo])
  })

  it('does not expose creation time as editable update input', () => {
    expect(
      UpdateTodoInput.safeParse({
        createdAt: new Date('2020-01-01T00:00:00.000Z'),
        id: existingTodo.id,
        title: 'Changed',
      }).success,
    ).toBe(false)
  })

  it('rejects blank titles at the update validation boundary', () => {
    expect(
      UpdateTodoInput.safeParse({
        id: existingTodo.id,
        title: '   ',
      }).success,
    ).toBe(false)
  })

  it('updates todos only when the todo belongs to the current user', async () => {
    const repository = createRepository({
      findOwnedTodoWithBucket: vi.fn(() => Promise.resolve(undefined)),
    })

    await expect(
      updateTodoForUser({
        data: {
          completed: true,
          id: existingTodo.id,
        },
        repository,
        userId: activeBucket.userId,
      }),
    ).rejects.toHaveProperty('status', 404)

    expect(repository.updateTodo).not.toHaveBeenCalled()
  })

  it('replaces the full submitted Tag set when updating a Todo', async () => {
    const repository = createRepository({
      findOwnedTodoWithBucket: vi.fn(() =>
        Promise.resolve({
          ...existingTodo,
          tags: [urgentTag],
        }),
      ),
      updateTodo: vi.fn((todoId, userId, updates) =>
        Promise.resolve({
          ...existingTodo,
          ...updates,
          id: todoId,
          userId,
        }),
      ),
    })

    const updatedTodo = await updateTodoForUser({
      data: {
        id: existingTodo.id,
        tagIds: [focusTag.id],
      },
      repository,
      userId: activeBucket.userId,
    })

    expect(repository.replaceTodoTags).toHaveBeenCalledWith(existingTodo.id, activeBucket.userId, [focusTag.id])
    expect(updatedTodo.tags).toEqual([
      {
        colorKey: focusTag.colorKey,
        id: focusTag.id,
        name: focusTag.name,
      },
    ])
  })

  it('preserves the existing Tag display data when update omits Tag IDs', async () => {
    const repository = createRepository({
      findOwnedTodoWithBucket: vi.fn(() =>
        Promise.resolve({
          ...existingTodo,
          tags: [urgentTag],
        }),
      ),
      updateTodo: vi.fn((todoId, userId, updates) =>
        Promise.resolve({
          ...existingTodo,
          ...updates,
          id: todoId,
          userId,
        }),
      ),
    })

    const updatedTodo = await updateTodoForUser({
      data: {
        completed: true,
        id: existingTodo.id,
      },
      repository,
      userId: activeBucket.userId,
    })

    expect(repository.findOwnedTags).not.toHaveBeenCalled()
    expect(repository.replaceTodoTags).not.toHaveBeenCalled()
    expect(updatedTodo.tags).toEqual([
      {
        colorKey: urgentTag.colorKey,
        id: urgentTag.id,
        name: urgentTag.name,
      },
    ])
  })

  it('requires an active owned target bucket when moving todos', async () => {
    const repository = createRepository({
      findOwnedActiveBucket: vi.fn((userId, bucketId) =>
        Promise.resolve(userId === activeBucket.userId && bucketId === otherActiveBucket.id ? undefined : activeBucket),
      ),
      findOwnedTodoWithBucket: vi.fn(() => Promise.resolve(existingTodo)),
    })

    await expect(
      updateTodoForUser({
        data: {
          bucketId: otherActiveBucket.id,
          id: existingTodo.id,
        },
        repository,
        userId: activeBucket.userId,
      }),
    ).rejects.toHaveProperty('status', 404)

    expect(repository.findOwnedActiveBucket).toHaveBeenCalledWith(activeBucket.userId, otherActiveBucket.id)
    expect(repository.updateTodo).not.toHaveBeenCalled()
  })

  it('deletes todos only when the todo belongs to the current user', async () => {
    const repository = createRepository({
      deleteTodo: vi.fn(() => Promise.resolve(undefined)),
    })

    await expect(
      deleteTodoForUser({
        data: { id: existingTodo.id },
        repository,
        userId: activeBucket.userId,
      }),
    ).rejects.toHaveProperty('status', 404)

    expect(repository.deleteTodo).toHaveBeenCalledWith(existingTodo.id, activeBucket.userId)
  })
})
