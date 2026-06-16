import { Checkbox } from '@shared/components/ui/checkbox'
import { memo } from 'react'

import { useToggleTodo } from '@/features/board/hooks/use-update-todo'
import { Badge } from '@/features/shared/components/ui/badge'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/features/shared/components/ui/card'
import { cn } from '@/features/shared/utils/tailwind'
import { getColorPreset } from '@/lib/types/Color'
import type { Todo } from '@/lib/types/Todo'

interface TodoCardProps {
  todo: Todo
  // onRemoveTodo: (todoId: number) => void
}

// TODO: implement drag and drop
function TodoCard({ todo /* onRemoveTodo */ }: TodoCardProps) {
  const shouldShowDescription = !todo.completed && todo.description
  const categoryColor = todo.category ? getColorPreset(todo.category.colorKey) : undefined
  const { mutate: toggleTodoMutation } = useToggleTodo()
  const handleCheckedChange = () => {
    toggleTodoMutation({ data: { id: todo.id, completed: !todo.completed } })
  }

  return (
    <Card
      data-completed={todo.completed}
      className={cn(
        'group m-2 shadow-sm ring-0',
        todo.category &&
          'border-l-4 border-l-(--todo-category-color) data-[completed=true]:border-l-[color-mix(in_oklab,var(--todo-category-color)_70%,transparent)]',
        categoryColor?.backgroundColorClass,
        categoryColor?.textColorClass,
        todo.completed && 'bg-muted',
      )}
    >
      <CardHeader>
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
          <Badge
            className={cn(
              'rounded-sm px-2.5 py-1 uppercase',
              'bg-[color-mix(in_oklab,var(--todo-category-color)_12%,transparent)] text-(--todo-category-text)',
            )}
          >
            {todo.category.name}
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
