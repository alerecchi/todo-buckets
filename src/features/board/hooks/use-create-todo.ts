import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TODOS_QUERY_KEY } from '@/features/board/queries/todo-queries'
import { Todo } from '@/lib/types/Todo'
import { createTodo } from '@/server/functions/todos'

export default function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo: Todo) =>
      // TODO check if I have to await query cache updates
      queryClient.setQueryData<Array<Todo>>([TODOS_QUERY_KEY, newTodo.bucketId], (old = []) => [...old, newTodo]),
  })
}
