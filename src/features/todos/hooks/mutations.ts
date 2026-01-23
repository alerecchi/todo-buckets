import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTodo } from '../server/todos'
import { Todo } from '../types/Todo'
import { TODOS_QUERY_KEY } from '../utils/queries'

type UpdateTodoVariables = {
  data: Parameters<typeof updateTodo>[0]['data']
  oldBucketId?: number
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: UpdateTodoVariables) =>
      updateTodo({ data: variables.data }),
    onSuccess: (updatedTodo: Todo, variables: UpdateTodoVariables) => {
      if (variables.oldBucketId) {
        const oldBucketId = variables.oldBucketId
        queryClient.setQueryData<Todo[]>(
          [TODOS_QUERY_KEY, oldBucketId],
          (cache = []) => cache.filter((todo) => todo.id !== updatedTodo.id),
        )

        const newBucketId = updatedTodo.bucketId
        queryClient.setQueryData<Todo[]>(
          [TODOS_QUERY_KEY, newBucketId],
          (cache = []) => [...cache, updatedTodo],
        )
      } else {
        queryClient.setQueryData<Todo[]>(
          [TODOS_QUERY_KEY, updatedTodo.bucketId],
          (cache = []) =>
            cache.map((todo) =>
              todo.id === updatedTodo.id ? updatedTodo : todo,
            ),
        )
      }
    },
  })
}
