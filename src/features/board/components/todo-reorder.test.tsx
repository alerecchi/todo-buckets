import { act, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BucketColumn } from '@/features/board/components/bucket-column'
import { TODOS_QUERY_KEY } from '@/features/board/queries/query-keys'
import type { Bucket } from '@/lib/types/Bucket'
import type { Todo } from '@/lib/types/Todo'
import { moveTodo } from '@/server/functions/todos'
import { createTestQueryClient, render } from '@/test'

const dnd = vi.hoisted(() => ({
  activeDropTargetId: null as string | null,
  dragEnd: undefined as ((event: unknown) => void) | undefined,
}))

vi.mock('@dnd-kit/react', () => ({
  DragDropProvider: ({ children, onDragEnd }: { children: ReactNode; onDragEnd: (event: unknown) => void }) => {
    dnd.dragEnd = onDragEnd

    return <>{children}</>
  },
  useDragOperation: () => ({
    source: null,
    target: dnd.activeDropTargetId ? { id: dnd.activeDropTargetId } : null,
  }),
  useDraggable: () => ({
    handleRef: vi.fn(),
    isDragSource: false,
    isDragging: false,
    isDropping: false,
    ref: vi.fn(),
  }),
  useDroppable: ({ id }: { id: string }) => ({
    isDropTarget: dnd.activeDropTargetId === id,
    ref: vi.fn(),
  }),
}))

vi.mock('@/server/functions/todos', () => ({
  createTodo: vi.fn(),
  deleteTodo: vi.fn(),
  getTodos: vi.fn(() => Promise.resolve([])),
  moveTodo: vi.fn(),
  updateTodo: vi.fn(),
}))

vi.mock('@/server/functions/buckets', () => ({
  getBuckets: vi.fn(),
}))

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

const bucket = {
  id: 2,
  period: '2026-06-24',
  type: 'daily',
  userId: 'user-1',
} satisfies Bucket

const buckets = [bucket] satisfies Array<Bucket>

const todos = [
  createTodo({ id: 10, position: 1024, title: 'First todo' }),
  createTodo({ id: 20, position: 2048, title: 'Second todo' }),
  createTodo({ id: 30, position: 3072, title: 'Third todo' }),
] satisfies Array<Todo>

const mockedMoveTodo = vi.mocked(moveTodo)

describe('Todo reordering within a Bucket', () => {
  beforeEach(() => {
    dnd.activeDropTargetId = null
    dnd.dragEnd = undefined
    mockedMoveTodo.mockReset()
    mockedMoveTodo.mockResolvedValue({
      affectedBucketIds: [bucket.id],
      affectedTodoPositions: [{ bucketId: bucket.id, id: todos[1].id, position: 512 }],
      todo: { ...todos[1], position: 512, userId: 'user-1' },
    })
  })

  it('moves a Todo before the first Todo when dropped on the first insertion line', async () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], todos)

    render(<BucketColumn bucket={bucket} buckets={buckets} />, { queryClient })

    expect(screen.getByRole('button', { name: 'Drag Second todo' })).toBeInTheDocument()

    act(() => {
      dnd.dragEnd?.({
        canceled: false,
        operation: {
          source: { data: { bucketId: bucket.id, kind: 'todo', todoId: todos[1].id } },
          target: {
            data: {
              afterTodoId: todos[0].id,
              beforeTodoId: undefined,
              bucketId: bucket.id,
              kind: 'todo-insertion',
            },
            id: `bucket-${bucket.id}-insertion-0`,
          },
        },
      })
    })

    await waitFor(() => {
      expect(mockedMoveTodo).toHaveBeenCalledWith({
        data: {
          afterTodoId: todos[0].id,
          id: todos[1].id,
          targetBucketId: bucket.id,
        },
      })
    })
  })

  it('moves a Todo between neighboring Todos when dropped on a middle insertion line', async () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], todos)

    render(<BucketColumn bucket={bucket} buckets={buckets} />, { queryClient })

    act(() => {
      dnd.dragEnd?.({
        canceled: false,
        operation: {
          source: { data: { bucketId: bucket.id, kind: 'todo', todoId: todos[0].id } },
          target: {
            data: {
              afterTodoId: todos[2].id,
              beforeTodoId: todos[1].id,
              bucketId: bucket.id,
              kind: 'todo-insertion',
            },
            id: `bucket-${bucket.id}-insertion-2`,
          },
        },
      })
    })

    await waitFor(() => {
      expect(mockedMoveTodo).toHaveBeenCalledWith({
        data: {
          afterTodoId: todos[2].id,
          beforeTodoId: todos[1].id,
          id: todos[0].id,
          targetBucketId: bucket.id,
        },
      })
    })
  })

  it('moves a Todo after the last Todo when dropped on the final insertion line', async () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], todos)

    render(<BucketColumn bucket={bucket} buckets={buckets} />, { queryClient })

    act(() => {
      dnd.dragEnd?.({
        canceled: false,
        operation: {
          source: { data: { bucketId: bucket.id, kind: 'todo', todoId: todos[0].id } },
          target: {
            data: {
              afterTodoId: undefined,
              beforeTodoId: todos[2].id,
              bucketId: bucket.id,
              kind: 'todo-insertion',
            },
            id: `bucket-${bucket.id}-insertion-3`,
          },
        },
      })
    })

    await waitFor(() => {
      expect(mockedMoveTodo).toHaveBeenCalledWith({
        data: {
          beforeTodoId: todos[2].id,
          id: todos[0].id,
          targetBucketId: bucket.id,
        },
      })
    })
  })

  it('does not move a Todo when dropped on the insertion line immediately before itself', () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], todos)

    render(<BucketColumn bucket={bucket} buckets={buckets} />, { queryClient })

    act(() => {
      dnd.dragEnd?.({
        canceled: false,
        operation: {
          source: { data: { bucketId: bucket.id, kind: 'todo', todoId: todos[1].id } },
          target: {
            data: {
              afterTodoId: todos[1].id,
              beforeTodoId: todos[0].id,
              bucketId: bucket.id,
              kind: 'todo-insertion',
            },
            id: `bucket-${bucket.id}-insertion-1`,
          },
        },
      })
    })

    expect(mockedMoveTodo).not.toHaveBeenCalled()
    expect(queryClient.getQueryData<Array<Todo>>([TODOS_QUERY_KEY, bucket.id])?.map((todo) => todo.id)).toEqual([
      todos[0].id,
      todos[1].id,
      todos[2].id,
    ])
  })

  it('does not move a Todo when dropped on the insertion line immediately after itself', () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], todos)

    render(<BucketColumn bucket={bucket} buckets={buckets} />, { queryClient })

    act(() => {
      dnd.dragEnd?.({
        canceled: false,
        operation: {
          source: { data: { bucketId: bucket.id, kind: 'todo', todoId: todos[1].id } },
          target: {
            data: {
              afterTodoId: todos[2].id,
              beforeTodoId: todos[1].id,
              bucketId: bucket.id,
              kind: 'todo-insertion',
            },
            id: `bucket-${bucket.id}-insertion-2`,
          },
        },
      })
    })

    expect(mockedMoveTodo).not.toHaveBeenCalled()
    expect(queryClient.getQueryData<Array<Todo>>([TODOS_QUERY_KEY, bucket.id])?.map((todo) => todo.id)).toEqual([
      todos[0].id,
      todos[1].id,
      todos[2].id,
    ])
  })

  it('updates the Bucket cache optimistically before the move finishes', () => {
    let finishMove: ((todo: Awaited<ReturnType<typeof moveTodo>>) => void) | undefined
    mockedMoveTodo.mockReturnValue(
      new Promise((resolve) => {
        finishMove = resolve
      }),
    )
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], todos)

    render(<BucketColumn bucket={bucket} buckets={buckets} />, { queryClient })

    act(() => {
      dnd.dragEnd?.({
        canceled: false,
        operation: {
          source: { data: { bucketId: bucket.id, kind: 'todo', todoId: todos[1].id } },
          target: {
            data: {
              afterTodoId: todos[0].id,
              beforeTodoId: undefined,
              bucketId: bucket.id,
              kind: 'todo-insertion',
            },
            id: `bucket-${bucket.id}-insertion-0`,
          },
        },
      })
    })

    expect(queryClient.getQueryData<Array<Todo>>([TODOS_QUERY_KEY, bucket.id])?.map((todo) => todo.id)).toEqual([
      todos[1].id,
      todos[0].id,
      todos[2].id,
    ])

    finishMove?.({
      affectedBucketIds: [bucket.id],
      affectedTodoPositions: [{ bucketId: bucket.id, id: todos[1].id, position: 512 }],
      todo: { ...todos[1], position: 512, userId: 'user-1' },
    })
  })

  it('shows only the active horizontal insertion line as the drop-position indicator', () => {
    dnd.activeDropTargetId = `bucket-${bucket.id}-insertion-1`
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], todos)

    render(<BucketColumn bucket={bucket} buckets={buckets} />, { queryClient })

    expect(screen.getByTestId(`bucket-${bucket.id}-insertion-0`)).toHaveAttribute('data-drop-target', 'false')
    expect(screen.getByTestId(`bucket-${bucket.id}-insertion-1`)).toHaveAttribute('data-drop-target', 'true')
    expect(screen.getByTestId(`bucket-${bucket.id}-insertion-2`)).toHaveAttribute('data-drop-target', 'false')
    expect(screen.getByTestId(`bucket-${bucket.id}-insertion-3`)).toHaveAttribute('data-drop-target', 'false')
    expect(screen.queryByTestId('todo-drop-placeholder')).not.toBeInTheDocument()
  })

  it('moves completed Todos with the same insertion-line anchors', async () => {
    const completedTodos = [todos[0], { ...todos[1], completed: true }, todos[2]]
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], completedTodos)

    render(<BucketColumn bucket={bucket} buckets={buckets} />, { queryClient })

    expect(screen.getByRole('button', { name: 'Drag Second todo' })).toBeInTheDocument()

    act(() => {
      dnd.dragEnd?.({
        canceled: false,
        operation: {
          source: { data: { bucketId: bucket.id, kind: 'todo', todoId: todos[1].id } },
          target: {
            data: {
              afterTodoId: undefined,
              beforeTodoId: todos[2].id,
              bucketId: bucket.id,
              kind: 'todo-insertion',
            },
            id: `bucket-${bucket.id}-insertion-3`,
          },
        },
      })
    })

    await waitFor(() => {
      expect(mockedMoveTodo).toHaveBeenCalledWith({
        data: {
          beforeTodoId: todos[2].id,
          id: todos[1].id,
          targetBucketId: bucket.id,
        },
      })
    })
  })
})

function createTodo({ id, position, title }: { id: number; position: number; title: string }): Todo {
  return {
    bucketId: bucket.id,
    category: null,
    categoryId: null,
    completed: false,
    createdAt: new Date('2026-06-24T10:00:00.000Z'),
    description: '',
    id,
    position,
    tags: [],
    title,
  }
}
