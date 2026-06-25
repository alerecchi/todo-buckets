import { useSuspenseQuery } from '@tanstack/react-query'

import { BucketColumn } from '@/features/board/components/bucket-column'
import { TodoDragDropProvider } from '@/features/board/components/todo-drag-drop-provider'
import { getBucketsQueryOptions } from '@/features/board/queries/todo-queries'
import type { Bucket } from '@/lib/types/Bucket'

const BUCKET_TYPE_ORDER = ['inbox', 'yearly', 'monthly', 'weekly', 'daily']
// Helper for O(1) lookups during sort
const bucketPriority: Record<string, number> = BUCKET_TYPE_ORDER.reduce(
  (acc, type, index) => ({ ...acc, [type]: index }),
  {},
)

export function Board() {
  const { data: bucketList = [] } = useSuspenseQuery(getBucketsQueryOptions)
  // TODO: decide where the sorting should be (server, client before cache?, here)
  const sortedBuckets = bucketList.toSorted((a: Bucket, b: Bucket) => bucketPriority[a.type] - bucketPriority[b.type])

  return (
    // TODO possibly "h-screen" and "container" on a higher level div
    <TodoDragDropProvider>
      <div className='container mx-auto flex h-screen flex-row gap-6'>
        {sortedBuckets.map((bucket: Bucket) => (
          <BucketColumn key={bucket.id} bucket={bucket} buckets={sortedBuckets} />
        ))}
      </div>
    </TodoDragDropProvider>
  )
}
// const deleteMutation = useMutation({
//   mutationFn: deleteTodo,
//   onSuccess: ({ todoId, bucketId }) => {
//     queryClient.setQueryData<Array<Todo>>([TODOS_QUERY_KEY, bucketId], (old = []) =>
//       old.filter((todo) => todo.id !== todoId),
//     )
//   },
// })

// const updateMutation = useUpdateTodo()
// onAddTodo={(text: string) => {
//   createMutation.mutate({
//     data: { title: text, bucketId: bucket.id },
//   })
// }}
// onRemoveTodo={(todoId: number) => {
//   deleteMutation.mutate({
//     data: { id: todoId },
//   })
// }}
// onToggleTodo={(todoId: number, completed: boolean) => {
//   updateMutation.mutate({
//     data: { id: todoId, bucketId: bucket.id, completed: completed },
//   })
// }}

/* <div>
        <Button
          onClick={() => {
            const todosFirstBucket = queryClient.getQueryData<Array<Todo>>([TODOS_QUERY_KEY, bucketList[0].id])!
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
     */
