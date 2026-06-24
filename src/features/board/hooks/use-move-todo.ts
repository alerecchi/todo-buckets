import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TODOS_QUERY_KEY } from '@/features/board/queries/query-keys'
import type { Todo } from '@/lib/types/Todo'
import { moveTodo } from '@/server/functions/todos'

type MoveTodoVariables = Parameters<typeof moveTodo>[0]

export function useMoveTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: MoveTodoVariables) => moveTodo(variables),
    onMutate: (variables) => {
      const previousTodos = queryClient.getQueryData<Array<Todo>>([TODOS_QUERY_KEY, variables.data.targetBucketId])

      queryClient.setQueryData<Array<Todo>>([TODOS_QUERY_KEY, variables.data.targetBucketId], (cache = []) =>
        moveTodoInCache(cache, variables.data.id, variables.data.beforeTodoId, variables.data.afterTodoId),
      )

      return { previousTodos }
    },
    onError: (_error, variables, context) => {
      queryClient.setQueryData([TODOS_QUERY_KEY, variables.data.targetBucketId], context?.previousTodos)
    },
    onSuccess: (result) => {
      for (const bucketId of result.affectedBucketIds) {
        queryClient.setQueryData<Array<Todo>>([TODOS_QUERY_KEY, bucketId], (cache = []) =>
          patchMovedTodoCache(cache, result.todo, result.affectedTodoPositions),
        )
      }
    },
  })
}

function moveTodoInCache(
  todos: Array<Todo>,
  movedTodoId: number,
  beforeTodoId: number | undefined,
  afterTodoId: number | undefined,
) {
  const movedTodo = todos.find((todo) => todo.id === movedTodoId)

  if (!movedTodo) {
    return todos
  }

  const remainingTodos = todos.filter((todo) => todo.id !== movedTodoId)
  const insertionIndex = getInsertionIndex(remainingTodos, beforeTodoId, afterTodoId)

  return remainingTodos.toSpliced(insertionIndex, 0, movedTodo)
}

function getInsertionIndex(todos: Array<Todo>, beforeTodoId: number | undefined, afterTodoId: number | undefined) {
  if (afterTodoId !== undefined) {
    const afterIndex = todos.findIndex((todo) => todo.id === afterTodoId)
    return afterIndex === -1 ? todos.length : afterIndex
  }

  if (beforeTodoId !== undefined) {
    const beforeIndex = todos.findIndex((todo) => todo.id === beforeTodoId)
    return beforeIndex === -1 ? todos.length : beforeIndex + 1
  }

  return todos.length
}

function patchMovedTodoCache(
  todos: Array<Todo>,
  movedTodo: Todo,
  affectedTodoPositions: Array<Pick<Todo, 'bucketId' | 'id' | 'position'>>,
) {
  const positionsById = new Map(affectedTodoPositions.map((todoPosition) => [todoPosition.id, todoPosition.position]))
  const patchedTodos = todos.map((todo) => {
    if (todo.id === movedTodo.id) {
      return movedTodo
    }

    const position = positionsById.get(todo.id)

    return position === undefined ? todo : { ...todo, position }
  })

  if (!patchedTodos.some((todo) => todo.id === movedTodo.id) && movedTodo.bucketId === todos[0]?.bucketId) {
    return [...patchedTodos, movedTodo].toSorted(compareTodoPosition)
  }

  return patchedTodos.toSorted(compareTodoPosition)
}

function compareTodoPosition(left: Todo, right: Todo) {
  return left.position - right.position || left.id - right.id
}
