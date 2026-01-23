import { GripVertical, Trash2 } from 'lucide-react'
import type { Todo } from '@/features/todos/types/Todo'
import { Checkbox } from '@/features/shared/components/ui/checkbox'
import { Button } from '@/features/shared/components/ui/button'
import { Label } from '@/features/shared/components/ui/label'

interface TodoCardProps {
  todo: Todo
  onRemoveTodo: (todoId: number) => void
  onToggleTodo: (todoId: number, completed: boolean) => void
}

export default function TodoCard({
  todo,
  onRemoveTodo,
  onToggleTodo,
}: TodoCardProps) {
  return (
    <div className="group flex items-center gap-2 p-3 bg-card rounded-lg border border-border hover:border-foreground/20 transition-colors">
      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggleTodo(todo.id, !todo.completed)}
      />
      <Label
        className={`flex-1 cursor-pointer ${
          todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
        }`}
        htmlFor={`todo-${todo.id}`}
      >
        {todo.title}
      </Label>
      <Button
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        variant="ghost"
        size="sm"
        onClick={() => onRemoveTodo(todo.id)}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  )
}
