import { useSuspenseQuery } from '@tanstack/react-query'
import { Inbox, ListTodo, LucideIcon, Map, Mountain, Signpost } from 'lucide-react'

import AddTodoButton from '@/features/board/components/create-todo-button'
import TodoCard from '@/features/board/components/todo-card'
import { getTodosQueryOptions } from '@/features/board/queries/todo-queries'
import { Badge } from '@/features/shared/components/ui/badge'
import { cn } from '@/features/shared/utils/tailwind'
import type { Bucket, BucketType } from '@/lib/types/Bucket'

interface BucketProps {
  bucket: Bucket
}

//TODO order for todos
export function BucketColumn({ bucket }: BucketProps) {
  const { data: todoList = []} = useSuspenseQuery(getTodosQueryOptions(bucket.id))
  const { icon: Icon, textColor, bgColor } = bucketStyles[bucket.type]

  return (
    <div className='my-6 flex flex-auto flex-col gap-4'>
      <div className='flex flex-row items-center gap-2'>
        <div className={cn('rounded-sm p-2', textColor, bgColor)}>
          <Icon className='size-6' />
        </div>
        <span className={cn('block text-xl font-semibold capitalize', textColor)}>{bucket.type}</span>
        <Badge className={cn(textColor, bgColor)}>{todoList.length}</Badge>
        <AddTodoButton bucketId={bucket.id} />
      </div>
      <div className='flex flex-auto flex-col rounded-lg bg-secondary'>
        {todoList.map((todoItem) => (
          <TodoCard key={todoItem.id} todo={todoItem} /* onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} */ />
        ))}
      </div>
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
