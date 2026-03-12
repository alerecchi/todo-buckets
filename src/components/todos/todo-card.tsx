import { GripVertical, Trash2 } from 'lucide-react'

import type { Todo } from '@/lib/types/Todo'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface TodoCardProps {
  todo: Todo
  onRemoveTodo: (todoId: number) => void
  onToggleTodo: (todoId: number, completed: boolean) => void
}

export default function TodoCard({ todo, onRemoveTodo, onToggleTodo }: TodoCardProps) {
  return (
    <div className='group flex items-center gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/20'>
      <GripVertical className='h-4 w-4 cursor-grab text-muted-foreground active:cursor-grabbing' />
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggleTodo(todo.id, !todo.completed)}
      />
      <Label
        className={`flex-1 cursor-pointer ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}
        htmlFor={`todo-${todo.id}`}
      >
        {todo.title}
      </Label>
      <Button
        className='opacity-0 transition-opacity group-hover:opacity-100'
        variant='ghost'
        size='sm'
        onClick={() => onRemoveTodo(todo.id)}
      >
        <Trash2 className='h-4 w-4 text-red-500' />
      </Button>
    </div>
  )
}
