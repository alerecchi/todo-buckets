import { Inbox, Plus } from 'lucide-react'
import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import TodoCard from './todo-card'
import AddTodoDialog from './add-todo-dialog'
import type { Bucket } from '@/lib/types/Bucket'
import { Button } from '@/components/ui/button'
import { getTodosQueryOptions } from '@/server/queries/todo-queries'

interface BucketProps {
  bucket: Bucket
  onAddTodo: (text: string) => void
  onRemoveTodo: (todoId: number) => void
  onToggleTodo: (todoId: number, completed: boolean) => void
}

export function BucketColumn({
  bucket,
  onAddTodo,
  onRemoveTodo,
  onToggleTodo,
}: BucketProps) {
  const [isDialogOpen, setDialogOpen] = useState(false)

  const { data: todoList = [] } = useSuspenseQuery(
    getTodosQueryOptions(bucket.id),
  )

  return (
    <div className="flex flex-col gap-4 min-h-[100px] p-2 rounded-lg border-2 border-dashed border-border bg-muted/20">
      <div className="flex items-center justify-between">
        <div className="flex flex-row gap-2 items-center p-2">
          <Inbox />
          {/* //TODO make a translation from type + period to a name */}
          <h2 className="text-lg font-semibold">{bucket.type}</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
        <AddTodoDialog
          isOpen={isDialogOpen}
          setOpen={setDialogOpen}
          onAddTodo={onAddTodo}
        />
      </div>
      <div className="flex flex-col gap-2">
        {todoList.map((todoItem) => (
          <TodoCard
            key={todoItem.id}
            todo={todoItem}
            onRemoveTodo={onRemoveTodo}
            onToggleTodo={onToggleTodo}
          />
        ))}
      </div>
    </div>
  )
}
