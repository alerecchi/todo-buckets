import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BucketColumn } from '@/features/board/components/bucket-column'
import { TODOS_QUERY_KEY } from '@/features/board/queries/query-keys'
import type { Bucket } from '@/lib/types/Bucket'
import { listCategories } from '@/server/functions/categories'
import { listTags } from '@/server/functions/tags'
import { getTodos, updateTodo } from '@/server/functions/todos'
import { createTestQueryClient, render } from '@/test'

vi.mock('@/server/functions/categories', () => ({
  createCategory: vi.fn(),
  deleteCategory: vi.fn(),
  listCategories: vi.fn(() => Promise.resolve([])),
  updateCategory: vi.fn(),
}))

vi.mock('@/server/functions/tags', () => ({
  createTag: vi.fn(),
  deleteTag: vi.fn(),
  listTags: vi.fn(() => Promise.resolve([])),
  updateTag: vi.fn(),
}))

vi.mock('@/server/functions/todos', () => ({
  createTodo: vi.fn(),
  getTodos: vi.fn(() => Promise.resolve([])),
  updateTodo: vi.fn(),
}))

vi.mock('@/server/functions/buckets', () => ({
  getBuckets: vi.fn(),
}))

const buckets = [
  {
    id: 1,
    period: '2026',
    type: 'yearly',
    userId: 'user-1',
  },
  {
    id: 2,
    period: '2026-06-11',
    type: 'daily',
    userId: 'user-1',
  },
] satisfies Array<Bucket>

const category = {
  colorKey: 'blue',
  id: 7,
  name: 'home admin',
  userId: 'user-1',
} as const

const tag = {
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

const existingTodo = {
  bucketId: 2,
  category: {
    colorKey: category.colorKey,
    id: category.id,
    name: category.name,
  },
  categoryId: category.id,
  completed: false,
  createdAt: new Date('2026-06-10T10:00:00.000Z'),
  description: 'Bring notes',
  id: 10,
  tags: [
    {
      colorKey: tag.colorKey,
      id: tag.id,
      name: tag.name,
    },
  ],
  title: 'Plan review',
  userId: 'user-1',
}

const mockedGetTodos = vi.mocked(getTodos)
const mockedListCategories = vi.mocked(listCategories)
const mockedListTags = vi.mocked(listTags)
const mockedUpdateTodo = vi.mocked(updateTodo)

describe('Todo card edit dialog', () => {
  beforeEach(() => {
    mockedGetTodos.mockReset()
    mockedGetTodos.mockResolvedValue([])
    mockedListCategories.mockReset()
    mockedListCategories.mockResolvedValue([])
    mockedListTags.mockReset()
    mockedListTags.mockResolvedValue([])
    mockedUpdateTodo.mockReset()
  })

  it('opens edit mode from a Todo card with the existing Todo values', async () => {
    mockedGetTodos.mockResolvedValue([existingTodo])
    mockedListCategories.mockResolvedValue([category])
    mockedListTags.mockResolvedValue([tag])
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, existingTodo.bucketId], [existingTodo])

    render(<BucketColumn bucket={buckets[1]} buckets={buckets} />, { queryClient })

    fireEvent.click(screen.getByText(existingTodo.title))

    expect(await screen.findByRole('heading', { name: 'Edit Task' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toHaveValue(existingTodo.title)
    expect(screen.getByLabelText('Description')).toHaveValue(existingTodo.description)
    expect(screen.getByLabelText('Bucket')).toHaveValue(String(existingTodo.bucketId))
    expect(await screen.findByRole('option', { name: category.name })).toBeInTheDocument()
    expect(screen.getByLabelText('Category')).toHaveValue(String(category.id))
    expect(await screen.findByLabelText(tag.name)).toBeChecked()
    expect(mockedUpdateTodo).not.toHaveBeenCalled()
  })

  it('toggles completion from the checkbox without opening edit mode', async () => {
    mockedGetTodos.mockResolvedValue([existingTodo])
    mockedUpdateTodo.mockResolvedValue({ ...existingTodo, completed: true })
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, existingTodo.bucketId], [existingTodo])

    render(<BucketColumn bucket={buckets[1]} buckets={buckets} />, { queryClient })

    fireEvent.click(screen.getByRole('checkbox'))

    await waitFor(() => {
      expect(mockedUpdateTodo.mock.calls[0]?.[0]).toEqual({
        data: {
          completed: true,
          id: existingTodo.id,
        },
      })
    })
    expect(screen.queryByRole('heading', { name: 'Edit Task' })).not.toBeInTheDocument()
  })

  it('saves Todo edits, closes, and replaces the Todo in the current Bucket cache', async () => {
    const updatedTodo = {
      ...existingTodo,
      category: null,
      categoryId: null,
      description: 'Bring slides',
      tags: [
        {
          colorKey: focusTag.colorKey,
          id: focusTag.id,
          name: focusTag.name,
        },
      ],
      title: 'Plan async review',
      userId: 'user-1',
    }
    mockedGetTodos.mockResolvedValue([existingTodo])
    mockedListCategories.mockResolvedValue([category])
    mockedListTags.mockResolvedValue([tag, focusTag])
    mockedUpdateTodo.mockResolvedValue(updatedTodo)
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, existingTodo.bucketId], [existingTodo])

    render(<BucketColumn bucket={buckets[1]} buckets={buckets} />, { queryClient })

    fireEvent.click(screen.getByText(existingTodo.title))
    expect(await screen.findByRole('heading', { name: 'Edit Task' })).toBeInTheDocument()
    await screen.findByLabelText(focusTag.name)
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: '  Plan async review  ' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Bring slides' } })
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: '' } })
    fireEvent.click(screen.getByLabelText(tag.name))
    fireEvent.click(screen.getByLabelText(focusTag.name))
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Edit Task' })).not.toBeInTheDocument()
    })
    expect(mockedUpdateTodo.mock.calls[0]?.[0]).toEqual({
      data: {
        bucketId: existingTodo.bucketId,
        categoryId: null,
        description: 'Bring slides',
        id: existingTodo.id,
        tagIds: [focusTag.id],
        title: 'Plan async review',
      },
    })
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, existingTodo.bucketId])).toEqual([updatedTodo])
  })

  it('saves a Bucket change from edit mode', async () => {
    const movedTodo = {
      ...existingTodo,
      bucketId: buckets[0].id,
      title: 'Plan moved review',
    }
    const staleMovedTodo = {
      ...existingTodo,
      bucketId: buckets[0].id,
      title: 'Stale moved review',
    }
    mockedGetTodos.mockResolvedValue([existingTodo])
    mockedUpdateTodo.mockResolvedValue(movedTodo)
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, existingTodo.bucketId], [existingTodo])
    queryClient.setQueryData([TODOS_QUERY_KEY, buckets[0].id], [staleMovedTodo])

    render(<BucketColumn bucket={buckets[1]} buckets={buckets} />, { queryClient })

    fireEvent.click(screen.getByText(existingTodo.title))
    expect(await screen.findByRole('heading', { name: 'Edit Task' })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Bucket'), { target: { value: String(buckets[0].id) } })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => {
      expect(mockedUpdateTodo.mock.calls[0]?.[0]).toEqual({
        data: {
          bucketId: buckets[0].id,
          categoryId: category.id,
          description: existingTodo.description,
          id: existingTodo.id,
          tagIds: [tag.id],
          title: existingTodo.title,
        },
      })
    })
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, existingTodo.bucketId])).toEqual([])
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, buckets[0].id])).toEqual([movedTodo])
  })

  it('keeps edit mode open and shows feedback when saving Todo edits fails', async () => {
    mockedGetTodos.mockResolvedValue([existingTodo])
    mockedUpdateTodo.mockRejectedValue(new Error('Could not save changes.'))
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, existingTodo.bucketId], [existingTodo])

    render(<BucketColumn bucket={buckets[1]} buckets={buckets} />, { queryClient })

    fireEvent.click(screen.getByText(existingTodo.title))
    expect(await screen.findByRole('heading', { name: 'Edit Task' })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Plan async review' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByText('Could not save changes.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Edit Task' })).toBeInTheDocument()
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, existingTodo.bucketId])).toEqual([existingTodo])
  })

  it('keeps edit mode open and leaves caches unchanged when a Bucket move fails', async () => {
    mockedGetTodos.mockResolvedValue([existingTodo])
    mockedUpdateTodo.mockRejectedValue(new Error('Bucket not found, archived, or unauthorized'))
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, existingTodo.bucketId], [existingTodo])
    queryClient.setQueryData([TODOS_QUERY_KEY, buckets[0].id], [])

    render(<BucketColumn bucket={buckets[1]} buckets={buckets} />, { queryClient })

    fireEvent.click(screen.getByText(existingTodo.title))
    expect(await screen.findByRole('heading', { name: 'Edit Task' })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Bucket'), { target: { value: String(buckets[0].id) } })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByText('Bucket not found, archived, or unauthorized')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Edit Task' })).toBeInTheDocument()
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, existingTodo.bucketId])).toEqual([existingTodo])
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, buckets[0].id])).toEqual([])
  })

  it('discards unsaved Todo field changes when edit mode is cancelled', async () => {
    mockedGetTodos.mockResolvedValue([existingTodo])
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, existingTodo.bucketId], [existingTodo])

    render(<BucketColumn bucket={buckets[1]} buckets={buckets} />, { queryClient })

    fireEvent.click(screen.getByText(existingTodo.title))
    expect(await screen.findByRole('heading', { name: 'Edit Task' })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Unsaved title' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Unsaved description' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Edit Task' })).not.toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(existingTodo.title))

    expect(await screen.findByRole('heading', { name: 'Edit Task' })).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toHaveValue(existingTodo.title)
    expect(screen.getByLabelText('Description')).toHaveValue(existingTodo.description)
    expect(mockedUpdateTodo).not.toHaveBeenCalled()
  })
})
