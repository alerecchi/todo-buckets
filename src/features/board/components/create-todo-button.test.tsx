import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CreateTodoButton from '@/features/board/components/create-todo-button'
import { TODOS_QUERY_KEY } from '@/features/board/queries/query-keys'
import { createCategory, listCategories } from '@/server/functions/categories'
import { createTodo } from '@/server/functions/todos'
import { createTestQueryClient, render } from '@/test'

vi.mock('@/server/functions/categories', () => ({
  createCategory: vi.fn(),
  listCategories: vi.fn(() => Promise.resolve([])),
}))

vi.mock('@/server/functions/todos', () => ({
  createTodo: vi.fn(),
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
] as const

const existingTodo = {
  bucketId: 1,
  category: null,
  categoryId: null,
  completed: false,
  createdAt: new Date('2026-06-10T10:00:00.000Z'),
  description: '',
  id: 1,
  title: 'Existing',
  userId: 'user-1',
}

const createdTodo = {
  bucketId: 2,
  category: null,
  categoryId: null,
  completed: false,
  createdAt: new Date('2026-06-11T10:00:00.000Z'),
  description: 'Bring notes',
  id: 2,
  title: 'Plan review',
  userId: 'user-1',
}

const createdCategory = {
  colorKey: 'blue',
  id: 7,
  name: 'home admin',
  userId: 'user-1',
} as const

const mockedCreateTodo = vi.mocked(createTodo)
const mockedCreateCategory = vi.mocked(createCategory)
const mockedListCategories = vi.mocked(listCategories)

describe('CreateTodoButton', () => {
  beforeEach(() => {
    mockedCreateCategory.mockReset()
    mockedListCategories.mockReset()
    mockedListCategories.mockResolvedValue([])
    mockedCreateTodo.mockReset()
  })

  it('opens TodoDialog create mode with the current bucket selected', () => {
    render(<CreateTodoButton bucketId={1} buckets={buckets} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))

    expect(screen.getByRole('heading', { name: 'Add New Task' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
    expect(screen.getByLabelText('Bucket')).toHaveValue('1')
  })

  it('creates a todo in the selected bucket, closes, and patches only that bucket cache', async () => {
    mockedCreateTodo.mockResolvedValue(createdTodo)
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, 1], [existingTodo])
    queryClient.setQueryData([TODOS_QUERY_KEY, 2], [])

    render(<CreateTodoButton bucketId={1} buckets={buckets} />, { queryClient })

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: '  Plan review  ' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Bring notes' } })
    fireEvent.change(screen.getByLabelText('Bucket'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Add New Task' })).not.toBeInTheDocument()
    })
    expect(mockedCreateTodo.mock.calls[0]?.[0]).toEqual({
      data: {
        bucketId: 2,
        categoryId: null,
        description: 'Bring notes',
        title: 'Plan review',
      },
    })
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, 1])).toEqual([existingTodo])
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, 2])).toEqual([createdTodo])
  })

  it('creates a Category from the picker, selects it, and saves the Todo with it', async () => {
    mockedCreateCategory.mockResolvedValue(createdCategory)
    mockedCreateTodo.mockResolvedValue({
      ...createdTodo,
      category: {
        colorKey: createdCategory.colorKey,
        id: createdCategory.id,
        name: createdCategory.name,
      },
      categoryId: createdCategory.id,
    })

    render(<CreateTodoButton bucketId={1} buckets={buckets} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Organize cabinet' } })
    fireEvent.change(screen.getByLabelText('New category'), { target: { value: '  Home   Admin  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create category' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Category')).toHaveValue(String(createdCategory.id))
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(mockedCreateTodo).toHaveBeenCalled()
    })
    expect(mockedCreateCategory.mock.calls[0]?.[0]).toEqual({
      data: {
        colorKey: 'blue',
        name: 'Home   Admin',
      },
    })
    expect(mockedCreateTodo.mock.calls[0]?.[0]).toEqual({
      data: {
        bucketId: 1,
        categoryId: createdCategory.id,
        description: '',
        title: 'Organize cabinet',
      },
    })
  })

  it('keeps the dialog open and shows feedback when Category creation fails', async () => {
    mockedCreateCategory.mockRejectedValue(new Error('Could not create the category.'))

    render(<CreateTodoButton bucketId={1} buckets={buckets} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    fireEvent.change(screen.getByLabelText('New category'), { target: { value: 'Home admin' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create category' }))

    expect(await screen.findByText('Could not create the category.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Add New Task' })).toBeInTheDocument()
    expect(screen.getByLabelText('Category')).toHaveValue('')
  })

  it('rejects missing title and missing bucket before saving', async () => {
    render(<CreateTodoButton bucketId={1} buckets={buckets} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(await screen.findByText('Title is required.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Plan review' } })
    fireEvent.change(screen.getByLabelText('Bucket'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(await screen.findByText('Bucket is required.')).toBeInTheDocument()
    expect(mockedCreateTodo).not.toHaveBeenCalled()
  })

  it('keeps the dialog open and shows feedback when saving fails', async () => {
    mockedCreateTodo.mockRejectedValue(new Error('Could not save the todo.'))
    render(<CreateTodoButton bucketId={1} buckets={buckets} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Plan review' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(await screen.findByText('Could not save the todo.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Add New Task' })).toBeInTheDocument()
  })
})
