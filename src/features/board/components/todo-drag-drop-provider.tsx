import { DragDropProvider } from '@dnd-kit/react'
import type { DragEndEvent } from '@dnd-kit/react'
import { useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { flushSync } from 'react-dom'

import type { TodoDragData } from '@/features/board/components/sortable-todo-card'
import { useMoveTodo } from '@/features/board/hooks/use-move-todo'
import { scrollTodoBoard } from '@/features/board/lib/board-auto-scroll'
import { scrollBucketTodoListToEnd } from '@/features/board/lib/bucket-todo-list-scroll'
import { TODOS_QUERY_KEY } from '@/features/board/queries/query-keys'
import type { Todo } from '@/lib/types/Todo'

type TodoInsertionData = {
  afterTodoId?: number
  beforeTodoId?: number
  bucketId: number
  kind: 'todo-insertion'
}

export type PendingTodoMove = {
  afterTodoId?: number
  beforeTodoId?: number
  sourceBucketId: number
  targetBucketId: number
  todo: Todo
}

const PendingTodoMoveContext = createContext<PendingTodoMove | null>(null)

export function TodoDragDropProvider({ children }: { children: ReactNode }) {
  const { mutate: moveTodo } = useMoveTodo()
  const queryClient = useQueryClient()
  const [pendingTodoMove, setPendingTodoMove] = useState<PendingTodoMove | null>(null)

  const handleDragMove = (event: unknown, manager: unknown) => {
    if (typeof document === 'undefined') {
      return
    }

    const targetData = getDragMoveTargetData(event)
    const currentBucketId = isTodoInsertionData(targetData) ? targetData.bucketId : undefined

    scrollTodoBoard({
      board: document.querySelector<HTMLElement>('[data-todo-board]'),
      bucketLists: Array.from(document.querySelectorAll<HTMLElement>('[data-bucket-todo-list]')),
      currentBucketId,
      pointer: getDragMovePointer(manager),
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) {
      return
    }

    const sourceData = event.operation.source?.data
    const targetData = event.operation.target?.data

    if (!isTodoDragData(sourceData) || !isTodoInsertionData(targetData)) {
      return
    }

    if (targetData.beforeTodoId === sourceData.todoId || targetData.afterTodoId === sourceData.todoId) {
      return
    }

    const sourceTodos = queryClient.getQueryData<Array<Todo>>([TODOS_QUERY_KEY, sourceData.bucketId])
    const movedTodo = sourceTodos?.find((todo) => todo.id === sourceData.todoId)

    if (movedTodo) {
      flushSync(() => {
        setPendingTodoMove(
          removeUndefinedValues({
            afterTodoId: targetData.afterTodoId,
            beforeTodoId: targetData.beforeTodoId,
            sourceBucketId: sourceData.bucketId,
            targetBucketId: targetData.bucketId,
            todo: { ...movedTodo, bucketId: targetData.bucketId },
          }),
        )
      })
    }

    moveTodo(
      {
        data: removeUndefinedValues({
          afterTodoId: targetData.afterTodoId,
          beforeTodoId: targetData.beforeTodoId,
          id: sourceData.todoId,
          targetBucketId: targetData.bucketId,
        }),
        sourceBucketId: sourceData.bucketId,
      },
      {
        onSettled: () => {
          setPendingTodoMove(null)
        },
      },
    )

    if (isFinalBucketInsertion(targetData)) {
      scrollBucketTodoListToEnd(targetData.bucketId)
    }
  }

  return (
    <PendingTodoMoveContext value={pendingTodoMove}>
      <DragDropProvider onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
        {children}
      </DragDropProvider>
    </PendingTodoMoveContext>
  )
}

export function usePendingTodoMove() {
  return useContext(PendingTodoMoveContext)
}

function isTodoDragData(data: unknown): data is TodoDragData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'kind' in data &&
    data.kind === 'todo' &&
    'bucketId' in data &&
    typeof data.bucketId === 'number' &&
    'todoId' in data &&
    typeof data.todoId === 'number'
  )
}

function isTodoInsertionData(data: unknown): data is TodoInsertionData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'kind' in data &&
    data.kind === 'todo-insertion' &&
    'bucketId' in data &&
    typeof data.bucketId === 'number'
  )
}

function removeUndefinedValues<T extends Record<string, unknown>>(values: T) {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined)) as T
}

function isFinalBucketInsertion(targetData: TodoInsertionData) {
  return targetData.beforeTodoId !== undefined && targetData.afterTodoId === undefined
}

function getDragMoveTargetData(event: unknown) {
  if (typeof event !== 'object' || event === null || !('operation' in event)) {
    return undefined
  }

  const operation = event.operation

  if (typeof operation !== 'object' || operation === null || !('target' in operation)) {
    return undefined
  }

  const target = operation.target

  if (typeof target !== 'object' || target === null || !('data' in target)) {
    return undefined
  }

  return target.data
}

function getDragMovePointer(manager: unknown) {
  if (typeof manager !== 'object' || manager === null || !('dragOperation' in manager)) {
    return null
  }

  const dragOperation = manager.dragOperation

  if (typeof dragOperation !== 'object' || dragOperation === null || !('position' in dragOperation)) {
    return null
  }

  const position = dragOperation.position

  if (typeof position !== 'object' || position === null || !('current' in position)) {
    return null
  }

  const pointer = position.current

  if (
    typeof pointer !== 'object' ||
    pointer === null ||
    !('x' in pointer) ||
    typeof pointer.x !== 'number' ||
    !('y' in pointer) ||
    typeof pointer.y !== 'number'
  ) {
    return null
  }

  return {
    x: pointer.x,
    y: pointer.y,
  }
}
