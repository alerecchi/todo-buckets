import { DragDropProvider } from '@dnd-kit/react'
import type { DragEndEvent } from '@dnd-kit/react'
import type { ReactNode } from 'react'

import type { TodoDragData } from '@/features/board/components/sortable-todo-card'
import { useMoveTodo } from '@/features/board/hooks/use-move-todo'

type TodoInsertionData = {
  afterTodoId?: number
  beforeTodoId?: number
  bucketId: number
  kind: 'todo-insertion'
}

export function TodoDragDropProvider({ children }: { children: ReactNode }) {
  const { mutate: moveTodo } = useMoveTodo()

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

    moveTodo({
      data: removeUndefinedValues({
        afterTodoId: targetData.afterTodoId,
        beforeTodoId: targetData.beforeTodoId,
        id: sourceData.todoId,
        targetBucketId: targetData.bucketId,
      }),
      sourceBucketId: sourceData.bucketId,
    })
  }

  return <DragDropProvider onDragEnd={handleDragEnd}>{children}</DragDropProvider>
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
