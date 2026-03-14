import { Checkbox } from '@shared/components/ui/checkbox'
import { memo } from 'react'

import { useToggleTodo } from '@/features/board/hooks/use-update-todo'
import { Badge } from '@/features/shared/components/ui/badge'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/features/shared/components/ui/card'
import { cn } from '@/features/shared/utils/tailwind'
import type { Todo } from '@/lib/types/Todo'

interface TodoCardProps {
  todo: Todo
  // onRemoveTodo: (todoId: number) => void
}

// TODO: implement drag and drop
function TodoCard({ todo /* onRemoveTodo */ }: TodoCardProps) {
  const shouldShowDescription = !todo.completed && todo.description
  const { mutate: toggleTodoMutation } = useToggleTodo()
  const handleCheckedChange = () => {
    toggleTodoMutation({ data: { id: todo.id, completed: !todo.completed } })
  }

  return (
    // TODO: add "border-l-6 border-red-600" with right color from category
    <Card className={cn('group m-2 shadow-sm ring-0', todo.completed && 'bg-muted')}>
      <CardHeader>
        {/* TODO make a map of category colors (bg + text same but darker), maybe same color as the border? (I have to understand the meaning of both) */}
        <CardAction className={cn(!shouldShowDescription && 'row-span-1')}>
          <Checkbox
            id={`terms-checkbox-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={handleCheckedChange}
            className={cn(
              'size-5 cursor-pointer rounded-full border-2',
              !todo.completed && 'opacity-0 transition-opacity group-hover:opacity-100',
              todo.completed && 'opacity-70',
            )}
          />
        </CardAction>
        {todo.category && (
          <Badge className={cn('rounded-sm px-2.5 py-1 uppercase', todo.completed && 'bg-muted-foreground')}>
            {todo.category}
          </Badge>
        )}
        <CardTitle className={cn(!todo.completed && 'font-bold', todo.completed && 'font-semibold text-slate-500')}>
          {todo.title}
        </CardTitle>
        {shouldShowDescription && <CardDescription>{todo.description}</CardDescription>}
      </CardHeader>
    </Card>
  )
}

export default memo(TodoCard)
