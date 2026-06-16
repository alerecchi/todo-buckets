import type { QueryClient } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TODOS_QUERY_KEY } from '@/features/board/queries/query-keys'
import type { Todo } from '@/lib/types/Todo'
import { updateTodo } from '@/server/functions/todos'

type UpdateTodoVariables = {
  data: Parameters<typeof updateTodo>[0]['data']
  oldBucketId?: number
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: UpdateTodoVariables) => updateTodo({ data: variables.data }),
    onSuccess: (updatedTodo: Todo, variables) => {
      if (variables.oldBucketId !== undefined && variables.oldBucketId !== updatedTodo.bucketId) {
        moveTodo(queryClient, variables.oldBucketId, updatedTodo)
        return
      }

      replaceTodo(queryClient, updatedTodo.bucketId, updatedTodo)
    },
  })
}

export function useToggleTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTodo,
    onSuccess: (updatedTodo: Todo) => {
      queryClient.setQueryData<Array<Todo>>([TODOS_QUERY_KEY, updatedTodo.bucketId], (cache = []) =>
        cache.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      )
    },
  })
}

function replaceTodo(queryClient: QueryClient, bucketId: number, updatedTodo: Todo) {
  queryClient.setQueryData<Array<Todo>>([TODOS_QUERY_KEY, bucketId], (cache = []) =>
    cache.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
  )
}

function moveTodo(queryClient: QueryClient, oldBucketId: number, updatedTodo: Todo) {
  queryClient.setQueryData<Array<Todo>>([TODOS_QUERY_KEY, oldBucketId], (cache = []) =>
    cache.filter((todo) => todo.id !== updatedTodo.id),
  )
  queryClient.setQueryData<Array<Todo>>([TODOS_QUERY_KEY, updatedTodo.bucketId], (cache = []) => [
    ...cache.filter((todo) => todo.id !== updatedTodo.id),
    updatedTodo,
  ])
}
