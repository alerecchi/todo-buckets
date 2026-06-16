import { useSuspenseQuery } from '@tanstack/react-query'
import { Inbox, ListTodo, Map, Mountain, Signpost } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'

import AddTodoButton from '@/features/board/components/create-todo-button'
import TodoCard from '@/features/board/components/todo-card'
import TodoDialog from '@/features/board/components/todo-dialog'
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

  return (
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
        {todoList.map((todoItem) => (
          <TodoCard
            key={todoItem.id}
            todo={todoItem}
            onEdit={setEditingTodo}
            /* onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} */
          />
        ))}
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
  )
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
