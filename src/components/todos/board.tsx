import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { TODOS_QUERY_KEY, getBucketsQueryOptions } from '../utils/queries'
import { createTodo, deleteTodo } from '../server/todos'
import { BucketColumn } from './bucket-column'
import type { Todo } from '@/lib/types/Todo'
import { Button } from '@/features/shared/components/ui/button'
import { useUpdateTodo } from '../hooks/mutations'
import { Bucket } from '../types/Bucket'
import { updateTodo } from "@/server/functions/todos"

const BUCKET_TYPE_ORDER = ['inbox', 'yearly', 'monthly', 'weekly', 'daily']
// Helper for O(1) lookups during sort
const bucketPriority: Record<string, number> = BUCKET_TYPE_ORDER.reduce(
  (acc, type, index) => ({ ...acc, [type]: index }),
  {},
)

export function BucketList() {
  const queryClient = useQueryClient()
  const { data: bucketList = [] } = useSuspenseQuery(getBucketsQueryOptions)
  //TODO decide where the sorting should be (server, client before cache?, here)
  const sortedBuckets = bucketList.toSorted(
    (a: Bucket, b: Bucket) => bucketPriority[a.type] - bucketPriority[b.type],
  )

  //TODO move to mutation hook
  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo: Todo) =>
      queryClient.setQueryData<Array<Todo>>(
        [TODOS_QUERY_KEY, newTodo.bucketId],
        (old = []) => [...old, newTodo],
      ),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: ({ todoId, bucketId }) => {
      queryClient.setQueryData<Array<Todo>>(
        [TODOS_QUERY_KEY, bucketId],
        (old = []) => old.filter((todo) => todo.id !== todoId),
      )
    },
  })

  const updateMutation = useUpdateTodo()

  return (
    <div className="container mx-auto grid grid-cols-5 gap-4">
      {sortedBuckets.map((bucket: Bucket) => (
        <BucketColumn
          key={bucket.id}
          bucket={bucket}
          onAddTodo={(text: string) => {
            createMutation.mutate({
              data: { title: text, bucketId: bucket.id },
            })
          }}
          onRemoveTodo={(todoId: number) => {
            deleteMutation.mutate({
              data: { id: todoId },
            })
          }}
          onToggleTodo={(todoId: number, completed: boolean) => {
            updateMutation.mutate({
              data: { id: todoId, bucketId: bucket.id, completed: completed },
            })
          }}
        />
      ))}
      <div>
        {/* //TODO just for test, remove later */}
        <Button
          onClick={() => {
            const todosFirstBucket = queryClient.getQueryData<Todo[]>([
              TODOS_QUERY_KEY,
              bucketList[0].id,
            ])!
            updateMutation.mutate({
              data: {
                id: todosFirstBucket[0].id,
                bucketId: bucketList[1].id,
              },
              oldBucketId: bucketList[0].id,
            })
          }}
        >
          move todo
        </Button>
      </div>
    </div>
  )
}

//TODO fix this
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