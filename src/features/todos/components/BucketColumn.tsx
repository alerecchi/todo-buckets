import { Inbox, Plus } from 'lucide-react'
import TodoCard from './TodoCard'
import { Bucket } from '@/features/todos/types/Bucket'
import { Button } from '@/features/shared/components/ui/button'
import AddTodoDialog from './AddTodoDialog'
import { useState } from 'react'

interface BucketProps {
  bucket: Bucket
  addTodo: (text: string, bucketId: number) => void
  removeTodo: (todoId: number, bucketId: number) => void
  toggleTodo: (todoId: number, bucketId: number) => void
}

export function BucketColumn({
  bucket,
  addTodo,
  removeTodo,
  toggleTodo,
}: BucketProps) {
  const [isDialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 min-h-[100px] p-2 rounded-lg border-2 border-dashed border-border bg-muted/20">
      <div className="flex items-center justify-between">
        <div className="flex flex-row gap-2 items-center p-2">
          <Inbox />
          <h2 className="text-lg font-semibold">{bucket.name}</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
        <AddTodoDialog
          open={isDialogOpen}
          bucketId={bucket.id}
          setOpen={setDialogOpen}
          addTodo={addTodo}
        />
      </div>
      <div className="flex flex-col gap-2">
        {bucket.todos.map((todoItem) => (
          <TodoCard
            key={todoItem.id}
            todo={todoItem}
            removeTodo={removeTodo}
            toggleTodo={toggleTodo}
          />
        ))}
      </div>
    </div>
  )
}
