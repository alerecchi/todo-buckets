import { DragDropProvider, useDroppable } from '@dnd-kit/react'
import type { DragEndEvent } from '@dnd-kit/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Inbox, ListTodo, Map, Mountain, Signpost } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'

import AddTodoButton from '@/features/board/components/create-todo-button'
import { SortableTodoCard } from '@/features/board/components/sortable-todo-card'
import type { TodoDragData } from '@/features/board/components/sortable-todo-card'
import TodoDialog from '@/features/board/components/todo-dialog'
import { useMoveTodo } from '@/features/board/hooks/use-move-todo'
import { getTodosQueryOptions } from '@/features/board/queries/todo-queries'
import { Badge } from '@/features/shared/components/ui/badge'
import { cn } from '@/features/shared/utils/tailwind'
import type { Bucket, BucketType } from '@/lib/types/Bucket'
import type { Todo } from '@/lib/types/Todo'

interface BucketProps {
  bucket: Bucket
  buckets: Array<Bucket>
}

// TODO order for todos
export function BucketColumn({ bucket, buckets }: BucketProps) {
  const { data: todoList = [] } = useSuspenseQuery(getTodosQueryOptions(bucket.id))
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const { icon: Icon, textColor, bgColor } = bucketStyles[bucket.type]
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

    if (sourceData.bucketId !== bucket.id || targetData.bucketId !== bucket.id) {
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
    })
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className='my-6 flex flex-auto flex-col gap-4'>
        <div className='flex flex-row items-center gap-2'>
          <div className={cn('rounded-sm p-2', textColor, bgColor)}>
            <Icon className='size-6' />
          </div>
          <span className={cn('block text-xl font-semibold capitalize', textColor)}>{bucket.type}</span>
          <Badge className={cn(textColor, bgColor)}>{todoList.length}</Badge>
          <AddTodoButton bucketId={bucket.id} buckets={buckets} />
        </div>
        <div className='flex flex-auto flex-col rounded-lg bg-secondary'>
          <TodoInsertionLine bucketId={bucket.id} index={0} afterTodoId={todoList[0]?.id} />
          {todoList
            .map((todoItem) => (
              <SortableTodoCard key={todoItem.id} bucketId={bucket.id} todo={todoItem} onEdit={setEditingTodo} />
            ))
            .flatMap((todoCard, index) => [
              todoCard,
              <TodoInsertionLine
                key={`insertion-${index + 1}`}
                bucketId={bucket.id}
                index={index + 1}
                beforeTodoId={todoList[index]?.id}
                afterTodoId={todoList[index + 1]?.id}
              />,
            ])}
        </div>
        <TodoDialog
          buckets={buckets}
          defaultBucketId={bucket.id}
          editingTodo={editingTodo}
          isOpen={editingTodo !== null}
          setOpen={(open) => {
            if (!open) {
              setEditingTodo(null)
            }
          }}
        />
      </div>
    </DragDropProvider>
  )
}

type TodoInsertionData = {
  afterTodoId?: number
  beforeTodoId?: number
  bucketId: number
  kind: 'todo-insertion'
}

function TodoInsertionLine({
  afterTodoId,
  beforeTodoId,
  bucketId,
  index,
}: {
  afterTodoId?: number
  beforeTodoId?: number
  bucketId: number
  index: number
}) {
  const id = `bucket-${bucketId}-insertion-${index}`
  const { isDropTarget, ref } = useDroppable<TodoInsertionData>({
    data: {
      afterTodoId,
      beforeTodoId,
      bucketId,
      kind: 'todo-insertion',
    },
    id,
  })

  return (
    <div
      aria-hidden='true'
      data-drop-target={isDropTarget}
      data-testid={id}
      ref={ref}
      className={cn('mx-2 -my-1 h-2 rounded-full transition-colors', isDropTarget ? 'bg-primary' : 'bg-transparent')}
    />
  )
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

type BucketStyle = {
  icon: LucideIcon
  textColor: string
  bgColor: string
}

const bucketStyles: Record<BucketType, BucketStyle> = {
  inbox: { icon: Inbox, textColor: 'text-slate-900', bgColor: 'bg-slate-900/50' },
  yearly: { icon: Mountain, textColor: 'text-violet-900', bgColor: 'bg-violet-900/50' },
  monthly: { icon: Map, textColor: 'text-blue-900', bgColor: 'bg-blue-900/50' },
  weekly: { icon: Signpost, textColor: 'text-amber-900', bgColor: 'bg-amber-900/50 ' },
  daily: { icon: ListTodo, textColor: 'text-green-900', bgColor: 'bg-green-900/50' },
}
