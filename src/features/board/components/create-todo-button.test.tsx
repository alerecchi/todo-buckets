import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CreateTodoButton from '@/features/board/components/create-todo-button'
import { CATEGORIES_QUERY_KEY, TAGS_QUERY_KEY, TODOS_QUERY_KEY } from '@/features/board/queries/query-keys'
import { createCategory, deleteCategory, listCategories, updateCategory } from '@/server/functions/categories'
import { createTag, deleteTag, listTags, updateTag } from '@/server/functions/tags'
import { createTodo, updateTodo } from '@/server/functions/todos'
import { createTestQueryClient, render } from '@/test'

vi.mock('@/server/functions/categories', () => ({
  createCategory: vi.fn(),
  deleteCategory: vi.fn(),
  listCategories: vi.fn(() => Promise.resolve([])),
  updateCategory: vi.fn(),
}))

vi.mock('@/server/functions/todos', () => ({
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
}))

vi.mock('@/server/functions/tags', () => ({
  createTag: vi.fn(),
  deleteTag: vi.fn(),
  listTags: vi.fn(() => Promise.resolve([])),
  updateTag: vi.fn(),
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
  tags: [],
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
  tags: [],
  title: 'Plan review',
  userId: 'user-1',
}

const createdCategory = {
  colorKey: 'blue',
  id: 7,
  name: 'home admin',
  userId: 'user-1',
} as const

const existingTag = {
  colorKey: 'rose',
  id: 11,
  name: 'urgent',
  userId: 'user-1',
} as const

const createdTag = {
  colorKey: 'blue',
  id: 12,
  name: 'focus',
  userId: 'user-1',
} as const

const mockedCreateTodo = vi.mocked(createTodo)
const mockedUpdateTodo = vi.mocked(updateTodo)
const mockedCreateCategory = vi.mocked(createCategory)
const mockedDeleteCategory = vi.mocked(deleteCategory)
const mockedListCategories = vi.mocked(listCategories)
const mockedUpdateCategory = vi.mocked(updateCategory)
const mockedCreateTag = vi.mocked(createTag)
const mockedDeleteTag = vi.mocked(deleteTag)
const mockedListTags = vi.mocked(listTags)
const mockedUpdateTag = vi.mocked(updateTag)

describe('CreateTodoButton', () => {
  beforeEach(() => {
    mockedCreateCategory.mockReset()
    mockedDeleteCategory.mockReset()
    mockedListCategories.mockReset()
    mockedListCategories.mockResolvedValue([])
    mockedCreateTag.mockReset()
    mockedDeleteTag.mockReset()
    mockedListTags.mockReset()
    mockedListTags.mockResolvedValue([])
    mockedUpdateTag.mockReset()
    mockedUpdateCategory.mockReset()
    mockedCreateTodo.mockReset()
    mockedUpdateTodo.mockReset()
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
        tagIds: [],
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
    expect(screen.getByLabelText('Edit category name')).toHaveValue(createdCategory.name)
    expect(screen.getByLabelText('Edit category color')).toHaveValue(createdCategory.colorKey)

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
        tagIds: [],
        title: 'Organize cabinet',
      },
    })
  })

  it('creates a Todo with multiple selected Tags', async () => {
    mockedListTags.mockResolvedValue([existingTag, createdTag])
    mockedCreateTodo.mockResolvedValue({
      ...createdTodo,
      tags: [
        {
          colorKey: existingTag.colorKey,
          id: existingTag.id,
          name: existingTag.name,
        },
        {
          colorKey: createdTag.colorKey,
          id: createdTag.id,
          name: createdTag.name,
        },
      ],
    })

    render(<CreateTodoButton bucketId={1} buckets={buckets} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Plan review' } })
    fireEvent.click(await screen.findByLabelText(existingTag.name))
    fireEvent.click(screen.getByLabelText(createdTag.name))
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(mockedCreateTodo).toHaveBeenCalled()
    })
    expect(mockedCreateTodo.mock.calls[0]?.[0]).toEqual({
      data: {
        bucketId: 1,
        categoryId: null,
        description: '',
        tagIds: [existingTag.id, createdTag.id],
        title: 'Plan review',
      },
    })
  })

  it('creates a Tag from the picker, selects it, and saves the Todo with it', async () => {
    mockedCreateTag.mockResolvedValue(createdTag)
    mockedCreateTodo.mockResolvedValue({
      ...createdTodo,
      tags: [
        {
          colorKey: createdTag.colorKey,
          id: createdTag.id,
          name: createdTag.name,
        },
      ],
    })
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TAGS_QUERY_KEY], [])

    render(<CreateTodoButton bucketId={1} buckets={buckets} />, { queryClient })

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Plan review' } })
    fireEvent.change(screen.getByLabelText('New tag'), { target: { value: '  Focus  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create tag' }))

    await waitFor(() => {
      expect(screen.getByLabelText(createdTag.name)).toBeChecked()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(mockedCreateTodo).toHaveBeenCalled()
    })
    expect(mockedCreateTag.mock.calls[0]?.[0]).toEqual({
      data: {
        colorKey: 'blue',
        name: 'Focus',
      },
    })
    expect(mockedCreateTodo.mock.calls[0]?.[0]).toEqual({
      data: {
        bucketId: 1,
        categoryId: null,
        description: '',
        tagIds: [createdTag.id],
        title: 'Plan review',
      },
    })
  })

  it('renames and recolors a Tag immediately and patches cached Todo card badges without submitting the Todo', async () => {
    const updatedTag = {
      colorKey: 'green',
      id: existingTag.id,
      name: 'next_up',
      userId: 'user-1',
    } as const
    mockedListTags.mockResolvedValue([existingTag])
    mockedUpdateTag.mockResolvedValue(updatedTag)
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TAGS_QUERY_KEY], [existingTag])
    queryClient.setQueryData(
      [TODOS_QUERY_KEY, 1],
      [
        {
          ...existingTodo,
          tags: [
            {
              colorKey: existingTag.colorKey,
              id: existingTag.id,
              name: existingTag.name,
            },
          ],
        },
      ],
    )
    queryClient.setQueryData(
      [TODOS_QUERY_KEY, 2],
      [
        {
          ...createdTodo,
          tags: [
            {
              colorKey: existingTag.colorKey,
              id: existingTag.id,
              name: existingTag.name,
            },
          ],
        },
      ],
    )

    render(<CreateTodoButton bucketId={1} buckets={buckets} />, { queryClient })

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    expect(await screen.findByLabelText(existingTag.name)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Edit tag name'), { target: { value: '  Next_Up  ' } })
    fireEvent.change(screen.getByLabelText('Edit tag color'), { target: { value: 'green' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save tag' }))

    await waitFor(() => {
      expect(mockedUpdateTag).toHaveBeenCalled()
    })
    expect(mockedUpdateTag.mock.calls[0]?.[0]).toEqual({
      data: {
        colorKey: 'green',
        id: existingTag.id,
        name: 'Next_Up',
      },
    })
    expect(mockedCreateTodo).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'Add New Task' })).toBeInTheDocument()
    expect(queryClient.getQueryData([TAGS_QUERY_KEY])).toEqual([updatedTag])
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, 1])).toEqual([
      expect.objectContaining({
        tags: [
          {
            colorKey: 'green',
            id: existingTag.id,
            name: 'next_up',
          },
        ],
      }),
    ])
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, 2])).toEqual([
      expect.objectContaining({
        tags: [
          {
            colorKey: 'green',
            id: existingTag.id,
            name: 'next_up',
          },
        ],
      }),
    ])
  })

  it('keeps Tag edit errors local to the picker', async () => {
    mockedListTags.mockResolvedValue([existingTag])
    mockedUpdateTag.mockRejectedValue(new Error('Tag name already exists'))

    render(<CreateTodoButton bucketId={1} buckets={buckets} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    expect(await screen.findByLabelText(existingTag.name)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Edit tag name'), { target: { value: 'focus' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save tag' }))

    expect(await screen.findByText('Tag name already exists')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Add New Task' })).toBeInTheDocument()
    expect(mockedCreateTodo).not.toHaveBeenCalled()
  })

  it('deletes a selected Tag after confirmation and clears cached Todo card badges without submitting', async () => {
    mockedListTags.mockResolvedValue([existingTag])
    mockedDeleteTag.mockResolvedValue({
      tagId: existingTag.id,
      userId: 'user-1',
    })
    mockedCreateTodo.mockResolvedValue(createdTodo)
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TAGS_QUERY_KEY], [existingTag])
    queryClient.setQueryData(
      [TODOS_QUERY_KEY, 1],
      [
        {
          ...existingTodo,
          tags: [
            {
              colorKey: existingTag.colorKey,
              id: existingTag.id,
              name: existingTag.name,
            },
          ],
        },
      ],
    )

    render(<CreateTodoButton bucketId={1} buckets={buckets} />, { queryClient })

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Plan review' } })
    fireEvent.click(await screen.findByLabelText(existingTag.name))
    fireEvent.click(screen.getByRole('button', { name: 'Delete tag' }))

    await waitFor(() => {
      expect(mockedDeleteTag).toHaveBeenCalled()
    })
    expect(confirmSpy).toHaveBeenCalledWith('Delete this tag? Todos using it will keep existing without this tag.')
    expect(mockedDeleteTag.mock.calls[0]?.[0]).toEqual({
      data: {
        id: existingTag.id,
      },
    })
    expect(mockedCreateTodo).not.toHaveBeenCalled()
    expect(queryClient.getQueryData([TAGS_QUERY_KEY])).toEqual([])
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, 1])).toEqual([
      expect.objectContaining({
        tags: [],
      }),
    ])

    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(mockedCreateTodo).toHaveBeenCalled()
    })
    expect(mockedCreateTodo.mock.calls[0]?.[0]).toEqual({
      data: {
        bucketId: 1,
        categoryId: null,
        description: '',
        tagIds: [],
        title: 'Plan review',
      },
    })

    confirmSpy.mockRestore()
  })

  it('keeps Tag delete errors local to the picker', async () => {
    mockedListTags.mockResolvedValue([existingTag])
    mockedDeleteTag.mockRejectedValue(new Error('Could not delete the tag.'))
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<CreateTodoButton bucketId={1} buckets={buckets} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    fireEvent.click(await screen.findByLabelText(existingTag.name))
    fireEvent.click(screen.getByRole('button', { name: 'Delete tag' }))

    expect(await screen.findByText('Could not delete the tag.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Add New Task' })).toBeInTheDocument()
    expect(screen.getByLabelText(existingTag.name)).toBeChecked()
    expect(mockedCreateTodo).not.toHaveBeenCalled()

    confirmSpy.mockRestore()
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

  it('renames and recolors a Category immediately and patches cached Todo cards without submitting the Todo', async () => {
    const updatedCategory = {
      colorKey: 'green',
      id: createdCategory.id,
      name: 'life admin',
      userId: 'user-1',
    } as const
    mockedListCategories.mockResolvedValue([createdCategory])
    mockedUpdateCategory.mockResolvedValue(updatedCategory)
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([CATEGORIES_QUERY_KEY], [createdCategory])
    queryClient.setQueryData(
      [TODOS_QUERY_KEY, 1],
      [
        {
          ...existingTodo,
          category: {
            colorKey: createdCategory.colorKey,
            id: createdCategory.id,
            name: createdCategory.name,
          },
          categoryId: createdCategory.id,
        },
      ],
    )
    queryClient.setQueryData(
      [TODOS_QUERY_KEY, 2],
      [
        {
          ...createdTodo,
          category: {
            colorKey: createdCategory.colorKey,
            id: createdCategory.id,
            name: createdCategory.name,
          },
          categoryId: createdCategory.id,
        },
      ],
    )

    render(<CreateTodoButton bucketId={1} buckets={buckets} />, { queryClient })

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    expect(await screen.findByRole('option', { name: createdCategory.name })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: String(createdCategory.id) } })
    fireEvent.change(await screen.findByLabelText('Edit category name'), { target: { value: '  Life   Admin  ' } })
    fireEvent.change(screen.getByLabelText('Edit category color'), { target: { value: 'green' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save category' }))

    await waitFor(() => {
      expect(mockedUpdateCategory).toHaveBeenCalled()
    })
    expect(mockedUpdateCategory.mock.calls[0]?.[0]).toEqual({
      data: {
        colorKey: 'green',
        id: createdCategory.id,
        name: 'Life   Admin',
      },
    })
    expect(mockedCreateTodo).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'Add New Task' })).toBeInTheDocument()
    expect(queryClient.getQueryData([CATEGORIES_QUERY_KEY])).toEqual([updatedCategory])
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, 1])).toEqual([
      expect.objectContaining({
        category: {
          colorKey: 'green',
          id: createdCategory.id,
          name: 'life admin',
        },
      }),
    ])
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, 2])).toEqual([
      expect.objectContaining({
        category: {
          colorKey: 'green',
          id: createdCategory.id,
          name: 'life admin',
        },
      }),
    ])
  })

  it('keeps Category edit errors local to the picker', async () => {
    mockedListCategories.mockResolvedValue([createdCategory])
    mockedUpdateCategory.mockRejectedValue(new Error('Category name already exists'))

    render(<CreateTodoButton bucketId={1} buckets={buckets} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    expect(await screen.findByRole('option', { name: createdCategory.name })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: String(createdCategory.id) } })
    fireEvent.change(await screen.findByLabelText('Edit category name'), { target: { value: 'life admin' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save category' }))

    expect(await screen.findByText('Category name already exists')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Add New Task' })).toBeInTheDocument()
    expect(mockedCreateTodo).not.toHaveBeenCalled()
  })

  it('deletes the selected Category after confirmation and clears cached Todo card categories without submitting', async () => {
    mockedListCategories.mockResolvedValue([createdCategory])
    mockedDeleteCategory.mockResolvedValue({
      categoryId: createdCategory.id,
      userId: 'user-1',
    })
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([CATEGORIES_QUERY_KEY], [createdCategory])
    queryClient.setQueryData(
      [TODOS_QUERY_KEY, 1],
      [
        {
          ...existingTodo,
          category: {
            colorKey: createdCategory.colorKey,
            id: createdCategory.id,
            name: createdCategory.name,
          },
          categoryId: createdCategory.id,
        },
      ],
    )

    render(<CreateTodoButton bucketId={1} buckets={buckets} />, { queryClient })

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    expect(await screen.findByRole('option', { name: createdCategory.name })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: String(createdCategory.id) } })
    fireEvent.click(await screen.findByRole('button', { name: 'Delete category' }))

    await waitFor(() => {
      expect(mockedDeleteCategory).toHaveBeenCalled()
    })
    expect(confirmSpy).toHaveBeenCalledWith(
      'Delete this category? Todos using it will keep existing without a category.',
    )
    expect(mockedDeleteCategory.mock.calls[0]?.[0]).toEqual({
      data: {
        id: createdCategory.id,
      },
    })
    expect(mockedCreateTodo).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Category')).toHaveValue('')
    expect(queryClient.getQueryData([CATEGORIES_QUERY_KEY])).toEqual([])
    expect(queryClient.getQueryData([TODOS_QUERY_KEY, 1])).toEqual([
      expect.objectContaining({
        category: null,
        categoryId: null,
      }),
    ])

    confirmSpy.mockRestore()
  })

  it('keeps Category delete errors local to the picker', async () => {
    mockedListCategories.mockResolvedValue([createdCategory])
    mockedDeleteCategory.mockRejectedValue(new Error('Could not delete the category.'))
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<CreateTodoButton bucketId={1} buckets={buckets} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add todo' }))
    expect(await screen.findByRole('option', { name: createdCategory.name })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: String(createdCategory.id) } })
    fireEvent.click(await screen.findByRole('button', { name: 'Delete category' }))

    expect(await screen.findByText('Could not delete the category.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Add New Task' })).toBeInTheDocument()
    expect(screen.getByLabelText('Category')).toHaveValue(String(createdCategory.id))
    expect(mockedCreateTodo).not.toHaveBeenCalled()

    confirmSpy.mockRestore()
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
