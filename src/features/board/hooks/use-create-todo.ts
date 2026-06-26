import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TODOS_QUERY_KEY } from '@/features/board/queries/query-keys'
import type { Todo } from '@/lib/types/Todo'
import { createTodo } from '@/server/functions/todos'

export default function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo: Todo) => {
      queryClient.setQueryData<Array<Todo>>([TODOS_QUERY_KEY, newTodo.bucketId], (old = []) => [...old, newTodo])
      scrollBucketTodoListToEnd(newTodo.bucketId)
    },
  })
}

function scrollBucketTodoListToEnd(bucketId: number) {
  if (typeof document === 'undefined' || typeof requestAnimationFrame === 'undefined') {
    return
  }

  requestAnimationFrame(() => {
    const bucketList = document.querySelector<HTMLElement>(
      `[data-bucket-todo-list][data-bucket-id="${bucketId}"]`,
    )

    bucketList?.scrollTo({ behavior: 'smooth', top: bucketList.scrollHeight })
  })
}
