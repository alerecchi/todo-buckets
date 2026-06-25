import { act, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BucketColumn } from '@/features/board/components/bucket-column'
import { TodoDragDropProvider } from '@/features/board/components/todo-drag-drop-provider'
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

const destinationBucket = {
  id: 3,
  period: '2026-06',
  type: 'monthly',
  userId: 'user-1',
} satisfies Bucket

const buckets = [bucket, destinationBucket] satisfies Array<Bucket>

const todos = [
  createTodo({ id: 10, position: 1024, title: 'First todo' }),
  createTodo({ id: 20, position: 2048, title: 'Second todo' }),
  createTodo({ id: 30, position: 3072, title: 'Third todo' }),
] satisfies Array<Todo>

const destinationTodos = [
  createTodo({ bucketId: destinationBucket.id, id: 40, position: 1024, title: 'Destination first' }),
  createTodo({ bucketId: destinationBucket.id, id: 50, position: 2048, title: 'Destination second' }),
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

    renderBucket(bucket, queryClient)

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

    renderBucket(bucket, queryClient)

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

    renderBucket(bucket, queryClient)

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

    renderBucket(bucket, queryClient)

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

    renderBucket(bucket, queryClient)

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

    renderBucket(bucket, queryClient)

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

    renderBucket(bucket, queryClient)

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

    renderBucket(bucket, queryClient)

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

describe('Bucket column layout', () => {
  it('uses stable equal-width flex sizing so unrelated Buckets do not reflow during moves', () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], todos)

    renderBucket(bucket, queryClient)

    expect(screen.getByText(bucket.type).closest('.my-6')).toHaveClass('min-w-0', 'basis-0', 'flex-1')
  })
})

describe('Todo movement across Buckets', () => {
  beforeEach(() => {
    dnd.activeDropTargetId = null
    dnd.dragEnd = undefined
    mockedMoveTodo.mockReset()
    mockedMoveTodo.mockResolvedValue({
      affectedBucketIds: [bucket.id, destinationBucket.id],
      affectedTodoPositions: [{ bucketId: destinationBucket.id, id: todos[1].id, position: 1536 }],
      todo: { ...todos[1], bucketId: destinationBucket.id, position: 1536, userId: 'user-1' },
    })
  })

  it('moves a Todo to another Bucket at the visible insertion line', async () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], todos)
    queryClient.setQueryData([TODOS_QUERY_KEY, destinationBucket.id], destinationTodos)

    render(
      <TodoDragDropProvider>
        <BucketColumn bucket={bucket} buckets={buckets} />
        <BucketColumn bucket={destinationBucket} buckets={buckets} />
      </TodoDragDropProvider>,
      { queryClient },
    )

    act(() => {
      dnd.dragEnd?.({
        canceled: false,
        operation: {
          source: { data: { bucketId: bucket.id, kind: 'todo', todoId: todos[1].id } },
          target: {
            data: {
              afterTodoId: destinationTodos[1].id,
              beforeTodoId: destinationTodos[0].id,
              bucketId: destinationBucket.id,
              kind: 'todo-insertion',
            },
            id: `bucket-${destinationBucket.id}-insertion-1`,
          },
        },
      })
    })

    await waitFor(() => {
      expect(mockedMoveTodo).toHaveBeenCalledWith({
        data: {
          afterTodoId: destinationTodos[1].id,
          beforeTodoId: destinationTodos[0].id,
          id: todos[1].id,
          targetBucketId: destinationBucket.id,
        },
      })
    })
  })

  it('removes the moved Todo from the source cache and inserts it into the destination cache after success', async () => {
    const movedTodo = { ...todos[1], bucketId: destinationBucket.id, position: 1536, userId: 'user-1' }
    mockedMoveTodo.mockResolvedValue({
      affectedBucketIds: [bucket.id, destinationBucket.id],
      affectedTodoPositions: [
        { bucketId: destinationBucket.id, id: destinationTodos[0].id, position: 1024 },
        { bucketId: destinationBucket.id, id: movedTodo.id, position: movedTodo.position },
        { bucketId: destinationBucket.id, id: destinationTodos[1].id, position: 2048 },
      ],
      todo: movedTodo,
    })
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], todos)
    queryClient.setQueryData([TODOS_QUERY_KEY, destinationBucket.id], destinationTodos)

    render(
      <TodoDragDropProvider>
        <BucketColumn bucket={bucket} buckets={buckets} />
        <BucketColumn bucket={destinationBucket} buckets={buckets} />
      </TodoDragDropProvider>,
      { queryClient },
    )

    act(() => {
      dnd.dragEnd?.({
        canceled: false,
        operation: {
          source: { data: { bucketId: bucket.id, kind: 'todo', todoId: todos[1].id } },
          target: {
            data: {
              afterTodoId: destinationTodos[1].id,
              beforeTodoId: destinationTodos[0].id,
              bucketId: destinationBucket.id,
              kind: 'todo-insertion',
            },
            id: `bucket-${destinationBucket.id}-insertion-1`,
          },
        },
      })
    })

    await waitFor(() => {
      expect(queryClient.getQueryData<Array<Todo>>([TODOS_QUERY_KEY, bucket.id])?.map((todo) => todo.id)).toEqual([
        todos[0].id,
        todos[2].id,
      ])
      expect(
        queryClient.getQueryData<Array<Todo>>([TODOS_QUERY_KEY, destinationBucket.id])?.map((todo) => todo.id),
      ).toEqual([destinationTodos[0].id, movedTodo.id, destinationTodos[1].id])
    })
  })

  it('optimistically moves a Todo across Buckets before the server responds', () => {
    mockedMoveTodo.mockReturnValue(new Promise(() => {}))
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], todos)
    queryClient.setQueryData([TODOS_QUERY_KEY, destinationBucket.id], destinationTodos)

    render(
      <TodoDragDropProvider>
        <BucketColumn bucket={bucket} buckets={buckets} />
        <BucketColumn bucket={destinationBucket} buckets={buckets} />
      </TodoDragDropProvider>,
      { queryClient },
    )

    act(() => {
      dnd.dragEnd?.({
        canceled: false,
        operation: {
          source: { data: { bucketId: bucket.id, kind: 'todo', todoId: todos[1].id } },
          target: {
            data: {
              afterTodoId: destinationTodos[1].id,
              beforeTodoId: destinationTodos[0].id,
              bucketId: destinationBucket.id,
              kind: 'todo-insertion',
            },
            id: `bucket-${destinationBucket.id}-insertion-1`,
          },
        },
      })
    })

    expect(queryClient.getQueryData<Array<Todo>>([TODOS_QUERY_KEY, bucket.id])?.map((todo) => todo.id)).toEqual([
      todos[0].id,
      todos[2].id,
    ])
    expect(
      queryClient.getQueryData<Array<Todo>>([TODOS_QUERY_KEY, destinationBucket.id])?.map((todo) => todo.id),
    ).toEqual([destinationTodos[0].id, todos[1].id, destinationTodos[1].id])
  })

  it('moves a Todo into an empty Bucket from its top insertion line', async () => {
    const movedTodo = { ...todos[0], bucketId: destinationBucket.id, position: 1024, userId: 'user-1' }
    dnd.activeDropTargetId = `bucket-${destinationBucket.id}-insertion-0`
    mockedMoveTodo.mockResolvedValue({
      affectedBucketIds: [bucket.id, destinationBucket.id],
      affectedTodoPositions: [{ bucketId: destinationBucket.id, id: movedTodo.id, position: movedTodo.position }],
      todo: movedTodo,
    })
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], todos)
    queryClient.setQueryData([TODOS_QUERY_KEY, destinationBucket.id], [])

    render(
      <TodoDragDropProvider>
        <BucketColumn bucket={bucket} buckets={buckets} />
        <BucketColumn bucket={destinationBucket} buckets={buckets} />
      </TodoDragDropProvider>,
      { queryClient },
    )

    expect(screen.getByTestId(`bucket-${destinationBucket.id}-insertion-0`)).toHaveAttribute('data-drop-target', 'true')

    act(() => {
      dnd.dragEnd?.({
        canceled: false,
        operation: {
          source: { data: { bucketId: bucket.id, kind: 'todo', todoId: todos[0].id } },
          target: {
            data: {
              afterTodoId: undefined,
              beforeTodoId: undefined,
              bucketId: destinationBucket.id,
              kind: 'todo-insertion',
            },
            id: `bucket-${destinationBucket.id}-insertion-0`,
          },
        },
      })
    })

    await waitFor(() => {
      expect(mockedMoveTodo).toHaveBeenCalledWith({
        data: {
          id: todos[0].id,
          targetBucketId: destinationBucket.id,
        },
      })
      expect(queryClient.getQueryData<Array<Todo>>([TODOS_QUERY_KEY, bucket.id])?.map((todo) => todo.id)).toEqual([
        todos[1].id,
        todos[2].id,
      ])
      expect(queryClient.getQueryData<Array<Todo>>([TODOS_QUERY_KEY, destinationBucket.id])).toEqual([movedTodo])
    })
  })

  it('moves a completed Todo across Buckets with the same insertion-line anchors', async () => {
    const completedTodos = [todos[0], { ...todos[1], completed: true }, todos[2]]
    const queryClient = createTestQueryClient()
    queryClient.setQueryData([TODOS_QUERY_KEY, bucket.id], completedTodos)
    queryClient.setQueryData([TODOS_QUERY_KEY, destinationBucket.id], destinationTodos)

    render(
      <TodoDragDropProvider>
        <BucketColumn bucket={bucket} buckets={buckets} />
        <BucketColumn bucket={destinationBucket} buckets={buckets} />
      </TodoDragDropProvider>,
      { queryClient },
    )

    act(() => {
      dnd.dragEnd?.({
        canceled: false,
        operation: {
          source: { data: { bucketId: bucket.id, kind: 'todo', todoId: todos[1].id } },
          target: {
            data: {
              afterTodoId: undefined,
              beforeTodoId: destinationTodos[1].id,
              bucketId: destinationBucket.id,
              kind: 'todo-insertion',
            },
            id: `bucket-${destinationBucket.id}-insertion-2`,
          },
        },
      })
    })

    await waitFor(() => {
      expect(mockedMoveTodo).toHaveBeenCalledWith({
        data: {
          beforeTodoId: destinationTodos[1].id,
          id: todos[1].id,
          targetBucketId: destinationBucket.id,
        },
      })
    })
  })
})

function renderBucket(bucketToRender: Bucket, queryClient: ReturnType<typeof createTestQueryClient>) {
  return render(
    <TodoDragDropProvider>
      <BucketColumn bucket={bucketToRender} buckets={buckets} />
    </TodoDragDropProvider>,
    { queryClient },
  )
}

function createTodo({
  bucketId = bucket.id,
  id,
  position,
  title,
}: {
  bucketId?: number
  id: number
  position: number
  title: string
}): Todo {
  return {
    bucketId,
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
